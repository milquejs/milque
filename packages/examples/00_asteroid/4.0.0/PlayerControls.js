import * as Input from './util/Input.js';

export const CONTEXT = Input.createContext();
export const UP = CONTEXT.registerState('up', {
    'key[ArrowUp].up': 0,
    'key[ArrowUp].down': 1
});
export const DOWN = CONTEXT.registerState('down', {
    'key[ArrowDown].up': 0,
    'key[ArrowDown].down': 1
});
export const LEFT = CONTEXT.registerState('left', {
    'key[ArrowLeft].up': 0,
    'key[ArrowLeft].down': 1
});
export const RIGHT = CONTEXT.registerState('right', {
    'key[ArrowRight].up': 0,
    'key[ArrowRight].down': 1
});
export const FIRE = CONTEXT.registerState('fire', {
    'key[ ].up': 0,
    'key[ ].down': 1
});
