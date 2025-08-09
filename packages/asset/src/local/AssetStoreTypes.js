import './LocalAssetStore'; // This is necessary to include this file in js.

/**
 * @typedef AssetStoreLike
 * @property {Record<string, any>} cached
 * @property {Record<string, import('./LocalAssetStore').Loading>} loadings
 * @property {Array<import('./LocalAssetStore').Fallback>} defaults
 */
