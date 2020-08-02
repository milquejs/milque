import * as MainControls from './MainControls.js';

import { IslandRenderer } from './IslandRenderer.js';
import { generateBoxyIsland } from './Island.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    MainControls.show();
    
    const width = 32;
    const height = 32;
    const length = width * height;
    const island = {
        tileSize: 4,
        width, height, length,
        ground: new Array(length),
        solid: new Array(length),
    };

    generateBoxyIsland(island, width, height, {});

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000;

        MainControls.poll();

        ctx.clearRect(0, 0, display.width, display.height);

        // The water around the island.
        ctx.fillStyle = 'dodgerblue';
        ctx.fillRect(0, 0, display.width, display.height);

        // The island.
        IslandRenderer.draw(ctx, [island]);
    });
}
