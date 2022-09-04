import { Geometry, joinGeometries } from './Geometry.js';

/**
 * @param {number} width 
 * @param {number} height 
 * @returns {Geometry}
 */
export function createGeometryQuad(out, width = 1, height = 1) {
    return joinGeometries(out, new Geometry(
        6,
        [0, 1, 2, 3, 4, 5],
        [0, 0, 0,
        width, height, 0,
        0, height, 0,
        0, 0, 0,
        width, 0, 0,
        width, height, 0],
        [0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]));
}
