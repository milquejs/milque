// @ts-nocheck
import { rollupConfig } from '../../.config/rollup/ModuleRollupHelper.js';
import * as packageJson from './package.json';
export default args => rollupConfig(
    args, packageJson,
    {
        entries: []
    }
);
