import { loadPackageJson } from './PackageJsonLoader.js';
import { configureEsbuild } from './EsbuildConfig.js';

import { startDevServer } from './DevServer.js';

/**
 * @param {object} opts
 * @param {Array<string>} [opts.entryPoints]
 * @param {object} [opts.packageJson]
 * @param {string} [opts.serveDir = 'out']
 * @param {string} [opts.bundleDir = '']
 * @param {import('esbuild').BuildOptions} [opts.esbuildOpts]
 */
export async function start(opts) {
  const {
    packageJson = await loadPackageJson(),
    entryPoints = ['src/main.js'],
    serveDir = 'out',
    bundleDir = '',
    esbuildOpts = {},
  } = opts;

  const nodeEnv = 'development';
  const { browser } = packageJson;
  const config = await configureEsbuild(entryPoints, [], nodeEnv, esbuildOpts);
  if (browser) {
    await startDevServer(config, serveDir, bundleDir);
  } else {
    throw new Error('Operation not supported.');
  }
}
