export const Sprite = {
    create(props)
    {
        const { textureStrip, offsetX = 0, offsetY = 0 } = props;
        if (!textureStrip) throw new Error(`Component instantiation is missing required prop 'textureStrip'.`);
        return {
            textureStrip,
            spriteIndex: 0,
            dt: 0,
            offsetX,
            offsetY,
        };
    },
    draw(ctx, sprite, spriteIndex = sprite.spriteIndex)
    {
        const spriteWidth = sprite.textureStrip.unitWidth;
        const spriteHeight = sprite.textureStrip.unitHeight;
        const { offsetX, offsetY } = sprite;
        sprite.textureStrip.unitDraw(ctx, -spriteWidth / 2 + offsetX, -spriteHeight / 2 + offsetY, spriteIndex);
    },
    next(sprite, dt = 1)
    {
        sprite.dt += dt;
        const amount = Math.floor(sprite.dt);
        sprite.dt -= amount;
        sprite.spriteIndex = (sprite.spriteIndex + amount) % sprite.textureStrip.length;
    }
};
