import { terser } from 'rollup-plugin-terser';
import { getMinifiedFileName } from './RollupHelper.js';

const DEFAULT_PARENT_CONFIG = { input: 'src/index.js' };

const BROWSER_GLOBALS = {
    'gl-matrix': 'glMatrix'
};
const EXTERNALS = Object.keys(BROWSER_GLOBALS);

export function createConfig(packageJson, moduleName, parentConfig = DEFAULT_PARENT_CONFIG)
{
    let MODULE_PATH = packageJson.module;
    let BROWSER_PATH = packageJson.browser;
    let MODULE_NAME = moduleName;

    return {
        ...parentConfig,
        external: EXTERNALS,
        output: [
            {
                file: MODULE_PATH,
                format: 'esm'
            },
            {
                file: getMinifiedFileName(MODULE_PATH),
                format: 'esm',
                plugins: [
                    terser()
                ]
            },
            {
                file: BROWSER_PATH,
                format: 'umd',
                name: MODULE_NAME,
                exports: 'named'
            },
            {
                file: getMinifiedFileName(BROWSER_PATH),
                format: 'umd',
                name: MODULE_NAME,
                exports: 'named',
                plugins: [
                    terser()
                ]
            }
        ]
    };
}
