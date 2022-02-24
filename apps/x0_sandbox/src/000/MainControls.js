import { AxisBinding, ButtonBinding } from '@milque/input';

export const CursorX = new AxisBinding('cursorX', 'Mouse', 'PosX');
export const CursorY = new AxisBinding('cursorY', 'Mouse', 'PosY');
export const Activate = new ButtonBinding('activate', 'Mouse', 'Button0');
export const Mark = new ButtonBinding('mark', 'Mouse', 'Button2');
export const Restart = new ButtonBinding('restart', 'Keyboard', 'KeyR');
