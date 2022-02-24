import * as MainControls from './MainControls.js';

import { IslandRenderer } from './IslandRenderer.js';
import { generateBoxyIsland } from './Island.js';

document.title = 'Archaea';

/**
 * 
 * @param {import('../game/Game.js').Game} game 
 */
export async function main(game)
{
    const display = game.display;
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    const inputs = game.inputs;
    inputs.bindBindings(Object.values(MainControls));
    
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
        ctx.clearRect(0, 0, display.width, display.height);

        // The water around the island.
        ctx.fillStyle = 'dodgerblue';
        ctx.fillRect(0, 0, display.width, display.height);

        // The island.
        IslandRenderer.draw(ctx, [island]);
    });
}
