import { InputContext } from './lib.js';

export const PLAYER_MAPPING = {
    activate: 'mouse:0',
    mark: 'mouse:2',
    restart: { key: 'keyboard:KeyR', event: 'up' },
    pointerX: { key: 'mouse:pos.x', scale: 1 },
    pointerY: { key: 'mouse:pos.y', scale: 1 },
};

export const PLAYER_INPUT_CONTEXT = new InputContext(PLAYER_MAPPING);
document.body.appendChild(PLAYER_INPUT_CONTEXT);

export const MARK = PLAYER_INPUT_CONTEXT.getInput('mark');
export const RESTART = PLAYER_INPUT_CONTEXT.getInput('restart');
export const ACTIVATE = PLAYER_INPUT_CONTEXT.getInput('activate');
export const MOUSE_X = PLAYER_INPUT_CONTEXT.getInput('pointerX');
export const MOUSE_Y = PLAYER_INPUT_CONTEXT.getInput('pointerY');
