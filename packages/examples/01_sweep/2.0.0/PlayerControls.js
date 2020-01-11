import { Input } from './milque.js';

export const CONTEXT = Input.createContext();
export const ACTIVE_ACTION = CONTEXT.registerAction('active', 'mouse[0].down');
export const MARK_ACTION = CONTEXT.registerAction('mark', 'mouse[2].down');
export const RESTART_ACTION = CONTEXT.registerAction('restart', 'key[r].up');
export const MOUSE_X = CONTEXT.registerRange('mousex', 'mouse[pos].x');
export const MOUSE_Y = CONTEXT.registerRange('mousey', 'mouse[pos].y');
