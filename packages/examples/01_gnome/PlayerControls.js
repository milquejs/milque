import * as Input from './util/Input.js';

export const CONTEXT = Input.createContext();
export const UP = CONTEXT.createInput('ArrowUp', 'w');
export const DOWN = CONTEXT.createInput('ArrowDown', 's');
export const LEFT = CONTEXT.createInput('ArrowLeft', 'a');
export const RIGHT = CONTEXT.createInput('ArrowRight', 'd');
export const FIRE = CONTEXT.createInput(' ');
