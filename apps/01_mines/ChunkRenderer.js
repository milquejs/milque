import * as AssetLoader from '../../packages/lib/src/AssetLoader.js';

import { drawBox, drawText } from './RenderHelper.js';
import * as Chunk from './Chunk.js';

let TILE_IMAGE;
let NUMS_IMAGE;
let MARK_IMAGE;

export const CHUNK_OFFSET_X = 32;
export const CHUNK_OFFSET_Y = 32;

export const TILE_OFFSET_X = Chunk.TILE_SIZE / 2;
export const TILE_OFFSET_Y = Chunk.TILE_SIZE / 2;

export async function load()
{
    const parentPath = '../../res';
    TILE_IMAGE = await AssetLoader.loadAsset('image:mines/tile.png', {}, parentPath);
    NUMS_IMAGE = await AssetLoader.loadAsset('image:mines/nums.png', {}, parentPath);
    MARK_IMAGE = await AssetLoader.loadAsset('image:mines/flag.png', {}, parentPath);
}

export function unload()
{

}

export function onRender(view, world)
{
    let chunk = world.chunk;
    let ctx = view.context;

    const TILE_SIZE = Chunk.TILE_SIZE;

    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, view.width, view.height);
    drawGrid(ctx, 0, 0, view.width, view.height, TILE_SIZE, TILE_SIZE);

    ctx.translate(CHUNK_OFFSET_X, CHUNK_OFFSET_Y);

    for(let y = 0; y < Chunk.CHUNK_HEIGHT; ++y)
    {
        for(let x = 0; x < Chunk.CHUNK_WIDTH; ++x)
        {
            let renderX = TILE_OFFSET_X + x * TILE_SIZE;
            let renderY = TILE_OFFSET_Y + y * TILE_SIZE;
            let tileIndex = x + y * Chunk.CHUNK_WIDTH;

            if (chunk.solids[tileIndex] > 0)
            {
                ctx.drawImage(TILE_IMAGE, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                if (chunk.marks[tileIndex] > 0)
                {
                    ctx.drawImage(MARK_IMAGE, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                }
            }
            else
            {
                if (chunk.tiles[tileIndex] > 0)
                {
                    // ctx.drawImage(TILE_IMAGE, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                    drawBox(ctx, renderX, renderY, TILE_SIZE, TILE_SIZE, 'rgba(0, 0, 0, 0.2)');
                    drawText(ctx, renderX, renderY, 'X', 10, 'black');
                }
                else if (chunk.overlay[tileIndex] > 0)
                {
                    let num = chunk.overlay[tileIndex] - 1;
                    ctx.drawImage(NUMS_IMAGE, 32 * num, 0, 32, 32, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                }
            }

            // Utils.drawText(ctx, chunk.regions[tileIndex], renderX, renderY, 0, 8, 'black');
        }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawGrid(ctx, offsetX, offsetY, width, height, tileWidth, tileHeight)
{
    ctx.strokeStyle = '#888888';
    ctx.beginPath();

    for(let y = 0; y < height; y += tileHeight)
    {
        ctx.moveTo(offsetX, y + offsetY);
        ctx.lineTo(offsetX + width, y + offsetY);
    }

    for(let x = 0; x < width; x += tileWidth)
    {
        ctx.moveTo(x + offsetX, offsetY);
        ctx.lineTo(x + offsetX, offsetY + height);
    }

    ctx.stroke();
}
