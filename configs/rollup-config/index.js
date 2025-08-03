import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import { dts as dtsPlugin } from 'rollup-plugin-dts';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const DEFAULT_EXTERNALS = [
  'gl-matrix',
];

/**
 * @param {object} packageJson
 * @param {string} inputPath 
 */
export function iife(packageJson, inputPath) {
  const { outputDir } = parsePackageJsonForExports(packageJson, 'bin', 'dist/index.js', 'index.js');
  return {
    input: [inputPath],
    output: {
      dir: outputDir,
      format: 'iife',
      banner: '#!/usr/bin/env node'
    },
    external: [
      ...DEFAULT_EXTERNALS
    ],
    plugins: [
      del({ targets: path.join(outputDir, '*') }),
      commonjs(),
      nodeResolve(),
      // TODO: https://github.com/micromatch/picomatch/pull/73
      nodePolyfills(),
      terser()
    ],
  }
}

/**
 * @param {object} packageJson
 * @param {string} globalName
 * @param {string} inputPath
 * @returns {import('rollup').RollupOptions}
 */
export function umd(packageJson, globalName, inputPath) {
  const { outputDir } = parsePackageJsonForExports(packageJson, 'main', 'dist/umd/index.js', 'index.js');
  return {
    input: [inputPath],
    output: {
      dir: outputDir,
      format: 'umd',
      name: globalName,
      esModule: false,
      exports: 'named',
      sourcemap: true,
      globals: {
        'gl-matrix': 'glMatrix'
      }
    },
    external: [
      ...DEFAULT_EXTERNALS
    ],
    plugins: [
      del({ targets: path.join(outputDir, '*') }),
      commonjs(),
      nodeResolve(),
      // TODO: https://github.com/micromatch/picomatch/pull/73
      nodePolyfills(),
      terser()
    ],
  };
}

/**
 * @param {object} packageJson
 * @param {string} inputPath
 * @param {string} [outputPath]
 * @returns {import('rollup').RollupOptions}
 */
export function esm(packageJson, inputPath) {
  const { outputDir } = parsePackageJsonForExports(packageJson, 'module', 'dist/esm/index.js', 'index.js');
  return {
    input: [inputPath],
    output: [
      {
        dir: outputDir,
        name: `${toPosixKebab(packageJson.name)}`,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      }
    ],
    external: [
      ...DEFAULT_EXTERNALS
    ],
    plugins: [
      del({ targets: path.join(outputDir, '*') }),
      commonjs(),
      nodeResolve(),
      // TODO: https://github.com/micromatch/picomatch/pull/73
      nodePolyfills(),
    ],
  };
}

/**
 * @param {object} packageJson
 * @param {string} inputPath
 * @returns {import('rollup').RollupOptions}
 */
export function dts(packageJson, inputPath) {
  const { outputDir } = parsePackageJsonForExports(packageJson, 'types', 'dist/types/index.d.ts', 'index.d.ts');
  return {
    input: [inputPath],
    output: {
      dir: outputDir,
      format: 'es',
    },
    external: [
      ...DEFAULT_EXTERNALS
    ],
    plugins: [
      del({ targets: path.join(outputDir, '*') }),
      dtsPlugin(),
    ],
  };
}

export function toPosixKebab(str) {
  str = str.replace('/', '-');
  str = str.replace(/[^\w\d_-]+/g, '');
  return str;
}

export function toPosixCamel(str) {
  str = str.replace(/-./g, x => x[1].toUpperCase());
  str = str.replace(/[^\w\d_-]+/g, '');
  return str;
}

/**
 * @param {object} packageJson 
 * @param {string} fieldName 
 * @param {string} expectedValue 
 * @param {string} [enforcedBaseName] 
 */
export function parsePackageJsonForExports(packageJson, fieldName, expectedValue, enforcedBaseName = undefined) {
  const outputPath = packageJson?.[fieldName];
  if (!outputPath) {
    throw new Error(
      `The package.json is missing "${fieldName}"\n- expected something like:\n${
        JSON.stringify({ [fieldName]: expectedValue }, null, 4)}\n- but found:\n${
        JSON.stringify({ [fieldName]: outputPath }, null, 4)}`)
  }
  const outputDir = path.dirname(outputPath);
  if (enforcedBaseName && path.basename(outputPath) !== enforcedBaseName) {
    throw new Error(
      `The package.json field "${fieldName}" must resolve to "${enforcedBaseName}"\n- expected something like:\n${
        JSON.stringify({ [fieldName]: path.join(outputDir, enforcedBaseName)}, null, 4)}\n- but found:\n${
        JSON.stringify({ [fieldName]: outputPath }, null, 4)}`);
  }
  return {
    outputDir
  };
}
