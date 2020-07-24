import * as Blocks from './Blocks.js';
import * as Fluids from './Fluids.js';

export function drawBlockMap(ctx, blockMap, blockSize)
{
    const blockMapWidth = blockMap.width;
    const blockMapHeight = blockMap.height;
    const blockMapMeta = blockMap.meta;
    const blockMapData = blockMap.data;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            let i = x + y * blockMapWidth;
            let block = blockMapData[i];
            if (!Blocks.isBlockAir(block))
            {
                if (Blocks.isBlockFluid(block))
                {
                    let meta = blockMapMeta[i];
                    let fluidRatio = meta / Fluids.MAX_FLUID_LEVELS;
                    let color = Blocks.getBlockColor(block);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * blockSize, y * blockSize + (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
                }
                else
                {
                    let color = Blocks.getBlockColor(block);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}

export function drawBlock(ctx, blockShape, blockSize)
{
    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
    }
}
