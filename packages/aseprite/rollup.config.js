import fs from 'fs';

import { dts, esm, umd } from '@milquejs/rollup-config';

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const inputPath = './src/index.js';

export default [
  esm(packageJson, inputPath),
  umd(packageJson, 'Milque', inputPath),
  dts(packageJson, inputPath),
];
