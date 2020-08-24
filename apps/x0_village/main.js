import { Camera2D } from './lib.js';
import * as CanvasView from './CanvasView.js';
import * as SystemUtils from './SystemUtils.js';

import * as Items from './Items.js';
import * as Player from './Player.js';
import * as TileMap from './TileMap.js';
import * as SimplePhysics from './SimplePhysics.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');
    const camera = new Camera2D();
    
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const world = {
        display,
        input,
    };

    const systems = [
        TileMap,
        SimplePhysics,
        Items,
        Player,
    ];

    await SystemUtils.loadSystems(world, systems);
    SystemUtils.initializeSystems(world, systems);

    display.addEventListener('frame', e => {
        // Update
        {
            const dt = (e.detail.deltaTime / 1000) * 100;
            SystemUtils.updateSystems(world, dt, systems);

            camera.moveTo(world.player.x - display.width / 2, world.player.y - display.height / 2);
        }
        // Render
        {
            ctx.clearRect(0, 0, display.width, display.height);
            CanvasView.begin(ctx, camera.getViewMatrix(), camera.getProjectionMatrix());
            {
                SystemUtils.renderSystems(world, ctx, systems);
            }
            CanvasView.end(ctx);
        }
    });
}
