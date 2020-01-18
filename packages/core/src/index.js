export * from './display/index.js';
export * from './input/index.js';
export * from './random/index.js';
export * from './util/index.js';
export * from './view/index.js';
export * from './game/index.js';
export * from './entity/index.js';

import * as Display from './modules/Display.js';
export { Display };
import * as Audio from './modules/Audio.js';
export { Audio };
import * as Input from './modules/Input.js';
export { Input };
import * as Random from './modules/Random.js';
export { Random };
import * as Utils from './modules/Utils.js';
export { Utils };

// NOTE: To allow both named and default imports
import * as self from './index.js';
export default self;
