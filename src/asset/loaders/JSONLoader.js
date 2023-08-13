/**
 * @param {string|ArrayBuffer} src
 * @returns {Promise<object>}
 */
export async function JSONLoader(src) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return JSONLoader(arrayBuffer);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      `Cannot load from source - must be an ArrayBuffer or fetchable url, but got instead: ${src}`,
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  return JSON.parse(new TextDecoder().decode(arrayBuffer));
}
