import { loadImage } from './ImageLoader.js';

const ASSETS = {
  LOADED: false,
  TILE_IMAGE: null,
  NUMS_IMAGE: null,
  MARK_IMAGE: null,
};

/**
 * @param {import('@milque/asset').AssetManager} assets
 */
export async function load(assets) {
  ASSETS.TILE_IMAGE = await loadImage(assets.get('raw://tile.png'));
  ASSETS.NUMS_IMAGE = await loadImage(assets.get('raw://nums.png'));
  ASSETS.MARK_IMAGE = await loadImage(assets.get('raw://flag.png'));
  ASSETS.LOADED = true;
}

export function renderMines(ctx, mines, tileSize = 16) {
  if (!ASSETS.LOADED)
    throw new Error('Assets for this renderer have not yet been loaded.');

  const chunkWidth = mines.width;
  const chunkHeight = mines.height;
  const chunkData = mines.data;

  const halfTileSize = tileSize / 2;

  // Draw grid lines.
  ctx.fillStyle = '#777777';
  ctx.fillRect(0, 0, chunkWidth * tileSize, chunkHeight * tileSize);
  drawGrid(
    ctx,
    0,
    0,
    chunkWidth * tileSize,
    chunkHeight * tileSize,
    tileSize,
    tileSize
  );

  // Draw tiles.
  for (let y = 0; y < chunkHeight; ++y) {
    for (let x = 0; x < chunkWidth; ++x) {
      let renderX = x * tileSize;
      let renderY = y * tileSize;
      let tileIndex = x + y * chunkWidth;

      if (chunkData.solids[tileIndex] > 0) {
        ctx.drawImage(ASSETS.TILE_IMAGE, renderX, renderY, tileSize, tileSize);

        if (chunkData.marks[tileIndex] > 0) {
          ctx.drawImage(
            ASSETS.MARK_IMAGE,
            renderX,
            renderY,
            tileSize,
            tileSize
          );
        }
      } else {
        if (chunkData.tiles[tileIndex] > 0) {
          // ctx.drawImage(ASSETS.TILE_IMAGE, renderX - halfTileSize, renderY - halfTileSize, tileSize, tileSize);

          // Shaded box.
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(renderX, renderY, tileSize, tileSize);

          // Text.
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#000000';
          ctx.fillText('X', renderX + halfTileSize, renderY + halfTileSize);
        } else if (chunkData.overlay[tileIndex] > 0) {
          let num = chunkData.overlay[tileIndex] - 1;
          ctx.drawImage(
            ASSETS.NUMS_IMAGE,
            32 * num,
            0,
            32,
            32,
            renderX,
            renderY,
            tileSize,
            tileSize
          );
        }
      }

      // Utils.drawText(ctx, chunkData.regions[tileIndex], renderX, renderY, 0, 8, 'black');
    }
  }
}

function drawGrid(ctx, offsetX, offsetY, width, height, tileWidth, tileHeight) {
  ctx.strokeStyle = '#888888';
  ctx.beginPath();

  for (let y = 0; y < height; y += tileHeight) {
    ctx.moveTo(offsetX, y + offsetY);
    ctx.lineTo(offsetX + width, y + offsetY);
  }

  for (let x = 0; x < width; x += tileWidth) {
    ctx.moveTo(x + offsetX, offsetY);
    ctx.lineTo(x + offsetX, offsetY + height);
  }

  ctx.stroke();
}
