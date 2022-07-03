import { Sound } from './Sound.js';
import { loadAudioBuffer } from './AudioBufferLoader.js';

/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<Sound>}
 */
export async function loadSound(src) {
  let audioContext = Sound.getAudioContext();
  let audioBuffer = await loadAudioBuffer(src, audioContext);
  let sound = new Sound(audioContext, audioBuffer);
  return sound;
}
