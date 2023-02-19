import { AssetManager, AssetRef, cacheAssetPackAsRaw, preloadAssetRefs, ImageLoader } from '@milque/asset';
import { loadSound } from './sound/SoundLoader.js';

export const ASSETS = {
  CanoeImage: new AssetRef('canoe', ImageLoader, undefined, 'raw://canoe.png'),
  PierImage: new AssetRef('pier', ImageLoader, undefined, 'raw://pier.png'),
  PierLegImage: new AssetRef('pierLeg', ImageLoader, undefined, 'raw://pier_leg.png'),
  BucketImage: new AssetRef('bucket', ImageLoader, undefined, 'raw://bucket.png'),
  MusicBack: new AssetRef('musicBack', loadSound, undefined, 'raw://music_back.wav'),
  MusicLayer1: new AssetRef('musicLayer1', loadSound, undefined, 'raw://music_1.wav'),
  MusicLayer2: new AssetRef('musicLayer2', loadSound, undefined, 'raw://music_2.wav'),
};

/** @param {AssetManager} assets */
export async function initAssets(assets) {
  await cacheAssetPackAsRaw(assets, 'res.pack');
  await preloadAssetRefs(assets, Object.values(ASSETS));
}
