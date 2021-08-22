import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import * as AcreWorld from './acreworld/main.js';

/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

window.addEventListener('DOMContentLoaded', main);
async function main()
{
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');
    /** @type {InputContext} */
    const inputs = document.querySelector('#inputs').getContext('axisbutton');
    /** @type {AssetPack} */
    const assets = document.querySelector('#assets');
    let promise = new Promise((resolve, reject) => {
        assets.addEventListener('load', resolve);
        assets.addEventListener('error', reject);
    });
    assets.src = 'res.pack';
    await promise;
    
    await AcreWorld.main(display, inputs, assets);
}
