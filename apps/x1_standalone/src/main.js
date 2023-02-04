import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { main as Three } from './three/main.js';

window.addEventListener('DOMContentLoaded', main);
export async function main() {
    await Three();
}
