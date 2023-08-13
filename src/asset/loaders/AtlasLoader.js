/**
 * @typedef {Record<string, AtlasSpriteData>} Atlas
 *
 * @typedef AtlasSpriteData
 * @property {number} u
 * @property {number} v
 * @property {number} w
 * @property {number} h
 * @property {number} frames
 * @property {number} cols
 * @property {number} rows
 * @property {string} name
 */

/**
 * @param {string|ArrayBuffer} src
 * @param {{ onprogress: (value: number, loaded: number, total: number) => void }} opts
 * @returns {Promise<Atlas>}
 */
export async function AtlasLoader(src, opts = { onprogress: undefined }) {
  if (typeof src === 'string') {
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    return AtlasLoader(arrayBuffer, opts);
  } else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src))) {
    throw new Error(
      `Cannot load from source - must be an ArrayBuffer or fetchable url, but got instead: ${src}`,
    );
  }
  /** @type {ArrayBuffer} */
  const arrayBuffer = src;
  const string = new TextDecoder().decode(arrayBuffer);
  /** @type {Atlas} */
  let result = {};
  let lines = string.split('\n');
  let progressTotal = lines.length;
  let progressLoaded = 0;
  if (opts.onprogress) {
    opts.onprogress(0, 0, progressTotal);
  }
  for (let line of lines) {
    ++progressLoaded;
    line = line.trim();
    if (line.length <= 0) continue;
    if (line.startsWith('#')) continue;
    if (line.startsWith('//')) continue;

    let args = [];
    let i = 0;
    let j = line.indexOf(' ');
    while (j >= 0) {
      args.push(line.substring(i, j));
      i = j + 1;
      j = line.indexOf(' ', i);
    }
    args.push(line.substring(i));

    let name = args[0];
    let u = Number.parseInt(args[1]);
    let v = Number.parseInt(args[2]);
    let w = Number.parseInt(args[3]);
    let h = Number.parseInt(args[4]);
    let frames =
      args.length >= 6
        ? Number.parseInt(args[5]) // User-defined
        : 1; // Default 1 frame
    let cols =
      args.length >= 7
        ? Number.parseInt(args[6]) // User-defined
        : frames; // Default same as frame count
    let rows =
      args.length >= 8
        ? Number.parseInt(args[7]) // User-defined
        : frames > cols // If more frames than cols...
        ? Math.ceil(frames / cols) // ...then expect more rows
        : 1; // Otherwise, default single row

    result[name] = {
      u,
      v,
      w,
      h,
      frames,
      cols,
      rows,
      name,
    };

    if (opts.onprogress) {
      opts.onprogress(
        progressLoaded / progressTotal,
        progressLoaded,
        progressTotal,
      );
    }
  }
  if (opts.onprogress) {
    opts.onprogress(1, progressLoaded, progressLoaded);
  }
  return result;
}
