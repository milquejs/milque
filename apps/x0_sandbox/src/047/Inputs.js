import { KeyCodes, ButtonBinding } from '@milque/input';

export const Forward = new ButtonBinding('forward', [KeyCodes.KEY_W, KeyCodes.ARROW_UP]);
export const Backward = new ButtonBinding('backward', [KeyCodes.KEY_S, KeyCodes.ARROW_DOWN]);
export const RotateLeft = new ButtonBinding('rotateLeft', [KeyCodes.KEY_A, KeyCodes.ARROW_LEFT]);
export const RotateRight = new ButtonBinding('rotateRight', [KeyCodes.KEY_D, KeyCodes.ARROW_RIGHT]);

export const Fire = new ButtonBinding('fire', KeyCodes.SPACE);
export const Debug = new ButtonBinding('debug', KeyCodes.BACKQUOTE);
