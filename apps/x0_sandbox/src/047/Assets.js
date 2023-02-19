import { AssetRef } from '@milque/asset';
import { loadSound } from '../../src/audio/SoundLoader.js';

export const SoundStart = new AssetRef(
  'sound://start.wav',
  undefined,
  loadSound,
  'res/start.wav'
);
export const SoundDead = new AssetRef(
  'sound://dead.wav',
  undefined,
  loadSound,
  'res/dead.wav'
);
export const SoundPop = new AssetRef(
  'sound://pop.wav',
  undefined,
  loadSound,
  'res/boop.wav'
);
export const SoundShoot = new AssetRef(
  'sound://shoot.wav',
  undefined,
  loadSound,
  'res/click.wav'
);
export const SoundBoom = new AssetRef(
  'sound://boom.wav',
  undefined,
  loadSound,
  'res/boom.wav'
);
export const BackgroundMusic = new AssetRef(
  'sound://music.wav',
  undefined,
  loadSound,
  'res/music.wav'
);

export async function loadAssetRefs(refs, assets) {
  await Promise.all(refs.map(ref => ref.load(assets)));
}
