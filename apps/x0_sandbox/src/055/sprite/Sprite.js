export class SpriteInstance {
    /**
     * @param {import('./SpriteDef').SpriteDef} def
     * @param {string} spriteName
     */
    static fromDef(spriteName, def) {
        let result = new SpriteInstance(spriteName);
        result.frameSpeed = def.initial.frameSpeed;
        result.spriteIndex = def.initial.spriteIndex;
        return result;
    }
    
    /**
     * @param {string} spriteName 
     */
    constructor(spriteName) {
        this.spriteName = spriteName;
        this.spriteIndex = 0;
        this.frameSpeed = 0;
        this.frameDelta = 0;
    }
}

/**
 * @param {SpriteInstance} sprite
 * @param {import('./SpriteDef').SpriteDef} def
 * @param {number} deltaTime
 */
export function updateSprite(sprite, def, deltaTime) {
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
 * @param {SpriteInstance} sprite 
 * @param {import('./SpriteDef').SpriteDef} def 
 * @param {CanvasImageSource} image
 */
export function drawSprite(ctx, sprite, def, image) {
    let frame = def.frames[sprite.spriteIndex % def.frameCount];
    ctx.drawImage(
        image,
        frame[0], frame[1],
        frame[2] - frame[0],
        frame[3] - frame[1],
        -def.originX,
        -def.originY,
        def.width,
        def.height);
}
