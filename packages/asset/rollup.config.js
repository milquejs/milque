import { configure } from '@milque-dev/build-tools';
import packageJson from './package.json';

export default configure({
  packageJson,
  input: 'src/index.js',
  moduleName: 'milque.asset',
});
