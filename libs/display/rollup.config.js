import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import del from 'rollup-plugin-delete';
import { dts } from 'rollup-plugin-dts';

const pkg = JSON.parse(fs.readFileSync('./package.json'));
const GLOBAL_PARENT_NAME = 'milque';
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
    },
    plugins: [del({ targets: 'dist/*' }), nodeResolve(), terser()],
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
    plugins: [nodeResolve()],
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
    plugins: [dts()],
  };
}

function toPosixKebab(str) {
  str = str.replace('/', '-');
  str = str.replace(/[^\w\d_-]+/g, '');
  return str;
}

/** @type {import('rollup').RollupOptions} */
export default [umd(), esm_cjs(), ts()];
