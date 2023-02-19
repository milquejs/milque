import { ViewHelper } from './milque.js';
import { Camera2D } from './util/Camera2D.js';

const TILE_MAP = `
0,0,6,3,0:
1. .1. .2. .
1.1.1. .1. .
1. .1. .1. .`;
const TILE_COLORS = ['', '#00FF00', '#0000FF'];

function drawTileByColorMap(colorMap, tileSize, ctx, x, y, value) {
  if (colorMap[value]) {
    drawTile(ctx, x, y, value, colorMap[value], tileSize);
  }
}

export function onStart() {
  this.camera = new Camera2D();
  this.tileMap = parseTileMap(TILE_MAP);
}

export function onRender(ctx, view, world) {
  ViewHelper.setViewTransform(
    view,
    this.camera.setOffset(view.width / 2, view.height / 2)
  );
  {
    const TILE_SIZE = 20;
    let offsetX = (world.tileMap.width / 2) * TILE_SIZE;
    let offsetY = (world.tileMap.height / 2) * TILE_SIZE;
    ctx.translate(-offsetX, -offsetY);
    drawTileMap(
      ctx,
      world.tileMap,
      drawTileByColorMap.bind(null, TILE_COLORS, 16)
    );
    ctx.translate(offsetX, offsetY);
  }
}

const LINE_COMMENT_PATTERN = /\/\/.*/g;
const BLOCK_COMMENT_PATTERN = /\/\*(\*(?!\/)|[^*])*\*\//g;
const ALL_COMMENT_PATTERN = new RegExp(
  `(${LINE_COMMENT_PATTERN.source})|(${BLOCK_COMMENT_PATTERN.source})`
);
function parseTileMap(tileMapString) {
  // Remove all line and block comments
  let string = tileMapString.replace(ALL_COMMENT_PATTERN, '');
  // Remove all remaining whitespace
  string = string.replace(/\s/g, '');

  // Find the header and body...
  const bodySeparator = string.indexOf(':');
  if (bodySeparator < 0)
    throw new Error(
      `Invalid header format for tilemap - expected 'x,y,w,h,fill:', not '${string.substring(
        0,
        Math.min(string.length, 10)
      )}'.`
    );

  const header = string.substring(0, bodySeparator);
  const body = string.substring(bodySeparator + 1);
  let index;

  // Evaluate header...
  index = 0;
  let args = [];
  while (index < header.length) {
    let next = header.indexOf(',', index);
    if (next >= 0) {
      args.push(header.substring(index, next));
      index = next + 1;
    } else {
      break;
    }
  }
  // Get x offset
  const offsetX = Number.parseInt(args[0] || 0);
  // Get y offset
  const offsetY = Number.parseInt(args[1] || 0);
  // Get width
  const width = Number.parseInt(args[2]);
  // Get height
  const height = Number.parseInt(args[3]);
  // Get fill value
  const fillValue = Number.parseInt(args[4] || 0);

  let result = createTileMap(width, height, fillValue);

  // Evaluate body...
  let x = offsetX;
  let y = offsetY;
  for (index = 0; index < body.length; ) {
    if (x >= width || y >= height)
      throw new Error(
        `Tile position '${x},${y}' out of bounds '${width},${height}'.`
      );

    let j = body.indexOf('.', index);

    // Empty tile
    if (index === j) {
      // Do nothing. It is already the fill value.
    } else {
      let s = body.substring(index, j);
      result[y][x] = Number.parseInt(s);
    }

    if (x + 1 >= width) {
      x = 0;
      ++y;
    } else {
      ++x;
    }

    index = j + 1;
  }

  return result;
}

function createTileMap(width, height = width, fillValue = 0) {
  let map = new Array(height);
  for (let y = 0; y < height; ++y) {
    map[y] = new Array(width).fill(fillValue);
  }
  map.width = width;
  map.height = height;
  return map;
}

function drawTileMap(ctx, tileMap, tileRenderer = drawTile) {
  for (let y = 0; y < tileMap.length; ++y) {
    for (let x = 0; x < tileMap[y].length; ++x) {
      tileRenderer(ctx, x, y, tileMap[y][x]);
    }
  }
}

function drawTile(ctx, x, y, value, tileColor = '#FF0000', tileSize = 16) {
  ctx.fillStyle = tileColor;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}
