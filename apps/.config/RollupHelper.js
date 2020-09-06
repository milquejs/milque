// @ts-nocheck
import path from 'path';

import nodeResolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import watchAssets from 'rollup-plugin-watch-assets';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';

const PROJECT_ROOT_ALIAS = '@app';
const SOURCE_ROOT_PATH = 'src';
const DEVELOPMENT_DIR_PATH = 'out';
const PUBLIC_DIR_PATH = 'dist';

const STATIC_FILES = [
    '../../res',
    'res',
];
const EXTERNAL_ASSETS = [
    { src: 'src/assets/template.html', rename: 'index.html' },
];

export function rollupConfig(packageJson, devMode)
{
    return devMode
        ? development(packageJson)
        : production(packageJson);
}

function getMinifyName(fileName)
{
    const ext = path.extname(fileName);
    const base = path.basename(fileName, ext);
    const dir = path.dirname(fileName);
    return dir + '/' + base + '.min' + ext;
}

export function common(opts)
{
    const { plugins, minify, outputDir, outputFile } = opts;
    const outputPath = path.join(outputDir, outputFile);
    return {
        input: 'src/main.js',
        output: [
            {
                file: outputPath,
                format: 'iife',
                sourcemap: true,
            },
            ...(minify ? [{
                file: getMinifyName(outputPath),
                format: 'iife',
                plugins: [
                    terser(),
                ]
            }] : [])
        ],
        plugins: [
            nodeResolve({ browser: true }),
            alias({
                entries: [
                    { find: PROJECT_ROOT_ALIAS, replacement: SOURCE_ROOT_PATH },
                ],
            }),
            copy({
                targets: EXTERNAL_ASSETS.map(opt => ({dest: outputDir, ...opt})),
            }),
            watchAssets({
                assets: EXTERNAL_ASSETS.map(opt => opt.src),
            }),
            clear({
                targets: [ outputDir ],
            }),
            ...plugins,
        ]
    };
}

export function development(pkg)
{
    const outputDir = DEVELOPMENT_DIR_PATH;
    const outputFile = path.basename(pkg.browser);
    return common({
        outputDir,
        outputFile,
        minify: false,
        plugins: [
            // Development-only plugins
            serve({
                open: true,
                contentBase: [outputDir, ...STATIC_FILES],
            }),
            livereload({
                watch: outputDir,
            }),
        ],
    });
}

export function production(pkg)
{
    const outputDir = PUBLIC_DIR_PATH;
    const outputFile = path.basename(pkg.browser);
    return common({
        outputDir,
        outputFile,
        minify: true,
        plugins: [
            // Production-only plugins
        ],
    });
}
