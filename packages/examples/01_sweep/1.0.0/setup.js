import * as Display from './util/Display.js';
import * as Input from './Input.js';

window.addEventListener('DOMContentLoaded', e => {
    const mainElement = document.querySelector('#main');
    Display.attachCanvas(mainElement);
    Input.attachSource(mainElement);
});
