/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<string>}
 */
export async function loadText(src) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return loadText(arrayBuffer);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      'Cannot load from source - must be ' + 'an array buffer or fetchable url'
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  return new TextDecoder().decode(arrayBuffer);
}
