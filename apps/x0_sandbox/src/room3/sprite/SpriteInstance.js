import { AssetManager } from '@milque/asset';

import { drawSprite } from './SpriteDef';

/**
 * @typedef {ReturnType<typeof createSpriteInstance>} SpriteInstance
 */

/**
 * @param {string} [spriteName]
 * @param {number} [frameIndex] 
 * @param {number} [frameSpeed]
 */
export function createSpriteInstance(spriteName = null, frameIndex = 0, frameSpeed = 0) {
    return {
        spriteName,
        frameIndex,
        frameSpeed,
        frameDelta: 0,
    };
}

/**
 * @param {AssetManager} assets 
 * @param {string} spriteName
 */
export function validateSpriteInstance(assets, spriteName) {
    if (!assets.exists(spriteName)) {
        throw new Error(`Missing sprite def asset '${spriteName}'.`);
    }
    let spriteDef = assets.get(spriteName);
    if (!assets.exists(spriteDef.image)) {
        throw new Error(`Missing image asset '${spriteDef.image}'.`);
    }
}

/**
 * @param {AssetManager} assets
 * @param {number} deltaTime 
 * @param {SpriteInstance} spriteInstance 
 */
export function updateSpriteInstance(assets, deltaTime, spriteInstance) {
    let def = assets.get(spriteInstance.spriteName);
    if (!def) return;
    if (spriteInstance.frameSpeed === 0) {
        return;
    }
    let frameCount = def.frameCount;
    spriteInstance.frameDelta += (deltaTime / 1_000) * spriteInstance.frameSpeed;
    let framesSkipped = Math.floor(spriteInstance.frameDelta);
    spriteInstance.frameDelta -= framesSkipped;
    let nextIndex = (spriteInstance.frameIndex + framesSkipped) % frameCount;
    if (nextIndex < 0) {
        nextIndex += frameCount;
    }
    spriteInstance.frameIndex = nextIndex;
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {AssetManager} assets 
 * @param {SpriteInstance} spriteInstance
 */
export function drawSpriteInstance(ctx, assets, spriteInstance) {
    let def = assets.get(spriteInstance.spriteName);
    if (!def) return;
    let image = assets.get(def.image);
    if (!image) return;
    drawSprite(ctx, spriteInstance.frameIndex, image, def);
}
