import { unzip } from 'fflate';

import { cacheInStore } from './AssetStore.js';
import { AssetManager } from './AssetManager.js';
import { AssetRef } from './AssetRef.js';

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {string} url
 * @param {(src: Uint8Array, path: string) => void} callback
 */
export async function loadAssetPack(url, callback) {
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    callback(buf, path);
                }
                resolve();
            }
        });
    });
}

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {AssetManager} assets
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
export async function cacheAssetPackAsRaw(assets, url, callback = undefined) {
    const assetStore = /** @type {import('./AssetStore').AssetStore} */ (/** @type {unknown} */ (assets));
    let rootPath = 'raw://';
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    await new Promise((resolve, reject) => {
        unzip(new Uint8Array(arrayBuffer), (err, data) => {
            if (err) {
                reject(err);
            } else {
                for (let [path, buf] of Object.entries(data)) {
                    // Standardize WIN paths
                    path = path.replaceAll('\\', '/');
                    // Remove the zip directory name
                    let i = path.indexOf('/');
                    if (i >= 0) {
                        path = path.substring(i + 1);
                    }
                    // Put the raw file in cache
                    let uri = rootPath + path;
                    cacheInStore(assetStore, uri, buf);
                    if (callback) {
                        callback(buf, uri, path);
                    }
                }
                resolve();
            }
        });
    });
}

/**
 * This is the same as calling `await AssetRef.load()` for each ref.
 * 
 * @param {AssetManager} assets
 * @param {Array<AssetRef<?, ?>>} refs 
 * @param {number} [timeout] 
 */
export async function preloadAssetRefs(assets, refs, timeout = 5000) {
    let promises = [];
    for (let ref of refs) {
        promises.push(ref.load(assets, timeout));
    }
    await Promise.allSettled(promises);
}
