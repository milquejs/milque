import { KeyCode } from './KeyCode';
import { KEYBOARD, MOUSE, GAMEPAD } from './DeviceCodes';

export const KEY_A = new KeyCode(KEYBOARD, 'KeyA');
export const KEY_B = new KeyCode(KEYBOARD, 'KeyB');
export const KEY_C = new KeyCode(KEYBOARD, 'KeyC');
export const KEY_D = new KeyCode(KEYBOARD, 'KeyD');
export const KEY_E = new KeyCode(KEYBOARD, 'KeyE');
export const KEY_F = new KeyCode(KEYBOARD, 'KeyF');
export const KEY_G = new KeyCode(KEYBOARD, 'KeyG');
export const KEY_H = new KeyCode(KEYBOARD, 'KeyH');
export const KEY_I = new KeyCode(KEYBOARD, 'KeyI');
export const KEY_J = new KeyCode(KEYBOARD, 'KeyJ');
export const KEY_K = new KeyCode(KEYBOARD, 'KeyK');
export const KEY_L = new KeyCode(KEYBOARD, 'KeyL');
export const KEY_M = new KeyCode(KEYBOARD, 'KeyM');
export const KEY_N = new KeyCode(KEYBOARD, 'KeyN');
export const KEY_O = new KeyCode(KEYBOARD, 'KeyO');
export const KEY_P = new KeyCode(KEYBOARD, 'KeyP');
export const KEY_Q = new KeyCode(KEYBOARD, 'KeyQ');
export const KEY_R = new KeyCode(KEYBOARD, 'KeyR');
export const KEY_S = new KeyCode(KEYBOARD, 'KeyS');
export const KEY_T = new KeyCode(KEYBOARD, 'KeyT');
export const KEY_U = new KeyCode(KEYBOARD, 'KeyU');
export const KEY_V = new KeyCode(KEYBOARD, 'KeyV');
export const KEY_W = new KeyCode(KEYBOARD, 'KeyW');
export const KEY_X = new KeyCode(KEYBOARD, 'KeyX');
export const KEY_Y = new KeyCode(KEYBOARD, 'KeyY');
export const KEY_Z = new KeyCode(KEYBOARD, 'KeyZ');

export const DIGIT_0 = new KeyCode(KEYBOARD, 'Digit0');
export const DIGIT_1 = new KeyCode(KEYBOARD, 'Digit1');
export const DIGIT_2 = new KeyCode(KEYBOARD, 'Digit2');
export const DIGIT_3 = new KeyCode(KEYBOARD, 'Digit3');
export const DIGIT_4 = new KeyCode(KEYBOARD, 'Digit4');
export const DIGIT_5 = new KeyCode(KEYBOARD, 'Digit5');
export const DIGIT_6 = new KeyCode(KEYBOARD, 'Digit6');
export const DIGIT_7 = new KeyCode(KEYBOARD, 'Digit7');
export const DIGIT_8 = new KeyCode(KEYBOARD, 'Digit8');
export const DIGIT_9 = new KeyCode(KEYBOARD, 'Digit9');

export const MINUS = new KeyCode(KEYBOARD, 'Minus');
export const EQUAL = new KeyCode(KEYBOARD, 'Equal');
export const BRACKET_LEFT = new KeyCode(KEYBOARD, 'BracketLeft');
export const BRACKET_RIGHT = new KeyCode(KEYBOARD, 'BracketRight');
export const SEMICOLON = new KeyCode(KEYBOARD, 'Semicolon');
export const QUOTE = new KeyCode(KEYBOARD, 'Quote');
export const BACKQUOTE = new KeyCode(KEYBOARD, 'Backquote');
export const BACKSLASH = new KeyCode(KEYBOARD, 'Backslash');
export const COMMA = new KeyCode(KEYBOARD, 'Comma');
export const PERIOD = new KeyCode(KEYBOARD, 'Period');
export const SLASH = new KeyCode(KEYBOARD, 'Slash');

export const ESCAPE = new KeyCode(KEYBOARD, 'Escape');
export const SPACE = new KeyCode(KEYBOARD, 'Space');
export const CAPS_LOCK = new KeyCode(KEYBOARD, 'CapsLock');
export const BACKSPACE = new KeyCode(KEYBOARD, 'Backspace');
export const DELETE = new KeyCode(KEYBOARD, 'Delete');
export const TAB = new KeyCode(KEYBOARD, 'Tab');
export const ENTER = new KeyCode(KEYBOARD, 'Enter');

export const ARROW_UP = new KeyCode(KEYBOARD, 'ArrowUp');
export const ARROW_DOWN = new KeyCode(KEYBOARD, 'ArrowDown');
export const ARROW_LEFT = new KeyCode(KEYBOARD, 'ArrowLeft');
export const ARROW_RIGHT = new KeyCode(KEYBOARD, 'ArrowRight');

/** Left Mouse Button */
export const MOUSE_BUTTON_0 = new KeyCode(MOUSE, 'Button0');
/** Middle Mouse Button */
export const MOUSE_BUTTON_1 = new KeyCode(MOUSE, 'Button1');
/** Right Mouse Button */
export const MOUSE_BUTTON_2 = new KeyCode(MOUSE, 'Button2');
/** Next Mouse Button */
export const MOUSE_BUTTON_3 = new KeyCode(MOUSE, 'Button3');
/** Back Mouse Button */
export const MOUSE_BUTTON_4 = new KeyCode(MOUSE, 'Button4');

export const MOUSE_POS_X = new KeyCode(MOUSE, 'PosX', true);
export const MOUSE_POS_Y = new KeyCode(MOUSE, 'PosY', true);

export const MOUSE_WHEEL_X = new KeyCode(MOUSE, 'WheelX', true);
export const MOUSE_WHEEL_Y = new KeyCode(MOUSE, 'WheelY', true);
export const MOUSE_WHEEL_Z = new KeyCode(MOUSE, 'WheelZ', true);

/**
 * Fires when a gamepad connects or disconnects.
 */
export const GAMEPAD_CONNECTION = new KeyCode(GAMEPAD, 'Connection');

/** `A` (Nintendo), `B` (Xbox), `X` (Playstation) */
export const GAMEPAD_BUTTON_0 = new KeyCode(GAMEPAD, 'Button0');
/** `B` (Nintendo), `A` (Xbox), `Circle` (Playstation) */
export const GAMEPAD_BUTTON_1 = new KeyCode(GAMEPAD, 'Button1');
/** `Y` (Nintendo), `X` (Xbox), `Square` (Playstation) */
export const GAMEPAD_BUTTON_2 = new KeyCode(GAMEPAD, 'Button2');
/** `X` (Nintendo), `Y` (Xbox), `Triangle` (Playstation) */
export const GAMEPAD_BUTTON_3 = new KeyCode(GAMEPAD, 'Button3');

/** `L1`, Left Bumper */
export const GAMEPAD_BUTTON_4 = new KeyCode(GAMEPAD, 'Button4');
/** `R1`, Right Bumper */
export const GAMEPAD_BUTTON_5 = new KeyCode(GAMEPAD, 'Button5');
/** `L2`, Left Trigger */
export const GAMEPAD_BUTTON_6 = new KeyCode(GAMEPAD, 'Button6');
/** `R2`, Right Trigger */
export const GAMEPAD_BUTTON_7 = new KeyCode(GAMEPAD, 'Button7');
/** `SELECT`, `BACK` */
export const GAMEPAD_BUTTON_8 = new KeyCode(GAMEPAD, 'Button8');
/** `START`, `FORWARD` */
export const GAMEPAD_BUTTON_9 = new KeyCode(GAMEPAD, 'Button9');
/** `L3`, Left Stick Button */
export const GAMEPAD_BUTTON_10 = new KeyCode(GAMEPAD, 'Button10');
/** `R3`, Right Stick Button */
export const GAMEPAD_BUTTON_11 = new KeyCode(GAMEPAD, 'Button11');
/** `D-pad ↑`, Up */
export const GAMEPAD_BUTTON_12 = new KeyCode(GAMEPAD, 'Button12');
/** `D-pad ↓`, Down */
export const GAMEPAD_BUTTON_13 = new KeyCode(GAMEPAD, 'Button13');
/** `D-pad ←`, Left */
export const GAMEPAD_BUTTON_14 = new KeyCode(GAMEPAD, 'Button14');
/** `D-pad →`, Right */
export const GAMEPAD_BUTTON_15 = new KeyCode(GAMEPAD, 'Button15');
/** `Home` */
export const GAMEPAD_BUTTON_16 = new KeyCode(GAMEPAD, 'Button16');

export const GAMEPAD_LEFT_STICK_X = new KeyCode(GAMEPAD, 'Axis0', true);
export const GAMEPAD_LEFT_STICK_Y = new KeyCode(GAMEPAD, 'Axis1', true);

export const GAMEPAD_RIGHT_STICK_X = new KeyCode(GAMEPAD, 'Axis2', true);
export const GAMEPAD_RIGHT_STICK_Y = new KeyCode(GAMEPAD, 'Axis3', true);

export const GAMEPAD_LEFT_BUMPER = new KeyCode(GAMEPAD, 'Button4');
export const GAMEPAD_RIGHT_BUMPER = new KeyCode(GAMEPAD, 'Button5');

export const GAMEPAD_LEFT_TRIGGER = new KeyCode(GAMEPAD, 'Button6');
export const GAMEPAD_RIGHT_TRIGGER = new KeyCode(GAMEPAD, 'Button7');

export const GAMEPAD_SELECT = new KeyCode(GAMEPAD, 'Button8');
export const GAMEPAD_START = new KeyCode(GAMEPAD, 'Button9');
export const GAMEPAD_HOME = new KeyCode(GAMEPAD, 'Button16');

export const GAMEPAD_LEFT_STICK_BUTTON = new KeyCode(GAMEPAD, 'Button10');
export const GAMEPAD_RIGHT_STICK_BUTTON = new KeyCode(GAMEPAD, 'Button11');

export const GAMEPAD_DPAD_UP = new KeyCode(GAMEPAD, 'Button12');
export const GAMEPAD_DPAD_DOWN = new KeyCode(GAMEPAD, 'Button13');
export const GAMEPAD_DPAD_LEFT = new KeyCode(GAMEPAD, 'Button14');
export const GAMEPAD_DPAD_RIGHT = new KeyCode(GAMEPAD, 'Button15');
