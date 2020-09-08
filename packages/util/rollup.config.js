// @ts-nocheck
import { rollupConfig } from '../.config/RollupHelper.js';
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
            'src/Uploader.js',
            'src/uuidv4.js',
        ]
    }
);
