import { MathHelper } from './lib.js';

import * as MainScene from './MainScene.js';

import * as MinesControls from './MinesControls.js';
import * as MinesRenderer from './MinesRenderer.js';

const HEALTH_X = 0;
const HEALTH_Y = 0;

export async function load()
{
    await MinesRenderer.load();
}

export function unload()
{

}

export function onRender(view, world)
{
    let ctx = view.context;
    ctx.translate(MainScene.CHUNK_OFFSET_X, MainScene.CHUNK_OFFSET_Y);
    {
        MinesRenderer.renderMines(ctx, world.mines, MainScene.CHUNK_TILE_SIZE);
    }
    ctx.translate(-MainScene.CHUNK_OFFSET_X, -MainScene.CHUNK_OFFSET_Y);

    const chunkWidth = world.mines.width;
    const chunkHeight = world.mines.height;
    const chunkOffsetX = MainScene.CHUNK_OFFSET_X;
    const chunkOffsetY = MainScene.CHUNK_OFFSET_Y;
    const tileSize = MainScene.CHUNK_TILE_SIZE;

    let mouseX = MinesControls.CursorX.value * view.width;
    let mouseY = MinesControls.CursorY.value * view.height;
    let mouseTileX = MathHelper.clamp(Math.floor((mouseX - chunkOffsetX) / tileSize), 0, chunkWidth - 1);
    let mouseTileY = MathHelper.clamp(Math.floor((mouseY - chunkOffsetY) / tileSize), 0, chunkHeight - 1);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(
        chunkOffsetX + mouseTileX * tileSize,
        chunkOffsetY + mouseTileY * tileSize,
        tileSize, tileSize);
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, view.width, chunkOffsetY);
    ctx.fillRect(0, view.height - chunkOffsetY, view.width, chunkOffsetY);
    ctx.fillRect(0, chunkOffsetY, chunkOffsetX, view.height - chunkOffsetY * 2);
    ctx.fillRect(view.width - chunkOffsetX, chunkOffsetY, chunkOffsetX, view.height - chunkOffsetY * 2);
    
    // Draw health
    for(let i = 0; i < MainScene.MAX_HEALTH; ++i)
    {
        let color = i < world.health ? 'salmon' : 'darkgray';
        ctx.fillStyle = color;
        ctx.fillRect(
            HEALTH_X + i * tileSize,
            HEALTH_Y,
            tileSize - 3,
            tileSize - 3);
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

    drawText(ctx, view.width / 2, view.height - tileSize, `Time: ${Math.floor(world.gameTime)}`, 16, 'white');
}

function drawBox(ctx, x, y, width, height, color)
{
    ctx.translate(x, y);
    {
        let halfWidth = width / 2;
        let halfHeight= height / 2;
        ctx.fillStyle = color;
        ctx.fillRect(-halfWidth, -halfHeight, width, height);
    }
    ctx.translate(-x, -y);
}

function drawText(ctx, x, y, text, fontSize, color)
{
    ctx.translate(x, y);
    {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.fillText(text, 0, 0);
    }
    ctx.translate(-x, -y);
}
