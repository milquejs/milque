import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import './dialogue/DialogueArea.js';

import { game } from './Game.js';

import { initInputs, INPUTS } from './Inputs.js';
import { ASSETS, initAssets } from './Assets.js';

import { AssetManager } from '@milque/asset';
import { SystemManager } from './SystemManager.js';
import { LoadSystem } from './systems/LoadSystem.js';
import { whenSystemLoaded } from './BaseHooks.js';
import {
  DisplayPortSystem,
  useDisplayPort,
} from './systems/DisplayPortSystem.js';
import {
  RenderFixedGLSystem,
  useFixedGLRenderer,
} from './systems/RenderFixedGLSystem.js';
import { RenderPassSystem, useRenderPass } from './systems/RenderPassSystem.js';
import { UpdateSystem, useUpdate } from './systems/UpdateSystem.js';

import { FishSystem } from './game/FishSystem.js';
import { SkySystem } from './game/SkySystem.js';
import { drawRippleEffect, RippleSystem } from './game/RippleSystem.js';
import { SeaSystem } from './game/SeaSystem.js';
import { FisherSystem } from './game/FisherSystem.js';
import { PlayerSystem } from './game/PlayerSystem.js';

import { Random } from '@milque/random';
import {
  RENDER_PASS_CLEAR,
  RENDER_PASS_FISHER,
  RENDER_PASS_OBJECTS,
  RENDER_PASS_PIER,
  RENDER_PASS_SEA,
  RENDER_PASS_SKY,
} from './RenderPasses.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 * @typedef {import('./SystemManager.js').SystemContext} SystemContext
 */

window.addEventListener('DOMContentLoaded', main);

async function main() {
  await AssetManager.loadAssetPack('res.pack');
  let systemManager = new SystemManager();
  await systemManager.preloadSystems([
    LoadSystem,
    DisplayPortSystem,
    RenderPassSystem,
    RenderFixedGLSystem,
    UpdateSystem,
  ]);

  systemManager
    .addSystem(MainSystem)
    .addSystem(FishSystem)
    .addSystem(RippleSystem)
    .addSystem(SkySystem)
    .addSystem(SeaSystem)
    .addSystem(FisherSystem)
    .addSystem(PlayerSystem);
  await systemManager.initialize();
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export async function MainSystem(m) {
  const g = game();
  const ctx = useFixedGLRenderer(m);
  const display = useDisplayPort(m);

  initInputs(g.inputs);
  await initAssets();

  let musicCtx = {
    progression: 0,
  };

  useUpdate(m, () => {
    let now = performance.now();
    g.inputs.poll(now);
    musicLoop(musicCtx);
  });

  useRenderPass(m, RENDER_PASS_CLEAR, (dt) => {
    ctx.resize();
    ctx.reset();
  });

  useRenderPass(m, RENDER_PASS_SKY - 0.5, () => {
    ctx.setTranslation(0, 0, -10);
    ctx.pushTransform();
  });

  // RENDER_PASS_SEA AND SKY

  useRenderPass(m, RENDER_PASS_SEA + 0.5, () => {
    ctx.popTransform();
  });

  useRenderPass(m, RENDER_PASS_PIER, (dt) => {
    let canvasWidth = display.width;
    let canvasHeight = display.height;
    const worldSpeed = INPUTS.FastForward.down ? 30 : 1;
    let now = performance.now() * worldSpeed;

    // Pier Shadow
    ctx.setTranslation(canvasWidth - 50, canvasHeight - 110);
    ctx.setScale(20, 3);
    ctx.setColor(0x333333);
    ctx.setOpacityFloat(0.3);
    ctx.drawCircle();
    ctx.setOpacityFloat(1);
    ctx.resetTransform();

    // Pier Leg Ripples
    ctx.setColor(0xffffff);
    drawRippleEffect(
      ctx,
      canvasWidth - 180,
      canvasHeight - 113,
      3_000,
      now,
      true
    );
    drawRippleEffect(
      ctx,
      canvasWidth - 100,
      canvasHeight - 92,
      5_000,
      now,
      true
    );

    // Pier
    ctx.setTranslation(0, 0, 20);
    {
      ctx.setColor(0x99775a);
      ctx.setTextureImage(8, ASSETS.PierLegImage.current);
      ctx.drawTexturedBox(8, canvasWidth - 100, canvasHeight - 110, 10, 20);
      ctx.drawTexturedBox(
        8,
        canvasWidth - 180,
        canvasHeight - 120,
        8,
        10,
        0,
        30
      );
      ctx.setTextureImage(7, ASSETS.PierImage.current);
      ctx.drawTexturedRect(
        7,
        canvasWidth - ASSETS.PierImage.current.width,
        canvasHeight - 140,
        canvasWidth,
        canvasHeight - 100
      );
    }
    ctx.resetTransform();
  });

  useRenderPass(m, RENDER_PASS_OBJECTS, (dt) => {
    let canvasWidth = display.width;
    let canvasHeight = display.height;

    // Objects
    ctx.setTranslation(0, 0, 30);

    // Bucket
    ctx.setTextureImage(9, ASSETS.BucketImage.current);
    ctx.setColor(0xc3d3d8);
    ctx.drawTexturedBox(9, canvasWidth - 140, canvasHeight - 140, 15);
  });

  useRenderPass(m, RENDER_PASS_FISHER + 0.5, () => {
    ctx.resetTransform();
  });

  return m;
}

function musicLoop(ctx) {
  if (!ASSETS.MusicBack.current.isPlaying()) {
    ASSETS.MusicBack.current.setGain(0.4).play();
    if (
      !ASSETS.MusicLayer1.current.isPlaying() &&
      !ASSETS.MusicLayer2.current.isPlaying()
    ) {
      let delta = Random.rangeInt(4, 6);
      ctx.progression += delta;

      if (ctx.progression < 8 && Random.next() < ctx.progression / 10) {
        ASSETS.MusicLayer1.current.setGain(0.6).play();
        ctx.progression += Random.rangeInt(-4, 4);
      } else if (ctx.progression > 8) {
        ASSETS.MusicLayer2.current.setGain(0.6).play();
        ctx.progression /= 2;
      }
    }
  }
}
