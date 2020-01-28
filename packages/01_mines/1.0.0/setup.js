import * as Display from './util/Display.js';
import * as Input from './util/Input.js';

window.addEventListener('DOMContentLoaded', e => {
    const mainElement = document.querySelector('#main');
    Display.attachCanvas(mainElement.getCanvas(), mainElement.getContext());
    Input.attachDisplay(mainElement);
});
