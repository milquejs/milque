import path from 'path';
import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { Zip, AsyncZipDeflate, Unzip, AsyncUnzipInflate } from 'fflate';

export async function createZip(outFile, inDir)
{
    let files = await forFiles(inDir);
    let outDir = path.dirname(outFile);
    await fs.mkdir(outDir, { recursive: true });
    let ws = createWriteStream(outFile);
    await zipFiles(files, ws);
}

export async function createUnzip(inFile, outDir)
{
    await fs.mkdir(outDir, { recursive: true });
    let rs = createReadStream(inFile);
    await unzipFiles(outDir, rs);
}

/**
 * @param {Array<string>} files 
 * @param {import('stream').Writable} writable 
 * @param {import('fflate').DeflateOptions} deflateOptions
 */
export async function zipFiles(files, writable, deflateOptions = undefined)
{
    return new Promise((resolve, reject) => {
        let zip = new Zip();
        zip.ondata = (err, data, final) => {
            if (err)
            {
                reject(err);
            }
            else
            {
                writable.write(data, err => {
                    if (!err && final)
                    {
                        writable.end(resolve);
                    }
                });
            }
        };
        writable.on('error', reject);
        // Register all files with zip
        let fileStreams = files.map(filePath => {
            // If string, read chunks from file
            if (typeof filePath === 'string')
            {
                let fileStream = new AsyncZipDeflate(filePath, deflateOptions);
                zip.add(fileStream);
                return fileStream;
            }
            // If array, read chunks from given buffer
            else if (Array.isArray(filePath))
            {
                let fileStream = new AsyncZipDeflate(filePath[0], deflateOptions);
                zip.add(fileStream);
                return [fileStream, ...filePath.slice(1)];
            }
        });
        // Ready for chunks
        zip.end();
        // Read in the chunks
        Promise.all(fileStreams.map(fileStream => new Promise((resolve, reject) => {
            // If array, read chunks from given buffer
            if (Array.isArray(fileStream))
            {
                const [ stream, buffer ] = fileStream;
                stream.push(buffer, true);
                resolve();
            }
            // Otherwise, read chunks from file
            else
            {
                let name = fileStream.filename;
                let readStream = createReadStream(name);
                readStream.on('error', reject);
                readStream.on('end', () => {
                    let emptyChunk = new Uint8Array();
                    fileStream.push(emptyChunk, true);
                    resolve();
                });
                readStream.on('data', chunk => {
                    fileStream.push(chunk);
                });
            }
        })))
        .then(resolve)
        .catch(reject);
    });
}

/**
 * @param {import('stream').Readable} readable
 */
export async function unzipFiles(outputDir, readable)
{
    return new Promise((resolve, reject) => {
        let promises = [];
        let unzip = new Unzip();
        unzip.register(AsyncUnzipInflate);
        unzip.onfile = fileStream => promises.push(
            fs.mkdir(path.join(outputDir, path.dirname(fileStream.name)), { recursive: true })
                .then(() => new Promise((resolve, reject) => {
                    console.log(fileStream.name, fileStream.originalSize, fileStream.size);
                    let writeStream = createWriteStream(path.join(outputDir, fileStream.name));
                    writeStream.on('error', err => {
                        fileStream.terminate();
                        reject(err);
                    });
                    fileStream.ondata = (err, data, final) => {
                        if (err)
                        {
                            writeStream.destroy();
                            reject(err);
                        }
                        else
                        {
                            writeStream.write(data, err => {
                                if (!err && final)
                                {
                                    writeStream.end(resolve);
                                }
                            });
                        }
                    };
                    fileStream.start();
                })));
        readable.on('error', reject);
        readable.on('end', () => {
            unzip.push(new Uint8Array(), true);
            // NOTE: We have read the last chunk, so no new files
            // will be discovered. Wait and close the streams.
            Promise.all(promises).then(resolve).catch(reject);
        });
        readable.on('data', data => {
            unzip.push(data);
        });
    });
}

/**
 * @template T
 * @param {string} dirPath 
 * @param {(file: string) => T|Promise<T>} [asyncCallback]
 * @returns {Promise<Array<T>>}
 */
export async function forFiles(dirPath, asyncCallback = async file => file)
{
    let dirs = [];
    let errors = [];
    let results = [];
    let promises = [];
    // Read directory files
    let files = await fs.readdir(dirPath);
    for(let file of files)
    {
        let filePath = path.join(dirPath, file);
        promises.push(fs.stat(filePath)
            .then(async stats => {
                if (stats.isDirectory()) dirs.push(filePath);
                else results.push(await asyncCallback(filePath, stats));
            })
            .catch(reason => errors.push(reason)));
    }
    // Resolve all results callback and dirs lookup
    await Promise.all(promises);
    promises.length = 0;
    // Look through all subdirectories
    for(let dir of dirs)
    {
        promises.push(forFiles(dir, asyncCallback)
            .catch(reason => errors.push(reason)));
    }
    // Resolve all subdirectories
    let subresults = await Promise.all(promises);
    promises.length = 0;
    results.push(...flatten(subresults));
    // Finally, throw all errors we found earlier
    if (errors.length > 0) throw errors.join('\n\n');
    // Remove all undefined values from result
    return results.filter(value => typeof value !== 'undefined');
}

export function* flatten(array, depth = 100)
{
    for(let value of array)
    {
        if (Array.isArray(value) && depth > 0)
        {
            yield* flatten(value, depth - 1);
        }
        else
        {
            yield value;
        }
    }
}
