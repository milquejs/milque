import { AssetRef, cacheAssetPackAsRaw, preloadAssetRefs } from '@milque/asset';
import { loadSound } from './audio/SoundLoader.js';

export const ASSETS = {
  SoundStart: new AssetRef(
    'start',
    loadSound,
    undefined,
    'res/start.wav'
  ),
  SoundDead: new AssetRef(
    'dead',
    loadSound,
    undefined,
    'res/dead.wav'
  ),
  SoundPop: new AssetRef(
    'pop',
    loadSound,
    undefined,
    'res/boop.wav'
  ),
  SoundShoot: new AssetRef(
    'shoot',
    loadSound,
    undefined,
    'res/click.wav'
  ),
  SoundBoom: new AssetRef(
    'boom',
    loadSound,
    undefined,
    'res/boom.wav',
  ),
  BackgroundMusic: new AssetRef(
    'music',
    loadSound,
    undefined,
    'res/music.wav'
  ),
};

export async function loadAssets(assets) {
  /*
  let assetPort = document.querySelector('asset-port');
  let ctx = assetPort.getContext('cached');
  ctx.getCache('main');
  assetCache.put(path, src);
  */
  await cacheAssetPackAsRaw(assets, 'res.pack');
  await preloadAssetRefs(assets, Object.values(ASSETS));
}
