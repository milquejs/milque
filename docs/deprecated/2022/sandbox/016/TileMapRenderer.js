export function renderTileMap(ctx, tileMap, tileSize = 16) {
  ctx.save();
  {
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${tileSize / 2}px monospace`;
    for (let y = 0; y < tileMap.height; ++y) {
      for (let x = 0; x < tileMap.width; ++x) {
        renderTile(ctx, x, y, tileMap.get(x, y), tileSize);
      }
    }
  }
  ctx.restore();
}

export function renderTile(ctx, x, y, tile, tileSize) {
  ctx.fillText(tile, x * tileSize, y * tileSize);
}

export function renderTilePointer(
  ctx,
  worldSpaceX,
  worldSpaceY,
  tileSize = 16
) {
  ctx.strokeStyle = 'white';
  let x = Math.floor(worldSpaceX / tileSize) * tileSize;
  let y = Math.floor(worldSpaceY / tileSize) * tileSize;
  ctx.strokeRect(x, y, tileSize, tileSize);
}
