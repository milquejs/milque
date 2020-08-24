import { DisplayPort } from './lib.js';

export const DISPLAY = new DisplayPort();
DISPLAY.id = 'main';
DISPLAY.mode = 'fit';
DISPLAY.debug = true;
document.body.appendChild(DISPLAY);
