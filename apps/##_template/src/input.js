import { InputContext } from 'milque';

// TODO: Should print the key code of any key somewhere, so we know what to use.
// NOTE: https://keycode.info/
const INPUT_MAPPING = {
    moveUp: [{key: 'keyboard:ArrowUp', scale: 1}, {key: 'keyboard:KeyW', scale: 1}],
    moveDown: [{key: 'keyboard:ArrowDown', scale: 1}, {key: 'keyboard:KeyS', scale: 1}],
    moveLeft: [{key: 'keyboard:ArrowLeft', scale: 1}, {key: 'keyboard:KeyA', scale: 1}],
    moveRight: [{key: 'keyboard:ArrowRight', scale: 1}, {key: 'keyboard:KeyD', scale: 1}],
    cursorX: {key: 'mouse:pos.x', scale: 1},
    cursorY: {key: 'mouse:pos.y', scale: 1},
};

export const INPUT_CONTEXT = new InputContext(INPUT_MAPPING);
INPUT_CONTEXT.auto = true;
INPUT_CONTEXT.for = 'main';
document.body.appendChild(INPUT_CONTEXT);
