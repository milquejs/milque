/* global process */
import { execWithStdio } from '../lib/stdio-util.js';

const BUILD_COMMAND = 'npx rollup --config --environment NODE_ENV:production';

const argc = process.argv.length;
if (argc < 3)
{
    execWithStdio(BUILD_COMMAND);
}
else if (argc === 3)
{
    let target = process.argv[2];
    execWithStdio(`${BUILD_COMMAND} --environment target:${target}`);
}
else
{
    throw new Error('Too many target packages to build.');
}
