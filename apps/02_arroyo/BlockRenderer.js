import { AssetLoader } from './lib.js';
import { BlockFluid } from './Block.js';
import * as Blocks from './Blocks.js';

let assets = {};
export async function load()
{
    assets.meteorite = await AssetLoader.loadAsset('image:sprite/meteorite.png', {}, '../../res');
}

export function drawBlock(ctx, world, blockPos, blockSize)
{
    let blockId = world.getBlockId(blockPos);
    if (!Blocks.isBlockAir(blockId))
    {
        if (Blocks.isBlockFluid(blockId))
        {
            drawBlockFluid(ctx, world, blockPos, blockSize);
        }
        else
        {
            drawBlockSolid(ctx, world, blockPos, blockSize);
        }
    }
}

function drawBlockFluid(ctx, world, blockPos, blockSize)
{
    let blockId = world.getBlockId(blockPos);
    let blockMeta = world.getBlockMeta(blockPos);
    let fluidRatio = blockMeta / BlockFluid.MAX_FLUID_LEVELS;
    let color = Blocks.getBlockColor(blockId);
    ctx.fillStyle = color;
    ctx.fillRect(0, (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
}

function drawBlockSolid(ctx, world, blockPos, blockSize)
{
    let blockId = world.getBlockId(blockPos);
    let color = Blocks.getBlockColor(blockId);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, blockSize, blockSize);
}

function drawBlockNeighbor(ctx, world, blockPos, blockSize)
{
    let neighbor = world.getBlockNeighbor(blockPos);
    ctx.drawImage(assets.meteorite, neighbor * 16, 0, 16, 16, 0, 0, blockSize, blockSize)
}
