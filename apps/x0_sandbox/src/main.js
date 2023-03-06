import './error.js';

import * as Util from '@milque/util';

import { main as m50 } from './050/main.js';
import { main as m51 } from './051/main.js';

main([
    m50,
    m51,
]);

async function main(ms) {
    const { m = 0 } = Util.getURLParameters();
    const mFunc = ms[m];
    await mFunc();
}
