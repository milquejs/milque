import * as Display from './util/Display.js';

window.addEventListener('DOMContentLoaded', e => {
    const mainElement = document.querySelector('#main');
    Display.attachCanvas(mainElement);
});
