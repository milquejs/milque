import { AssetManager, AssetRef } from '@milque/asset';
import { loadSound } from './audio/SoundLoader.js';

export const ASSETS = {
  SoundStart: new AssetRef(
    'start',
    'res/start.wav',
    loadSound
  ),
  SoundDead: new AssetRef(
    'dead',
    'res/dead.wav',
    loadSound
  ),
  SoundPop: new AssetRef(
    'pop',
    'res/boop.wav',
    loadSound
  ),
  SoundShoot: new AssetRef(
    'shoot',
    'res/click.wav',
    loadSound
  ),
  SoundBoom: new AssetRef(
    'boom',
    'res/boom.wav',
    loadSound
  ),
  BackgroundMusic: new AssetRef(
    'music',
    'res/music.wav',
    loadSound
  ),
};

export async function loadAssets() {
  /*
  let assetPort = document.querySelector('asset-port');
  let ctx = assetPort.getContext('cached');
  ctx.getCache('main');
  assetCache.put(path, src);
  */
  await AssetManager.loadAssetPack('res.pack', (src, path) => AssetManager.cache(path, src));
  AssetManager.loadAssetRefs(Object.values(ASSETS));
}
