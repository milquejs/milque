import { InputContext } from './InputContext.js';

export const MOVE_MAPPING = {
    up: [ { key: 'keyboard:ArrowUp', scale: 1 } ],
    down: { key: 'keyboard:ArrowDown', scale: 1 },
    left: [ { key: 'keyboard:ArrowLeft', scale: 1 } ],
    right: { key: 'keyboard:ArrowRight', scale: 1 },
};
export const SHOOT_MAPPING = {
    shootx: [ { key: 'mouse:pos.x', scale: 1 } ],
    shooty: { key: 'mouse:pos.y', scale: 1 },
    shoot: { key: 'mouse:0', scale: 1 },
};

export const PLAYER_INPUT_CONTEXT = new InputContext({ ...MOVE_MAPPING, ...SHOOT_MAPPING });

export const MoveUp = PLAYER_INPUT_CONTEXT.getRange('up');
export const MoveDown = PLAYER_INPUT_CONTEXT.getRange('down');
export const MoveLeft = PLAYER_INPUT_CONTEXT.getRange('left');
export const MoveRight = PLAYER_INPUT_CONTEXT.getRange('right');
export const ShootPosX = PLAYER_INPUT_CONTEXT.getRange('shootx');
export const ShootPosY = PLAYER_INPUT_CONTEXT.getRange('shooty');
export const ShootAction = PLAYER_INPUT_CONTEXT.getRange('shoot');
