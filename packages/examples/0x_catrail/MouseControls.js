import { Input } from './milque.js';

export const CONTEXT = Input.createContext();
export const POS_X = CONTEXT.registerRange('x', 'mouse[pos].x');
export const POS_Y = CONTEXT.registerRange('y', 'mouse[pos].y');
export const DOWN = CONTEXT.registerState('down', {
    'mouse.up': 0,
    'mouse.down': 1,
});
export const LEFT_DOWN = CONTEXT.registerState('ldown', {
    'mouse[0].up': 0,
    'mouse[0].down': 1,
});
export const RIGHT_DOWN = CONTEXT.registerState('rdown', {
    'mouse[2].up': 0,
    'mouse[2].down': 1,
});
export const CLICK = CONTEXT.registerAction('click', 'mouse.up');
export const LEFT_CLICK = CONTEXT.registerAction('lclick', 'mouse[0].up');
export const RIGHT_CLICK = CONTEXT.registerAction('rclick', 'mouse[2].up');
