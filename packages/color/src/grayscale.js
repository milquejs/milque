/**
 * @returns {import('./ColorTypes').Grayscale}
 */
export function create() {
  return 0x0;
}

/**
 * @param {number} gray
 * @param {number} alpha
 */
export function fromBytes(gray, alpha = 0xff) {
  return (
    ((alpha & 0xff) << 8) | (gray & 0xff)
  );
}

/**
 * @param {number} grayf
 * @param {number} alphaf
 */
export function fromFloats(grayf, alphaf = 1.0) {
  let g = Math.floor(Math.max(Math.min(grayf, 1), 0) * 255);
  let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
  return fromBytes(g, a);
}

/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
export function gray(hexValue) {
  return hexValue & 0xff;
}

/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
export function grayf(hexValue) {
  return (hexValue & 0xff) / 255.0;
}

/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
export function alpha(hexValue) {
  let result = (hexValue >> 8) & 0xff;
  if (result === 0x00) {
    return 0xff;
  }
  return result;
}

/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
export function alphaf(hexValue) {
  return alpha(hexValue) / 255.0;
}

const OPACITY_EPSILON = 0.01;

/**
 * @param {import('./ColorTypes').Grayscale} from
 * @param {import('./ColorTypes').Grayscale} to
 * @param {number} delta
 */
export function mix(from = 0x0000, to = 0xffff, delta = 0.5) {
  const gm = grayf(from);
  const am = alphaf(from);
  const gf = (grayf(to) - gm) * delta + gm;
  /** @type {number|undefined} */
  let af = (alphaf(to) - am) * delta + am;
  if (af < OPACITY_EPSILON) {
    af = undefined;
  }
  return fromFloats(gf, af);
}

/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
export function toCSSColorString(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  let g = gray(hexValue).toString(16).padStart(2, '0');
  return `#${g}${g}${g}`;
}

/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
export function toFloatVector(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  return [grayf(hexValue), alphaf(hexValue)];
}
