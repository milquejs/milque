import { Sound } from 'src/audio/Sound.js';
import { loadAudioBuffer } from 'src/loader/AudioBufferLoader.js';
import { AssetRef } from './AssetRef.js';

export const SoundStart = new AssetRef('sound://start.wav', 'res/start.wav', loadSound);
export const SoundDead = new AssetRef('sound://dead.wav', 'res/dead.wav', loadSound);
export const SoundPop = new AssetRef('sound:pop.wav', 'res/boop.wav', loadSound);
export const SoundShoot = new AssetRef('sound://shoot.wav', 'res/click.wav', loadSound);
export const SoundBoom = new AssetRef('sound://boom.wav', 'res/boom.wav', loadSound);
export const BackgroundMusic = new AssetRef('sound://music.wav', 'res/music.wav', loadSound);

/**
 * @param {import('@milque/asset').AssetPack} assetPack
 * @param {Array<AssetRef>} refs
 */
export async function bindRefs(assetPack, refs) {
    let promises = [];
    for(let ref of refs) {
        if (ref instanceof AssetRef) {
            promises.push(ref.register(assetPack));
        }
    }
    await Promise.allSettled(promises);
}

async function loadSound(assetData) {
    let audioContext = Sound.getAudioContext();
    let audioBuffer = await loadAudioBuffer(assetData, audioContext);
    let sound = new Sound(audioContext, audioBuffer);
    return sound;
}
