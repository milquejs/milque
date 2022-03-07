import { AssetManager } from './AssetManager.js';
import { loadAudio } from './Audio.js';
import { load as loadWebGLTexture } from './WebGLTextureLoader.js';

export const ASSETS = new AssetManager()
  .registerLoader('audio', loadAudio)
  .registerLoader('texture', loadWebGLTexture);
