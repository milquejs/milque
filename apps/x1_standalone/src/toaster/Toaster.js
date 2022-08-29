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
    ctx.bindBindings(Object.values(inputs));
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
