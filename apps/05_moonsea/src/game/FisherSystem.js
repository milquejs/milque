import { clamp } from '@milque/util';
import { INPUTS } from '../Inputs.js';
import { drawRippleEffect } from './RippleSystem.js';
import { useUpdate } from '../systems/UpdateSystem.js';
import { useFixedGLRenderer } from '../systems/RenderFixedGLSystem.js';
import { useDisplayPort } from '../systems/DisplayPortSystem.js';
import { useRenderPass } from '../systems/RenderPassSystem.js';
import { RENDER_PASS_PLAYER } from '../RenderPasses.js';

/**
 * @typedef {import('../renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 */

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

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export function FisherSystem(m) {
  const display = useDisplayPort(m);
  const canvasWidth = display.width;
  const canvasHeight = display.height;

  const x = canvasWidth - 200;
  const y = canvasHeight - 200;
  const state = {
    fishingState: FISHING_STATE.IDLE,
    headX: x,
    headY: y,
    bobX: x,
    bobY: y,
    hookedItem: null,
    castingStartTime: 0,
    castingPowerX: -10,
    castingPowerY: 10,
    nibblingStartTime: 0,
    bitingStartTime: 0,
  };

  useFisherUpdate(m, state);
  useFisherRenderer(m, state);

  return state;
}

/**
 * @param {SystemContext} m
 * @param {ReturnType<FisherSystem>} state
 */
function useFisherUpdate(m, state) {
  const display = useDisplayPort(m);
  useUpdate(m, (dt) => {
    const now = performance.now();
    const canvasHeight = display.height;

    const fishingY = canvasHeight - 60;

    let headX = state.headX;
    let headY = state.headY;
    let bobX = state.bobX;
    let bobY = state.bobY;

    switch (state.fishingState) {
      case FISHING_STATE.IDLE:
        // Do nothing.
        break;
      case FISHING_STATE.POWERING:
        {
          state.bobX = headX;
          state.bobY = headY;
        }
        break;
      case FISHING_STATE.CASTING:
        {
          state.castingPowerY -= CASTING_GRAVITY;
          let powerX = state.castingPowerX;
          let powerY = state.castingPowerY * -1;
          state.bobX += powerX;
          state.bobY += powerY;
          if (state.bobY >= fishingY) {
            state.bobY = fishingY;
            state.fishingState = FISHING_STATE.PLOPPING;
          }
        }
        break;
      case FISHING_STATE.PLOPPING:
        // Create splash and animate.
        // Then move on.
        state.fishingState = FISHING_STATE.BOBBING;
        break;
      case FISHING_STATE.BOBBING:
        // Bob away until bite.
        break;
      case FISHING_STATE.NIBBLING:
        {
          // Nibble away until reel or bob.
          let dt = now - state.nibblingStartTime;
          if (dt > MAX_NIBBLING_TIME) {
            // Return to bobbing.
            state.fishingState = FISHING_STATE.BOBBING;
          }
        }
        break;
      case FISHING_STATE.BITING:
        {
          // Bite away until reel or bob.
          let dt = now - state.bitingStartTime;
          let maxTime = getMaxBitingTimeForItem(state.hookedItem);
          if (dt > maxTime) {
            // Return to bobbing.
            state.hookedItem = null;
            state.fishingState = FISHING_STATE.BOBBING;
          }
        }
        break;
      case FISHING_STATE.REELING:
        let dx = headX - bobX;
        let dy = headY - bobY;
        if (Math.abs(dx) > REELING_NEAR_RANGE) {
          state.bobX += dx * 0.2;
          state.bobY += dy * 0.2;
        } else {
          state.fishingState = FISHING_STATE.CAUGHT;
          state.bobX = headX;
          state.bobY = headY;
        }
        break;
      case FISHING_STATE.CAUGHT:
        // Animate catching the fish.
        // Then move on.
        state.fishingState = FISHING_STATE.IDLE;
        break;
    }

    switch (state.fishingState) {
      case FISHING_STATE.IDLE:
        {
          if (INPUTS.Fish.pressed) {
            state.fishingState = FISHING_STATE.POWERING;
            state.castingStartTime = now;
          }
        }
        break;
      case FISHING_STATE.POWERING:
        {
          if (INPUTS.Fish.released) {
            let dt = now - state.castingStartTime;
            let power =
              clamp(dt, MIN_CASTING_POWER, MAX_CASTING_POWER) /
              MAX_CASTING_POWER;
            state.castingPowerX = -15 * power;
            state.castingPowerY = 15 * power;
            state.fishingState = FISHING_STATE.CASTING;
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
            state.fishingState = FISHING_STATE.REELING;
          }
        }
        break;
      case FISHING_STATE.REELING:
      case FISHING_STATE.CAUGHT:
        // No input allowed.
        break;
    }
  });
}

/**
 * @param {SystemContext} m
 * @param {ReturnType<FisherSystem>} state
 */
function useFisherRenderer(m, state) {
  const ctx = useFixedGLRenderer(m);
  useRenderPass(m, RENDER_PASS_PLAYER, () => {
    const now = performance.now();

    // All fishing stuff is above background
    ctx.setDepthFloat(50);

    let fishingState = state.fishingState;
    let bobX = state.bobX;
    let bobY = state.bobY;
    let headX = state.headX;
    let headY = state.headY;

    if (fishingState === FISHING_STATE.IDLE) {
      // Don't render anything if idle.
      return;
    }

    // Calculate info
    let x = bobX;
    let y = bobY;
    let bobAlpha = 1;
    if (fishingState === FISHING_STATE.BOBBING) {
      let dt = Math.sin(now / 500);
      y += 2 - dt * 2;
      bobAlpha = clamp((dt + 1) * 0.5, 0.5, 1);
    }

    // Fishing Line
    let dx = Math.max(x, headX) - Math.min(x, headX);
    ctx.setColor(0x000000);
    if (dx > 4) {
      if (fishingState === FISHING_STATE.REELING) {
        ctx.drawLine(headX, headY, x, y);
      } else {
        ctx.drawQuadratic(headX, headY, x, y, clamp(40 - dx / 60, 0, 40));
      }
    }

    // Bobber
    let db = 0;
    if (fishingState === FISHING_STATE.POWERING) {
      let dt = clamp((now - state.castingStartTime) / MAX_CASTING_POWER, 0, 1);
      db = dt * 20;
    }
    ctx.setOpacityFloat(bobAlpha);
    ctx.setColor(0xffffff);
    ctx.drawCircle(x + db, y + db / 2);
    ctx.setColor(0xff0000);
    ctx.drawHalfCircle(x + db, y + db / 2);
    ctx.setOpacityFloat(1);

    if (fishingState === FISHING_STATE.BOBBING) {
      // Bobber Ripple
      ctx.setColor(0xffffff);
      ctx.setTranslation(0, 0, 50);
      ctx.pushTransform();
      drawRippleEffect(ctx, x, bobY, 0, now, true);
      ctx.popTransform();
      ctx.resetTransform();
    }

    if (state.hookedItem) {
      // TODO: Draw a hooked fish!
    }
  });
}

function getMaxBitingTimeForItem(item) {
  return 2_000;
}

export function startNibbling(fisher, worldTime) {
  if (fisher.fishingState !== FISHING_STATE.BOBBING) {
    return;
  }
  fisher.fishingState = FISHING_STATE.NIBBLING;
  fisher.nibblingStartTime = worldTime;
}

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
