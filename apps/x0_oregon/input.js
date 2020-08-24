import { InputContext } from './lib.js';

export const INPUT_MAP = {
    // Cursor
    cursorX: { key: 'mouse:pos.x', scale: 1 },
    cursorY: { key: 'mouse:pos.y', scale: 1 },
    // Movement
    moveUp: [
        { key: 'keyboard:KeyW', scale: 1 },
        { key: 'keyboard:ArrowUp', scale: 1 },
    ],
    moveDown: [
        { key: 'keyboard:KeyS', scale: 1 },
        { key: 'keyboard:ArrowDown', scale: 1 },
    ],
    moveLeft: [
        { key: 'keyboard:KeyA', scale: 1 },
        { key: 'keyboard:ArrowLeft', scale: 1 },
    ],
    moveRight: [
        { key: 'keyboard:KeyD', scale: 1 },
        { key: 'keyboard:ArrowRight', scale: 1 },
    ],
    // Actions
};

export const INPUT = new InputContext(INPUT_MAP);
INPUT.for = 'main';
INPUT.auto = true;
document.body.appendChild(INPUT);

export const CursorX = INPUT.getInput('cursorX');
export const CursorY = INPUT.getInput('cursorY');

export const MoveUp = INPUT.getInput('moveUp');
export const MoveDown = INPUT.getInput('moveDown');
export const MoveLeft = INPUT.getInput('moveLeft');
export const MoveRight = INPUT.getInput('moveRight');
