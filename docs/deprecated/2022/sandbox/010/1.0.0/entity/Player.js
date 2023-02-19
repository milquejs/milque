import { Utils } from '../milque.js';

import * as PlayerControls from './PlayerControls.js';

export const PLAYER_MOVE_SPEED = 0.2;
export const PLAYER_ROT_SPEED = 0.2;
export const MIN_PLAYER_VELOCITY_X = 1;
export const MIN_PLAYER_VELOCITY_Y = 1;
export const MAX_PLAYER_VELOCITY_X = 3;
export const MAX_PLAYER_VELOCITY_Y = 3;
export const PLAYER_BRAKE_FRICTION = 0.1;
export const INV_PLAYER_BRAKE_FRICTION = 1 - PLAYER_BRAKE_FRICTION;

export async function load() {}
export function unload() {}

export function spawn(world, ...args) {
  let result = create(...args);
  world.players.push(result);
  return result;
}

export function destroy(world, entity) {
  world.players.splice(world.players.indexOf(entity), 1);
}

export function create(x = 0, y = 0) {
  return {
    x,
    y,
    dx: 0,
    dy: 0,
    rotation: 0,
  };
}

export function onPreUpdate(dt, world, entities) {}

export function onUpdate(dt, world, entities) {
  let player = entities[0];

  let xControl = PlayerControls.RIGHT.value - PlayerControls.LEFT.value;
  let yControl = PlayerControls.DOWN.value - PlayerControls.UP.value;
  let moveControl = xControl || yControl;

  let rotation = Math.atan2(yControl, xControl);
  let speed = Math.sqrt(player.dx * player.dx + player.dy * player.dy);

  let dx = Math.cos(rotation) * PLAYER_MOVE_SPEED;
  let dy = Math.sin(rotation) * PLAYER_MOVE_SPEED;
  if (moveControl) {
    player.dx += dx;
    player.dy += dy;
  } else {
    if (player.dx < MIN_PLAYER_VELOCITY_X) {
      player.dx = Utils.lerp(player.dx, MIN_PLAYER_VELOCITY_X, dt);
    }
    if (player.dy < MIN_PLAYER_VELOCITY_Y) {
      player.dy = Utils.lerp(player.dy, MIN_PLAYER_VELOCITY_Y, dt);
    }
  }

  player.dx = Utils.clampRange(
    player.dx,
    -MAX_PLAYER_VELOCITY_X,
    MAX_PLAYER_VELOCITY_X
  );
  player.dy = Utils.clampRange(
    player.dy,
    -MAX_PLAYER_VELOCITY_Y,
    MAX_PLAYER_VELOCITY_Y
  );
  player.x += player.dx;
  player.y += player.dy;

  if (player.dx || player.dy) {
    player.rotation = Utils.lookAt2D(
      player.rotation,
      Math.atan2(player.dy, player.dx),
      PLAYER_ROT_SPEED
    );
  }
}

export function onRender(view, world, entities) {
  let ctx = view.context;
  let player = entities[0];
  Utils.drawBox(ctx, player.x, player.y, player.rotation, 16, 16, 'red');
  Utils.drawBox(ctx, player.x, player.y, player.rotation, 12, 4, 'white');
}
