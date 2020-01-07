import * as Display from './modules/Display.js';
import * as Audio from './modules/Audio.js';
import * as Input from './modules/Input.js';
import * as Random from './modules/Random.js';
import * as Viewport from './modules/Viewport.js';
import * as Utils from './modules/Utils.js';

export * from './display/index.js';
export * from './input/index.js';
export * from './random/index.js';
export * from './util/index.js';

export {
    Display,
    Audio,
    Input,
    Random,
    Viewport,
    Utils,
};

// NOTE: To allow both named and default imports
import * as self from './index.js';
export default self;
