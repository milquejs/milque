// @ts-nocheck
import { rollupConfig } from '../.config/RollupHelper.js';
import * as packageJson from './package.json';
export default args => rollupConfig(packageJson, args.dev);