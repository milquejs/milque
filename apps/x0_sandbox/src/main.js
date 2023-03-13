import { DisplayPort } from '@milque/display';
import './error.js';

import * as Util from '@milque/util';

import { main as m50 } from './050/main.js';
import { main as m51 } from './051/main.js';
import { main as m52 } from './052/main.js';
import { main as m53 } from './053/main.js';

DisplayPort.define();

const TARGETS = [
    m50, m51, m52, m53
];

window.addEventListener('DOMContentLoaded', () => main(TARGETS));
async function main(ms) {
    const { m = 0 } = Util.getURLParameters();
    const i = Math.max(0, Math.min(m, TARGETS.length));
    const mFunc = ms[i];
    if (!mFunc) {
        throw new Error('Missing main function.');
    }
    await mFunc();
}
