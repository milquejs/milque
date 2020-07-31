import * as BlockRenderer from './BlockRenderer.js';

export async function load() {}

export function drawBlockMap(ctx, blockMap, blockSize)
{
    let blockPos = blockMap.at(0, 0);
    const blockMapWidth = blockMap.width;
    const blockMapHeight = blockMap.height;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            blockPos.set(x, y);
            BlockRenderer.drawBlock(ctx, blockMap, blockPos, blockSize);
        }
    }
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, blockMapWidth * blockSize, blockMapHeight * blockSize);
}

export function drawPlacement(ctx, placementState, blockSize)
{
    drawBlockMap(ctx, placementState.shapeMap, blockSize);
}
