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
    let blockPos = blockMap.at(x, y);
    let block = blockMap.getBlockId(blockPos);
    if (!Blocks.isBlockAir(block))
    {
        if (Blocks.isBlockFluid(block))
        {
            drawBlockFluid(ctx, blockMap, blockPos, block, blockSize);
        }
        else
        {
            drawBlockSolid(ctx, blockMap, blockPos, block, blockSize);
        }
    }
}

function drawBlockFluid(ctx, blockMap, blockPos, block, blockSize)
{
    const { x, y } = blockPos;
    let meta = blockMap.getBlockMeta(blockPos);
    let fluidRatio = meta / BlockFluid.MAX_FLUID_LEVELS;
    let color = Blocks.getBlockColor(block);
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize + (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
}

function drawBlockSolid(ctx, blockMap, blockPos, block, blockSize)
{
    const { x, y } = blockPos;
    let color = Blocks.getBlockColor(block);
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawBlockNeighbor(ctx, blockMap, blockPos, block, blockSize)
{
    const { x, y } = blockPos;
    let neighbor = blockMap.getBlockNeighbor(blockPos);
    ctx.drawImage(assets.meteorite, neighbor * 16, 0, 16, 16, x * blockSize, y * blockSize, blockSize, blockSize)
}
