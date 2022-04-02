import { ComponentClass } from '../ComponentClass.js';
import { FisherSystem, FISHING_STATE } from './FisherSystem.js';
import { INPUTS } from '../Inputs.js';
import { RENDER_PASS_PLAYER } from '../RenderPasses.js';
import { getSystemState } from '../SystemManager.js';
import { useDisplayPort } from '../systems/DisplayPortSystem.js';
import { useFixedGLRenderer } from '../systems/RenderFixedGLSystem.js';
import { useRenderPass } from '../systems/RenderPassSystem.js';
import { useInit, useUpdate } from '../systems/UpdateSystem.js';

const PlayerComponent = new ComponentClass('player', () => {
  return {
    x: 0, y: 0,
    motionX: 0,
  };
});

export function PlayerSystem(m) {
  const state = usePlayerInit(m);
  usePlayerUpdate(m, state);
  usePlayerRender(m, state);
  return state;
}

function usePlayerInit(m) {
  const display = useDisplayPort(m);
  const state = {
    player: null,
  };
  useInit(m, () => {
    const canvasWidth = display.width;
    let player = PlayerComponent.create();
    state.player = player;
    player.x = canvasWidth - 100;
    return () => {
      PlayerComponent.destroy(player);
    };
  });
  return state;
}

function usePlayerUpdate(m, state) {
  const display = useDisplayPort(m);
  useUpdate(m, (dt) => {
    const player = state.player;
    if (!player) {
      return;
    }
    const canvasWidth = display.width;
    const canvasHeight = display.height;

    let friction = 0.4;
    let invFriction = 1 - friction;
    let dx = INPUTS.MoveRight.value - INPUTS.MoveLeft.value;
    player.motionX += dx * dt * 0.1;
    player.motionX *= invFriction;
    player.x += player.motionX;
    player.y = canvasHeight - 200;

    let fisher = getSystemState(m, FisherSystem);
    fisher.headX = player.x;
    fisher.headY = player.y;
    if (
      fisher.fishingState === FISHING_STATE.IDLE ||
      fisher.fishingState === FISHING_STATE.POWERING
    ) {
      fisher.bobX = player.x;
      fisher.bobY - player.y;
    }
    if (player.x > canvasWidth - 10) {
      player.x = canvasWidth - 10;
    } else if (player.x < canvasWidth - 130) {
      player.x = canvasWidth - 130;
    }
  });
}

function usePlayerRender(m, state) {
  const ctx = useFixedGLRenderer(m);
  useRenderPass(m, RENDER_PASS_PLAYER, () => {
    const player = state.player;
    if (!player) {
      return;
    }

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
  });
}