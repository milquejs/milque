import { AssetLoader } from './lib.js';
import { BlockFluid } from './Block.js';
import * as Blocks from './Blocks.js';

let assets = {};
export async function load()
{
    assets.meteorite = await AssetLoader.loadAsset('image:sprite/meteorite.png', {}, '../../res');
}

export function drawBlockMap(ctx, blockMap, blockSize)
{
    const blockMapWidth = blockMap.width;
    const blockMapHeight = blockMap.height;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            let i = x + y * blockMapWidth;
            let block = blockMap.data[i];
            if (!Blocks.isBlockAir(block))
            {
                if (Blocks.isBlockFluid(block))
                {
                    drawBlockFluid(ctx, blockMap, x, y, i, block, blockSize);
                }
                else
                {
                    drawBlockSolid(ctx, blockMap, x, y, i, block, blockSize);
                }
            }
        }
    }
}

export function drawPlacement(ctx, placementState, blockSize)
{
    drawBlockMap(ctx, placementState.shapeMap, blockSize);
}

export function drawBlockFluid(ctx, blockMap, x, y, i, block, blockSize)
{
    let meta = blockMap.meta[i];
    let fluidRatio = meta / BlockFluid.MAX_FLUID_LEVELS;
    let color = Blocks.getBlockColor(block);
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize + (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
}

export function drawBlockSolid(ctx, blockMap, x, y, i, block, blockSize)
{
    let color = Blocks.getBlockColor(block);
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

export function drawBlockNeighbor(ctx, blockMap, x, y, i, block, blockSize)
{
    let neighbor = blockMap.neighbor[i];
    ctx.drawImage(assets.meteorite, neighbor * 16, 0, 16, 16, x * blockSize, y * blockSize, blockSize, blockSize)
}
