import '@milque/display';
import '@milque/input';
import '@milque/asset';
import './error.js';

import { DrawContextFixedGLText } from './renderer/drawcontext/DrawContextFixedGLText.js';
import * as Sky from './Sky.js';
import * as Sea from './Sea.js';
import { AssetRef, bindRefs, loadRefs } from './loader/AssetRef.js';
import { Random } from '@milque/random';
import { ButtonBinding, KeyCodes } from '@milque/input';
import { loadImage } from './loader/ImageLoader.js';
import { hex } from './renderer/color.js';

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

export const ASSETS = {
  FishImage: new AssetRef('fish_shadow.png', 'res/fish_shadow.png', loadImage),
  CanoeImage: new AssetRef('canoe.png', 'res/canoe.png', loadImage),
};

export const INPUTS = {
  MoveLeft: new ButtonBinding('moveLeft', [
    KeyCodes.KEY_A,
    KeyCodes.ARROW_LEFT,
  ]),
  MoveRight: new ButtonBinding('moveRight', [
    KeyCodes.KEY_D,
    KeyCodes.ARROW_RIGHT,
  ]),
  Fish: new ButtonBinding('fish', [KeyCodes.SPACE]),
};

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

  bindRefs(game.assets, Object.values(ASSETS));
  await loadRefs(Object.values(ASSETS));
  game.inputs.bindBindings(Object.values(INPUTS));

  await Sky.load(game);
  await Sea.load(game);
  const skyWorld = Sky.init(game);
  const seaWorld = Sea.init(game);

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

  let boat = {
    x: canvas.width + 100,
    y: canvas.height - 100,
  };

  let player = {
    chargeTime: 0,
    fishing: false,
    fishSpotX: boat.x,
    fishSpotY: boat.y,
    casting: false,
    chargeX: 0,
    chargeY: 0,
    chargeMotionX: 0,
    chargeMotionY: 0,
  };

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    let { deltaTime, now } = e.detail;
    canvasWidth = game.display.width;
    canvasHeight = game.display.height;

    game.inputs.poll(now);

    const worldSpeed = 1;
    deltaTime *= worldSpeed;
    now *= worldSpeed;
    game.deltaTime = deltaTime;
    game.now = now;

    // Update
    Sky.update(deltaTime, game, skyWorld);
    Sea.update(deltaTime, game, seaWorld);

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

    // Boat
    let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
    boat.x += (dx * deltaTime) / 10;
    boat.y = canvas.height - 160;

    if (!player.fishing) {
      if (INPUTS.Fish.down) {
        player.chargeTime += deltaTime + player.chargeTime / 4;
        if (player.chargeTime > 4000) {
          player.chargeTime = 4000;
        }
      } else if (INPUTS.Fish.released && player.chargeTime > 0) {
        player.chargeTime = 0;
        player.fishing = true;
      }
      if (player.chargeTime > 0) {
        let ct = player.chargeTime / 10;
        player.fishSpotX = boat.x - ct;
        player.fishSpotY = boat.y + 20 + ct / 4;
        player.chargeMotionY = -ct / 100;
        player.chargeMotionX = -ct / 100;
        player.chargeX = boat.x;
        player.chargeY = boat.y;
        player.casting = true;
      }
    } else {
      if (INPUTS.Fish.pressed) {
        player.fishing = false;
      }
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

    // Boat
    ctx.setColor(0x725842);
    let dy = Math.sin(now / 400) * 2;
    let dw = 100;
    let dh = 20;
    let dr = Math.cos(now / 300);
    ctx.setRotation(0, 0, dr);
    ctx.setTranslation(boat.x, boat.y + dy);
    ctx.setTextureImage(7, ASSETS.CanoeImage.current);
    ctx.drawTexturedBox(7, 0, 0, dw, dh);
    ctx.resetTransform();
    ctx.setColor(0x4f3b2a);
    ctx.drawRect(
      boat.x - dw + 10,
      boat.y + dh - 10 - dy,
      boat.x + dw - 10,
      boat.y + dh + 2
    );
    ctx.resetTransform();

    // Player
    if (player.fishing) {
      ctx.setColor(0x00ffaa);
    } else {
      ctx.setColor(0xffffff);
    }
    ctx.drawCircle(boat.x, boat.y - 15);

    // Fishing rod
    if (player.casting) {
      if (player.chargeY > player.fishSpotY) {
        player.fishSpotX = player.chargeX;
        player.fishSpotY = player.chargeY;
        player.casting = false;
      } else {
        player.chargeMotionY += 0.4;
        player.chargeX += player.chargeMotionX;
        player.chargeY += player.chargeMotionY;
  
        let x = player.chargeX;
        let y = player.chargeY;
  
        // Fishing Line
        ctx.setColor(0x000000);
        ctx.drawLine(boat.x, boat.y, x, y);
  
        // Bauble
        ctx.setColor(0xFF0000);
        ctx.drawCircle(x, y);
        ctx.setColor(0xFFFFFF);
        ctx.drawBox(x, y, 8, 2);
      }
    } else if (player.fishing) {
      let bob = Math.sin(now / 400);
      let bobRatio = (bob + 1) / 2;
      let spotX = player.fishSpotX;
      let spotY = player.fishSpotY + bob;

      // Ripple?
      if (bob > 0) {
        // drawRipple(ctx, spotX, spotY, bob);
      }
  
      // Fishing Line
      ctx.setColor(0x000000);
      ctx.drawLine(boat.x, boat.y, spotX, spotY);
  
      // Bauble
      ctx.setColor(hex.mix(0xFF0000, 0xAA0000, bobRatio));
      ctx.drawCircle(spotX, spotY);
      ctx.setColor(hex.mix(0xFFFFFF, 0xAAAAAA, bobRatio));
      ctx.drawBox(spotX, spotY, 8, 2);
    }
  });
}

function drawRipple(ctx, x, y, age) {
  if (age <= 0) return;
  ctx.setColor(0xffffff);
  let dr = age / 10_000;
  ctx.setTranslation(x, y, 10);
  let ds = (1 - dr) * 0.9;
  ctx.setScale(2 + ds * 2, 0.5 + ds);
  ctx.setOpacityFloat(dr);
  ctx.drawLineCircle();
  let dt = (1 - dr) * 0.5;
  ctx.setScale(1 + dt * 2, 0.1 + dt);
  ctx.drawLineCircle();
  ctx.setOpacityFloat(1);
  ctx.resetTransform();
}