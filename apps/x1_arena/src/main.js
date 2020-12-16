import '@milque/display';
import '@milque/input';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#mainInput');
    input.source.autopoll = true;

    display.addEventListener('frame', ({ deltaTime }) => {
        
    });
}
