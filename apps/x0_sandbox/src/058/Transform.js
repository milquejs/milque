/**
 * @typedef {ReturnType<typeof createTransform>} Transform
 */

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} scaleX 
 * @param {number} scaleY 
 * @param {number} rotation 
 */
export function createTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0) {
    return {
        x,
        y,
        scaleX,
        scaleY,
        rotation,
    };
}
