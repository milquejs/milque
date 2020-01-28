import * as Utils from './util/Utils.js';
import * as Display from './util/Display.js';
import * as Input from './util/Input.js';

Utils.onDOMLoaded(() => {
    const mainDisplay = document.querySelector('#main');
    Display.attachCanvas(mainDisplay.getCanvas(), mainDisplay.getContext());
    Input.attachCanvas(mainDisplay.getCanvas());
});
