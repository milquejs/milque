import { createGeometry } from './Geometry.js';
import { vec3 } from 'gl-matrix';

/** @typedef {import('./Geometry.js').Geometry} Geometry */

/**
 * 
 * @param {number} width 
 * @param {number} height 
 * @returns 
 */
export function createGeometryQuad(width = 1, height = 1) {
    return createGeometry(
        6,
        [0, 1, 2, 3, 4, 5],
        [0, 0, 0,
        width, height, 0,
        0, height, 0,
        0, 0, 0,
        width, 0, 0,
        width, height, 0],
        [0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
}
