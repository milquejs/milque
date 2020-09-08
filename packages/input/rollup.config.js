// @ts-nocheck
import { rollupConfig } from '../.config/RollupHelper.js';
import * as packageJson from './package.json';
export default args => rollupConfig(
    args, packageJson,
    {
        entries: [
            'src/device/index.js',
            'src/InputContext.js',
            'src/InputKey.js',
        ]
    }
);
