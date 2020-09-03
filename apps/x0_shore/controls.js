import { InputContext } from './lib.js';

const INPUT_MAPPING = {
    moveUp: [{ key: 'keyboard:ArrowUp', scale: 1 }, { key: 'keyboard:KeyW', scale: 1 }],
    moveDown: [{ key: 'keyboard:ArrowDown', scale: 1 }, { key: 'keyboard:KeyDown', scale: 1 }],
    moveLeft: [{ key: 'keyboard:ArrowLeft', scale: 1 }, { key: 'keyboard:KeyLeft', scale: 1 }],
    moveLeft: [{ key: 'keyboard:ArrowRight', scale: 1 }, { key: 'keyboard:KeyRight', scale: 1 }],
};
const INPUT_CONTEXT = new InputContext(INPUT_MAPPING);
INPUT_CONTEXT.auto = true;

export const MoveUp = INPUT_CONTEXT.getInput('moveUp');
export const MoveLeft = INPUT_CONTEXT.getInput('moveLeft');
export const MoveRight = INPUT_CONTEXT.getInput('moveRight');
export const MoveDown = INPUT_CONTEXT.getInput('moveDown');

export function show()
{
    document.body.appendChild(INPUT_CONTEXT);
    return INPUT_CONTEXT;
}
