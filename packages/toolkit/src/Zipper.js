import path from 'path';
import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { Unzip, Zip, AsyncZipDeflate } from 'fflate';
import { crc32c, unixPath } from './FileUtil.js';
import { AsyncUnzipInflate } from 'fflate';

/**
 * @typedef ZipManifest
 * @property {number} totalBytes
 * @property {number} checksum
 * @property {Array<{name: string, bytes: number, crc: number}>} files
 */

function logInfo(message) {
  /* eslint-disable no-console */
  console.log(message);
}

export async function createZip(outFile, inDir) {
  let files = await forFiles(inDir);
  let outDir = path.dirname(outFile);
  await fs.mkdir(outDir, { recursive: true });
  let ws = createWriteStream(outFile);
  return await zipFiles(files, ws);
}

export async function createUnzip(inFile, outDir) {
  await fs.mkdir(outDir, { recursive: true });
  let rs = createReadStream(inFile);
  return await unzipFiles(outDir, rs);
}

/**
 * @param {Array<string>} files
 * @param {import('stream').Writable} writable
 * @param {import('fflate').DeflateOptions} zipOpts
 * @returns {Promise<ZipManifest>}
 */
export async function zipFiles(files, writable, zipOpts = {}) {
  /** @type {ZipManifest} */
  let manifest = {
    files: [],
    totalBytes: 0,
    checksum: 0,
  };
  await new Promise((resolve, reject) => {
    writable.on('error', reject);
    let zip = new Zip();
    zip.ondata = (err, data, final) => {
      if (err) {
        reject(err);
      } else {
        writable.write(data, (err) => {
          if (err) {
            reject(err);
          } else {
            if (final) {
              writable.end(resolve);
            }
          }
        });
      }
    };
    let promise = (async () => {
      for (let file of files) {
        if (typeof file === 'string') {
          const filePath = file;
          let bytes = 0;
          let crc = 0;
          let fileStream = new AsyncZipDeflate(filePath, zipOpts);
          zip.add(fileStream);
          await new Promise((resolve, reject) => {
            let readable = createReadStream(filePath);
            readable.on('error', reject);
            readable.on('end', () => {
              manifest.files.push({
                name: unixPath(filePath),
                bytes,
                crc,
              });
              manifest.totalBytes += bytes;
              fileStream.push(new Uint8Array(), true);
              resolve();
            });
            readable.on('data', (chunk) => {
              crc = crc32c(crc, chunk);
              bytes += chunk.byteLength;
              fileStream.push(chunk);
            });
          });
        } else if (Array.isArray(file)) {
          const [filePath, ...chunks] = file;
          let bytes = 0;
          let crc = 0;
          let fileStream = new AsyncZipDeflate(filePath, zipOpts);
          zip.add(fileStream);
          for (let chunk of chunks) {
            crc = crc32c(crc, chunk);
            bytes += chunk.byteLength;
            fileStream.push(chunk);
          }
          manifest.files.push({
            name: unixPath(filePath),
            bytes,
            crc,
          });
          manifest.totalBytes += bytes;
          fileStream.push(new Uint8Array(), true);
        }
      }
    })();
    promise.then(() => zip.end()).catch(reject);
  });
  manifest.files.sort((a, b) => a.name.localeCompare(b.name));
  manifest.checksum = crc32c(
    manifest.checksum,
    new TextEncoder().encode(JSON.stringify(manifest))
  );
  return manifest;
}

/**
 * @param {import('stream').Readable} readable
 * @returns {Promise<ZipManifest>}
 */
export async function unzipFiles(outputDir, readable) {
  /** @type {ZipManifest} */
  let manifest = {
    files: [],
    totalBytes: 0,
    checksum: 0,
  };
  await new Promise((resolve, reject) => {
    let promises = [];
    let unzip = new Unzip();
    unzip.register(AsyncUnzipInflate);
    unzip.onfile = (fileStream) => {
      let promise = fs.mkdir(
        path.join(outputDir, path.dirname(fileStream.name)),
        { recursive: true }
      );
      promise = promise.then(
        () =>
          new Promise((resolve, reject) => {
            logInfo(
              `${fileStream.name} [${fileStream.originalSize} => ${fileStream.size}]`
            );
            let writable = createWriteStream(
              path.join(outputDir, fileStream.name)
            );
            writable.on('error', (err) => {
              fileStream.terminate();
              reject(err);
            });
            let bytes = 0;
            let crc = 0;
            fileStream.ondata = (err, data, final) => {
              if (err) {
                writable.destroy(err);
              } else {
                crc = crc32c(crc, data);
                bytes += data.byteLength;
                writable.write(data, (err) => {
                  if (err) {
                    writable.destroy(err);
                  } else {
                    if (final) {
                      manifest.files.push({
                        name: unixPath(fileStream.name),
                        bytes,
                        crc,
                      });
                      manifest.totalBytes += bytes;
                      writable.end(resolve);
                    }
                  }
                });
              }
            };
            fileStream.start();
          })
      );
      promises.push(promise);
    };
    readable.on('error', reject);
    readable.on('end', () => {
      unzip.push(new Uint8Array(), true);
      Promise.all(promises)
        .then(() => {
          manifest.files.sort((a, b) => a.name.localeCompare(b.name));
          manifest.checksum = crc32c(
            manifest.checksum,
            new TextEncoder().encode(JSON.stringify(manifest))
          );
          resolve();
        })
        .catch(reject);
    });
    readable.on('data', (data) => {
      unzip.push(data);
    });
  });
  return manifest;
}

/**
 * @param {string} inFile
 * @returns {Promise<ZipManifest>}
 */
export async function getZipManifest(inFile) {
  /** @type {ZipManifest} */
  let manifest = {
    files: [],
    totalBytes: 0,
    checksum: 0,
  };
  await new Promise((resolve, reject) => {
    let readable = createReadStream(inFile);
    let promises = [];
    let unzip = new Unzip();
    unzip.register(AsyncUnzipInflate);
    unzip.onfile = (fileStream) =>
      promises.push(
        new Promise((resolve, reject) => {
          let bytes = 0;
          let crc = 0;
          fileStream.ondata = (err, data, final) => {
            if (err) {
              reject(err);
            } else {
              crc = crc32c(crc, data);
              bytes += data.byteLength;
              if (final) {
                manifest.files.push({
                  name: unixPath(fileStream.name),
                  bytes,
                  crc,
                });
                manifest.totalBytes += bytes;
                resolve();
              }
            }
          };
          fileStream.start();
        })
      );
    readable.on('error', reject);
    readable.on('end', () => {
      unzip.push(new Uint8Array(), true);
      Promise.all(promises)
        .then(() => {
          manifest.files.sort((a, b) => a.name.localeCompare(b.name));
          manifest.checksum = crc32c(
            manifest.checksum,
            new TextEncoder().encode(JSON.stringify(manifest))
          );
          resolve();
        })
        .catch(reject);
    });
    readable.on('data', (data) => {
      unzip.push(data);
    });
  });
  return manifest;
}

/**
 * @template T
 * @param {string} dirPath
 * @param {(file: string, stats) => string|Promise<T>} [asyncCallback]
 * @returns {Promise<Array<T>>}
 */
export async function forFiles(dirPath, asyncCallback = async (file, stats) => unixPath(file)) {
  let dirs = [];
  let errors = [];
  let results = [];
  let promises = [];
  // Read directory files
  let files = await fs.readdir(dirPath);
  for (let file of files) {
    let filePath = path.join(dirPath, file);
    promises.push(
      fs
        .stat(filePath)
        .then(async (stats) => {
          if (stats.isDirectory()) dirs.push(filePath);
          else results.push(await asyncCallback(filePath, stats));
        })
        .catch((reason) => errors.push(reason))
    );
  }
  // Resolve all results callback and dirs lookup
  await Promise.all(promises);
  promises.length = 0;
  // Look through all subdirectories
  for (let dir of dirs) {
    promises.push(
      forFiles(dir, asyncCallback).catch((reason) => errors.push(reason))
    );
  }
  // Resolve all subdirectories
  let subresults = await Promise.all(promises);
  promises.length = 0;
  results.push(...flatten(subresults));
  // Finally, throw all errors we found earlier
  if (errors.length > 0) throw errors.join('\n\n');
  // Remove all undefined values from result
  return results.filter((value) => typeof value !== 'undefined');
}

export function* flatten(array, depth = 100) {
  for (let value of array) {
    if (Array.isArray(value) && depth > 0) {
      yield* flatten(value, depth - 1);
    } else {
      yield value;
    }
  }
}
