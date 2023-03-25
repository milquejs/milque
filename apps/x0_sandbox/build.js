import { build, context } from 'esbuild';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { copyPlugin } from '@sprout2000/esbuild-copy-plugin';
import clear from 'esbuild-plugin-clear';

import open from 'open';

function createBuildOpts(production = true) {
    const outdir = production ? 'public' : 'out';
    return {
        entryPoints: ['./src/index.js'],
        bundle: true,
        minify: production,
        sourcemap: production,
        outdir,
        loader: {
            '.png': 'file'
        },
        define: {
            'window.IS_PRODUCTION': String(Boolean(production)),
            'process.platform': JSON.stringify('browser'),
        },
        plugins: [
            clear(outdir),
            copyPlugin({
                src: './src/index.html',
                dest: `${outdir}/index.html`,
            }),
            // TODO: https://github.com/micromatch/picomatch/pull/73
            NodeModulesPolyfillPlugin(),
        ]
    };
}

/**
 * @param {Array} args 
 */
async function main(args) {
    if (args.includes('--watch')) {
        const ctx = await context({
            ...createBuildOpts(false),
            minify: false,
            sourcemap: false,
        });

        await ctx.watch();

        const server = await ctx.serve({
            servedir: 'out',
        });

        const url = `http://${server.host}:${server.port}`;
        console.log(`Opening at ${url} ...`);
        await open(url, { wait: true });
        console.log('...closing.');
        return;
    }

    await build({
        ...createBuildOpts(true)
    });
}

main(process.argv);
