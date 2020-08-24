import { Random } from './lib.js';
import { ChunkMap } from './chunk/ChunkMap.js';
import * as ChunkMapRenderer from './chunk/ChunkMapRenderer.js';

export function initialize(world)
{
    world.chunkMap = new ChunkMap(0, 0, 100, 100, 10, 10);
    for(let i = 0; i < 100; ++i)
    {
        for(let j = 0; j < 100; ++j)
        {
            world.chunkMap.setBlockId(world.chunkMap.at(i, j), Random.choose([0, 1]));
        }
    }
}

export function render(world, ctx)
{
    ChunkMapRenderer.drawChunkMap(ctx, world.chunkMap, 10, renderBlock);
}

function renderBlock(ctx, chunkMap, blockPos, blockSize)
{
    const blockId = chunkMap.getBlockId(blockPos);
    if (blockId)
    {
        ctx.fillStyle = 'dodgerblue';
        ctx.fillRect(0, 0, blockSize, blockSize);
    }
}
