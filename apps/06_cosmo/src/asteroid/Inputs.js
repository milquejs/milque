import { ButtonBinding, KeyCodes } from '@milque/input';

export const MoveLeft = new ButtonBinding('moveLeft', [KeyCodes.ARROW_LEFT, KeyCodes.KEY_A]);
export const MoveRight = new ButtonBinding('moveRight', [KeyCodes.ARROW_RIGHT, KeyCodes.KEY_D]);
export const MoveUp = new ButtonBinding('moveUp', [KeyCodes.ARROW_UP, KeyCodes.KEY_W]);
export const MoveDown = new ButtonBinding('moveDown', [KeyCodes.ARROW_DOWN, KeyCodes.KEY_S]);
export const Shoot = new ButtonBinding('shoot', KeyCodes.SPACE);
export const Debug = new ButtonBinding('debug', KeyCodes.BACKSLASH);
