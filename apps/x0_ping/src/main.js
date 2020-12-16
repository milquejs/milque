import '@milque/display';
import '@milque/input';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#inputMain');
    input.src = {
        PointerX: 'Mouse:PosX',
        PointerY: 'Mouse:PosY',
        PointerDown: 'Mouse:Button0',
        PointerAlt: 'Mouse:Button2',
    };

    display.addEventListener('frame', ({ deltaTime }) => {
        
    });
}
