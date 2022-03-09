import { Random } from '@milque/random';
import { clamp } from '@milque/util';
import { AssetRef, bindRefs, loadRefs } from './loader/AssetRef';
import { loadImage } from './loader/ImageLoader';
import { hex } from './renderer/color.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('./main.js').Game} Game
 */

const STAR_COLORS = [
  0xfafafa
];
const GRADIENT_TOP = 0x8278b4;
const GRADIENT_BOTTOM = 0xb4bee6;
const STREAK_COLORS = [
  0xb4a0e6,
  0xcdbff2,
];

const SKY_STAR_COUNT = 40;
const SKY_STREAK_COUNT = 12;
const SKY_BIG_STREAK_COUNT = 4;
const SKY_SHADE_COUNT = 6;
const SKY_CLOUD_COUNT = 8;

export const ASSETS = {
  StarImage: new AssetRef('star.png', 'res/star.png', loadImage),
  BlurStrokeImage: new AssetRef('blur_stroke.png', 'res/blur_stroke.png', loadImage),
  CircleImage: new AssetRef('circle.png', 'res/circle.png', loadImage),
  CloudImage: new AssetRef('cloud.png', 'res/cloud.png', loadImage),
};

/** @param {Game} game */
export async function load(game) {
  bindRefs(game.assets, Object.values(ASSETS));
  await loadRefs(Object.values(ASSETS));
}

/** @param {Game} game */
export function init(game) {
  const { display } = game;
  const canvas = display.canvas;
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;

  const stars = [];
  for (let i = 0; i < SKY_STAR_COUNT; ++i) {
    let inst = createStar(canvasWidth, canvasHeight);
    stars.push(inst);
  }
  const streaks = [];
  for(let i = 0; i < SKY_STREAK_COUNT; ++i) {
    streaks.push(createStreak(canvasWidth, canvasHeight));
  }
  const bigStreaks = [];
  for(let i = 0; i < SKY_BIG_STREAK_COUNT; ++i) {
    bigStreaks.push(createBigStreak(canvasWidth, canvasHeight));
  }
  const shades = [];
  for(let i = 0; i < SKY_SHADE_COUNT; ++i) {
    shades.push(createShade(canvasWidth, canvasHeight));
  }
  const clouds = [];
  for(let i = 0; i < SKY_CLOUD_COUNT; ++i) {
    clouds.push(createCloud(canvasWidth, canvasHeight));
  }
  return {
    stars,
    streaks,
    bigStreaks,
    shades,
    clouds,
  };
}

/**
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function update(dt, game, world) {
  const deltaTime = dt;
  const canvas = game.display.canvas;
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;

  const { streaks, bigStreaks, clouds } = world;
  for (let s of streaks) {
    s.progress += (deltaTime / 50) * s.speed;
    if (s.progress > s.y * 2 + s.length) {
      let x = Random.range(-canvasWidth / 2, canvasWidth);
      s.x = x;
      s.y = canvasHeight;
      s.progress = 0;
      s.speed = Random.range(0.1, 2);
      s.opacity = Random.range(0.1, 0.3);
      s.radius = Random.range(0.5, 1);
      s.length = Random.range(1, 2);
    }
  }
  for (let s of bigStreaks) {
    s.progress += (deltaTime / 50) * s.speed;
    if (s.progress > s.y * 2 + s.length) {
      let x = Random.range(-canvasWidth / 2, canvasWidth);
      s.x = x;
      s.y = canvasHeight;
      s.progress = 0;
      s.speed = Random.range(0.1, 0.5);
      s.opacity = Random.range(0.1, 0.5);
      s.radius = Random.range(0.5, 1) * 3;
      s.length = Random.range(1, 2) * 3;
    }
  }
  for (let c of clouds) {
    c.progress += (deltaTime / 100) * c.speed;
    if (c.progress > canvasWidth - c.x + 300) {
      c.w = Random.range(2, 4);
      c.h = Random.range(0.2, 1);
      c.x = -canvasWidth;
      c.y = Random.range(0, canvasHeight * 0.6);
      c.progress = 0;
      c.speed = Random.range(0.5, 3);
    }
  }
}

/**
 * @param {DrawContextFixedGLText} ctx
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function render(ctx, game, world) {
  const now = game.now;
  const canvas = game.display.canvas;
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;
  const { shades, streaks, bigStreaks, stars, clouds } = world;

  // Sky
  ctx.drawGradientRect(GRADIENT_TOP, GRADIENT_BOTTOM, 0, 0, canvasWidth, canvasHeight);

  // Shades
  for (let s of shades) {
    ctx.setColor(s.color);
    ctx.setScale(canvasWidth / 16, s.height / 16);
    ctx.setTranslation(s.x, s.y);
    ctx.drawCircle();
    ctx.resetTransform();
  }

  // Streaks
  ctx.setTextureImage(2, ASSETS.BlurStrokeImage.current);
  ctx.setRotation(0, 0, -45);
  for (let s of streaks) {
    let maxOpacity = s.progress / 100;
    ctx.setColor(s.color);
    ctx.setOpacityFloat(Math.min(maxOpacity, s.opacity));
    ctx.setScale(s.length, s.radius);
    ctx.setTranslation(s.x, s.y);
    ctx.drawTexturedBox(2, s.progress);
  }
  for (let s of bigStreaks) {
    let maxOpacity = s.progress / 100;
    ctx.setColor(s.color);
    ctx.setOpacityFloat(Math.min(maxOpacity, s.opacity));
    ctx.setScale(s.length, s.radius);
    ctx.setTranslation(s.x, s.y);
    ctx.drawTexturedBox(2, s.progress);
  }
  ctx.setOpacityFloat(1);
  ctx.resetTransform();

  // Stars
  let starOffsetX = (now / 400) % canvasWidth;
  let starOffsetY = (now / 400) % canvasHeight;
  ctx.setTextureImage(0, ASSETS.StarImage.current);
  for (let s of stars) {
    ctx.setColor(s.color);
    ctx.setOpacityFloat(s.opacity);
    let f = Math.sin((now / 500) * s.wiggleSpeed + s.wiggleOffset) + 1;
    let x = (s.x + starOffsetX) % canvasWidth;
    let y = (s.y + starOffsetY) % canvasHeight;
    ctx.drawTexturedBox(0, x, canvasHeight - y, 16 * s.scale, 16 * s.scale + f * s.scale * 8);
  }
  ctx.setOpacityFloat(1);

  // Moon
  ctx.setColor(STAR_COLORS[0]);
  ctx.setTextureImage(3, ASSETS.CircleImage.current);
  ctx.drawTexturedBox(3, canvasWidth * 0.66, 200);

  // Cloud
  let cloudImage = ASSETS.CloudImage.current;
  ctx.setTextureImage(4, cloudImage);
  let cloudOffsetY = -cloudImage.height / 2;
  for (let c of clouds) {
    let x = c.x + c.progress;
    ctx.setColor(c.highlight);
    ctx.setScale(c.w * 1.2, c.h * 1.2);
    ctx.setTranslation(x, c.y);
    let ratio = (x / canvasWidth);
    ctx.drawTexturedBox(4, (10 * (-ratio * 2 + 1)), cloudOffsetY);

    ctx.setColor(c.lowlight);
    ctx.setScale(c.w, c.h);
    ctx.setTranslation(x, c.y);
    ctx.drawTexturedBox(4, 0, cloudOffsetY);
  }
  ctx.resetTransform();
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createStar(canvasWidth, canvasHeight) {
  return {
    x: Random.rangeInt(0, canvasWidth),
    y: Random.rangeInt(0, canvasHeight),
    scale: Random.range(0.1, 0.4),
    opacity: Random.range(0.3, 1),
    color: Random.choose(STAR_COLORS),
    wiggleSpeed: Random.range(0.8, 1.2),
    wiggleOffset: Random.range(0, 2),
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createStreak(canvasWidth, canvasHeight) {
  let x = Random.range(-canvasWidth / 2, canvasWidth);
  let y = Random.range(0, canvasHeight);
  let color;
  if (y < canvasWidth * 0.6) {
    color = STREAK_COLORS[0];
  } else {
    color = STREAK_COLORS[1];
  }
  let scale = Random.range(1, 2);
  return {
    x, y,
    color,
    progress: Random.range(0, canvasHeight),
    speed: Random.range(0.1, 1.5),
    opacity: Random.range(0.1, 0.3),
    radius: Random.range(0.5, 1) * scale,
    length: Random.range(1, 2) * scale,
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createBigStreak(canvasWidth, canvasHeight) {
  let x = Random.range(-canvasWidth / 2, canvasWidth);
  let y = Random.rangeInt(0, canvasHeight);
  let color = STREAK_COLORS[1];
  return {
    x, y,
    color,
    progress: 0,
    speed: Random.range(0.1, 0.5),
    opacity: Random.range(0.1, 0.5),
    radius: Random.range(0.5, 1) * 3,
    length: Random.range(1, 2) * 3,
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createShade(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let y = Random.range(0, canvasHeight);
  let color = hex.mix(GRADIENT_BOTTOM, GRADIENT_TOP, clamp(y / canvasHeight -0.06, 0, 1));
  let height = Random.range(50, 80);
  return {
    x,
    y,
    opacity: 1,
    color,
    height,
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createCloud(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let y = Random.range(0, canvasHeight * 0.6);
  let w = Random.range(2, 4);
  let h = Random.range(0.2, 1);
  let highlight = 0xFFFFFF;
  let lowlight = 0xE0EEFF;
  return {
    x, y,
    w, h,
    highlight,
    lowlight,
    progress: 0,
    speed: Random.range(0.5, 3),
  };
}
