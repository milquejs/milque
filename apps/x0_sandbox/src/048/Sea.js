import { Random } from '@milque/random';
import { clamp } from '@milque/util';
import { AssetRef, bindRefs } from 'src/loader/AssetRef';

/**
 * @typedef {import('../renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('../game/Game.js').Game} Game
 */

const SEA_COLUMN_COLORS = [
  0xa2bee5,
  0x5381c1,
  0x4c4593,
];
const SEA_ROWS_COLORS = [
  0x4979bc,
  0x3865a5,
  0x1b4f99,
  0x184789,
];

const SEA_SPARKLE_COUNT = 60;
const SEA_FOAM_COUNT = 40;
const SEA_COLUMN_COUNT = 10;
const SEA_ROW_COUNT = 8;

export const ASSETS = {
  /** @type {AssetRef<HTMLImageElement>} */
  Wave1Image: new AssetRef('image:wave1.png'),
  /** @type {AssetRef<HTMLImageElement>} */
  Wave2Image: new AssetRef('image:wave2.png'),
};

/** @param {Game} game */
export async function load(game) {
  bindRefs(game.assets, Object.values(ASSETS));
}

/** @param {Game} game */
export function init(game) {
  const { display } = game;
  const canvas = display.canvas;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const sparkles = [];
  for (let i = 0; i < SEA_SPARKLE_COUNT; ++i) {
    sparkles.push(createSparkle(canvasWidth, canvasHeight));
  }
  const foams = [];
  for (let i = 0; i < SEA_FOAM_COUNT; ++i) {
    foams.push(createFoam(canvasWidth, canvasHeight));
  }
  const columns = [];
  for (let i = 0; i < SEA_COLUMN_COUNT; ++i) {
    columns.push(createColumn(canvasWidth, canvasHeight));
  }
  const rows = [];
  for (let i = 0; i < SEA_ROW_COUNT; ++i) {
    rows.push(createRow(canvasWidth, canvasHeight));
  }
  return {
    sparkles,
    foams,
    columns,
    rows,
  };
}

/**
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function update(dt, game, world) {
  const deltaTime = dt;
  const canvas = game.display.canvas;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
}

/**
 * @param {DrawContextFixedGLText} ctx
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function render(ctx, game, world) {
  const now = game.now;
  const canvas = game.display.canvas;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const { columns, rows, sparkles, foams } = world;

  let horizon = canvas.height - 200;
  ctx.setColor(0xFFFFFF);
  ctx.drawGradientRect(0x4979bc, 0x1b4f99, 0, horizon, canvas.width, canvas.height);

  // Sea Column
  ctx.setOpacityFloat(0.6);
  for (let s of columns) {
    ctx.setColor(s.color);
    ctx.drawRect(s.x, horizon, s.x + s.width, canvas.height);
  }
  ctx.setOpacityFloat(1);

  // Sea Rows
  for (let s of rows) {
    ctx.setColor(s.color);
    ctx.setScale(s.height, 1);
    ctx.setTranslation(s.x, s.y);
    ctx.drawCircle();
  }
  ctx.resetTransform();

  // ---------------------------------- AT SURFACE
  const SURFACE_DEPTH = 10;

  let startSparkleY = canvas.height - 150;
  let sparkleRangeY = startSparkleY - horizon;
  // Sea Sparkles
  ctx.setRotation(0, 0, 45);
  for (let s of sparkles) {
    ctx.setColor(0xFFFFFF);
    let opacity = (Math.sin(now / 1000 + s.sparkleOffset) + 1) / 2;
    ctx.setOpacityFloat(opacity);
    let dx = 10 * (Math.sin(now / 5000 + s.sparkleOffset) + 1) / 2;
    ctx.setTranslation(s.x + dx, s.y, SURFACE_DEPTH);
    let dy = (horizon - s.y) / sparkleRangeY;
    ctx.setScale(0.5 + dy, 0.5 + dy);
    ctx.drawBox();
  }
  ctx.setOpacityFloat(1);
  ctx.resetTransform();

  let foamRangeY = canvas.height - horizon;
  // Sea Foam
  for (let s of foams) {
    ctx.setColor(0xFFFFFF);
    let opacity = clamp((Math.sin(now / 1000 + s.opacity) + 1) / 2 * 2, 0, 1);
    ctx.setOpacityFloat(opacity);
    let dx = 100 * (Math.sin(now / 5000 + s.opacity) + 1) / 2;
    ctx.setTranslation(s.x + dx, s.y, SURFACE_DEPTH);
    let dy = (s.y - startSparkleY) / foamRangeY;
    ctx.setScale(0.1 + dy, (0.1 + dy) * 0.5);
    let wave;
    switch (s.wave) {
      case 0:
        wave = ASSETS.Wave1Image.current;
        break;
      default:
      case 1:
        wave = ASSETS.Wave2Image.current;
        break;
    }
    ctx.setTextureImage(5, wave);
    ctx.drawTexturedBox(5);
  }
  ctx.setOpacityFloat(1);
  ctx.resetTransform();
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createSparkle(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let y = Random.range(canvasHeight - 190, canvasHeight - 150);
  return {
    x, y,
    sparkleOffset: Random.range(0, Math.PI * 2),
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createFoam(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let y = Random.range(canvasHeight - 150, canvasHeight);
  let wave = Random.choose([0, 1]);
  return {
    x, y,
    wave,
    opacity: Random.range(0, Math.PI * 2),
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createColumn(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let color = Random.choose(SEA_COLUMN_COLORS);
  let width = Random.range(50, 100);
  return {
    x,
    color,
    width,
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createRow(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let y = Random.range(canvasHeight - 190, canvasHeight - 20);
  let height = Random.range(20, 60);
  let color;
  if (Random.next() < 0.6) {
    let dy = ((y - (canvasHeight - 190)) / 200);
    if (dy < 0.3) {
      color = SEA_ROWS_COLORS[0];
    } else if (dy < 0.6) {
      color = SEA_ROWS_COLORS[1];
    } else {
      color = SEA_ROWS_COLORS[2];
    }
  } else {
    color = Random.choose(SEA_ROWS_COLORS);
  }
  return {
    x, y,
    color,
    height,
  };
}
