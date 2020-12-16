import '@milque/display';
import './input/index.js';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#mainInput');
    input.src = {
        PointerX: 'Mouse:PosX',
        PointerY: 'Mouse:PosY',
        PointerDown: 'Mouse:Button0',
        PointerAlt: 'Mouse:Button2',
    };

    display.addEventListener('frame', ({ deltaTime }) => {
        
    });
}
