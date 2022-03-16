import { clamp } from '@milque/util';
import { INPUTS } from './Inputs.js';
import { drawRippleEffect } from './Ripple.js';
import { loadAssetRefs } from './loader/AssetHelper.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('./main.js').Game} Game
 */

export const ASSETS = {};

/** @param {Game} game */
export async function load(game) {
  await loadAssetRefs(Object.values(ASSETS));
}

const REELING_NEAR_RANGE = 4;
const CASTING_GRAVITY = 0.6;
const MAX_CASTING_POWER = 800;
const MIN_CASTING_POWER = 100;
const MAX_NIBBLING_TIME = 1000;
export const FISHING_STATE = {
  IDLE: 0,
  POWERING: 1,
  CASTING: 2,
  PLOPPING: 3,
  BOBBING: 4,
  NIBBLING: 5,
  BITING: 6,
  REELING: 7,
  CAUGHT: 8,
};

/** @param {Game} game */
export function init(game) {
  const { display } = game;
  const canvas = display.canvas;
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;

  let x = canvasWidth - 200;
  let y = canvasHeight - 200;
  return {
    fishingState: FISHING_STATE.IDLE,
    headX: x,
    headY: y,
    bobX: x,
    bobY: y,
    castingStartTime: 0,
    castingPowerX: -10,
    castingPowerY: 10,
    nibblingStartTime: 0,
    bitingStartTime: 0,
    hookedItem: null,
  };
}

function getMaxBitingTimeForItem(item) {
  return 2_000;
}

/**
 * @param {number} dt
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
export function update(dt, game, world) {
  const deltaTime = dt;
  const canvas = game.display.canvas;
  const canvasWidth = game.display.width;
  const canvasHeight = game.display.height;

  const fishingY = canvasHeight - 60;

  switch (world.fishingState) {
    case FISHING_STATE.IDLE:
      // Do nothing.
      break;
    case FISHING_STATE.POWERING:
      {
        world.bobX = world.headX;
        world.bobY = world.headY;
      }
      break;
    case FISHING_STATE.CASTING:
      {
        world.castingPowerY -= CASTING_GRAVITY;
        let powerX = world.castingPowerX;
        let powerY = world.castingPowerY * -1;
        world.bobX += powerX;
        world.bobY += powerY;
        if (world.bobY >= fishingY) {
          world.bobY = fishingY;
          world.fishingState = FISHING_STATE.PLOPPING;
        }
      }
      break;
    case FISHING_STATE.PLOPPING:
      // Create splash and animate.
      // Then move on.
      world.fishingState = FISHING_STATE.BOBBING;
      break;
    case FISHING_STATE.BOBBING:
      // Bob away until bite.
      break;
    case FISHING_STATE.NIBBLING:
      {
        // Nibble away until reel or bob.
        let dt = game.now - world.nibblingStartTime;
        if (dt > MAX_NIBBLING_TIME) {
          // Return to bobbing.
          world.fishingState = FISHING_STATE.BOBBING;
        }
      }
      break;
    case FISHING_STATE.BITING:
      {
        // Bite away until reel or bob.
        let dt = game.now - world.bitingStartTime;
        let maxTime = getMaxBitingTimeForItem(world.hookedItem);
        if (dt > maxTime) {
          // Return to bobbing.
          world.hookedItem = null;
          world.fishingState = FISHING_STATE.BOBBING;
        }
      }
      break;
    case FISHING_STATE.REELING:
      let dx = world.headX - world.bobX;
      let dy = world.headY - world.bobY;
      if (Math.abs(dx) > REELING_NEAR_RANGE) {
        world.bobX += dx * 0.2;
        world.bobY += dy * 0.2;
      } else {
        world.fishingState = FISHING_STATE.CAUGHT;
        world.bobX = world.headX;
        world.bobY = world.headY;
      }
      break;
    case FISHING_STATE.CAUGHT:
      // Animate catching the fish.
      // Then move on.
      world.fishingState = FISHING_STATE.IDLE;
      break;
  }

  input(game, world);
}

/**
 * @param {Game} game
 * @param {ReturnType<init>} world
 */
function input(game, world) {
  switch (world.fishingState) {
    case FISHING_STATE.IDLE:
      {
        if (INPUTS.Fish.pressed) {
          world.fishingState = FISHING_STATE.POWERING;
          world.castingStartTime = game.now;
        }
      }
      break;
    case FISHING_STATE.POWERING:
      {
        if (INPUTS.Fish.released) {
          let dt = game.now - world.castingStartTime;
          let power =
            clamp(dt, MIN_CASTING_POWER, MAX_CASTING_POWER) / MAX_CASTING_POWER;
          world.castingPowerX = -15 * power;
          world.castingPowerY = 15 * power;
          world.fishingState = FISHING_STATE.CASTING;
        }
      }
      break;
    case FISHING_STATE.CASTING:
    case FISHING_STATE.PLOPPING:
    case FISHING_STATE.BOBBING:
    case FISHING_STATE.NIBBLING:
    case FISHING_STATE.BITING:
      {
        if (INPUTS.Fish.pressed) {
          world.fishingState = FISHING_STATE.REELING;
        }
      }
      break;
    case FISHING_STATE.REELING:
    case FISHING_STATE.CAUGHT:
      // No input allowed.
      break;
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

  // All fishing stuff is above background
  ctx.setDepthFloat(50);

  if (world.fishingState === FISHING_STATE.IDLE) {
    // Don't render anything if idle.
    return;
  }

  // Calculate info
  let x = world.bobX;
  let y = world.bobY;
  let bobAlpha = 1;
  if (world.fishingState === FISHING_STATE.BOBBING) {
    let dt = Math.sin(now / 500);
    y += 2 - dt * 2;
    bobAlpha = clamp((dt + 1) * 0.5, 0.5, 1);
  }

  // Fishing Line
  let dx = Math.max(x, world.headX) - Math.min(x, world.headX);
  ctx.setColor(0x000000);
  if (dx > 4) {
    if (world.fishingState === FISHING_STATE.REELING) {
      ctx.drawLine(world.headX, world.headY, x, y);
    } else {
      ctx.drawQuadratic(
        world.headX,
        world.headY,
        x,
        y,
        clamp(40 - dx / 60, 0, 40)
      );
    }
  }

  // Bobber
  let db = 0;
  if (world.fishingState === FISHING_STATE.POWERING) {
    let dt = clamp((now - world.castingStartTime) / MAX_CASTING_POWER, 0, 1);
    db = dt * 20;
  }
  ctx.setOpacityFloat(bobAlpha);
  ctx.setColor(0xffffff);
  ctx.drawCircle(x + db, y + db / 2);
  ctx.setColor(0xff0000);
  ctx.drawHalfCircle(x + db, y + db / 2);
  ctx.setOpacityFloat(1);

  if (world.fishingState === FISHING_STATE.BOBBING) {
    // Bobber Ripple
    ctx.setColor(0xffffff);
    ctx.setTranslation(0, 0, 50);
    ctx.pushTransform();
    drawRippleEffect(ctx, x, world.bobY, 0, now, true);
    ctx.popTransform();
    ctx.resetTransform();
  }

  if (world.hookedItem) {
    // TODO: Draw a hooked fish!
  }
}

/**
 * @param {ReturnType<init>} fisher
 */
export function startNibbling(fisher, worldTime) {
  if (fisher.fishingState !== FISHING_STATE.BOBBING) {
    return;
  }
  fisher.fishingState = FISHING_STATE.NIBBLING;
  fisher.nibblingStartTime = worldTime;
}

/**
 * @param {ReturnType<init>} fisher
 */
export function startBiting(fisher, worldTime) {
  if (
    fisher.fishingState !== FISHING_STATE.BOBBING &&
    fisher.fishingState !== FISHING_STATE.NIBBLING
  ) {
    return;
  }
  fisher.fishingState = FISHING_STATE.BITING;
  fisher.bitingStartTime = worldTime;
}
