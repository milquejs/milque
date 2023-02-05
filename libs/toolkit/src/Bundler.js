import fs from 'fs/promises';
import path from 'path';
import esbuild from 'esbuild';

export async function bundleForBrowserDistribution(config, outputDir) {
  // Build the package (iife)
  await esbuild.build({
    ...config,
    platform: 'browser',
    format: 'iife',
    outdir: outputDir,
  });
}

export async function bundleForNodeDistribution(config, outputDir) {
  // Build the package (commonjs)
  await esbuild.build({
    ...config,
    platform: 'node',
    format: 'cjs',
    outdir: outputDir,
  });

  await fs.writeFile(
    path.join(outputDir, 'package.json'),
    JSON.stringify({ type: 'commonjs' })
  );
}

export async function bundleForModuleDistribution(config, outputDir) {
  // Build the package (esmodules)
  await esbuild.build({
    ...config,
    platform: 'browser',
    format: 'esm',
    outdir: outputDir,
  });

  await fs.writeFile(
    path.join(outputDir, 'package.json'),
    JSON.stringify({ type: 'module' })
  );
}
