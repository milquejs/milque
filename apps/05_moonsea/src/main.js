import { DisplayPort } from '@milque/display';
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
import * as Fish from './Fish.js';
import * as Ripple from './Ripple.js';
import * as Player from './Player.js';
import { game } from './Game.js';

/**
 * @typedef {import('@milque/input').InputContext} InputContext
 * @typedef {ReturnType<import('./Game.js').game>} Game
 */

DisplayPort.define();
window.addEventListener('DOMContentLoaded', main);
async function main() {
  const g = game();
  await start(g);
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
  await Fish.load(game);
  await Ripple.load(game);
  await Player.load(game);
  const skyWorld = Sky.init(game);
  const seaWorld = Sea.init(game);
  const fisher = Fisher.init(game);
  const rippleWorld = Ripple.init(game);
  const fishWorld = Fish.init(game);
  const player = Player.init(game);

  let musicCtx = {
    progression: 0,
  };

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    let { deltaTime, now } = e.detail;
    canvasWidth = game.display.width;
    canvasHeight = game.display.height;

    game.inputs.poll(now);
    musicLoop(musicCtx);

    const worldSpeed = INPUTS.FastForward.current.down ? 30 : 1;
    deltaTime *= worldSpeed;
    now *= worldSpeed;
    game.deltaTime = deltaTime;
    game.now = now;

    // Update
    Sky.update(deltaTime, game, skyWorld);
    Sea.update(deltaTime, game, seaWorld);
    Fisher.update(deltaTime, game, fisher);
    Ripple.update(deltaTime, game, rippleWorld);
    Fish.update(deltaTime, game, fishWorld, rippleWorld);
    Player.update(deltaTime, game, player, fisher);

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

    Fish.render(ctx, game, fishWorld);
    Ripple.render(ctx, game, rippleWorld);

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
    Ripple.drawRippleEffect(
      ctx,
      canvasWidth - 180,
      canvasHeight - 113,
      3_000,
      now,
      true
    );
    Ripple.drawRippleEffect(
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

    // Objects
    ctx.setTranslation(0, 0, 30);
    {
      // Bucket
      ctx.setTextureImage(9, ASSETS.BucketImage.current);
      ctx.setColor(0xc3d3d8);
      ctx.drawTexturedBox(9, canvasWidth - 140, canvasHeight - 140, 15);

      // Player stuff
      Player.render(ctx, game, player);
      // Fisher stuff
      Fisher.render(ctx, game, fisher);
    }
    ctx.resetTransform();
  });
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
