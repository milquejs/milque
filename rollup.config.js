import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { string } from 'rollup-plugin-string';

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const GLOBAL_PARENT_NAME = 'Milque';
const INPUT_FILE = './src/index.js';

/**
 * @returns {import('rollup').RollupOptions}
 */
function umd() {
  return {
    input: [INPUT_FILE],
    output: {
      file: `dist/${toPosixKebab(pkg.name)}.min.js`,
      format: 'umd',
      name: GLOBAL_PARENT_NAME,
      esModule: false,
      exports: 'named',
      sourcemap: true,
      globals: {
        'gl-matrix': 'glMatrix'
      }
    },
    external: [
      'gl-matrix'
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      commonjs(),
      nodeResolve(),
      // TODO: https://github.com/micromatch/picomatch/pull/73
      nodePolyfills(),
      string({
        include: ['**/*.html', '**/*.css'],
      }),
      terser()
    ],
  };
}

/**
 * @returns {import('rollup').RollupOptions}
 */
function esm_cjs() {
  return {
    input: [INPUT_FILE],
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: 'dist/cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
    ],
    external: [
      'gl-matrix'
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      // TODO: https://github.com/micromatch/picomatch/pull/73
      nodePolyfills(),
      string({
        include: ['**/*.html', '**/*.css'],
      }),
    ],
  };
}

/** @type {import('rollup').RollupOptions} */
function ts() {
  return {
    input: [INPUT_FILE],
    output: {
      file: 'dist/types/index.d.ts',
      format: 'es',
    },
    external: [
      'gl-matrix'
    ],
    plugins: [
      string({
        include: ['**/*.html', '**/*.css'],
      }),
      dts(),
    ],
  };
}

function toPosixKebab(str) {
  str = str.replace('/', '-');
  str = str.replace(/[^\w\d_-]+/g, '');
  return str;
}

/** @type {import('rollup').RollupOptions} */
export default [umd(), esm_cjs(), ts()];
