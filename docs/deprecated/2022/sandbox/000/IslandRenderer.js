const DEFAULT_INFO = {
  tileSize: 16,
};
const INFO_KEY = Symbol('IslandRendererInfo');
export class IslandRenderer {
  static get Info() {
    return INFO_KEY;
  }

  static draw(ctx, targets, defaultInfo = undefined) {
    const defaults = defaultInfo
      ? { ...DEFAULT_INFO, ...defaultInfo }
      : DEFAULT_INFO;

    let i = 0;
    for (let target of targets) {
      const info = target[INFO_KEY];

      const island = target;
      const width = resolveInfo('width', info, target, defaults);
      const height = resolveInfo('height', info, target, defaults);
      const tileSize = resolveInfo('tileSize', info, target, defaults);

      for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
          let i = x + y * width;
          let ground = island.ground[i];
          let solid = island.solid[i];
          if (ground) {
            ctx.fillStyle = 'saddlebrown';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
          if (solid) {
            ctx.fillStyle = 'green';
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
        }
      }
      ++i;
    }
  }
}

function resolveInfo(param, info, target, defaults) {
  if (info) {
    if (param in info) {
      return info[param];
    } else if (param in target) {
      return target[param];
    } else {
      return defaults[param];
    }
  } else if (target) {
    if (param in target) {
      return target[param];
    } else {
      return defaults[param];
    }
  } else {
    return defaults[param];
  }
}
