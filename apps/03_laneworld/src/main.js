import '@milque/display';
import '@milque/input';
import './error.js';

import * as AcreWorld from './acreworld/main.js';
import { AssetManager, cacheAssetPackAsRaw } from '@milque/asset';
import { DisplayPort } from '@milque/display';

/**
 * @typedef {import('@milque/input').InputContext} InputContext
 */

DisplayPort.define();

window.addEventListener('DOMContentLoaded', main);
async function main() {
  /** @type {DisplayPort} */
  const display = document.querySelector('#display');
  /** @type {InputContext} */
  const inputs = document.querySelector('#inputs').getContext('axisbutton');
  const assets = new AssetManager();
  await cacheAssetPackAsRaw(assets, 'res.pack');

  await AcreWorld.main(display, inputs, assets);
}
