import * as BlockRenderer from './BlockRenderer.js';

export async function load() {}

export function drawBlockMap(ctx, blockMap, blockSize)
{
    const blockMapWidth = blockMap.width;
    const blockMapHeight = blockMap.height;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            let i = x + y * blockMapWidth;
            BlockRenderer.drawBlock(ctx, blockMap, x, y, i, blockSize);
        }
    }
}

export function drawPlacement(ctx, placementState, blockSize)
{
    drawBlockMap(ctx, placementState.shapeMap, blockSize);
}
