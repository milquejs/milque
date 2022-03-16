import { AssetManager } from '@milque/asset';
import { createSound } from './audio.js';

const SOUNDS = {};

export function sounds() {
  return SOUNDS;
}

export async function loadSounds() {
  await Promise.all([
    registerSound('start', AssetManager.get('raw://start.wav')),
    registerSound('dead', AssetManager.get('raw://dead.wav')),
    registerSound('pop', AssetManager.get('raw://boop.wav')),
    registerSound('music', AssetManager.get('raw://music.wav')),
    registerSound('shoot', AssetManager.get('raw://click.wav')),
    registerSound('boom', AssetManager.get('raw://boom.wav')),
  ]);
}

async function registerSound(name, fileData) {
  let arrayBuffer = new ArrayBuffer(fileData.byteLength);
  new Uint8Array(arrayBuffer).set(fileData);
  SOUNDS[name] = await createSound(arrayBuffer);
}
