import { configure } from '@milque-dev/build-tools';
import packageJson from './package.json';

export default configure({
    packageJson: forceESMOnly(packageJson),
    input: 'src/index.js',
    moduleName: 'milque.toolkit',
});

function forceESMOnly(packageJson)
{
    const { main, ...others } = packageJson;
    return {
        module: main,
        ...others
    };
}
