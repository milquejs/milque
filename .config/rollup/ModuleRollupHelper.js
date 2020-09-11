// @ts-nocheck
import path from 'path';

import alias from '@rollup/plugin-alias';
import clear from 'rollup-plugin-clear';

const PROJECT_ROOT_ALIAS = '@module';
const SOURCE_ROOT_PATH = 'src';
const DEVELOPMENT_DIR_PATH = 'out';
const PUBLIC_DIR_PATH = 'dist';

export function rollupConfig(args, packageJson, opts = {})
{
    const { entries = [] } = opts;
    const moduleName = capitalize(packageJson.name.split('/')[1]);
    return [
        main(packageJson, moduleName),
        module(packageJson, entries),
    ];
}

function capitalize(string)
{
    return string.charAt(0).toUpperCase() + string.substring(1);
}

export function main(pkg, moduleName)
{
    const outputDir = PUBLIC_DIR_PATH;
    const outputFile = path.basename(pkg.main);
    const outputPath = path.join(outputDir, outputFile);
    return {
        input: 'src/index.js',
        output: {
            file: outputPath,
            format: 'umd',
            name: moduleName,
            globals: {
                'gl-matrix': 'glMatrix'
            },
        },
        external: [
            'gl-matrix'
        ],
        plugins: [
            alias({
                entries: [
                    { find: PROJECT_ROOT_ALIAS, replacement: SOURCE_ROOT_PATH },
                ],
            }),
            clear({
                targets: [ outputDir ]
            }),
        ]
    };
}

export function module(pkg, entryPoints)
{
    const outputDir = path.dirname(pkg.module);
    return {
        input: [
            'src/index.js',
            ...entryPoints,
        ],
        output: {
            dir: outputDir,
            format: 'esm',
        },
        external: [
            'gl-matrix',
        ]
    };
}
