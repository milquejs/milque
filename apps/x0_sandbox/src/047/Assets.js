import { AssetRef } from '@milque/asset';
import { loadSound } from 'src/audio/SoundLoader.js';

export const ASSETS = {
  SoundStart: new AssetRef('sound://start.wav', 'raw://start.wav', loadSound),
  SoundDead: new AssetRef('sound://dead.wav', 'raw://dead.wav', loadSound),
  SoundPop: new AssetRef('sound://pop.wav', 'raw://boop.wav', loadSound),
  SoundShoot: new AssetRef('sound://shoot.wav', 'raw://click.wav', loadSound),
  SoundBoom: new AssetRef('sound://boom.wav', 'raw://boom.wav', loadSound),
  BackgroundMusic: new AssetRef('sound://music.wav', 'raw://music.wav', loadSound),
};
