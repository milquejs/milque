import { AssetRef } from '@milque/asset';
import { loadSound } from './SoundLoader.js';

export const Assets = {
  SoundStart: new AssetRef(
    'start',
    loadSound,
    undefined,
    'raw://start.wav'
  ),
  SoundDead: new AssetRef(
    'dead',
    loadSound,
    undefined,
    'raw://dead.wav',
  ),
  SoundPop: new AssetRef(
    'pop',
    loadSound,
    undefined,
    'raw://boop.wav'
  ),
  SoundShoot: new AssetRef(
    'shoot',
    loadSound,
    undefined,
    'raw://click.wav'
  ),
  SoundBoom: new AssetRef(
    'boom',
    loadSound,
    undefined,
    'raw://boom.wav'
  ),
  BackgroundMusic: new AssetRef(
    'music',
    loadSound,
    undefined,
    'raw://music.wav'
  ),
};
