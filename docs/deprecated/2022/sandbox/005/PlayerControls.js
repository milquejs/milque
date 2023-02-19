import { InputContext } from './lib.js';

export const MOVE_MAPPING = {
  up: [
    { key: 'keyboard:ArrowUp', scale: 1 },
    { key: 'keyboard:KeyW', scale: 1 },
  ],
  down: [
    { key: 'keyboard:ArrowDown', scale: 1 },
    { key: 'keyboard:KeyS', scale: 1 },
  ],
  left: [
    { key: 'keyboard:ArrowLeft', scale: 1 },
    { key: 'keyboard:KeyA', scale: 1 },
  ],
  right: [
    { key: 'keyboard:ArrowRight', scale: 1 },
    { key: 'keyboard:KeyD', scale: 1 },
  ],
};
export const SHOOT_MAPPING = {
  pointx: { key: 'mouse:pos.x', scale: 1 },
  pointy: { key: 'mouse:pos.y', scale: 1 },
  point: [
    { key: 'mouse:0', scale: 1 },
    { key: 'mouse:2', scale: 1 },
  ],
};

export const PLAYER_INPUT_CONTEXT = new InputContext({
  ...MOVE_MAPPING,
  ...SHOOT_MAPPING,
});
document.querySelector('footer').appendChild(PLAYER_INPUT_CONTEXT);

export const MoveUp = PLAYER_INPUT_CONTEXT.getInput('up');
export const MoveDown = PLAYER_INPUT_CONTEXT.getInput('down');
export const MoveLeft = PLAYER_INPUT_CONTEXT.getInput('left');
export const MoveRight = PLAYER_INPUT_CONTEXT.getInput('right');
export const PointX = PLAYER_INPUT_CONTEXT.getInput('pointx');
export const PointY = PLAYER_INPUT_CONTEXT.getInput('pointy');
export const Point = PLAYER_INPUT_CONTEXT.getInput('point');
