import { AxisBinding, ButtonBinding } from '@milque/input';

export const MoveLeft = ButtonBinding.fromString('moveLeft', 'Keyboard.KeyA');
export const MoveRight = ButtonBinding.fromString('moveRight', 'Keyboard.KeyD');
export const MoveUp = ButtonBinding.fromString('moveRight', 'Keyboard.KeyD');
export const MoveDown = ButtonBinding.fromString('moveRight', 'Keyboard.KeyD');

export const PointerX = AxisBinding.fromString('pointerX', 'Mouse.PosX');
export const PointerY = AxisBinding.fromString('pointerY', 'Mouse.PosY');

export const Grabbing = AxisBinding.fromString('grabbing', 'Mouse.Button0');
