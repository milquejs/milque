// @ts-nocheck
import { rollupConfig } from '../../.config/rollup/ModuleRollupHelper.js';
import * as packageJson from './package.json';
export default args => rollupConfig(
    args, packageJson,
    {
        entries: [
            'src/Discrete.js',
            'src/Downloader.js',
            'src/Eventable.js',
            'src/Logger.js',
            'src/MathHelper.js',
            'src/PriorityQueue.js',
            'src/TopologicalSort.js',
            'src/Uploader.js',
            'src/uuidv4.js',
        ]
    }
);
