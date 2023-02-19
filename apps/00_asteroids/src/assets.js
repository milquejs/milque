import { AssetRef } from '@milque/asset';
import { loadSound } from './SoundLoader.js';

export const SoundStart = new AssetRef('start.wav', loadSound, undefined, 'raw://start.wav');
export const SoundDead = new AssetRef('dead.wav', loadSound, undefined, 'raw://dead.wav');
export const SoundPop = new AssetRef('pop.wav', loadSound, undefined, 'raw://boop.wav');
export const SoundShoot = new AssetRef('shoot.wav', loadSound, undefined, 'raw://click.wav');
export const SoundBoom = new AssetRef('boom.wav', loadSound, undefined, 'raw://boom.wav');
export const BackgroundMusic = new AssetRef('music.wav', loadSound, undefined, 'raw://music.wav');
