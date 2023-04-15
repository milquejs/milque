/**
 * @typedef {ReturnType<typeof createMaskDef>} MaskDef
 */

export const SHAPE_BOX = 'box';
export const SHAPE_CIRCLE = 'circle';

/**
 * @param {string} shape
 * @param {number} left
 * @param {number} top
 * @param {number} right
 * @param {number} bottom
 */
export function createMaskDef(shape, left, top, right, bottom) {
    return {
        shape,
        left,
        top,
        right,
        bottom,
    };
}

/**
 * @param {Partial<MaskDef>} json
 */
export function createMaskDefFromJSON(json) {
    let {
        shape,
        left = 0,
        top = 0,
        right = 0,
        bottom = 0,
    } = json;
    return createMaskDef(shape, left, top, right, bottom);
}

/**
 * @param {MaskDef} maskDef 
 * @param {DOMMatrix} domMatrix 
 */
export function transformMaskDef(maskDef, domMatrix) {
    let point = new DOMPoint(maskDef.left, maskDef.top);
    domMatrix.transformPoint(point);
    maskDef.left = point.x;
    maskDef.top = point.y;
    point.x = maskDef.right;
    point.y = maskDef.bottom;
    domMatrix.transformPoint(point);
    maskDef.right = point.x;
    maskDef.bottom = point.y;
}
