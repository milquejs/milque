import { CanvasView } from './view/CanvasView.js';
import { BLOCK_SIZE, MAX_FADE_IN_TICKS } from './Config.js';
import * as ChunkMapRenderer from './chunk/ChunkMapRenderer.js';

export async function GameRenderer(game)
{
    await ChunkMapRenderer.load();
    
    /** @type {import('@milque/display').DisplayPort} */
    const display = game.display;

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const view = new CanvasView();

    let world = game.world;
    /** @type {import('./view/Camera2D.js').Camera2D} */
    let camera = game.camera;
    let placement = game.placement;

    return function()
    {
        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        ctx.clearRect(0, 0, display.width, display.height);
        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            ChunkMapRenderer.drawChunkMap(ctx, world.map, BLOCK_SIZE);

            if (placement.placing)
            {
                ctx.translate(placement.placeX * BLOCK_SIZE, placement.placeY * BLOCK_SIZE);
                {
                    ChunkMapRenderer.drawPlacement(ctx, placement, BLOCK_SIZE);
                }
                ctx.translate(-placement.placeX * BLOCK_SIZE, -placement.placeY * BLOCK_SIZE);
            }
        }
        view.end(ctx);

        if (world.time < MAX_FADE_IN_TICKS)
        {
            ctx.fillStyle = `rgba(0, 0, 0, ${1 - (world.time / MAX_FADE_IN_TICKS)})`;
            ctx.fillRect(0, 0, display.width, display.height);
        }

        ctx.fillStyle = 'white';
        ctx.fillText(world.score, 4, 12);
    };
}
