import '@milque/display';
import '@milque/input';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#input');
    input.source.autopoll = true;

    const ctx = display.canvas.getContext('2d');

    display.addEventListener('frame', ({ deltaTime }) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.width, display.height);
    });
}
