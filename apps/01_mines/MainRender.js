import * as MathHelper from '../../packages/lib/src/MathHelper.js';

import { drawBox, drawText } from './RenderHelper.js';
import * as MainScene from './MainScene.js';
import * as Chunk from './Chunk.js';
import * as PlayerControls from './PlayerControls.js';

import * as ChunkRenderer from './ChunkRenderer.js';

const HEALTH_X = 0;
const HEALTH_Y = 0;
const FRAMES_PER_SECOND = 60;

export async function load()
{
    await ChunkRenderer.load();
}

export function unload()
{

}

export function onRender(view, world)
{
    let ctx = view.context;

    ChunkRenderer.onRender(view, world);

    let mouseX = PlayerControls.MOUSE_X.value * view.width;
    let mouseY = PlayerControls.MOUSE_Y.value * view.height;
    let mouseTileX = MathHelper.clamp(Math.floor((mouseX - ChunkRenderer.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
    let mouseTileY = MathHelper.clamp(Math.floor((mouseY - ChunkRenderer.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
    
    drawBox(ctx,
        ChunkRenderer.CHUNK_OFFSET_X + ChunkRenderer.TILE_OFFSET_X + mouseTileX * Chunk.TILE_SIZE,
        ChunkRenderer.CHUNK_OFFSET_Y + ChunkRenderer.TILE_OFFSET_Y + mouseTileY * Chunk.TILE_SIZE,
        Chunk.TILE_SIZE - 1, Chunk.TILE_SIZE - 1, 'rgba(0, 0, 0, 0.2)');
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, view.width, ChunkRenderer.CHUNK_OFFSET_Y);
    ctx.fillRect(0, view.height - ChunkRenderer.CHUNK_OFFSET_Y, view.width, ChunkRenderer.CHUNK_OFFSET_Y);
    ctx.fillRect(0, ChunkRenderer.CHUNK_OFFSET_Y, ChunkRenderer.CHUNK_OFFSET_X, view.height - ChunkRenderer.CHUNK_OFFSET_Y * 2);
    ctx.fillRect(view.width - ChunkRenderer.CHUNK_OFFSET_X, ChunkRenderer.CHUNK_OFFSET_Y, ChunkRenderer.CHUNK_OFFSET_X, view.height - ChunkRenderer.CHUNK_OFFSET_Y * 2);
    
    // Draw health
    for(let i = 0; i < MainScene.MAX_HEALTH; ++i)
    {
        let color = i < world.health ? 'salmon' : 'darkgray';
        drawBox(ctx,
            HEALTH_X + Chunk.TILE_SIZE / 2 + i * Chunk.TILE_SIZE,
            HEALTH_Y + Chunk.TILE_SIZE / 2,
            Chunk.TILE_SIZE - 3,
            Chunk.TILE_SIZE - 3,
            color);
    }

    if (world.gameOver)
    {
        drawBox(ctx, view.width / 2, view.height / 2, view.width * 0.7, 8, 'black');
        drawText(ctx, view.width / 2 + 1, view.height / 2 + 1, 'Game Over', 32, 'black');
        drawText(ctx, view.width / 2 - 1, view.height / 2 - 1, 'Game Over', 32, 'white');
        
        drawText(ctx, view.width / 2 + 1, view.height / 2 + 24 + 1, 'Click to continue', 16, 'black');
        drawText(ctx, view.width / 2 - 1, view.height / 2 + 24 - 1, 'Click to continue', 16, 'white');
    }
    else if (world.gameWin)
    {
        drawBox(ctx, view.width / 2, view.height / 2, view.width * 0.7, 8, 'black');
        drawText(ctx, view.width / 2 + 1, view.height / 2 + 1, 'Success!', 32, 'black');
        drawText(ctx, view.width / 2 - 1, view.height / 2 - 1, 'Success!', 32, 'gold');
        
        drawText(ctx, view.width / 2 + 1, view.height / 2 + 24 + 1, 'Click to continue', 16, 'black');
        drawText(ctx, view.width / 2 - 1, view.height / 2 + 24 - 1, 'Click to continue', 16, 'white');
    }

    drawText(ctx, view.width / 2, view.height - Chunk.TILE_SIZE, `Time: ${Math.floor(world.gameTime / FRAMES_PER_SECOND)}`, 16, 'white');
}
