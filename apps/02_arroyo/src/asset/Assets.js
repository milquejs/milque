import { AssetManager } from './AssetManager.js';
import { loadAudio } from './Audio.js';

export const ASSETS = new AssetManager()
    .registerLoader('audio', loadAudio);
