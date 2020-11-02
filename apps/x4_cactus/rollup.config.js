// @ts-nocheck
import { rollupConfig } from '../../.config/rollup/AppRollupHelper.js';
import * as packageJson from './package.json';
export default args => rollupConfig(args, packageJson, { indexHTML: 'src/template.html' });
