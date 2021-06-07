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

async function createZip(outFile, inDir)
{
    let files = await forFiles(inDir);
    let outDir = path.dirname(outFile);
    await fs.mkdir(outDir, { recursive: true });
    let ws = createWriteStream(outFile);
    await zipFiles(files, ws);
}

async function createUnzip(inFile, outDir)
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
 */
async function unzipFiles(outputDir, readable)
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

async function munge(inputFile, outputDir = undefined, reset = false)
{
    // Start munge time
    console.time('munge');
    if (typeof outputDir === 'undefined')
    {
        let ext = path.extname(inputFile);
        let name = path.basename(inputFile, ext);
        outputDir = path.join(path.dirname(inputFile), name);
    }
    await fs.mkdir(outputDir, { recursive: true });
    if (reset)
    {
        // Sync asset files from zip
        // TODO: In the future, we should diff this instead of just overwrite
        await createUnzip(path.join('..', inputFile), outputDir);
    }
    else
    {
        // Munge asset files to zip
        await createZip(inputFile, outputDir);
    }
    // End munge time
    console.timeEnd('munge');
}

export { BuildManager, FileManager, build, loadPackageJson, munge, start };
