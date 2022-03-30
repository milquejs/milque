import { ComponentClass } from './ComponentClass.js';
import { RENDER_PASS_RIPPLE } from './RenderPasses.js';
import { getSystemContext } from './SystemManager.js';
import { useFixedGLRenderer } from './systems/RenderFixedGLSystem.js';
import { useRenderPass } from './systems/RenderPassSystem.js';
import { useInit, useUpdate } from './systems/UpdateSystem.js';

/**
 * @typedef {import('./renderer/drawcontext/DrawContextFixedGLText.js').DrawContextFixedGLText} DrawContextFixedGLText
 */

/** @typedef {import('./SystemManager.js').SystemContext} SystemContext */

function Ripple() {
  return {
    x: 0, y: 0,
    startTime: 0,
    dead: false,
  };
}
const RippleComponent = new ComponentClass('ripple', Ripple);

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export function RippleSystem(m) {
  /** @type {Array<ReturnType<Ripple>>} */
  let ripples = [];
  m.ripples = ripples;

  useInit(m, () => {
    RippleComponent.createAll(ripples, 10);
    return () => {
      RippleComponent.destroyAll(ripples);
    };
  });

  useUpdate(m, (dt) => {
    for(let ripple of ripples) {
      if (ripple.dead) {
        continue;
      }
      let dr = performance.now() - ripple.startTime;
      if (dr > MAX_RIPPLE_AGE) {
        ripple.dead = true;
      }
    }
  });

  const ctx = useFixedGLRenderer(m);
  useRenderPass(m, RENDER_PASS_RIPPLE, () => {
    let now = performance.now();
    for (let ripple of ripples) {
      if (ripple.dead) {
        continue;
      }
      drawRippleEffect(ctx, ripple.x, ripple.y, ripple.startTime, now, false);
    }
  });
  return /** @type {T&{ ripples: Array<ReturnType<Ripple>> }} */ (m);
}

/**
 * @param {SystemContext} m
 * @param {number} x
 * @param {number} y
 * @param {number} now
 */
export function startRipple(m, x, y, now) {
  let ripples = getSystemContext(m, RippleSystem).ripples;
  let target = null;
  for (let ripple of ripples) {
    if (ripple.dead) {
      target = ripple;
      break;
    }
  }
  if (target) {
    target.x = x;
    target.y = y;
    target.startTime = now;
    target.dead = false;
  }
  return target;
}

const MAX_RIPPLE_AGE = 8_000;
export function drawRippleEffect(ctx, x, y, startTime, now, loop = false) {
  let dt = now - startTime;
  if (loop) {
    // Loop back.
    dt %= MAX_RIPPLE_AGE;
  } else if (dt >= MAX_RIPPLE_AGE) {
    // Already too old :(
    return;
  }

  let dr = 1 - dt / MAX_RIPPLE_AGE;
  let ds = (1 - dr) * 0.9;
  let du = (1 - dr) * 0.5;

  ctx.setColor(0xffffff);
  ctx.setTranslation(x, y, 10);
  ctx.setScale(2 + ds * 2, 0.5 + ds);
  ctx.setOpacityFloat(dr);
  ctx.drawLineCircle();
  ctx.setScale(1 + du * 2, 0.1 + du);
  ctx.drawLineCircle();
  ctx.setOpacityFloat(1);
  ctx.resetTransform();
}
