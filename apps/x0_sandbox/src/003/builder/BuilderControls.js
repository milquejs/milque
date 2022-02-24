import { AxisBinding, ButtonBinding } from '@milque/input';

export const BuildX = AxisBinding.fromString('buildx', 'Mouse', 'PosX');
export const BuildY = AxisBinding.fromString('buildy', 'Mouse', 'PosY');
export const BuildAction = ButtonBinding.fromString('build', 'Mouse', 'Button2');
export const BuildDrag = ButtonBinding.fromString('build_dragstart', 'Mouse', 'Button0');
export const BuildNextTile = ButtonBinding.fromString('build_nexttile', 'Keyboard', 'KeyA');
export const BuildPrevTile = ButtonBinding.fromString('build_prevtile', 'Keyboard', 'KeyD');
