import { DrawContextFixedGLText } from 'src/renderer/drawcontext/DrawContextFixedGLText.js';
import * as Sky from './Sky.js';
import * as Sea from './Sea.js';
import { AssetRef, bindRefs } from 'src/loader/AssetRef.js';
import { Random } from '@milque/random';
import { ButtonBinding, KeyCodes } from '@milque/input';

document.title = 'Moonsea';

export const ASSETS = {
  FishImage: new AssetRef('image:fish_shadow.png'),
};

export const INPUTS = {
  MoveLeft: new ButtonBinding('moveLeft', [KeyCodes.KEY_A, KeyCodes.ARROW_LEFT]),
  MoveRight: new ButtonBinding('moveRight', [KeyCodes.KEY_D, KeyCodes.ARROW_RIGHT]),
  Fish: new ButtonBinding('fish', [KeyCodes.SPACE]),
};

/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const { display } = game;
  const canvas = display.canvas;
  const ctx = new DrawContextFixedGLText(canvas.getContext('webgl'));
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;

  bindRefs(game.assets, Object.values(ASSETS));
  game.inputs.bindBindings(Object.values(INPUTS));

  await Sky.load(game);
  await Sea.load(game);
  const skyWorld = Sky.init(game);
  const seaWorld = Sea.init(game);

  let fishes = [];
  for(let i = 0; i < 6; ++i) {
    let x = Random.range(0, canvasWidth);
    let y = Random.range(canvasHeight - 100, canvasHeight);
    let offset = Random.range(0, Math.PI * 2);
    fishes.push({
      x, y,
      offset,
      size: Random.range(0.3, 0.5),
      speed: Random.range(1, 3) * Random.sign(),
    });
  }

  let ripples = [];
  for(let i = 0; i < 10; ++i) {
    ripples.push({
      x: 0,
      y: 0,
      age: 0,
    });
  }

  let boat = {
    x: 400,
    y: canvas.height - 100,
  };

  let player = {
    chargeTime: 0,
    fishing: false,
    fishSpotX: 0,
    fishSpotY: 0,
  };

  display.addEventListener('frame', (/** @type {CustomEvent} */ e) => {
    let { deltaTime, now } = e.detail;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    const worldSpeed = 1;
    deltaTime *= worldSpeed;
    now *= worldSpeed;
    game.deltaTime = deltaTime;
    game.now = now;

    // Update
    Sky.update(deltaTime, game, skyWorld);
    Sea.update(deltaTime, game, seaWorld);

    for(let fish of fishes) {
      fish.x += (0.2 + (Math.sin(now / 1000 + fish.offset) + 1) / 2) * fish.speed;
      if (fish.x > canvas.width) {
        fish.x = 0;
        fish.y = Random.range(canvasHeight - 100, canvasHeight);
      }
      if (fish.x < 0) {
        fish.x = canvas.width;
        fish.y = Random.range(canvasHeight - 100, canvasHeight);
      }
      if (Math.floor(now / 10 + fish.y * 10) % 400 === 0
        && Math.random() < 0.1) {
        let target = null;
        for(let ripple of ripples) {
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
    for(let ripple of ripples) {
      if (ripple.age > 0) {
        ripple.age -= deltaTime;
      }
    }

    // Boat
    let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
    boat.x += dx * deltaTime / 10;
    boat.y = canvas.height - 160;

    if (!player.fishing) {
      if (INPUTS.Fish.down) {
        player.chargeTime += deltaTime;
      } else if (INPUTS.Fish.released && player.chargeTime > 0) {
        player.chargeTime = 0;
        player.fishing = true;
      }
      if (player.chargeTime > 0) {
        let ct = player.chargeTime / 10;
        player.fishSpotX = boat.x - ct;
        player.fishSpotY = boat.y + 60 + ct / 4;
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
    for(let fish of fishes) {
      ctx.pushTransform();
      let dt = Math.sin(fish.x / 5 + fish.y);
      let dt2 = Math.cos(fish.x / 20);
      ctx.setTranslation(fish.x, fish.y + (dt2 * 4));
      ctx.setOpacityFloat(0.5);
      ctx.setRotation(0, 0, 90 + dt * 4 + (fish.speed < 0 ? 180 : 0));
      ctx.setScale(fish.size, fish.size + ((dt2 + 1) / 2) * 0.1);
      ctx.drawTexturedBox(6, 0, 20);
      ctx.popTransform();
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();

    ctx.setColor(0xFFFFFF);
    for(let ripple of ripples) {
      if (ripple.age <= 0) continue;
      let dr = ripple.age / 10_000;
      ctx.setTranslation(ripple.x, ripple.y, 10);
      let ds = (1 - dr) * 0.9;
      ctx.setScale(2 + ds * 2, 0.5 + ds);
      ctx.setOpacityFloat(dr);
      ctx.drawLineCircle();
      let dt = (1 - dr) * 0.5;
      ctx.setScale(1 + dt * 2, 0.1 + dt);
      ctx.drawLineCircle();
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();

    // Boat
    ctx.setColor(0xAA00AA);
    let dy = Math.sin(now / 400) * 2;
    let dw = 160;
    let dh = 50;
    ctx.drawBox(boat.x, boat.y + dy, dw, dh);
    ctx.setColor(0x440044);
    ctx.drawRect(boat.x - dw, boat.y + dh - 10 - dy, boat.x + dw, boat.y + dh + 10);
    ctx.resetTransform();

    // Player
    if (player.fishing) {
      ctx.setColor(0x00FFAA);
    } else {
      ctx.setColor(0xFFFFFF);
    }
    ctx.drawCircle(boat.x, boat.y - 80);

    ctx.setColor(0xFFFFFF);
    ctx.drawLineBox(player.fishSpotX, player.fishSpotY);
  });
}
