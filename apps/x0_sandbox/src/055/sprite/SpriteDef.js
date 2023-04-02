/**
 * @typedef {ReturnType<create>} SpriteDef
 * @typedef {[ u: number, v: number, s: number, t: number ]} SpriteFrame
 */

/**
 * @param {string} image
 * @param {number} width
 * @param {number} height
 * @param {Array<SpriteFrame>} frames
 */
export function create(image, width, height, frames = [[0, 0, width, height]]) {
    return {
        image,
        width,
        height,
        originX: width / 2,
        originY: height / 2,
        frames,
        frameCount: frames.length,
        initial: {
            frameSpeed: frames.length > 0 ? 1 : 0,
            spriteIndex: 0,
        },
    };
}

/**
 * @param {Partial<SpriteDef>} json
 */
export function fromJSON(json) {
    let {
        image,
        width = 0,
        height = 0,
        originX = 0,
        originY = 0,
        frames = [[0, 0, width, height]],
        frameCount = frames.length,
        initial = undefined,
    } = json;
    const {
        frameSpeed = 0,
        spriteIndex = 0,
    } = initial || {};
    let result = create(image, width, height, frames);
    result.originX = originX;
    result.originY = originY;
    result.frameCount = frameCount;
    result.initial.frameSpeed = frameSpeed;
    result.initial.spriteIndex = spriteIndex;
    return result;
}

/**
 * @param {string} image 
 * @param {number} width 
 * @param {number} height 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} cols
 * @param {number} rows
 * @param {number} [fromIndex]
 * @param {number} [toIndex]
 */
export function fromSpriteSheet(image, width, height, offsetX, offsetY, cols, rows, fromIndex = 0, toIndex = cols * rows) {
    let frames = [];
    for (let i = fromIndex; i < toIndex; ++i) {
        let x = (i % cols) * width;
        let y = Math.floor(i / cols) * height;
        /** @type {SpriteFrame} */
        let frame = [offsetX + x, offsetY + y, offsetX + width + x, offsetY + height + y];
        frames.push(frame);
    }
    return create(image, width, height, frames);
}
