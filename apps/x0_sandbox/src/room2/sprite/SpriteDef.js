import { ComponentClass, EntityManager, Query } from '@milque/scene';

/** @module SpriteDef */

/**
 * @typedef {ReturnType<create>} SpriteDef
 * @typedef {ReturnType<newInstance>} SpriteInstance
 * @typedef {[ u: number, v: number, s: number, t: number ]} SpriteFrame
 */

/**
 * @param {string} image
 * @param {number} width
 * @param {number} height
 * @param {Array<SpriteFrame>} frames
 */
export function create(image, width, height, frames = [[0, 0, width, height]], frameSpeed = frames.length > 0 ? 1 : 0) {
    return {
        image,
        width,
        height,
        originX: width / 2,
        originY: height / 2,
        frames,
        frameCount: frames.length,
        initial: {
            frameSpeed,
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
export function fromSpriteSheet(image, width, height, offsetX, offsetY, cols, rows, fromIndex = 0, toIndex = cols * rows, frameSpeed = undefined) {
    let frames = [];
    for (let i = fromIndex; i < toIndex; ++i) {
        let x = (i % cols) * width;
        let y = Math.floor(i / cols) * height;
        /** @type {SpriteFrame} */
        let frame = [offsetX + x, offsetY + y, offsetX + width + x, offsetY + height + y];
        frames.push(frame);
    }
    return create(image, width, height, frames, frameSpeed);
}

export const SpriteComponent = new ComponentClass('sprite', () => createSpriteInstance(null, 0, 0, 0));
export const SpriteQuery = new Query(SpriteComponent);

/**
 * @param {string} spriteName 
 * @param {import('@milque/scene').EntityId} spriteId 
 * @param {number} spriteIndex 
 * @param {number} frameSpeed 
 * @returns 
 */
function createSpriteInstance(spriteName, spriteId, spriteIndex, frameSpeed) {
    return {
        spriteName,
        spriteId,
        spriteIndex,
        frameSpeed,
        frameDelta: 0,
    };
}

/**
 * @param {EntityManager} ents
 * @param {SpriteDef} spriteDef
 * @param {string} spriteName
 */
export function newInstance(ents, spriteDef, spriteName, spriteId = ents.create()) {
    let sprite = createSpriteInstance(spriteName, spriteId, spriteDef.initial.spriteIndex, spriteDef.initial.frameSpeed);
    ents.attach(spriteId, SpriteComponent, sprite);
    return sprite;
}

/**
 * @param {EntityManager} ents 
 * @param {import('@milque/scene').EntityId} spriteId
 */
export function getInstance(ents, spriteId) {
    return ents.get(spriteId, SpriteComponent);
}

/**
 * @param {number} deltaTime
 * @param {SpriteInstance} sprite
 * @param {SpriteDef} def
 */
export function updateInstance(deltaTime, sprite, def) {
    if (sprite.frameSpeed === 0) {
        return;
    }
    let frameCount = def.frameCount;
    sprite.frameDelta += (deltaTime / 1_000) * sprite.frameSpeed;
    let framesSkipped = Math.floor(sprite.frameDelta);
    sprite.frameDelta -= framesSkipped;
    let nextIndex = (sprite.spriteIndex + framesSkipped) % frameCount;
    if (nextIndex < 0) {
        nextIndex += frameCount;
    }
    sprite.spriteIndex = nextIndex;
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} spriteIndex
 * @param {SpriteDef} spriteDef 
 * @param {CanvasImageSource} image
 */
export function drawInstance(ctx, spriteIndex, spriteDef, image) {
    let frame = spriteDef.frames[spriteIndex % spriteDef.frameCount];
    ctx.drawImage(
        image,
        frame[0], frame[1],
        frame[2] - frame[0],
        frame[3] - frame[1],
        -spriteDef.originX,
        -spriteDef.originY,
        spriteDef.width,
        spriteDef.height);
}
