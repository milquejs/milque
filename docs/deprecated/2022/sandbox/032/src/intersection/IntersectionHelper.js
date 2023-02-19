export const EPSILON = 1e-8;

/**
 * @typedef HitResult
 * @property {Number} x
 * @property {Number} y
 * @property {Number} dx
 * @property {Number} dy
 * @property {Number} nx
 * @property {Number} ny
 * @property {Number} time
 */

/**
 * Clamp the value between the given range.
 *
 * @param {Number} value The value to be clamped.
 * @param {Number} min The minimum possible value, inclusive.
 * @param {Number} max The maximum possible value, inclusive.
 * @returns {Number} The clamped value.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Creates a hit result.
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} nx
 * @param {Number} ny
 * @param {Number} time
 * @returns {HitResult}
 */
export function createHitResult(x, y, dx, dy, nx, ny, time) {
  return {
    x,
    y,
    dx,
    dy,
    nx,
    ny,
    time,
  };
}
