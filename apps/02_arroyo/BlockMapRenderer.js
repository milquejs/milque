import * as BlockRenderer from './BlockRenderer.js';

export async function load() {}

export function drawBlockMap(ctx, blockMap, blockSize)
{
    let blockPos = blockMap.at(0, 0);
    const blockMapWidth = blockMap.chunkWidth;
    const blockMapHeight = blockMap.chunkHeight;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            blockPos.set(x, y);
            BlockRenderer.drawBlock(ctx, blockMap, blockPos, blockSize);
        }
    }
}

export function drawPlacement(ctx, placementState, blockSize)
{
    drawBlockMap(ctx, placementState.shapeMap, blockSize);
}
