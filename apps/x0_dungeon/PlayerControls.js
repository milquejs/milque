import { InputContext } from './Input.js';

export const MOVE_MAPPING = {
    up: [ { key: 'keyboard:ArrowUp', event: 'down' } ],
    down: { key: 'keyboard:ArrowDown', event: 'down' },
    left: [ 'keyboard:ArrowLeft' ],
    right: 'keyboard:ArrowRight',
};
export const SHOOT_MAPPING = {
    shootx: [ { key: 'mouse:pos.x', scale: 1 } ],
    shooty: { key: 'mouse:pos.y', scale: 1 },
    shoot: 'mouse:0',
};

export const CONTEXT = new InputContext({ ...MOVE_MAPPING, ...SHOOT_MAPPING });

export const MoveUp = CONTEXT.getRange('up');
export const MoveDown = CONTEXT.getRange('down');
export const MoveLeft = CONTEXT.getRange('left');
export const MoveRight = CONTEXT.getRange('right');
export const ShootPosX = CONTEXT.getRange('shootx');
export const ShootPosY = CONTEXT.getRange('shooty');
export const ShootAction = CONTEXT.getRange('shoot');
