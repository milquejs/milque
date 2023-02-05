import { unzip } from 'fflate';
import { AssetRef } from './AssetRef.js';
import { cacheInStore, keysInStore, getCurrentInStore } from './AssetStore.js';

const DEFAULT_TIMEOUT = 5_000;
/** @type {import('./AssetStore.js').AssetStore} */
const GLOBAL = {
    cache: {},
    loadings: {},
    defaults: [],
};

/**
 * Fetch asset pack from url and cache raw file content under `raw://`.
 * 
 * @param {string} url
 * @param {(src: Uint8Array, uri: string, path: string) => void} [callback]
 */
export async function loadAssetPackAsRaw(url, callback = undefined) {
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
                    cacheInStore(GLOBAL, uri, buf);
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
 * This is the same as calling `await AssetRef.load()` for each ref.
 * 
 * @param {Array<AssetRef>} refs 
 * @param {number} [timeout] 
 */
export async function loadAssetRefs(refs, timeout = DEFAULT_TIMEOUT) {
    let promises = [];
    for (let ref of refs) {
        promises.push(ref.preload(GLOBAL, timeout));
    }
    await Promise.allSettled(promises);
}

/**
 * @template T
 * @param {string} uri
 * @param {T} asset
 * @returns {T}
 */
export function cache(uri, asset) {
    return cacheInStore(GLOBAL, uri, asset);
}

/**
 * @returns {Array<string>}
 */
export function keys() {
    return keysInStore(GLOBAL);
}

/**
 * @param {string} uri
 * @returns {object}
 */
export function current(uri) {
    return getCurrentInStore(GLOBAL, uri);
}

/**
 * @param {string} uri
 * @returns {object}
 */
export function get(uri) {
    return current(uri);
}
