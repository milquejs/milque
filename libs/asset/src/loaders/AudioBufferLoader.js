/**
 * @param {ArrayBuffer|Uint8Array|string} src
 * @param {object} opts
 * @param {AudioContext} opts.audioContext
 * @returns {Promise<AudioBuffer>}
 */
export async function AudioBufferLoader(src, opts) {
  const { audioContext } = opts || {};
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return AudioBufferLoader(arrayBuffer, { audioContext });
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  let audioArrayBuffer = new ArrayBuffer(arrayBuffer.byteLength);
  new Uint8Array(audioArrayBuffer).set(arrayBuffer);
  let audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
  return audioBuffer;
}
