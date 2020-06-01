import { Input } from './milque.js';

export const CONTEXT = Input.createContext(-1, false);
export const ANY = CONTEXT.registerAction('anykey', 'key[].down');
export const DEBUG = CONTEXT.registerAction('debug', 'key[\\].up');
