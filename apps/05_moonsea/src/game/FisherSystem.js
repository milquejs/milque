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
  const ctx = useFixedGLRenderer(m);

  let x = canvasWidth - 200;
  let y = canvasHeight - 200;
  m.fishingState = FISHING_STATE.IDLE;
  m.headX = x;
  m.headY = y;
  m.bobX = x;
  m.bobY = y;
  let castingStartTime = 0;
  let castingPowerX = -10;
  let castingPowerY = 10;
  let nibblingStartTime = 0;
  let bitingStartTime = 0;
  let hookedItem = null;

  useUpdate(m, (dt) => {
    const now = performance.now();
    const canvasHeight = display.height;
  
    const fishingY = canvasHeight - 60;

    let headX = m.headX;
    let headY = m.headY;
    let bobX = m.bobX;
    let bobY = m.bobY;
  
    switch (m.fishingState) {
      case FISHING_STATE.IDLE:
        // Do nothing.
        break;
      case FISHING_STATE.POWERING:
        {
          m.bobX = headX;
          m.bobY = headY;
        }
        break;
      case FISHING_STATE.CASTING:
        {
          castingPowerY -= CASTING_GRAVITY;
          let powerX = castingPowerX;
          let powerY = castingPowerY * -1;
          m.bobX += powerX;
          m.bobY += powerY;
          if (m.bobY >= fishingY) {
            m.bobY = fishingY;
            m.fishingState = FISHING_STATE.PLOPPING;
          }
        }
        break;
      case FISHING_STATE.PLOPPING:
        // Create splash and animate.
        // Then move on.
        m.fishingState = FISHING_STATE.BOBBING;
        break;
      case FISHING_STATE.BOBBING:
        // Bob away until bite.
        break;
      case FISHING_STATE.NIBBLING:
        {
          // Nibble away until reel or bob.
          let dt = now - nibblingStartTime;
          if (dt > MAX_NIBBLING_TIME) {
            // Return to bobbing.
            m.fishingState = FISHING_STATE.BOBBING;
          }
        }
        break;
      case FISHING_STATE.BITING:
        {
          // Bite away until reel or bob.
          let dt = now - bitingStartTime;
          let maxTime = getMaxBitingTimeForItem(hookedItem);
          if (dt > maxTime) {
            // Return to bobbing.
            hookedItem = null;
            m.fishingState = FISHING_STATE.BOBBING;
          }
        }
        break;
      case FISHING_STATE.REELING:
        let dx = headX - bobX;
        let dy = headY - bobY;
        if (Math.abs(dx) > REELING_NEAR_RANGE) {
          m.bobX += dx * 0.2;
          m.bobY += dy * 0.2;
        } else {
          m.fishingState = FISHING_STATE.CAUGHT;
          m.bobX = headX;
          m.bobY = headY;
        }
        break;
      case FISHING_STATE.CAUGHT:
        // Animate catching the fish.
        // Then move on.
        m.fishingState = FISHING_STATE.IDLE;
        break;
    }
  
    switch (m.fishingState) {
      case FISHING_STATE.IDLE:
        {
          if (INPUTS.Fish.pressed) {
            m.fishingState = FISHING_STATE.POWERING;
            castingStartTime = now;
          }
        }
        break;
      case FISHING_STATE.POWERING:
        {
          if (INPUTS.Fish.released) {
            let dt = now - castingStartTime;
            let power =
              clamp(dt, MIN_CASTING_POWER, MAX_CASTING_POWER) / MAX_CASTING_POWER;
            castingPowerX = -15 * power;
            castingPowerY = 15 * power;
            m.fishingState = FISHING_STATE.CASTING;
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
            m.fishingState = FISHING_STATE.REELING;
          }
        }
        break;
      case FISHING_STATE.REELING:
      case FISHING_STATE.CAUGHT:
        // No input allowed.
        break;
    }
  });

  useRenderPass(m, RENDER_PASS_PLAYER, () => {
    const now = performance.now();

    // All fishing stuff is above background
    ctx.setDepthFloat(50);

    let fishingState = m.fishingState;
    let bobX = m.bobX;
    let bobY = m.bobY;
    let headX = m.headX;
    let headY = m.headY;

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
        ctx.drawQuadratic(
          headX,
          headY,
          x,
          y,
          clamp(40 - dx / 60, 0, 40)
        );
      }
    }

    // Bobber
    let db = 0;
    if (fishingState === FISHING_STATE.POWERING) {
      let dt = clamp((now - castingStartTime) / MAX_CASTING_POWER, 0, 1);
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

    if (hookedItem) {
      // TODO: Draw a hooked fish!
    }
  });

  return m;
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
