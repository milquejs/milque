import { InputContext } from 'milque';

// https://keycode.info/
const INPUT_MAPPING = {
    cursorX: { key: 'mouse:pos.x', scale: 1 },
    cursorY: { key: 'mouse:pos.y', scale: 1 },
    cursorPick: [
        { key: 'mouse:Button0', scale: 1 },
        { key: 'mouse:Button2', scale: 1 }
    ],
};

export const INPUT_CONTEXT = new InputContext(INPUT_MAPPING);
INPUT_CONTEXT.auto = true;
INPUT_CONTEXT.for = 'main';
document.body.appendChild(INPUT_CONTEXT);
