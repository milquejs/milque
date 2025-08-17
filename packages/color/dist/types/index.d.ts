type Rgba = number;
type Grayscale = number;

/** @returns {import('./ColorTypes').Rgba} */
declare function create$1(): Rgba;
/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 * @param {number} [alpha]
 */
declare function fromBytes$1(red: number, green: number, blue: number, alpha?: number): number;
/**
 * @param {number} redf
 * @param {number} greenf
 * @param {number} bluef
 * @param {number} alphaf
 */
declare function fromFloats$1(redf: number, greenf: number, bluef: number, alphaf?: number): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function red(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function redf(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function green(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function greenf(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function blue(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function bluef(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function alpha$1(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function alphaf$1(hexValue: Rgba): number;
/**
 * @param {import('./ColorTypes').Rgba} from
 * @param {import('./ColorTypes').Rgba} to
 * @param {number} delta
 */
declare function mix$1(from?: Rgba, to?: Rgba, delta?: number): number;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function toCSSColorString$1(hexValue: Rgba): string;
/**
 * @param {import('./ColorTypes').Rgba} hexValue
 */
declare function toFloatVector$1(hexValue: Rgba): number[];

declare const rgba_blue: typeof blue;
declare const rgba_bluef: typeof bluef;
declare const rgba_green: typeof green;
declare const rgba_greenf: typeof greenf;
declare const rgba_red: typeof red;
declare const rgba_redf: typeof redf;
declare namespace rgba {
  export {
    alpha$1 as alpha,
    alphaf$1 as alphaf,
    rgba_blue as blue,
    rgba_bluef as bluef,
    create$1 as create,
    fromBytes$1 as fromBytes,
    fromFloats$1 as fromFloats,
    rgba_green as green,
    rgba_greenf as greenf,
    mix$1 as mix,
    rgba_red as red,
    rgba_redf as redf,
    toCSSColorString$1 as toCSSColorString,
    toFloatVector$1 as toFloatVector,
  };
}

/**
 * @returns {import('./ColorTypes').Grayscale}
 */
declare function create(): Grayscale;
/**
 * @param {number} gray
 * @param {number} alpha
 */
declare function fromBytes(gray: number, alpha?: number): number;
/**
 * @param {number} grayf
 * @param {number} alphaf
 */
declare function fromFloats(grayf: number, alphaf?: number): number;
/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
declare function gray(hexValue: Grayscale): number;
/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
declare function grayf(hexValue: Grayscale): number;
/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
declare function alpha(hexValue: Grayscale): number;
/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
declare function alphaf(hexValue: Grayscale): number;
/**
 * @param {import('./ColorTypes').Grayscale} from
 * @param {import('./ColorTypes').Grayscale} to
 * @param {number} delta
 */
declare function mix(from?: Grayscale, to?: Grayscale, delta?: number): number;
/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
declare function toCSSColorString(hexValue: Grayscale): string;
/**
 * @param {import('./ColorTypes').Grayscale} hexValue
 */
declare function toFloatVector(hexValue: Grayscale): number[];

declare const grayscale_alpha: typeof alpha;
declare const grayscale_alphaf: typeof alphaf;
declare const grayscale_create: typeof create;
declare const grayscale_fromBytes: typeof fromBytes;
declare const grayscale_fromFloats: typeof fromFloats;
declare const grayscale_gray: typeof gray;
declare const grayscale_grayf: typeof grayf;
declare const grayscale_mix: typeof mix;
declare const grayscale_toCSSColorString: typeof toCSSColorString;
declare const grayscale_toFloatVector: typeof toFloatVector;
declare namespace grayscale {
  export {
    grayscale_alpha as alpha,
    grayscale_alphaf as alphaf,
    grayscale_create as create,
    grayscale_fromBytes as fromBytes,
    grayscale_fromFloats as fromFloats,
    grayscale_gray as gray,
    grayscale_grayf as grayf,
    grayscale_mix as mix,
    grayscale_toCSSColorString as toCSSColorString,
    grayscale_toFloatVector as toFloatVector,
  };
}

export { grayscale, rgba };
export type { Grayscale, Rgba };
