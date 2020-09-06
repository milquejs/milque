import path from 'path';
import * as packageJson from './package.json';

const MODULE_DIR = path.dirname(packageJson.module);
const MODULE_NAME = 'Milque.Util';
const MAIN_PATH = packageJson.main;

export default [
    {
        input: 'src/index.js',
        output: {
            file: MAIN_PATH,
            format: 'umd',
            name: MODULE_NAME,
        }
    },
    {
        input: [
            'src/index.js',
            'src/Discrete.js',
            'src/Downloader.js',
            'src/Eventable.js',
            'src/Logger.js',
            'src/MathHelper.js',
            'src/PriorityQueue.js',
            'src/Uploader.js',
            'src/uuidv4.js',
        ],
        output: {
            dir: MODULE_DIR,
            format: 'esm',
        }
    }
];
