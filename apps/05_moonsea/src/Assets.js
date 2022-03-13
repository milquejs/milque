import { AssetRef, bindRefs, loadRefs } from './loader/AssetRef.js';
import { loadImage } from './loader/ImageLoader.js';
import { loadSound } from './sound/SoundLoader.js';

export const ASSETS = {
  FishImage: new AssetRef('fishShadow', 'res/fish_shadow.png', loadImage),
  CanoeImage: new AssetRef('canoe', 'res/canoe.png', loadImage),
  PierImage: new AssetRef('pier', 'res/pier.png', loadImage),
  PierLegImage: new AssetRef('pierLeg', 'res/pier_leg.png', loadImage),
  BucketImage: new AssetRef('bucket', 'res/bucket.png', loadImage),
  MusicBack: new AssetRef('musicBack', 'res/music_back.wav', loadSound),
  MusicLayer1: new AssetRef('musicLayer1', 'res/music_1.wav', loadSound),
  MusicLayer2: new AssetRef('musicLayer2', 'res/music_2.wav', loadSound),
};

/** @param {import('@milque/asset').AssetPack} assetPack */
export async function initAssets(assetPack) {
  bindRefs(assetPack, Object.values(ASSETS));
  await loadRefs(Object.values(ASSETS));
}
