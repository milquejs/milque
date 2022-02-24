import { AxisBinding, ButtonBinding } from '@milque/input';

export const CursorX = AxisBinding.fromString('cursorX', 'Mouse.PosX');
export const CursorY = AxisBinding.fromString('cursorY', 'Mouse.PosY');
export const Activate = ButtonBinding.fromString('activate', 'Mouse.Button0');
export const Mark = ButtonBinding.fromString('mark', 'Mouse.Button2');
export const Restart = ButtonBinding.fromString('restart', 'Keyboard.KeyR');
