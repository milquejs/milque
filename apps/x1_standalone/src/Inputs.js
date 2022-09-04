import { AxisBinding, ButtonBinding, KeyCodes } from '@milque/input';

export const INPUTS = {
    CursorX: new AxisBinding('cursorX', [KeyCodes.MOUSE_POS_X]),
    CursorY: new AxisBinding('cursorY', [KeyCodes.MOUSE_POS_Y]),
    CursorMain: new ButtonBinding('cursorMain', KeyCodes.MOUSE_BUTTON_0),
    CursorAlt: new ButtonBinding('cursorAlt', KeyCodes.MOUSE_BUTTON_2),
    MoveLeft: new ButtonBinding('moveLeft', [
        KeyCodes.KEY_A,
        KeyCodes.ARROW_LEFT,
    ]),
    MoveRight: new ButtonBinding('moveRight', [
        KeyCodes.KEY_D,
        KeyCodes.ARROW_RIGHT,
    ]),
    MoveUp: new ButtonBinding('moveUp', [
        KeyCodes.KEY_Q,
    ]),
    MoveDown: new ButtonBinding('moveDown', [
        KeyCodes.KEY_E
    ]),
    MoveForward: new ButtonBinding('moveForward', [
        KeyCodes.KEY_W,
        KeyCodes.ARROW_UP,
    ]),
    MoveBackward: new ButtonBinding('moveBackward', [
        KeyCodes.KEY_S,
        KeyCodes.ARROW_DOWN,
    ]),
    MainAction: new ButtonBinding('mainAction', [
        KeyCodes.KEY_Z,
        KeyCodes.KEY_Q,
    ]),
    AltAction: new ButtonBinding('altAction', [
        KeyCodes.KEY_X,
        KeyCodes.KEY_E,
    ]),
    Evade: new ButtonBinding('evade', [KeyCodes.SPACE]),
};
