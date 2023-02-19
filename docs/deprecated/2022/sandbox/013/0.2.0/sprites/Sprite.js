function createSprite(
  texture,
  x = 0,
  y = 0,
  width = texture.width,
  height = texture.height,
  u1 = 0,
  v1 = 0,
  u2 = 1,
  v2 = 1
) {
  return {
    texture,
    x,
    y,
    width,
    height,
    u: u1,
    v: v1,
    s: u2,
    t: v2,
  };
}

function createSpriteSheet(texture) {
  return {
    get(index) {},
    set(index, u, v, s, t) {},
  };
}
