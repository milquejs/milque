import path from 'path';
import { fileURLToPath } from 'url';

import alias from 'esbuild-plugin-alias';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

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
export async function configureEsbuild(entryPoints, nodeEnv = 'production', ...overrides)
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
