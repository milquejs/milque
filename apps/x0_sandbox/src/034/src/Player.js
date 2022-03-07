import { InputContext } from '@milque/input';

const ALLOWED_INPUTS = ['MoveUp', 'MoveDown'];
export const PLAYER_CONTROLS = new InputContext(/* ALLOWED_INPUTS */);
const MOVE_UP = PLAYER_CONTROLS.getInput('MoveUp');
const MOVE_DOWN = PLAYER_CONTROLS.getInput('MoveDown');

export async function init(world) {
  world.inputSource.addContext(PLAYER_CONTROLS);
}

export function create(world, player) {}

export function render(world, player) {}

export function update(world, player) {
  if (MOVE_UP.value) {
    player.y -= 1;
  }

  if (MOVE_DOWN.value) {
    player.y += 1;
  }
}
