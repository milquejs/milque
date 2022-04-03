import { AssetRef } from '@milque/asset';
import { Random } from '@milque/random';

import { whenSystemLoaded } from '../BaseHooks.js';
import { ComponentClass } from '../ComponentClass.js';
import { loadImage } from '../loader/ImageLoader.js';
import { RENDER_PASS_FISH } from '../RenderPasses.js';
import { RippleSystem, startRipple } from './RippleSystem.js';
import { useDisplayPort } from '../systems/DisplayPortSystem.js';
import { useLoad } from '../systems/LoadSystem.js';
import {
  RenderFixedGLSystem,
  useFixedGLRenderer,
} from '../systems/RenderFixedGLSystem.js';
import { useRenderPass } from '../systems/RenderPassSystem.js';
import { useInit, useUpdate } from '../systems/UpdateSystem.js';
import { useSystemState } from '../SystemManager.js';

/** @typedef {import('../SystemManager.js').SystemContext} SystemContext */

const FishImage = new AssetRef(
  'fishShadow',
  'raw://fish_shadow.png',
  loadImage
);
const FishComponent = new ComponentClass('fish', () => ({
  x: 0,
  y: 0,
  offset: 0,
  size: 0,
  speed: 0,
}));

const SPAWN_OFFSET = [0, Math.PI * 2];
const SIZE = [0.3, 0.5];
const SPEED = [1, 3];
const FISH_COUNT = 6;

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export async function FishSystem(m) {
  await whenSystemLoaded(m, RenderFixedGLSystem);
  const fishes = [];
  useFishInit(m, fishes);
  useFishUpdater(m, fishes);
  useFishRenderer(m, fishes);
  return {
    fishes,
  };
}

async function load() {
  await FishImage.load();
}

function useFishInit(m, fishes) {
  const DISPLAY = useDisplayPort(m);
  const DISPLAY_W = DISPLAY.width;
  const DISPLAY_H = DISPLAY.height;
  const SPAWN_X = [0, DISPLAY_W];
  const SPAWN_Y = [DISPLAY_H - 100, DISPLAY_H];

  useLoad(m, load);
  useInit(m, () => {
    let result = FishComponent.createAll(fishes, FISH_COUNT);
    for (let fish of result) {
      fish.x = Random.range(SPAWN_X[0], SPAWN_X[1]);
      fish.y = Random.range(SPAWN_Y[0], SPAWN_Y[1]);
      fish.offset = Random.range(SPAWN_OFFSET[0], SPAWN_OFFSET[1]);
      fish.size = Random.range(SIZE[0], SIZE[1]);
      fish.speed = Random.range(SPEED[0], SPEED[1]) * Random.sign();
    }
    return () => {
      FishComponent.destroyAll(result);
      result.length = 0;
    };
  });
}

function useFishUpdater(m, fishes) {
  const DISPLAY = useDisplayPort(m);
  const rippleSystem = useSystemState(m, RippleSystem);

  useUpdate(m, () => {
    const canvasWidth = DISPLAY.width;
    const canvasHeight = DISPLAY.height;
    const now = performance.now();

    for (let fish of fishes) {
      fish.x +=
        (0.2 + (Math.sin(now / 1000 + fish.offset) + 1) / 2) * fish.speed;
      if (fish.x > canvasWidth) {
        fish.x = 0;
        fish.y = Random.range(canvasHeight - 100, canvasHeight);
      }
      if (fish.x < 0) {
        fish.x = canvasWidth;
        fish.y = Random.range(canvasHeight - 100, canvasHeight);
      }
      if (
        Math.floor(now / 10 + fish.y * 10) % 400 === 0 &&
        Math.random() < 0.1
      ) {
        startRipple(rippleSystem.current, fish.x, fish.y - 5, now);
      }
    }
  });
}

function useFishRenderer(m, fishes) {
  const ctx = useFixedGLRenderer(m);
  useRenderPass(m, RENDER_PASS_FISH, (dt) => {
    ctx.setTextureImage(6, FishImage.current);
    ctx.setColor(0x333333);
    for (let fish of fishes) {
      ctx.pushTransform();
      let dt = Math.sin(fish.x / 5 + fish.y);
      let dt2 = Math.cos(fish.x / 20);
      ctx.setTranslation(fish.x, fish.y + dt2 * 4);
      ctx.setOpacityFloat(0.5);
      ctx.setRotation(0, 0, 90 + dt * 4 + (fish.speed < 0 ? 180 : 0));
      ctx.setScale(fish.size, fish.size + ((dt2 + 1) / 2) * 0.1);
      ctx.drawTexturedBox(6, 0, 20);
      ctx.popTransform();
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();
  });
}
