import { AssetLoader } from './lib.js';
import { BlockFluid } from './Block.js';
import * as Blocks from './Blocks.js';

let assets = {};
export async function load()
{
    assets.meteorite = await AssetLoader.loadAsset('image:sprite/meteorite.png', {}, '../../res');
}

export function drawBlock(ctx, blockMap, x, y, i, blockSize)
{
    let block = blockMap.block[i];
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
