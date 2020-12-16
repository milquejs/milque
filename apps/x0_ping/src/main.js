import '@milque/display';
import './input/index.js';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const inputSource = document.querySelector('#mainInputSource');
    const inputMap = document.querySelector('#mainInputMap');

    inputMap.src = {
        PointerX: 'Mouse:PosX',
        PointerY: 'Mouse:PosY',
        PointerDown: 'Mouse:Button0',
        PointerAlt: 'Mouse:Button2',
    };

    display.addEventListener('frame', ({ deltaTime }) => {
        
    });
}
