import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import './dialogue/DialogueArea.js';

import { Random } from '@milque/random';

import { initInputs, INPUTS } from './Inputs.js';
import { ASSETS, initAssets } from './Assets.js';

import { DrawContextFixedGLText } from './renderer/drawcontext/DrawContextFixedGLText.js';
import * as Sky from './Sky.js';
import * as Sea from './Sea.js';
import * as Fisher from './Fisher.js';
import { drawRipple } from './Ripple.js';

/**
 * @typedef {import('@milque/asset').AssetPack} AssetPack
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

/**
 * @typedef Game
 * @property {DisplayPort} display
 * @property {AssetPack} assets
 * @property {InputContext} inputs
 * @property {number} deltaTime
 * @property {number} now
 */

window.addEventListener('DOMContentLoaded', main);
async function main() {
  /** @type {DisplayPort} */
  const display = document.querySelector('#display');
  /** @type {InputContext} */
  const inputs = document.querySelector('#inputs').getContext('axisbutton');
  /** @type {AssetPack} */
  const assets = document.querySelector('#assets');
  let promise = new Promise((resolve, reject) => {
    assets.addEventListener('load', resolve);
    assets.addEventListener('error', reject);
  });
  assets.src = 'res.pack';
  await promise;

  await start({ display, inputs, assets, deltaTime: 0, now: 0 });
}

/**
 * @param {Game} game
 */
async function start(game) {
  const { display } = game;
  const canvas = display.canvas;
  const ctx = new DrawContextFixedGLText(canvas.getContext('webgl'));
  let canvasWidth = display.width;
  let canvasHeight = display.height;

  initInputs(game.inputs);
  await initAssets(game.assets);

  await Sky.load(game);
  await Sea.load(game);
  await Fisher.load(game);
  const skyWorld = Sky.init(game);
  const seaWorld = Sea.init(game);
  const fisher = Fisher.init(game);

  let fishes = [];
  for (let i = 0; i < 6; ++i) {
    let x = Random.range(0, canvasWidth);
    let y = Random.range(canvasHeight - 100, canvasHeight);
    let offset = Random.range(0, Math.PI * 2);
    fishes.push({
      x,
      y,
      offset,
      size: Random.range(0.3, 0.5),
      speed: Random.range(1, 3) * Random.sign(),
    });
  }

  let ripples = [];
  for (let i = 0; i < 10; ++i) {
    ripples.push({
      x: 0,
      y: 0,
      age: 0,
    });
  }

  let player = {
    x: canvasWidth - 100,
    y: 0,
    motionX: 0,
  };

  let musicCtx = {
    progression: 0,
  };

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    let { deltaTime, now } = e.detail;
    canvasWidth = game.display.width;
    canvasHeight = game.display.height;

    game.inputs.poll(now);
    musicLoop(musicCtx);

    const worldSpeed = INPUTS.FastForward.down ? 30 : 1;
    deltaTime *= worldSpeed;
    now *= worldSpeed;
    game.deltaTime = deltaTime;
    game.now = now;

    // Update
    Sky.update(deltaTime, game, skyWorld);
    Sea.update(deltaTime, game, seaWorld);
    Fisher.update(deltaTime, game, fisher);

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
        let target = null;
        for (let ripple of ripples) {
          if (ripple.age <= 0) {
            target = ripple;
          }
        }
        if (target) {
          target.x = fish.x;
          target.y = fish.y;
          target.age = Random.range(5_000, 10_000);
        }
      }
    }
    for (let ripple of ripples) {
      if (ripple.age > 0) {
        ripple.age -= deltaTime;
      }
    }

    // Player
    let friction = 0.4;
    let invFriction = 1 - friction;
    let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
    player.motionX += (dx * deltaTime) * 0.1;
    player.motionX *= invFriction;
    player.x += player.motionX;
    player.y = canvasHeight - 200;
    fisher.headX = player.x;
    fisher.headY = player.y;
    if (fisher.fishingState === Fisher.FISHING_STATE.IDLE
      || fisher.fishingState === Fisher.FISHING_STATE.POWERING) {
      fisher.bobX = player.x;
      fisher.bobY - player.y;
    }
    if (player.x > canvasWidth - 10) {
      player.x = canvasWidth - 10;
    } else if (player.x < canvasWidth - 130) {
      player.x = canvasWidth - 130;
    }

    // Draw
    ctx.resize();
    ctx.reset();

    ctx.setTranslation(0, 0, -10);
    ctx.pushTransform();
    {
      Sky.render(ctx, game, skyWorld);
      Sea.render(ctx, game, seaWorld);
    }
    ctx.popTransform();

    ctx.setTextureImage(6, ASSETS.FishImage.current);
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

    for (let ripple of ripples) {
      if (ripple.age <= 0) continue;
      drawRipple(ctx, ripple.x, ripple.y, ripple.age);
    }

    // Pier Shadow
    ctx.setTranslation(canvasWidth - 50, canvasHeight - 110)
    ctx.setScale(20, 3);
    ctx.setColor(0x333333);
    ctx.setOpacityFloat(0.3);
    ctx.drawCircle();
    ctx.setOpacityFloat(1);
    ctx.resetTransform();

    // Pier Leg Ripples
    ctx.setColor(0xffffff);
    let rippleProgress = Math.sin(now / 800) * 2_000 + 3_000;
    let rippleProgressAlt = Math.cos(now / 800) * 2_000 + 3_000;
    drawRipple(ctx, canvasWidth - 180, canvasHeight - 113, rippleProgress);
    drawRipple(ctx, canvasWidth - 100, canvasHeight - 92, rippleProgressAlt);

    // Pier
    ctx.setTranslation(0, 0, 20);
    {
      ctx.setColor(0x99775a);
      ctx.setTextureImage(8, ASSETS.PierLegImage.current);
      ctx.drawTexturedBox(8, canvasWidth - 100, canvasHeight - 110, 10, 20);
      ctx.drawTexturedBox(8, canvasWidth - 180, canvasHeight - 120, 8, 10, 0, 30);
      ctx.setTextureImage(7, ASSETS.PierImage.current);
      ctx.drawTexturedRect(7, canvasWidth - ASSETS.PierImage.current.width, canvasHeight - 140, canvasWidth, canvasHeight - 100);
    }
    ctx.resetTransform();

    // Objects
    ctx.setTranslation(0, 0, 30);
    {
      // Bucket
      ctx.setTextureImage(9, ASSETS.BucketImage.current);
      ctx.setColor(0xc3d3d8);
      ctx.drawTexturedBox(9, canvasWidth - 140, canvasHeight - 140, 15);

      // Player
      ctx.setColor(0x00ffaa);
      ctx.drawCircle(player.x, player.y);
  
      // Player Shadow
      ctx.pushTransform();
      {
        ctx.setTranslation(player.x, player.y + 75);
        ctx.setScale(3, 1);
        ctx.setColor(0x333333);
        ctx.setOpacityFloat(0.3);
        ctx.drawCircle();
        ctx.setOpacityFloat(1);
      }
      ctx.popTransform();
      
      // Fisher stuff
      Fisher.render(ctx, game, fisher);
    }
    ctx.resetTransform();
  });
}

function musicLoop(ctx) {
  if (!ASSETS.MusicBack.current.isPlaying()) {
    ASSETS.MusicBack.current.setGain(0.4).play();
    if (!ASSETS.MusicLayer1.current.isPlaying() && !ASSETS.MusicLayer2.current.isPlaying()) {
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
