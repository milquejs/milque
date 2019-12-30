import * as Input from './util/Input.js';

export const CONTEXT = Input.createContext(-1).disable();
export const ANY = CONTEXT.registerAction('anykey', 'key[].down');
export const DEBUG = CONTEXT.registerAction('debug', 'key[\\].up');
