import * as esbuild from 'esbuild';
import fs from 'fs/promises';
import path from 'path';
import open from 'open';

async function main(args) {
    const devMode = args.includes('--dev');
    const prodMode = args.includes('--prod');

    const entryPoints = [
        './src/main.js',
    ];
    const outputDir = 'out';
    const publicDir = 'public';

    if (devMode) {
        await fs.mkdir(outputDir).catch(e => {});
        await fs.copyFile('./game.html', path.join(outputDir, 'index.html'));

        const ctx = await esbuild.context({
            entryPoints,
            bundle: true,
            outdir: outputDir,
            define: {
                'window.IS_PRODUCTION': 'false',
            }
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
            define: {
                'window.IS_PRODUCTION': 'true',
            }
        });
        console.log('Completed build.');
        return;
    }

    console.log('No mode?');
}

main(process.argv);
