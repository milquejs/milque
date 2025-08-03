/**
 * @typedef {ReturnType<create>} RGBA
 */

function create$1() {
  return 0x0;
}

/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} [alpha]
 */
function fromBytes$1(red, green, blue, alpha = 0xff) {
  return (
    ((alpha & 0xff) << 24) | ((red & 0xff) << 16) | ((green & 0xff) << 8) | (blue & 0xff)
  );
}

/**
 * @param {number} redf
 * @param {number} greenf
 * @param {number} bluef
 * @param {number} alphaf
 */
function fromFloats$1(redf, greenf, bluef, alphaf = 1.0) {
  let r = Math.floor(Math.max(Math.min(redf, 1), 0) * 255);
  let g = Math.floor(Math.max(Math.min(greenf, 1), 0) * 255);
  let b = Math.floor(Math.max(Math.min(bluef, 1), 0) * 255);
  let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
  return fromBytes$1(r, g, b, a);
}

/**
 * @param {RGBA} hexValue
 */
function red(hexValue) {
  return (hexValue >> 16) & 0xff;
}

/**
 * @param {RGBA} hexValue
 */
function redf(hexValue) {
  return ((hexValue >> 16) & 0xff) / 255.0;
}

/**
 * @param {RGBA} hexValue
 */
function green(hexValue) {
  return (hexValue >> 8) & 0xff;
}

/**
 * @param {RGBA} hexValue
 */
function greenf(hexValue) {
  return ((hexValue >> 8) & 0xff) / 255.0;
}

/**
 * @param {RGBA} hexValue
 */
function blue(hexValue) {
  return hexValue & 0xff;
}

/**
 * @param {RGBA} hexValue
 */
function bluef(hexValue) {
  return (hexValue & 0xff) / 255.0;
}

/**
 * @param {RGBA} hexValue
 */
function alpha$1(hexValue) {
  let result = (hexValue >> 24) & 0xff;
  if (result === 0x00) {
    return 0xff;
  }
  return result;
}

/**
 * @param {RGBA} hexValue
 */
function alphaf$1(hexValue) {
  return alpha$1(hexValue) / 255.0;
}

const OPACITY_EPSILON$1 = 0.01;

/**
 * @param {RGBA} from
 * @param {RGBA} to
 * @param {number} delta
 */
function mix$1(from = 0x000000, to = 0xffffff, delta = 0.5) {
  const rm = redf(from);
  const gm = greenf(from);
  const bm = bluef(from);
  const am = alphaf$1(from);
  const rf = (redf(to) - rm) * delta + rm;
  const gf = (greenf(to) - gm) * delta + gm;
  const bf = (bluef(to) - bm) * delta + bm;
  /** @type {number|undefined} */
  let af = (alphaf$1(to) - am) * delta + am;
  if (af < OPACITY_EPSILON$1) {
    af = undefined;
  }
  return fromFloats$1(rf, gf, bf, af);
}

/**
 * @param {RGBA} hexValue
 */
function toCSSColorString$1(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  let r = red(hexValue).toString(16).padStart(2, '0');
  let g = green(hexValue).toString(16).padStart(2, '0');
  let b = blue(hexValue).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

/**
 * @param {RGBA} hexValue
 */
function toFloatVector$1(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  return [redf(hexValue), greenf(hexValue), bluef(hexValue), alphaf$1(hexValue)];
}

var rgba = /*#__PURE__*/Object.freeze({
  __proto__: null,
  alpha: alpha$1,
  alphaf: alphaf$1,
  blue: blue,
  bluef: bluef,
  create: create$1,
  fromBytes: fromBytes$1,
  fromFloats: fromFloats$1,
  green: green,
  greenf: greenf,
  mix: mix$1,
  red: red,
  redf: redf,
  toCSSColorString: toCSSColorString$1,
  toFloatVector: toFloatVector$1
});

/**
 * @typedef {ReturnType<create>} Grayscale
 */

function create() {
  return 0x0;
}

/**
 * @param {number} gray
 * @param {number} alpha
 */
function fromBytes(gray, alpha = 0xff) {
  return (
    ((alpha & 0xff) << 8) | (gray & 0xff)
  );
}

/**
 * @param {number} grayf
 * @param {number} alphaf
 */
function fromFloats(grayf, alphaf = 1.0) {
  let g = Math.floor(Math.max(Math.min(grayf, 1), 0) * 255);
  let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
  return fromBytes(g, a);
}

/**
 * @param {Grayscale} hexValue
 */
function gray(hexValue) {
  return hexValue & 0xff;
}

/**
 * @param {Grayscale} hexValue
 */
function grayf(hexValue) {
  return (hexValue & 0xff) / 255.0;
}

/**
 * @param {Grayscale} hexValue
 */
function alpha(hexValue) {
  let result = (hexValue >> 8) & 0xff;
  if (result === 0x00) {
    return 0xff;
  }
  return result;
}

/**
 * @param {Grayscale} hexValue
 */
function alphaf(hexValue) {
  return alpha(hexValue) / 255.0;
}

const OPACITY_EPSILON = 0.01;

/**
 * @param {Grayscale} from
 * @param {Grayscale} to
 * @param {number} delta
 */
function mix(from = 0x0000, to = 0xffff, delta = 0.5) {
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
 * @param {Grayscale} hexValue
 */
function toCSSColorString(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  let g = gray(hexValue).toString(16).padStart(2, '0');
  return `#${g}${g}${g}`;
}

/**
 * @param {Grayscale} hexValue
 */
function toFloatVector(hexValue) {
  if (typeof hexValue !== 'number') {
    throw new Error('Not a valid number for hex color value.');
  }
  return [grayf(hexValue), alphaf(hexValue)];
}

var grayscale = /*#__PURE__*/Object.freeze({
  __proto__: null,
  alpha: alpha,
  alphaf: alphaf,
  create: create,
  fromBytes: fromBytes,
  fromFloats: fromFloats,
  gray: gray,
  grayf: grayf,
  mix: mix,
  toCSSColorString: toCSSColorString,
  toFloatVector: toFloatVector
});

export { grayscale, rgba };
//# sourceMappingURL=index.js.map
