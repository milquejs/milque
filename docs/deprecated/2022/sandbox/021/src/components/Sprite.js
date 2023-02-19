export const Sprite = {
  create(props) {
    const { subTexture, offsetX = 0, offsetY = 0 } = props;
    return {
      subTexture,
      spriteIndex: 0,
      dt: 0,
      offsetX,
      offsetY,
    };
  },
  draw(ctx, sprite, spriteIndex = sprite.spriteIndex) {
    const { subTexture } = sprite;
    const spriteWidth = subTexture.unitWidth;
    const spriteHeight = subTexture.unitHeight;
    const { offsetX, offsetY } = sprite;
    subTexture.unitDraw(
      ctx,
      -spriteWidth / 2 + offsetX,
      -spriteHeight / 2 + offsetY,
      spriteIndex
    );
  },
  next(sprite, dt = 1) {
    sprite.dt += dt;
    const amount = Math.floor(sprite.dt);
    sprite.dt -= amount;
    sprite.spriteIndex =
      (sprite.spriteIndex + amount) % sprite.subTexture.length;
  },
  change(sprite, subTexture) {
    sprite.subTexture = subTexture;
    sprite.spriteIndex = 0;
    sprite.dt = 0;
  },
};
