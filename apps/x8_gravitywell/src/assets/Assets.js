import { AssetManager } from './AssetManager.js';
import { loadWebGLTexture } from './WebGLTextureLoader.js';
import { Sound } from './Sound.js';

export const ASSETS = new AssetManager()
    .registerLoader('sound', Sound.loadSound)
    .registerLoader('texture', loadWebGLTexture);
