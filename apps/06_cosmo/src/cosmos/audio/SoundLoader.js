import { AudioBufferLoader } from '@milque/asset';
import { Sound } from './Sound.js';

/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<Sound>}
 */
export async function loadSound(src) {
  let audioContext = Sound.getAudioContext();
  let audioBuffer = await AudioBufferLoader(src, { audioContext });
  let sound = new Sound(audioContext, audioBuffer);
  return sound;
}
