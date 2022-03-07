import { Sound } from './Sound.js';
import { loadAudioBuffer } from '../loader/AudioBufferLoader.js';

export async function loadSound(src) {
    let audioContext = Sound.getAudioContext();
    let audioBuffer = await loadAudioBuffer(src, audioContext);
    let sound = new Sound(audioContext, audioBuffer);
    return sound;
}
