import path from 'path';

import { loadPackageJson } from './PackageJsonLoader.js';
import { configureEsbuild } from './EsbuildConfig.js';

import {
    bundleForBrowserDistribution,
    bundleForModuleDistribution,
    bundleForNodeDistribution
} from './Bundler.js';

/** @typedef {import('esbuild').BuildOptions} BuildOptions */

/**
 * @param {object} opts
 * @param {Array<string>} [opts.entryPoints]
 * @param {object} [opts.packageJson]
 * @param {string} [opts.outputDir]
 * @param {BuildOptions} [opts.esbuildOpts]
 */
export async function build(opts)
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
