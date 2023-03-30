import { AssetManager } from '@milque/asset';

/**
 * @param {Record<?, import('@milque/input').InputBinding>} inputs 
 * @param {string} inputPortQuerySelector 
 * @returns {Promise<import('@milque/input').InputContext>}
 */
export async function connectInputs(inputs, inputPortQuerySelector = 'input-port') {
    /** @type {import('@milque/input').InputPort} */
    let inputPort = document.querySelector(inputPortQuerySelector);
    let ctx = inputPort.getContext('axisbutton');
    ctx.bindKeys(inputs);
    return ctx;
}

export async function preloadAssetPack() {
  await AssetManager.loadAssetPack('res.pack', (src, path) => AssetManager.cache(path, src));
}

/**
 * @param {Record<?, import('@milque/asset').AssetRef>} assets 
 * @param {string} assetPortQuerySelector 
 * @returns {Promise<void>}
 */
export async function preloadAssets(assets, assetPortQuerySelector = 'asset-port') {
    await AssetManager.loadAssetRefs(Object.values(assets));
}

/**
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {import('@milque/display').DisplayPort}
 */
export function getDisplayPort(root = document, selector = 'display-port') {
  return root.querySelector(selector);
}

/**
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {import('@milque/input').InputPort}
 */
export function getInputPort(root = document, selector = 'input-port') {
  return root.querySelector(selector);
}
