import { INPUT_CONTEXT } from './input.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = INPUT_CONTEXT;
    
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        
        ctx.clearRect(0, 0, display.width, display.height);
    });
}
