export const Sprite = {
    create(props)
    {
        const { textureStrip } = props;
        if (!textureStrip) throw new Error(`Component instantiation is missing required prop 'textureStrip'.`);
        return {
            textureStrip,
            spriteIndex: 0,
            dt: 0,
        };
    },
    draw(ctx, sprite)
    {
        const spriteWidth = sprite.textureStrip.unitWidth;
        const spriteHeight = sprite.textureStrip.unitHeight;
        sprite.textureStrip.unitDraw(ctx, -spriteWidth / 2, -spriteHeight / 2, sprite.spriteIndex);
    },
    next(sprite, dt = 1)
    {
        sprite.dt += dt;
        const amount = Math.floor(sprite.dt);
        sprite.dt -= amount;
        sprite.spriteIndex = (sprite.spriteIndex + amount) % sprite.textureStrip.length;
    }
};
