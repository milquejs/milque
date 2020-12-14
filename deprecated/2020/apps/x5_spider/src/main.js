import { INPUT_CONTEXT } from './input.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = INPUT_CONTEXT;
    const ctx = display.canvas.getContext('2d');
    
    const tileWidth = 10;
    const tileHeight = 10;
    const width = 16;
    const height = 16;
    const tilemap = new Array(width * height);

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.width, display.height);

        for(let y = 0; y < height; ++y)
        {
            for(let x = 0; x < width; ++x)
            {
                ctx.strokeStyle = 'white';
                ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    });
}
