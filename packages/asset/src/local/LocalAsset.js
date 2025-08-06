import {
  cacheAndResolve,
  currentValue,
  currentFallback,
  currentLoading,
  hasCurrentValue,
  isCurrentLoading,
  loadThenCache,
  cancelAndReject,
  deleteAndReject,
} from './LocalAssetStore';

/**
 * @template T
 * @template {object} Options
 * @param {string} uri
 * @param {import('../AssetTypes').AssetLoader<T, Options>} loader
 * @param {Options} [opts]
 */
export function create(uri, loader, opts = /** @type {any} */ ({})) {
  return /** @type {const} */ ({
    uri,
    loader,
    opts,
  });
}

/**
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<any, any>} target
 * @returns {boolean}
 */
export function isCached(assets, target) {
  return hasCurrentValue(assets, target.uri);
}

/**
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @returns {T|null}
 */
export function getOrNull(assets, target) {
  if (hasCurrentValue(assets, target.uri)) {
    return /** @type {T} */ (currentValue(assets, target.uri));
  }
  const def = currentFallback(assets, target.uri);
  if (def) {
    return /** @type {T} */ (def);
  }
  return null;
}

/**
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @returns {T}
 */
export function getOrThrow(assets, target) {
  let result = getOrNull(assets, target);
  if (result !== null) {
    return result;
  }
  throw new Error(
    `Trying to get value from asset not yet loaded "${target.uri}".`
  );
}

/**
 * Pre-load target into cache ONLY if not yet loaded or loading. Otherwise, will throw.
 * 
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {number} timeout
 * @returns {Promise<T>}
 */
export async function preload(assets, target, timeout) {
  if (hasCurrentValue(assets, target.uri)) {
    throw new Error(`Asset already cached for "${target.uri}" - probably trying to load duplicate asset name!`);
  } else if (isCurrentLoading(assets, target.uri)) {
    throw new Error(`Asset already loading for "${target.uri}" - if this is intentional, use load() instead!`);
  }
  return await loadThenCache(
    assets,
    target.uri,
    target.uri,
    target.loader,
    target.opts,
    timeout
  );
}

/**
 * Load target into cache if not yet loaded. Otherwise, return already cached value or loading promise.
 * 
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {number} timeout
 * @returns {Promise<T>}
 */
export async function load(assets, target, timeout) {
  if (hasCurrentValue(assets, target.uri)) {
    return /** @type {T} */ (currentValue(assets, target.uri));
  } else if (isCurrentLoading(assets, target.uri)) {
    return /** @type {T} */ (
      await currentLoading(assets, target.uri)
    );
  }
  return await loadThenCache(
    assets,
    target.uri,
    target.uri,
    target.loader,
    target.opts,
    timeout
  );
}

/**
 * Re-load target into cache. Will always replace cached value.
 * 
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {number} timeout
 * @returns {Promise<T>}
 */
export async function reload(assets, target, timeout) {
  return await loadThenCache(
    assets,
    target.uri,
    target.uri,
    target.loader,
    target.opts,
    timeout
  );
}

/**
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @returns {Promise<boolean>}
 */
export async function cancel(assets, target) {
  return cancelAndReject(assets, target.uri);
}

/**
 * Cache target with value. Will always replace cached value.
 * 
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {T} value
 */
export async function cachePut(assets, target, value) {
  cacheAndResolve(assets, target.uri, value);
}

/**
 * Cache target with value ONLY if not yet loaded or loading. Otherwise, will throw.
 * 
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 * @param {T} value
 */
export async function cacheSafely(assets, target, value) {
  if (hasCurrentValue(assets, target.uri)) {
    throw new Error(`Asset already cached for "${target.uri}" - probably trying to cache duplicate asset name!`);
  } else if (isCurrentLoading(assets, target.uri)) {
    throw new Error(`Asset already loading for "${target.uri}" - if this is intentional, use cachePut() instead!`);
  }
  cacheAndResolve(assets, target.uri, value);
}

/**
 * @template T
 * @param {import('./LocalAssetStore').AssetStoreLike} assets
 * @param {import('../AssetTypes').AssetLike<T, any>} target
 */
export async function dispose(assets, target) {
  deleteAndReject(assets, target.uri);
}
