import { InputSource } from './input/source/InputSource.js';
import { InputContext } from './input/InputContext.js';

// TODO: Should print the key code of any key somewhere, so we know what to use.
// NOTE: https://keycode.info/
const INPUT_MAPPING = {
  PointerX: { key: 'Mouse:PosX', scale: 1 },
  PointerY: { key: 'Mouse:PosY', scale: 1 },
  PointerDown: [
    { key: 'Mouse:Button0', scale: 1 },
    { key: 'Mouse:Button2', scale: 1 },
  ],
};

const inputSource = InputSource.from(document.querySelector('#main'));
export const INPUT_CONTEXT = new InputContext()
  .setInputMap(INPUT_MAPPING)
  .attach(inputSource);
