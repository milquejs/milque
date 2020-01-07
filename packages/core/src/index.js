import * as Display from './modules/Display.js';
import * as Audio from './modules/Audio.js';
import * as Input from './modules/Input.js';
import * as Random from './modules/Random.js';
import * as Viewport from './modules/Viewport.js';
import * as Utils from './modules/Utils.js';

import * as DisplayModule from './display/index.js';
import * as InputModule from './input/index.js';
import * as RandomModule from './random/index.js';
import * as UtilModule from './util/index.js';

export default {
    Display,
    Audio,
    Input,
    Random,
    Viewport,
    Utils,
    ...DisplayModule,
    ...InputModule,
    ...RandomModule,
    ...UtilModule,
};