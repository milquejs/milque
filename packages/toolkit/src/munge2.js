import fs from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { zip } from 'fflate';
import { Unzip, AsyncUnzipInflate } from 'fflate';


/**
 * On project init, unzip packfile into packdir
 * On build and pre-commit, zip packdir into packfile
 */

async function sync()
{
    // Setup environment for munge-sync
    // - if no packfile, create it
    // - if no packdir, generate from packfile
    // - diff all content and verify with meta files
    // - confirm these changes are expected (y/n)
    // - overwrite packfile with changes
}

async function diff()
{

}

async function reset()
{
    
}

async function main(args)
{
    try
    {
        // Start munge time
        console.time('munge');
        let writeStream = createWriteStream(packfile);
        let files = [];
        await forFiles('res', async file => {
            files.push(file);
        });
        await zipFiles(files, writeStream);
        // End munge time
        console.timeEnd('munge');
    }
    catch(e)
    {
        console.error(e);
        process.exit(1);
    }
}

main(process.argv);

async function getPackDirectory(packfile)
{
    let packExt = path.extname(packfile);
    let packName = path.basename(packfile, packExt);
    let packStats;
    try
    {
        packStats = await fs.stat(packName);
    }
    catch(e)
    {
        // Does not exist. Create it.
        await fs.mkdir(packName);
        packStats = await fs.stat(packName);
    }
    if (!packStats.isDirectory())
    {
        throw new Error('Packfile directory is not a directory.');
    }
    return packName;
}

async function munge2(packfile)
{
    let packDir = await getPackDirectory(packfile);
    let metaFiles = [];
    let files = await forFiles(packDir,
        async file => {
            if (!file.endsWith('.meta'))
            {
                return file;
            }
            else
            {
                metaFiles.push(file);
                return;
            }
        });
    // Generate new meta files
    let metaJsons = await generateMetaFiles(packDir, files);
    // Diff with old meta files
    {
        let metaFileJsons = await Promise.all(metaFiles.map(async metaFile => readMetaFile(metaFile)));
        let oldMetas = metaFileJsons.reduce((result, value) => {
            result[value.key] = value;
            return result;
        }, {});
        let newMetas = metaJsons.reduce((result, value) => {
            result[value.key] = value;
            return result;
        }, {});
        let diff = {
            added: [],
            removed: [],
            changed: [],
        }
        for(let key in newMetas)
        {
            if (key in oldMetas)
            {
                if (oldMetas[key].hash !== newMetas[key].hash)
                {
                    diff.changed.push(key);
                }
                else
                {
                    // It's the same!
                }
                // Should use the new meta instead
                delete oldMetas[key];
            }
            else
            {
                diff.added.push(key);
            }
        }
        for(let key in oldMetas)
        {
            diff.removed.push(key);
        }
        // Added
        for(let key of diff.added)
        {
            console.log(`Added: ${key}`);
        }
        // Removed
        for(let key of diff.removed)
        {
            console.log(`Removed: ${key}`);
        }
        // Changed
        for(let key of diff.changed)
        {
            console.log(`Changed: ${key}`);
        }
        console.log();
    }
    // Encode new meta files to be zipped
    let encoder = new TextEncoder();
    for(let meta of metaJsons)
    {
        let text = JSON.stringify(meta, undefined, 4);
        let buffer = encoder.encode(text);
        files.push([meta.key + '.meta', buffer]);
    }
    // Start zipping
    let writeStream = createWriteStream(packfile);
    await zipFiles(files, writeStream);
}

async function unmunge2(packfile)
{
    let readStream = createReadStream(packfile);
    await unzipFiles(readStream);
}

async function readMetaFile(filePath)
{
    let buffer = await fs.readFile(filePath);
    let decoder = new TextDecoder();
    let text = decoder.decode(buffer);
    let json = JSON.parse(text);
    return json;
}

async function generateMetaFiles(packName, files)
{
    let result = await Promise.all(files.map(async file => {
        return new Promise((resolve, reject) => {
            let readStream = createReadStream(file);
            let crc = 0;
            let bytes = 0;
            readStream.on('error', reject);
            readStream.on('end', () => resolve({
                key: file,
                hash: crc,
                bytes: bytes,
            }));
            readStream.on('data', data => {
                crc = crc32c(crc, data);
                bytes += data.length;
            });
        });
    }));
    // Sort to maintain consistent order
    result.sort((a, b) => a.key.localeCompare(b.key));
    let totalFiles = [];
    let totalBytes = 0;
    let totalHash = 0;
    let encoder = new TextEncoder();
    for(let meta of result)
    {
        let buf = encoder.encode(meta.key + '#' + meta.hash);
        totalHash = crc32c(totalHash, buf);
        totalBytes += meta.bytes;
        totalFiles.push(meta.key);
    }
    let rootMeta = {
        key: packName + path.sep,
        bytes: totalBytes,
        hash: totalHash,
        files: totalFiles,
    };
    result.unshift(rootMeta);
    return result;
}

/**
 * @param {Array<string>} files 
 * @param {import('stream').Writable} writable 
 * @param {import('fflate').DeflateOptions} deflateOptions
 */
async function zipFiles(files, writable, deflateOptions = undefined)
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
 * @returns 
 */
async function unzipFiles(readable)
{
    return new Promise((resolve, reject) => {
        let promises = [];
        let unzip = new Unzip();
        unzip.register(AsyncUnzipInflate);
        unzip.onfile = fileStream => promises.push(
            fs.mkdir(path.dirname(fileStream.name), { recursive: true })
                .then(() => new Promise((resolve, reject) => {
                    console.log(fileStream.name, fileStream.originalSize, fileStream.size);
                    let writeStream = createWriteStream(fileStream.name);
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

async function munge(packfile)
{
    const packext = path.extname(packfile);
    const packname = path.basename(packfile, packext);
    const inputPath = packname;
    const outputPath = packfile;

    const outContentPath = path.join('out', 'content.zip');
    const rootMetaPath = path.join(packname, '.meta');

    let packfileJson = {};

    // Zip content
    let contentStream = createWriteStream(outContentPath);
    let contentZip = new Zip();
    await new Promise((resolve, reject) => {
        contentStream.on('error', reject);
        contentZip.ondata = (err, data, final) => {
            if (err)
            {
                reject(err);
            }
            else
            {
                contentStream.write(data, err => {
                    if (!err && final)
                    {
                        contentStream.end();
                        resolve();
                    }
                });
            }
        };
        forFiles(inputPath, async (filePath, fileStats) => {
            if (filePath === rootMetaPath)
            {
                // Skip root meta for content zip
                try
                {
                    let buffer = await fs.readFile(filePath);
                    let text = new TextDecoder().decode(buffer);
                    let json = JSON.parse(text);
                    packfileJson = json;
                }
                catch(e)
                {
                    // Invalid root meta file. Make a new one.
                    packfileJson = {};
                }
                return;
            }

            // Let's process this file
            console.log(filePath);

            let fileExt = path.extname(filePath);
            if (fileExt === '.meta')
            {
                // Skip meta files, it will be processed at asset file
                return;
            }

            let metaPath = filePath + '.meta';
            let metaJson = {};
            try
            {
                await fs.stat(metaPath);
                let buffer = await fs.readFile(metaPath);
                let text = new TextDecoder().decode(buffer);
                let json = JSON.parse(text);
                metaJson = json;
            }
            catch(e)
            {
                // Meta file doesn't exist. That's okay. Let's make one.
                metaJson = {
                    contentHash: 0,
                    sizeBytes: 0,
                };
            }

            await new Promise((resolve, reject) => {
                let hash = crypto.createHash('sha1');
                let bytes = 0;

                let rs = createReadStream(filePath).on('error', reject);
                let fileStream = new AsyncZipDeflate(filePath);
                contentZip.add(fileStream);
                let metaStream = new AsyncZipDeflate(metaPath);
                contentZip.add(metaStream);
                rs.on('data', chunk => {
                    fileStream.push(chunk);
                    hash.update(chunk);
                    bytes += chunk.length;
                });
                rs.on('end', () => {
                    fileStream.push(new Uint8Array(), true);
                    // Update meta file
                    metaJson.contentHash = hash.digest('hex');
                    metaJson.sizeBytes = bytes;
                    metaStream.push(new TextEncoder().encode(JSON.stringify(metaJson)), true);
                    resolve();
                });
            })
        }).then(() => contentZip.end());
    });

    // Zip packfile
    let rootStream = createWriteStream(outputPath);
    let rootZip = new Zip();
    await new Promise((resolve, reject) => {
        rootStream.on('error', reject);
        rootZip.ondata = (err, data, final) => {
            if (err)
            {
                reject(err);
            }
            else
            {
                rootStream.write(data, err => {
                    if (!err && final)
                    {
                        rootStream.end();
                        resolve();
                    }
                });
            }
        };
        
        let packfileBuffer = new TextEncoder().encode(JSON.stringify(packfileJson, null, 4));
        let packfileStream = new AsyncZipDeflate('.meta', { level: 0 });
        rootZip.add(packfileStream);
        packfileStream.push(packfileBuffer, true);

        let contentReader = createReadStream(outContentPath);
        let contentStream = new AsyncZipDeflate('content', { level: 0 });
        rootZip.add(contentStream);
        contentReader.on('error', reject);
        contentReader.on('data', chunk => {
            contentStream.push(chunk);
        });
        contentReader.on('end', () => {
            contentStream.push(new Uint8Array(), true);
            resolve();
        });
    }).then(() => rootZip.end());

    console.log();
}

async function unmunge(packfile)
{
    const packext = path.extname(packfile);
    const packname = path.basename(packfile, packext);
    const inputPath = packfile;
    const rootMetaPath = path.join(packname, '.meta');

    const { rootMetaJson, contentStream } = await readPackfile(inputPath);

    // Create root meta file
    await fs.mkdir(path.dirname(rootMetaPath), { recursive: true });
    await fs.writeFile(rootMetaPath, JSON.stringify(rootMetaJson, null, 4));
    
    // Unzip content
    let tracker = new UnzipProgressTracker();
    let unzip = new Unzip();
    unzip.register(AsyncUnzipInflate);
    return new Promise((resolve, reject) => {
        unzip.onfile = createUnzipFileHandler(tracker);
        contentStream.ondata = (err, data, final) => {
            if (err)
            {
                tracker.destroy();
                reject(err);
            }
            else
            {
                unzip.push(data, final);
                if (final)
                {
                    // NOTE: This assumes all files have been
                    // discovered by this point. This should
                    // be the case since discovery should be
                    // much faster than bytes reading.
                    tracker.waitUntilDone()
                        .then(resolve)
                        .catch(reject);
                }
            }
        };
        contentStream.start();
    })
    // Clean up in-progress files
    .catch(err => tracker.destroy(err));
}

async function readPackfile(packfile)
{
    let rs = createReadStream(packfile);
    let unzip = new Unzip();
    unzip.register(AsyncUnzipInflate);
    let rootMetaJson = null;
    let contentStream = null;
    return new Promise((resolve, reject) => {
        unzip.onfile = file => {
            switch(file.name)
            {
                case '.meta':
                    let chunks = [];
                    file.ondata = (err, data, final) => {
                        if (err)
                        {
                            reject(err);
                        }
                        else
                        {
                            chunks.push(data);
                            if (final)
                            {
                                let totalBytes = chunks.reduce((result, chunk) => result + chunk.length, 0);
                                let buffer = new Uint8Array(totalBytes);
                                let bufferIndex = 0;
                                for(let data of chunks)
                                {
                                    buffer.set(data, bufferIndex);
                                    bufferIndex += data.length;
                                }
                                let textDecoder = new TextDecoder();
                                let text = textDecoder.decode(buffer);
                                rootMetaJson = JSON.parse(text);
                                if (contentStream)
                                {
                                    resolve({
                                        rootMetaJson,
                                        contentStream
                                    });
                                }
                            }
                        }
                    };
                    file.start();
                    break;
                case 'content':
                    contentStream = file;
                    if (rootMetaJson)
                    {
                        resolve({
                            rootMetaJson,
                            contentStream
                        });
                    }
                    break;
                default:
                    // Ignore other files
            }
        };
        rs.on('data', data => {
            unzip.push(data);
        });
        rs.on('end', () => {
            unzip.push(new Uint8Array(), true);
        });
        rs.on('error', err => {
            reject(err);
        });
    });
}

class UnzipProgressTracker
{
    constructor()
    {
        this.progress = {};
        this.promises = [];

        this.dead = false;
    }

    async waitUntilDone()
    {
        return Promise.all(this.promises);
    }

    destroy(reason)
    {
        // Stop all future files
        this.dead = true;

        // Stop all current files
        for(let fileKey of Object.keys(this.progress))
        {
            this.cancelFile(fileKey, reason);
        }
    }

    startTrackingFile(fileKey)
    {
        let progress = {
            active: true,
            // If truthy, this will stop new files from starting (and reject early)
            error: false,
            // If truthy, this will stop new files from starting (and resolve early)
            result: false,
            // Allow file progress to clean up file stream
            fstream: null,
            // Setup during processing, allow file progress to clean up write stream
            wstream: null,
            // Setup during processing, allow file progress to be resolvable
            resolve: null,
            // Setup during processing, allow file progress to be rejectable
            reject: null,
            // Setup during processing, allow file progress to be waited on
            promise: null,
        };
        this.progress[fileKey] = progress;
        return progress;
    }

    stopTrackingFile(fileKey)
    {
        let progress = this.getFileProgress(fileKey);
        progress.active = false;
        progress.error = false;
        progress.result = false;
        progress.fstream = null;
        progress.wstream = null;
        progress.resolve = null;
        progress.reject = null;
        progress.promise = null;
    }

    isTrackingFile(fileKey)
    {
        return fileKey in this.progress;
    }

    isTrackingActiveFile(fileKey)
    {
        if (this.isTrackingFile(fileKey))
        {
            let progress = this.getFileProgress(fileKey);
            return progress.active;
        }
        else
        {
            return false;
        }
    }

    trackFileStream(fileKey, fileStream)
    {
        let progress = this.getFileProgress(fileKey);
        progress.fstream = fileStream;
    }

    trackFilePromise(fileKey, promise)
    {
        let progress = this.getFileProgress(fileKey);
        progress.promise = promise;
        this.promises.push(promise);
    }

    trackFilePromiseHandlers(fileKey, promisedResolve, promisedReject)
    {
        let progress = this.getFileProgress(fileKey);
        progress.resolve = promisedResolve;
        progress.reject = promisedReject;
    }

    trackFileWriter(fileKey, writeStream)
    {
        let progress = this.getFileProgress(fileKey);
        progress.wstream = writeStream;
    }

    tryPreparingFile(fileKey)
    {
        let progress = this.getFileProgress(fileKey);
        // If already cancelled, early-out
        if (progress.error)
        {
            this.cancelFile(fileKey, progress.error);
            return false;
        }
        // If already overriden, early-out
        if (progress.result)
        {
            this.putFile(fileKey, progress.result);
            return false;
        }
        // If dead, don't start anything either
        if (this.dead)
        {
            this.cancelFile(fileKey, progress.error);
            return false;
        }
        return true;
    }

    tryProcessingFile(fileKey)
    {
        let progress = this.getFileProgress(fileKey);
        // If already cancelled, early-out
        if (progress.error)
        {
            this.cancelFile(fileKey, progress.error);
            return false;
        }
        // If already overriden, early-out
        if (progress.result)
        {
            this.putFile(fileKey, progress.result);
            return false;
        }
        // If dead, don't start anything either
        if (this.dead)
        {
            this.cancelFile(fileKey, progress.error);
            return false;
        }
        return true;
    }

    getFileProgress(fileKey)
    {
        return this.progress[fileKey];
    }

    putFile(fileKey, buffer)
    {
        let progress = this.getFileProgress(fileKey);
        progress.result = buffer || new Uint8Array();
        progress.error = false;
        if (progress.fstream)
        {
            progress.fstream.terminate();
            progress.fstream = null;
        }
        if (progress.wstream)
        {
            progress.wstream.destroy();
            progress.wstream = null;
        }
        if (progress.resolve)
        {
            progress.resolve(buffer);
            progress.resolve = null;
            progress.reject = null;
        }
        this.stopTrackingFile(fileKey);
    }

    cancelFile(fileKey, reason)
    {
        let progress = this.getFileProgress(fileKey);
        progress.error = reason || true;
        progress.result = false;
        if (progress.fstream)
        {
            progress.fstream.terminate();
            progress.fstream = null;
        }
        if (progress.wstream)
        {
            progress.wstream.destroy();
            progress.wstream = null;
        }
        if (progress.reject)
        {
            progress.reject(reason);
            progress.reject = null;
            progress.resolve = null;
        }
        this.stopTrackingFile(fileKey);
    }
}

function createUnzipFileHandler(tracker)
{
    return function unzipFileHandler(file)
    {
        const fileKey = file.name;
        tracker.startTrackingFile(fileKey);
        tracker.trackFileStream(fileKey, file);
        tracker.trackFilePromise(fileKey, new Promise((resolve, reject) => {
            tracker.trackFilePromiseHandlers(fileKey, resolve, reject);
            if (!tracker.tryPreparingFile(fileKey)) return;
            // Prepare file system for writing
            const filePath = fileKey;
            fs.mkdir(path.dirname(filePath), { recursive: true }).then(() => {
                if (!tracker.tryProcessingFile(fileKey)) return;
                // Setup streams for processing
                let ws = createWriteStream(filePath);
                tracker.trackFileWriter(fileKey, ws);
                ws.on('error', err => {
                    tracker.stopTrackingFile(fileKey);
                    file.terminate();
                    reject(err);
                });
                file.ondata = (err, data, final) => {
                    if (err)
                    {
                        ws.destroy(err);
                    }
                    else
                    {
                        // NOTE: Data chunks can overflow the write buffer
                        // here and cause the system to become OutOfMemory.
                        ws.write(data, err => {
                            if (!err && final)
                            {
                                // Finished processing this file!
                                tracker.stopTrackingFile(fileKey);
                                ws.end();
                                resolve();
                            }
                        });
                    }
                };
                // Start processing the file
                file.start();
            }).catch(err => {
                tracker.stopTrackingFile(fileKey);
                file.terminate();
                reject(err);
            });
        }));
    };
}

async function forFiles(dirPath, asyncCallback = async file => file)
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

function* flatten(array, depth = 100)
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

function crc32c(crc, bytes) {
    var POLY = 0x82f63b78;
    crc ^= 0xffffffff;
    for (let n = 0; n < bytes.length; n++) {
        crc ^= bytes[n];
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
    }
    return crc ^ 0xffffffff;
}
