import './reload.js';
import './error.js';

import * as Util from '@milque/util';

import { main as m50 } from './050/main.js';
import { main as m51 } from './051/main.js';
import { main as m52 } from './052/main.js';
import { main as m53 } from './053/main.js';
import { main as m54 } from './054/main.js';
import { main as m55 } from './055/main.js';
import { main as m56 } from './056/main.js';
import { main as m57 } from './057/main.js';
import { main as m58 } from './058/main.js';

const TARGETS = [
    m50, m51, m52, m53, m54, m55, m56, m57, m58
];

window.addEventListener('DOMContentLoaded', () => main(TARGETS));
async function main(ms) {
    const { m = TARGETS.length - 1 } = Util.getURLParameters();
    const i = Math.max(0, Math.min(m, TARGETS.length));
    const mFunc = ms[i];
    if (!mFunc) {
        throw new Error('Missing main function.');
    }
    await mFunc();
}
