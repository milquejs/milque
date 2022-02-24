import { AxisBinding, ButtonBinding } from '@milque/input'

export const MoveLeft = ButtonBinding.fromString('moveLeft', 'Keyboard.KeyA');
export const MoveRight = ButtonBinding.fromString('moveRight', 'Keyboard.KeyD');
export const MoveUp = ButtonBinding.fromString('moveUp', 'Keyboard.KeyW');
export const MoveDown = ButtonBinding.fromString('moveDown', 'Keyboard.KeyS');
export const CursorX = AxisBinding.fromString('cursorX', 'Mouse.PosX');
export const CursorY = AxisBinding.fromString('cursorY', 'Mouse.PosY');
export const Shoot = ButtonBinding.fromString('shoot', 'Keyboard.Space');
