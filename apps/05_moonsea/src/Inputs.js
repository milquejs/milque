import { ButtonBinding, KeyCodes } from '@milque/input';

export const INPUTS = {
  MoveLeft: new ButtonBinding('moveLeft', [
    KeyCodes.KEY_A,
    KeyCodes.ARROW_LEFT,
  ]),
  MoveRight: new ButtonBinding('moveRight', [
    KeyCodes.KEY_D,
    KeyCodes.ARROW_RIGHT,
  ]),
  Fish: new ButtonBinding('fish', [KeyCodes.KEY_Z]),
  FastForward: new ButtonBinding('fastForward', [
    KeyCodes.SPACE
  ]),
};

/** @param {import('@milque/input').InputContext} inputContext */
export function initInputs(inputContext) {
  inputContext.bindBindings(Object.values(INPUTS));
}
