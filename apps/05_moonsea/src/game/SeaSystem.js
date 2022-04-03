import { Random } from '@milque/random';
import { AssetManager, AssetRef } from '@milque/asset';
import { clamp } from '@milque/util';
import { loadImage } from '../loader/ImageLoader.js';
import {
  getDayDelta,
  getDayIndex,
  mixDaylightColor,
  spicyDaylightColor,
} from '../Colors.js';
import { useLoad } from '../systems/LoadSystem.js';
import { useInit } from '../systems/UpdateSystem.js';
import { useDisplayPort } from '../systems/DisplayPortSystem.js';
import { useRenderPass } from '../systems/RenderPassSystem.js';
import { RENDER_PASS_SEA } from '../RenderPasses.js';
import { useFixedGLRenderer } from '../systems/RenderFixedGLSystem.js';

const SEA_SPARKLE_COUNT = 60;
const SEA_FOAM_COUNT = 40;
const SEA_COLUMN_COUNT = 10;
const SEA_ROW_COUNT = 8;

export const ASSETS = {
  Wave1Image: new AssetRef('wave1.png', 'raw://wave1.png', loadImage),
  Wave2Image: new AssetRef('wave2.png', 'raw://wave2.png', loadImage),
};

export function SeaSystem(m) {
  useLoad(m, async () => {
    await AssetManager.loadAssetRefs(Object.values(ASSETS));
  });

  const display = useDisplayPort(m);
  const sparkles = [];
  const foams = [];
  const columns = [];
  const rows = [];

  useInit(m, () => {
    const canvasWidth = display.width;
    const canvasHeight = display.height;
    createFilledArray(
      sparkles,
      () => createSparkle(canvasWidth, canvasHeight),
      SEA_SPARKLE_COUNT
    );
    createFilledArray(
      foams,
      () => createFoam(canvasWidth, canvasHeight),
      SEA_FOAM_COUNT
    );
    createFilledArray(
      columns,
      () => createColumn(canvasWidth, canvasHeight),
      SEA_COLUMN_COUNT
    );
    createFilledArray(
      rows,
      () => createRow(canvasWidth, canvasHeight),
      SEA_ROW_COUNT
    );
  });

  const ctx = useFixedGLRenderer(m);
  useRenderPass(m, RENDER_PASS_SEA, () => {
    const now = performance.now();
    const canvas = display.canvas;
    const canvasWidth = display.width;
    const canvasHeight = display.height;
    const MAX_WORLD_TIME = 60_000;
    const worldTime = now % MAX_WORLD_TIME;
    const dayIndex = getDayIndex(worldTime, MAX_WORLD_TIME);
    const dayDelta = getDayDelta(worldTime, MAX_WORLD_TIME);

    let horizon = canvas.height - 200;

    // Sea
    const gradientTop = mixDaylightColor(dayIndex, dayDelta, 'seas', 0);
    const gradientBot = mixDaylightColor(dayIndex, dayDelta, 'seas', 1);
    ctx.drawGradientRect(
      gradientTop,
      gradientBot,
      0,
      horizon,
      canvasWidth,
      canvasHeight
    );

    // Sea Column
    ctx.setOpacityFloat(0.6);
    for (let s of columns) {
      let color = spicyDaylightColor(dayIndex, dayDelta, s.spicy, 'columns');
      ctx.setColor(color);
      ctx.drawRect(s.x, horizon, s.x + s.width, canvas.height);
    }
    ctx.setOpacityFloat(1);

    // Sea Rows
    for (let s of rows) {
      let color = spicyDaylightColor(dayIndex, dayDelta, s.spicy, 'rows');
      ctx.setColor(color);
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
      ctx.setColor(0xffffff);
      let opacity = (Math.sin(now / 1000 + s.sparkleOffset) + 1) / 2;
      ctx.setOpacityFloat(opacity);
      let dx = (10 * (Math.sin(now / 5000 + s.sparkleOffset) + 1)) / 2;
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
      ctx.setColor(0xffffff);
      let opacity = clamp(
        ((Math.sin(now / 1000 + s.opacity) + 1) / 2) * 2,
        0,
        1
      );
      ctx.setOpacityFloat(opacity);
      let dx = (100 * (Math.sin(now / 5000 + s.opacity) + 1)) / 2;
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
  });
  return {
    sparkles,
    foams,
    columns,
    rows,
  };
}

/**
 * @template T
 * @param {Array<T>} out
 * @param {() => T} factory
 * @param {number} count
 */
function createFilledArray(out, factory, count) {
  for (let i = 0; i < count; ++i) {
    out.push(factory());
  }
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createSparkle(canvasWidth, canvasHeight) {
  let x = Random.range(0, canvasWidth);
  let y = Random.range(canvasHeight - 190, canvasHeight - 150);
  return {
    x,
    y,
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
    x,
    y,
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
  let width = Random.range(50, 100);
  return {
    x,
    width,
    spicy: Random.next(),
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
  let spicy;
  if (Random.next() < 0.6) {
    let dy = (y - (canvasHeight - 190)) / 200;
    if (dy < 0.3) {
      spicy = 0;
    } else if (dy < 0.6) {
      spicy = 0.4;
    } else {
      spicy = 0.9;
    }
  } else {
    spicy = Random.next();
  }
  return {
    x,
    y,
    height,
    spicy,
  };
}
