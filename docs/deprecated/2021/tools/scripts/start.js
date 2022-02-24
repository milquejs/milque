/* global process */
import { execWithStdio } from '../lib/stdio-util.js';

const BUILD_COMMAND = 'npx rollup --config --watch --environment NODE_ENV:development';

const argc = process.argv.length;
if (argc < 3)
{
    throw new Error('Missing target package to start.');
}
else if (argc > 3)
{
    throw new Error('Too many target packages to start.');
}
else
{
    let target = process.argv[2];
    execWithStdio(`${BUILD_COMMAND} --environment target:${target}`);
}
