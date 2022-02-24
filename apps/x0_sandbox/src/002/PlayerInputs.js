import { AxisBinding, ButtonBinding } from '@milque/input'

export const MoveLeft = new ButtonBinding('moveLeft', 'Keyboard', 'KeyA');
export const MoveRight = new ButtonBinding('moveRight', 'Keyboard', 'KeyD');
export const MoveUp = new ButtonBinding('moveUp', 'Keyboard', 'KeyW');
export const MoveDown = new ButtonBinding('moveDown', 'Keyboard', 'KeyS');
export const CursorX = new AxisBinding('cursorX', 'Mouse', 'PosX');
export const CursorY = new AxisBinding('cursorY', 'Mouse', 'PosY');
export const Shoot = new ButtonBinding('shoot', 'Keyboard', 'Space');
