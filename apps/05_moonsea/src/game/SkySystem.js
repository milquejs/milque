import { Random } from '@milque/random';
import { clamp } from '@milque/util';
import { AssetManager, AssetRef } from '@milque/asset';
import { loadImage } from '../loader/ImageLoader.js';
import { hex } from '../renderer/color.js';
import {
  cloudyDaylightColor,
  getDayDelta,
  getDayIndex,
  mixDaylightColor,
  spicyDaylightColor,
} from '../Colors.js';
import { useLoad } from '../systems/LoadSystem.js';
import { useInit, useUpdate } from '../systems/UpdateSystem.js';
import { useDisplayPort } from '../systems/DisplayPortSystem.js';
import { useRenderPass } from '../systems/RenderPassSystem.js';
import { useFixedGLRenderer } from '../systems/RenderFixedGLSystem.js';
import { RENDER_PASS_SKY } from '../RenderPasses.js';

const SKY_STAR_COUNT = 40;
const SKY_STREAK_COUNT = 12;
const SKY_BIG_STREAK_COUNT = 4;
const SKY_SHADE_COUNT = 6;
const SKY_CLOUD_COUNT = 8;

export const ASSETS = {
  StarImage: new AssetRef('star.png', 'raw://star.png', loadImage),
  BlurStrokeImage: new AssetRef(
    'blur_stroke.png',
    'raw://blur_stroke.png',
    loadImage
  ),
  CircleImage: new AssetRef('circle.png', 'raw://circle.png', loadImage),
  CloudImage: new AssetRef('cloud.png', 'raw://cloud.png', loadImage),
};

export function SkySystem(m) {
  const display = useDisplayPort(m);
  const streaks = [];
  const bigStreaks = [];
  const clouds = [];
  const stars = [];
  const shades = [];

  useLoad(m, async () => {
    await AssetManager.loadAssetRefs(Object.values(ASSETS));
  });

  useInit(m, () => {
    const canvasWidth = display.width;
    const canvasHeight = display.height;

    createFilledArray(
      stars,
      () => createStar(canvasWidth, canvasHeight),
      SKY_STAR_COUNT
    );
    createFilledArray(
      streaks,
      () => createStreak(canvasWidth, canvasHeight),
      SKY_STREAK_COUNT
    );
    createFilledArray(
      bigStreaks,
      () => createBigStreak(canvasWidth, canvasHeight),
      SKY_BIG_STREAK_COUNT
    );
    createFilledArray(
      shades,
      () => createShade(canvasWidth, canvasHeight),
      SKY_SHADE_COUNT
    );
    createFilledArray(
      clouds,
      () => createCloud(canvasWidth, canvasHeight),
      SKY_CLOUD_COUNT
    );
  });

  useUpdate(m, (dt) => {
    const deltaTime = dt;
    const canvasWidth = display.width;
    const canvasHeight = display.height;

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
  });

  const ctx = useFixedGLRenderer(m);
  useRenderPass(m, RENDER_PASS_SKY, (dt) => {
    const now = performance.now();
    const canvasWidth = display.width;
    const canvasHeight = display.height;
    const MAX_WORLD_TIME = 60_000;
    const worldTime = now % MAX_WORLD_TIME;
    const dayIndex = getDayIndex(worldTime, MAX_WORLD_TIME);
    const dayDelta = getDayDelta(worldTime, MAX_WORLD_TIME);

    // Sky
    const gradientTop = mixDaylightColor(dayIndex, dayDelta, 'skies', 0);
    const gradientBot = mixDaylightColor(dayIndex, dayDelta, 'skies', 1);
    ctx.drawGradientRect(
      gradientTop,
      gradientBot,
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    // Shades
    for (let s of shades) {
      let color = hex.mix(
        gradientTop,
        gradientBot,
        clamp(s.y / canvasHeight - 0.06, 0, 1)
      );
      ctx.setColor(color);
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
      let color = spicyDaylightColor(dayIndex, dayDelta, s.spicy, 'streaks');
      ctx.setColor(color);
      ctx.setOpacityFloat(Math.min(maxOpacity, s.opacity));
      ctx.setScale(s.length, s.radius);
      ctx.setTranslation(s.x, s.y);
      ctx.drawTexturedBox(2, s.progress);
    }
    for (let s of bigStreaks) {
      let maxOpacity = s.progress / 100;
      let color = spicyDaylightColor(dayIndex, dayDelta, s.spicy, 'streaks');
      ctx.setColor(color);
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
      let color = spicyDaylightColor(dayIndex, dayDelta, s.spicy, 'stars');
      ctx.setColor(color);
      ctx.setOpacityFloat(s.opacity);
      let f = Math.sin((now / 500) * s.wiggleSpeed + s.wiggleOffset) + 1;
      let x = (s.x + starOffsetX) % canvasWidth;
      let y = (s.y + starOffsetY) % canvasHeight;
      ctx.drawTexturedBox(
        0,
        x,
        canvasHeight - y,
        16 * s.scale,
        16 * s.scale + f * s.scale * 8
      );
    }
    ctx.setOpacityFloat(1);

    // Moon
    let starColor = mixDaylightColor(dayIndex, dayDelta, 'stars', 0);
    ctx.setColor(starColor);
    ctx.setTextureImage(3, ASSETS.CircleImage.current);
    ctx.drawTexturedBox(3, canvasWidth * 0.66, 200);

    // Cloud
    let cloudImage = ASSETS.CloudImage.current;
    ctx.setTextureImage(4, cloudImage);
    let cloudOffsetY = -cloudImage.height / 2;
    for (let c of clouds) {
      let [high, low] = cloudyDaylightColor(
        dayIndex,
        dayDelta,
        c.spicy,
        'clouds'
      );
      let x = c.x + c.progress;
      ctx.setColor(high);
      ctx.setScale(c.w * 1.2, c.h * 1.2);
      ctx.setTranslation(x, c.y);
      let ratio = x / canvasWidth;
      ctx.drawTexturedBox(4, 10 * (-ratio * 2 + 1), cloudOffsetY);

      ctx.setColor(low);
      ctx.setScale(c.w, c.h);
      ctx.setTranslation(x, c.y);
      ctx.drawTexturedBox(4, 0, cloudOffsetY);
    }
    ctx.resetTransform();
  });

  return {
    streaks,
    bigStreaks,
    clouds,
    stars,
    shades,
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
function createStar(canvasWidth, canvasHeight) {
  return {
    x: Random.rangeInt(0, canvasWidth),
    y: Random.rangeInt(0, canvasHeight),
    scale: Random.range(0.1, 0.4),
    opacity: Random.range(0.3, 1),
    wiggleSpeed: Random.range(0.8, 1.2),
    wiggleOffset: Random.range(0, 2),
    spicy: Random.next(),
  };
}

/**
 * @param {number} canvasWidth
 * @param {number} canvasHeight
 */
function createStreak(canvasWidth, canvasHeight) {
  let x = Random.range(-canvasWidth / 2, canvasWidth);
  let y = Random.range(0, canvasHeight);
  let spicy;
  if (y < canvasWidth * 0.6) {
    spicy = 0;
  } else {
    spicy = 0.99;
  }
  let scale = Random.range(1, 2);
  return {
    x,
    y,
    spicy,
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
  return {
    x,
    y,
    spicy: 0.99,
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
  let height = Random.range(50, 80);
  return {
    x,
    y,
    opacity: 1,
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
  return {
    x,
    y,
    w,
    h,
    spicy: Random.next(),
    progress: 0,
    speed: Random.range(0.5, 3),
  };
}
