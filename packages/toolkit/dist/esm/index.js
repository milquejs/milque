import path from 'path';
import chokidar from 'chokidar';
import fs from 'fs/promises';
import { createWriteStream, createReadStream } from 'fs';
import { Zip, AsyncZipDeflate, Unzip, AsyncUnzipInflate } from 'fflate';
import esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import alias from 'esbuild-plugin-alias';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import open from 'open';

async function exists(filePath)
{
    try
    {
        await fs.stat(filePath);
    }
    catch(e)
    {
        return false;
    }
    return true;
}

async function verifyFile(filePath)
{
    let stats;
    try
    {
        stats = await fs.stat(filePath);
    }
    catch(e)
    {
        return false;
    }
    return stats.isFile();
}

async function verifyDirectory(dirPath)
{
    let stats;
    try
    {
        stats = await fs.stat(dirPath);
    }
    catch(e)
    {
        return false;
    }
    return stats.isDirectory();
}

async function copyFile(inputPath, outputPath)
{
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.copyFile(inputPath, outputPath);
}

async function deleteFile(filePath)
{
    await fs.rm(filePath);
}

async function deleteFiles(filePath)
{
    await fs.rm(filePath, { recursive: true, force: true });
}

function crc32c(crc, bytes)
{
    var POLY = 0x82f63b78;
    crc ^= 0xffffffff;
    for (let n = 0; n < bytes.length; n++)
    {
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

/**
 * @typedef ZipManifest
 * @property {number} totalBytes
 * @property {number} checksum
 * @property {Record<string, {bytes: number, checksum: number}>} files
 */

async function createZip(outFile, inDir)
{
    let files = await forFiles(inDir);
    let outDir = path.dirname(outFile);
    await fs.mkdir(outDir, { recursive: true });
    let ws = createWriteStream(outFile);
    return await zipFiles(files, ws);
}

async function createUnzip(inFile, outDir)
{
    await fs.mkdir(outDir, { recursive: true });
    let rs = createReadStream(inFile);
    return await unzipFiles(outDir, rs);
}

/**
 * @param {Array<string>} files 
 * @param {import('stream').Writable} writable 
 * @param {import('fflate').DeflateOptions} zipOpts
 * @returns {ZipManifest}
 */
async function zipFiles(files, writable, zipOpts = {})
{
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
            if (err)
            {
                reject(err);
            }
            else
            {
                writable.write(data, err => {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        if (final)
                        {
                            writable.end(resolve);
                        }
                    }
                });
            }
        };
        let promise = (async () => {
            for(let file of files)
            {
                if (typeof file === 'string')
                {
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
                                name: filePath,
                                bytes,
                                crc,
                            });
                            manifest.totalBytes += bytes;
                            fileStream.push(new Uint8Array(), true);
                            resolve();
                        });
                        readable.on('data', chunk => {
                            crc = crc32c(crc, chunk);
                            bytes += chunk.byteLength;
                            fileStream.push(chunk);
                        });
                    });
                }
                else if (Array.isArray(file))
                {
                    const [filePath, ...chunks] = file;
                    let bytes = 0;
                    let crc = 0;
                    let fileStream = new AsyncZipDeflate(filePath, zipOpts);
                    zip.add(fileStream);
                    for(let chunk of chunks)
                    {
                        crc = crc32c(crc, chunk);
                        bytes += chunk.byteLength;
                        fileStream.push(chunk);
                    }
                    manifest.files.push({
                        name: filePath,
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
    manifest.checksum = crc32c(manifest.checksum, new TextEncoder().encode(JSON.stringify(manifest)));
    return manifest;
}

/**
 * @param {import('stream').Readable} readable
 * @returns {ZipManifest}
 */
async function unzipFiles(outputDir, readable)
{
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
        unzip.onfile = fileStream => {
            let promise = fs.mkdir(path.join(outputDir, path.dirname(fileStream.name)), { recursive: true });
            promise = promise.then(() => new Promise((resolve, reject) => {
                console.log(`${fileStream.name} [${fileStream.originalSize} => ${fileStream.size}]`);
                let writable = createWriteStream(path.join(outputDir, fileStream.name));
                writable.on('error', err => {
                    fileStream.terminate();
                    reject(err);
                });
                let bytes = 0;
                let crc = 0;
                fileStream.ondata = (err, data, final) => {
                    if (err)
                    {
                        writable.destroy(err);
                    }
                    else
                    {
                        crc = crc32c(crc, data);
                        bytes += data.byteLength;
                        writable.write(data, (err) => {
                            if (err)
                            {
                                writable.destroy(err);
                            }
                            else
                            {
                                if (final)
                                {
                                    manifest.files.push({
                                        name: fileStream.name,
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
            }));
            promises.push(promise);
        };
        readable.on('error', reject);
        readable.on('end', () => {
            unzip.push(new Uint8Array(), true);
            Promise.all(promises).then(() => {
                manifest.files.sort((a, b) => a.name.localeCompare(b.name));
                manifest.checksum = crc32c(manifest.checksum, new TextEncoder().encode(JSON.stringify(manifest)));
                resolve();
            }).catch(reject);
        });
        readable.on('data', data => {
            unzip.push(data);
        });
    });
    return manifest;
}

/**
 * @param {string} inFile
 * @returns {Promise<ZipManifest>}
 */
async function getZipManifest(inFile)
{
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
        unzip.onfile = fileStream => promises.push(new Promise((resolve, reject) => {
            let bytes = 0;
            let crc = 0;
            fileStream.ondata = (err, data, final) => {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    crc = crc32c(crc, data);
                    bytes += data.byteLength;
                    if (final)
                    {
                        manifest.files.push({
                            name: fileStream.name,
                            bytes,
                            crc,
                        });
                        manifest.totalBytes += bytes;
                        resolve();
                    }
                }
            };
            fileStream.start();
        }));
        readable.on('error', reject);
        readable.on('end', () => {
            unzip.push(new Uint8Array(), true);
            Promise.all(promises).then(() => {
                manifest.files.sort((a, b) => a.name.localeCompare(b.name));
                manifest.checksum = crc32c(manifest.checksum, new TextEncoder().encode(JSON.stringify(manifest)));
                resolve();
            }).catch(reject);
        });
        readable.on('data', data => {
            unzip.push(data);
        });
    });
    return manifest;
}

/**
 * @template T
 * @param {string} dirPath 
 * @param {(file: string) => T|Promise<T>} [asyncCallback]
 * @returns {Promise<Array<T>>}
 */
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

class FileManager
{
    /**
     * @param {string} outputDir
     * @param {boolean} watch
     */
    constructor(outputDir, watch)
    {
        /**
         * @protected
         * @type {string}
         */
        this.outputDir = outputDir;
        /**
         * @protected
         * @type {boolean}
         */
        this.watching = watch;
        /**
         * @private
         * @type {Array<import('chokidar').FSWatcher>}
         */
        this.activeWatchers = [];
    }

    async clearOutput()
    {
        let outputDir = this.outputDir;
        if (await verifyDirectory(outputDir))
        {
            await deleteFiles(outputDir);
        }
    }

    async copy(inputFile, outputPath)
    {
        outputPath = path.join(this.outputDir, outputPath);
        if (await verifyFile(inputFile))
        {
            await copyFile(inputFile, outputPath);
        }
        if (this.watching)
        {
            let watcher = chokidar.watch(inputFile);
            watcher.on('all', async event => {
                switch(event)
                {
                    case 'add':
                    case 'change':
                        if (await verifyFile(inputFile))
                        {
                            await copyFile(inputFile, outputPath);
                        }
                        break;
                    case 'unlink':
                        if (await verifyFile(outputPath))
                        {
                            await deleteFile(outputPath);
                        }
                        break;
                    default:
                        return;
                }
            });
            this.activeWatchers.push(watcher);
        }
    }

    async zip(inputDir, outputPath)
    {
        outputPath = path.join(this.outputDir, outputPath);
        if (await verifyDirectory(inputDir))
        {
            await createZip(outputPath, inputDir);
        }
        if (this.watching)
        {
            let watcher = chokidar.watch(inputDir);
            watcher.on('all', async event => {
                switch(event)
                {
                    case 'add':
                    case 'change':
                    case 'unlink':
                        if (await verifyDirectory(inputDir))
                        {
                            await createZip(outputPath, inputDir);
                        }
                        break;
                    default:
                        return;
                }
            });
            this.activeWatchers.push(watcher);
        }
    }

    async unzip(inputFile, outputPath)
    {
        outputPath = path.join(this.outputDir, outputPath);
        if (await verifyFile(inputFile))
        {
            await createUnzip(inputFile, outputPath);
        }
        if (this.watching)
        {
            let watcher = chokidar.watch(inputFile);
            watcher.on('all', async event => {
                switch(event)
                {
                    case 'add':
                    case 'change':
                    case 'unlink':
                        if (await verifyFile(inputFile))
                        {
                            await createUnzip(inputFile, outputPath);
                        }
                        break;
                    default:
                        return;
                }
            });
            this.activeWatchers.push(watcher);
        }
    }

    async close()
    {
        for(let watcher of this.activeWatchers)
        {
            await watcher.close();
        }
        this.activeWatchers.length = 0;
    }
}

async function loadPackageJson(inputPath = 'package.json')
{
    return JSON.parse(await fs.readFile(inputPath));
}

/** @typedef {import('esbuild').BuildOptions} BuildOptions */

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {Array<string>} entryPoints 
 * @param {'production'|'development'} nodeEnv 
 * @param  {...BuildOptions} overrides 
 * @returns {BuildOptions}
 */
async function configureEsbuild(entryPoints, nodeEnv = 'production', ...overrides)
{
    if (entryPoints.length <= 0)
    {
        throw new Error('Must have at least one entry point.');
    }
    
    const sourceDir = path.dirname(path.join(__dirname, entryPoints[0]));

    /** @type {esbuild.BuildOptions} */
    return mergeConfigurations({
        entryPoints: entryPoints,
        bundle: true,
        minify: nodeEnv === 'production',
        sourcemap: true,
        loader: {
            '.css': 'text',
            '.html': 'text',
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            'process.platform': JSON.stringify('browser'),
        },
        plugins: [
            alias({
                'src': sourceDir,
            }),
            // TODO: https://github.com/micromatch/picomatch/pull/73
            NodeModulesPolyfillPlugin(),
        ],
    },
    ...overrides);
}

function mergeConfigurations(...configs)
{
    return configs.reduce((result, config) => {
        for(let [key, value] of Object.entries(config))
        {
            if (!(key in result))
            {
                result[key] = value;
            }
            else if (typeof value === 'object')
            {
                if (Array.isArray(value))
                {
                    result[key].push(...value);
                }
                else
                {
                    result[key] = {
                        ...result[key],
                        ...value,
                    };
                }
            }
            else
            {
                result[key] = value;
            }
        }
        return result;
    }, {});
}

/**
 * @param {esbuild.BuildOptions} config
 * @param {string} [serveDir] 
 * @param {string} [outputDir] 
 * @param {object} [opts]
 * @param {boolean} [opts.open]
 */
async function startDevServer(config, serveDir, outputDir, opts = {})
{
    const {
        open: startOpen = true
    } = opts;
    let server = await esbuild.serve(
        { servedir: serveDir }, {
            ...config,
            outdir: path.join(serveDir, outputDir),
        });
    if (startOpen)
    {
        let url = `http://${server.host}:${server.port}`;
        console.log(`Launching browser at '${url}'`);
        await open(url, { wait: true });
        console.log('Closed browser.');
    }
}

/**
 * @param {object} opts
 * @param {Array<string>} [opts.entryPoints]
 * @param {object} [opts.packageJson]
 * @param {string} [opts.serveDir = 'out']
 * @param {string} [opts.bundleDir = '']
 * @param {esbuild.BuildOptions} [opts.esbuildOpts]
 */
async function start(opts)
{
    const {
        packageJson = await loadPackageJson(),
        entryPoints = [ 'src/main.js' ],
        serveDir = 'out',
        bundleDir = '',
        esbuildOpts = {},
    } = opts;

    const nodeEnv = 'development';
    const config = await configureEsbuild(entryPoints, nodeEnv, esbuildOpts);
    const { browser } = packageJson;
    if (browser)
    {
        await startDevServer(config, serveDir, bundleDir);
    }
    else
    {
        throw new Error('Operation not supported.');
    }
}

async function bundleForBrowserDistribution(config, outputDir)
{
    // Build the package (iife)
    await esbuild.build({
        ...config,
        platform: 'browser',
        format: 'iife',
        outdir: outputDir,
    });
}

async function bundleForNodeDistribution(config, outputDir)
{
    // Build the package (commonjs)
    await esbuild.build({
        ...config,
        platform: 'node',
        format: 'cjs',
        outdir: outputDir,
    });

    await fs.writeFile(
        path.join(outputDir, 'package.json'),
        JSON.stringify({ type: 'commonjs' }));
}


async function bundleForModuleDistribution(config, outputDir)
{
    // Build the package (esmodules)
    await esbuild.build({
        ...config,
        platform: 'browser',
        format: 'esm',
        outdir: outputDir,
    });
    
    await fs.writeFile(
        path.join(outputDir, 'package.json'),
        JSON.stringify({ type: 'module' }));
}

/** @typedef {import('esbuild').BuildOptions} BuildOptions */

/**
 * @param {object} opts
 * @param {Array<string>} [opts.entryPoints]
 * @param {object} [opts.packageJson]
 * @param {string} [opts.outputDir]
 * @param {BuildOptions} [opts.esbuildOpts]
 */
async function build(opts)
{
    const {
        packageJson = await loadPackageJson(),
        entryPoints = [ 'src/main.js' ],
        outputDir = 'dist',
        esbuildOpts = {},
    } = opts;

    const nodeEnv = 'production';
    const config = await configureEsbuild(entryPoints, nodeEnv, esbuildOpts);
    const {
        main,
        exports,
        browser,
    } = packageJson;

    let flag = false;
    if (main || exports)
    {
        flag = true;
        await Promise.all([
            bundleForNodeDistribution(config, path.join(outputDir, 'cjs')),
            bundleForModuleDistribution(config, path.join(outputDir, 'esm')),
        ]);
    }
    
    if (browser)
    {
        flag = true;
        await bundleForBrowserDistribution(config, outputDir);
    }

    if (!flag)
    {
        throw new Error('Missing build targets - must set \'main\', '
            + '\'module\', or \'browser\' in your package json.');
    }
}

class BuildManager extends FileManager
{
    /**
     * @param {string} outputDir 
     * @param {boolean} watch 
     */
    constructor(outputDir, watch)
    {
        super(outputDir, watch);

        this.packageJsonObject = undefined;
        this.esbuildConfigs = [];
    }

    async packageJson(json)
    {
        if (typeof json === 'object')
        {
            this.packageJsonObject = {
                ...(this.packageJsonObject || {}),
                ...json,
            };
        }
        else if (typeof json === 'string')
        {
            this.packageJsonObject = await loadPackageJson(json);
        }
        else
        {
            this.packageJsonObject = await loadPackageJson();
        }
    }

    async esbuildConfig(...configs)
    {
        this.esbuildConfigs.push(...configs);
    }

    async build(entryPoints)
    {
        if (this.watching)
        {
            await start({
                entryPoints,
                packageJson: this.packageJsonObject,
                serveDir: this.outputDir,
                bundleDir: '',
                esbuildOpts: this.esbuildConfigs,
            });
        }
        else
        {
            await build({
                entryPoints,
                packageJson: this.packageJsonObject,
                outputDir: this.outputDir,
                esbuildOpts: this.esbuildConfigs,
            });
        }
    }
}

async function munge(inFile, outDir, opts = {})
{
    const packFile = path.basename(inFile);
    const packExt = path.extname(inFile);
    const packName = packFile.substring(0, packFile.length - packExt.length);
    const packDir = outDir;
    const packZip = inFile;
    const packRC = `${packName}.packrc`;
    const date = new Date();
    const backupDir = 'tmp';
    const backupName = `${
        date.getFullYear()}-${
            String(date.getMonth()).padStart(2, '0')}-${
                String(date.getDate()).padStart(2, '0')}-${
                    String(date.getHours()).padStart(2, '0')}-${
                        String(date.getMinutes()).padStart(2, '0')}-${
                            String(date.getSeconds()).padStart(2, '0')}`;
    const backupZip = path.join(backupDir, `${backupName}.${packName}.pack.backup`);

    const hasZip = await exists(packZip);
    const hasDir = await exists(packDir);
    
    let manifest = null;

    // Copy the backup if nothing exists
    if (!hasZip)
    {
        console.log('Creating packfile...');
        await fs.mkdir(packDir, { recursive: true });
        manifest = await createZip(packZip, packDir);
    }
    // If zip exists, but no source files. Extract!
    else if (!hasDir)
    {
        console.log('Extracting packfile...');
        manifest = await createUnzip(packZip, '.');
    }
    // If zip and source exists. Diff!
    else
    {
        console.log('Diffing packfile...');
        const tempDir = backupDir;
        const tempZip = path.join(backupDir, 'tmp.pack');
        await fs.mkdir(tempDir, { recursive: true });
        await createZip(tempZip, packDir);
        let zipManifest = await getZipManifest(packZip);
        let srcManifest = await getZipManifest(tempZip);

        // If different, overwrite zip with source
        if (zipManifest.checksum !== srcManifest.checksum)
        {
            console.log('Updating packfile...');
            // Always make backup first
            await fs.mkdir(backupDir, { recursive: true });
            await fs.copyFile(packZip, backupZip);
            // Then continue...
            await fs.copyFile(tempZip, packZip);
            manifest = srcManifest;
        }
        else
        {
            await fs.rm(tempZip);
            manifest = zipManifest;
        }
    }
    
    // Write to .packrc
    let packConfig = {
        version: '1.0.0',
        manifest,
    };
    if (await exists(packRC))
    {
        let config;
        try
        {
            config = JSON.parse(await fs.readFile(packRC));
        }
        catch(e)
        {
            config = {};
        }
        packConfig = {
            ...config,
            ...packConfig,
        };
    }
    await fs.writeFile(packRC, JSON.stringify(packConfig, undefined, 4));
}

export { BuildManager, FileManager, build, exists, getZipManifest, loadPackageJson, munge, start, createUnzip as unzip, createZip as zip };
