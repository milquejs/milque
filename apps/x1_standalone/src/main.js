import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { INPUTS } from './Inputs.js';
import { ASSETS } from './Assets.js';

import { Toaster } from './toaster/index.js';

async function main() {
    await Toaster.connectInputs(INPUTS);
    await Toaster.preloadAssetPack();
    await Toaster.preloadAssets(ASSETS);
}

window.addEventListener('DOMContentLoaded', main);
