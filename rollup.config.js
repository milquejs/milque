import resolve from '@rollup/plugin-node-resolve';

import { createConfig } from './scripts/BaseRollupConfig.js';
import * as pkg from './package.json';
export default createConfig(pkg, 'Milque', {
    input: 'index.js',
    plugins: [ resolve() ]
});
