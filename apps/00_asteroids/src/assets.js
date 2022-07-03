import { AssetManager, AssetRef } from '@milque/asset';
import { loadSound } from './SoundLoader.js';

export const Assets = {
  SoundStart: new AssetRef(
    'start',
    'raw://start.wav',
    loadSound
  ),
  SoundDead: new AssetRef(
    'dead',
    'raw://dead.wav',
    loadSound
  ),
  SoundPop: new AssetRef(
    'pop',
    'raw://boop.wav',
    loadSound
  ),
  SoundShoot: new AssetRef(
    'shoot',
    'raw://click.wav',
    loadSound
  ),
  SoundBoom: new AssetRef(
    'boom',
    'raw://boom.wav',
    loadSound
  ),
  BackgroundMusic: new AssetRef(
    'music',
    'raw://music.wav',
    loadSound
  ),
};

export async function loadAssets() {
  await AssetManager.loadAssetPackAsRaw('res.pack');
  AssetManager.loadAssetRefs(Object.values(Assets));
}
