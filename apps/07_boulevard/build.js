import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import open from 'open';
import alias from 'esbuild-plugin-alias';
import { fileURLToPath } from 'url';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDefine(isProduction) {
    return {
        // TODO: For esbuild watch-mode.
        'window.IS_PRODUCTION': isProduction ? 'true' : 'false',
        // TODO: https://github.com/micromatch/picomatch/pull/73
        'process.platform': JSON.stringify('browser'),
    };
}

function getPlugins(sourcePath) {
    return [
        alias({ '@': sourcePath }),
        // TODO: https://github.com/micromatch/picomatch/pull/73
        NodeModulesPolyfillPlugin(),
    ];
}

function getLoader() {
    return {
        '.png': 'file',
    };
}

async function main(args) {
    const devMode = args.includes('--dev');
    const prodMode = args.includes('--prod');

    const entryPoints = [
        './src/main.js',
    ];
    const sourcePath = path.dirname(path.join(__dirname, entryPoints[0]));
    const outputDir = 'out';
    const publicDir = 'public';

    if (devMode) {
        await fs.mkdir(outputDir).catch(e => {});
        await fs.copyFile('./game.html', path.join(outputDir, 'index.html'));

        const ctx = await esbuild.context({
            entryPoints,
            bundle: true,
            outdir: outputDir,
            define: getDefine(false),
            plugins: getPlugins(sourcePath),
            loader: getLoader(),
        });
        await ctx.watch();
        const server = await ctx.serve({
            servedir: outputDir,
        });

        const url = `http://${server.host}:${server.port}`;
        console.log(`Launching browser at '${url}'`);
        await open(url, { wait: true });
        console.log('Closed browser.');
        return;
    }

    if (prodMode) {
        await fs.mkdir(publicDir).catch(e => {});
        await fs.copyFile('./game.html', path.join(publicDir, 'index.html'));

        await esbuild.build({
            entryPoints,
            bundle: true,
            minify: true,
            sourcemap: true,
            outdir: publicDir,
            define: getDefine(true),
            plugins: getPlugins(sourcePath),
            loader: getLoader(),
        });
        console.log('Completed build.');
        return;
    }

    console.log('No mode?');
}

main(process.argv);
