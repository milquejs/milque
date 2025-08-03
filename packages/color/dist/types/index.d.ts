/**
 * @typedef {ReturnType<create>} RGBA
 */
declare function create$1(): number;
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
 * @param {RGBA} hexValue
 */
declare function red(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function redf(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function green(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function greenf(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function blue(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function bluef(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function alpha$1(hexValue: RGBA): number;
/**
 * @param {RGBA} hexValue
 */
declare function alphaf$1(hexValue: RGBA): number;
/**
 * @param {RGBA} from
 * @param {RGBA} to
 * @param {number} delta
 */
declare function mix$1(from?: RGBA, to?: RGBA, delta?: number): number;
/**
 * @param {RGBA} hexValue
 */
declare function toCSSColorString$1(hexValue: RGBA): string;
/**
 * @param {RGBA} hexValue
 */
declare function toFloatVector$1(hexValue: RGBA): number[];
type RGBA = ReturnType<typeof create$1>;

type rgba_RGBA = RGBA;
declare const rgba_blue: typeof blue;
declare const rgba_bluef: typeof bluef;
declare const rgba_green: typeof green;
declare const rgba_greenf: typeof greenf;
declare const rgba_red: typeof red;
declare const rgba_redf: typeof redf;
declare namespace rgba {
  export { alpha$1 as alpha, alphaf$1 as alphaf, rgba_blue as blue, rgba_bluef as bluef, create$1 as create, fromBytes$1 as fromBytes, fromFloats$1 as fromFloats, rgba_green as green, rgba_greenf as greenf, mix$1 as mix, rgba_red as red, rgba_redf as redf, toCSSColorString$1 as toCSSColorString, toFloatVector$1 as toFloatVector };
  export type { rgba_RGBA as RGBA };
}

/**
 * @typedef {ReturnType<create>} Grayscale
 */
declare function create(): number;
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
 * @param {Grayscale} hexValue
 */
declare function gray(hexValue: Grayscale): number;
/**
 * @param {Grayscale} hexValue
 */
declare function grayf(hexValue: Grayscale): number;
/**
 * @param {Grayscale} hexValue
 */
declare function alpha(hexValue: Grayscale): number;
/**
 * @param {Grayscale} hexValue
 */
declare function alphaf(hexValue: Grayscale): number;
/**
 * @param {Grayscale} from
 * @param {Grayscale} to
 * @param {number} delta
 */
declare function mix(from?: Grayscale, to?: Grayscale, delta?: number): number;
/**
 * @param {Grayscale} hexValue
 */
declare function toCSSColorString(hexValue: Grayscale): string;
/**
 * @param {Grayscale} hexValue
 */
declare function toFloatVector(hexValue: Grayscale): number[];
type Grayscale = ReturnType<typeof create>;

type grayscale_Grayscale = Grayscale;
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
  export { grayscale_alpha as alpha, grayscale_alphaf as alphaf, grayscale_create as create, grayscale_fromBytes as fromBytes, grayscale_fromFloats as fromFloats, grayscale_gray as gray, grayscale_grayf as grayf, grayscale_mix as mix, grayscale_toCSSColorString as toCSSColorString, grayscale_toFloatVector as toFloatVector };
  export type { grayscale_Grayscale as Grayscale };
}

export { grayscale, rgba };
