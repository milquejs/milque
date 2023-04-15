/**
 * @typedef {ReturnType<createSpriteDef>} SpriteDef
 * @typedef {[ u: number, v: number, s: number, t: number ]} SpriteFrame
 */

/**
 * @param {string} image
 * @param {number} width
 * @param {number} height
 * @param {Array<SpriteFrame>} frames
 * @returns 
 */
export function createSpriteDef(image, width, height, frames = [[0, 0, width, height]]) {
    return {
        image,
        width,
        height,
        originX: width / 2,
        originY: height / 2,
        frames,
        frameCount: frames.length,
    };
}

/**
 * @param {Partial<SpriteDef>} json
 */
export function createSpriteDefFromJSON(json) {
    let {
        image,
        width = 0,
        height = 0,
        originX = 0,
        originY = 0,
        frames = [[0, 0, width, height]],
        frameCount = frames.length,
    } = json;
    let result = createSpriteDef(image, width, height, frames);
    result.originX = originX;
    result.originY = originY;
    result.frameCount = frameCount;
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
export function createSpriteDefFromSpriteSheet(image, width, height, offsetX, offsetY, cols, rows, fromIndex = 0, toIndex = cols * rows) {
    let frames = [];
    for (let i = fromIndex; i < toIndex; ++i) {
        let x = (i % cols) * width;
        let y = Math.floor(i / cols) * height;
        /** @type {SpriteFrame} */
        let frame = [offsetX + x, offsetY + y, offsetX + width + x, offsetY + height + y];
        frames.push(frame);
    }
    return createSpriteDef(image, width, height, frames);
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} frameIndex
 * @param {CanvasImageSource} spriteImage
 * @param {SpriteDef} spriteDef 
 */
export function drawSprite(ctx, frameIndex, spriteImage, spriteDef) {
    let frame = spriteDef.frames[frameIndex % spriteDef.frameCount];
    ctx.drawImage(
        spriteImage,
        frame[0], frame[1],
        frame[2] - frame[0],
        frame[3] - frame[1],
        -spriteDef.originX,
        -spriteDef.originY,
        spriteDef.width,
        spriteDef.height);
}
