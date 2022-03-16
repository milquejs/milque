import { AssetRef } from '@milque/asset';
import { loadSound } from 'src/audio/SoundLoader.js';

export const SoundStart = new AssetRef(
  'sound://start.wav',
  'res/start.wav',
  loadSound
);
export const SoundDead = new AssetRef(
  'sound://dead.wav',
  'res/dead.wav',
  loadSound
);
export const SoundPop = new AssetRef(
  'sound://pop.wav',
  'res/boop.wav',
  loadSound
);
export const SoundShoot = new AssetRef(
  'sound://shoot.wav',
  'res/click.wav',
  loadSound
);
export const SoundBoom = new AssetRef(
  'sound://boom.wav',
  'res/boom.wav',
  loadSound
);
export const BackgroundMusic = new AssetRef(
  'sound://music.wav',
  'res/music.wav',
  loadSound
);

export async function loadAssetRefs(refs) {
  await Promise.all(refs.map(ref => ref.load()));
}
