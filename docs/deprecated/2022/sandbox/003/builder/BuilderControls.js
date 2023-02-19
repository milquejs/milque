import { AxisBinding, ButtonBinding } from '@milque/input';

export const BuildX = AxisBinding.fromBind('buildx', 'Mouse', 'PosX');
export const BuildY = AxisBinding.fromBind('buildy', 'Mouse', 'PosY');
export const BuildAction = ButtonBinding.fromBind('build', 'Mouse', 'Button2');
export const BuildDrag = ButtonBinding.fromBind(
  'build_dragstart',
  'Mouse',
  'Button0'
);
export const BuildNextTile = ButtonBinding.fromBind(
  'build_nexttile',
  'Keyboard',
  'KeyA'
);
export const BuildPrevTile = ButtonBinding.fromBind(
  'build_prevtile',
  'Keyboard',
  'KeyD'
);
