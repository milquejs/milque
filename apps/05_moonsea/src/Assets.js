import { AssetManager, AssetRef } from '@milque/asset';
import { loadImage } from './loader/ImageLoader.js';
import { loadSound } from './sound/SoundLoader.js';

export const ASSETS = {
  CanoeImage: new AssetRef('canoe', 'raw://canoe.png', loadImage),
  PierImage: new AssetRef('pier', 'raw://pier.png', loadImage),
  PierLegImage: new AssetRef('pierLeg', 'raw://pier_leg.png', loadImage),
  BucketImage: new AssetRef('bucket', 'raw://bucket.png', loadImage),
  MusicBack: new AssetRef('musicBack', 'raw://music_back.wav', loadSound),
  MusicLayer1: new AssetRef('musicLayer1', 'raw://music_1.wav', loadSound),
  MusicLayer2: new AssetRef('musicLayer2', 'raw://music_2.wav', loadSound),
};

export async function initAssets() {
  await AssetManager.loadAssetRefs(Object.values(ASSETS));
}
