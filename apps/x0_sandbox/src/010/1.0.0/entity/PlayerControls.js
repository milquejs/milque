import { Input } from '../milque.js';

export const CONTEXT = Input.createContext();
export const UP = CONTEXT.registerState('forward', {
  'key[ArrowUp].up': 0,
  'key[ArrowUp].down': 1,
  'key[w].up': 0,
  'key[w].down': 1,
});
export const DOWN = CONTEXT.registerState('backward', {
  'key[ArrowDown].up': 0,
  'key[ArrowDown].down': 1,
  'key[s].up': 0,
  'key[s].down': 1,
});
export const LEFT = CONTEXT.registerState('left', {
  'key[ArrowLeft].up': 0,
  'key[ArrowLeft].down': 1,
  'key[a].up': 0,
  'key[a].down': 1,
});
export const RIGHT = CONTEXT.registerState('right', {
  'key[ArrowRight].up': 0,
  'key[ArrowRight].down': 1,
  'key[d].up': 0,
  'key[d].down': 1,
});
export const FIRE = CONTEXT.registerState('fire', {
  'key[ ].up': 0,
  'key[ ].down': 1,
});
