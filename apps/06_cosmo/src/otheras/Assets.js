import { AssetRef } from '@milque/asset';
import { loadSound } from './SoundLoader.js';

export const Assets = {
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
