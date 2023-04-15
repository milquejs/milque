import { AxisBinding, ButtonBinding, KeyCodes } from '@milque/input';

export const PointerX = new AxisBinding('pointer.x', KeyCodes.MOUSE_POS_X);
export const PointerY = new AxisBinding('pointer.y', KeyCodes.MOUSE_POS_Y);
export const PointerAction = new ButtonBinding('pointer.action', KeyCodes.MOUSE_BUTTON_0);
