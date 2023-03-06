
/**
 * @param {number} hexValue
 */
export function red(hexValue) {
    return (hexValue >> 16) & 0xff;
}

/**
 * @param {number} hexValue
 */
export function redf(hexValue) {
    return ((hexValue >> 16) & 0xff) / 255.0;
}

/**
 * @param {number} hexValue
 */
export function green(hexValue) {
    return (hexValue >> 8) & 0xff;
}

/**
 * @param {number} hexValue
 */
export function greenf(hexValue) {
    return ((hexValue >> 8) & 0xff) / 255.0;
}

/**
 * @param {number} hexValue
 */
export function blue(hexValue) {
    return hexValue & 0xff;
}

/**
 * @param {number} hexValue
 */
export function bluef(hexValue) {
    return (hexValue & 0xff) / 255.0;
}

/**
 * @param {number} hexValue
 */
export function alpha(hexValue) {
    return (hexValue >> 24) & 0xff;
}

/**
 * @param {number} hexValue
 */
export function alphaf(hexValue) {
    return ((hexValue >> 24) & 0xff) / 255.0;
}

/**
 * @param {number} redf
 * @param {number} greenf
 * @param {number} bluef
 * @param {number} alphaf
 */
export function hexf(redf, greenf, bluef, alphaf = 1) {
    let r = Math.floor(Math.max(Math.min(redf, 1), 0) * 255);
    let g = Math.floor(Math.max(Math.min(greenf, 1), 0) * 255);
    let b = Math.floor(Math.max(Math.min(bluef, 1), 0) * 255);
    let a = Math.floor(Math.max(Math.min(alphaf, 1), 0) * 255);
    return (
        ((a & 0xff) << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff)
    );
}

/**
 * @param {number} from
 * @param {number} to 
 * @param {number} delta
 */
export function mix(from = 0x000000, to = 0xffffff, delta = 0.5) {
    let rm = this.redf(from);
    let gm = this.greenf(from);
    let bm = this.bluef(from);
    let am = this.alphaf(from);
    let rf = (this.redf(to) - rm) * delta + rm;
    let gf = (this.greenf(to) - gm) * delta + gm;
    let bf = (this.bluef(to) - bm) * delta + bm;
    let af = (this.alphaf(to) - am) * delta + am;
    if (af < 0.01) {
        af = undefined;
    }
    return hexf(rf, gf, bf, af);
}

/**
 * @param {number} hexValue
 */
export function toCSSColor(hexValue) {
    if (typeof hexValue !== 'number') {
        return hexValue;
    }
    let r = red(hexValue).toString(16).padStart(2, '0');
    let g = green(hexValue).toString(16).padStart(2, '0');
    let b = blue(hexValue).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
