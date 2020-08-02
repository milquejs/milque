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

    let time = Date.now() / 2000;
    let rx = blockPos.x / world.chunkWidth;
    let ry = blockPos.y / world.chunkHeight;
    let osx = blockPos.blockCoordX % 2 === 0;
    let osy = blockPos.blockCoordY % 2 === 0;
    let sfactor = Math.sin(time + rx - ry + (osx ? 0.3 : 0) + (osy ? 0.1 : 0));
    ctx.fillStyle = `rgba(0, 0, 100, ${((sfactor + 1) / 2) * 0.4})`;
    ctx.fillRect(0, (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
}

function drawBlockSolid(ctx, world, blockPos, blockSize)
{
    let blockId = world.getBlockId(blockPos);
    let color = Blocks.getBlockColor(blockId);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, blockSize, blockSize);

    if (blockId === Blocks.GOLD.blockId)
    {
        let time = Date.now() / 500;
        let rx = blockPos.x / world.chunkWidth;
        let ry = blockPos.y / world.chunkHeight;
        let sfactor = Math.sin(time + rx * 4 + ry * 4);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, sfactor - 0.6)})`;
        ctx.fillRect(0, 0, blockSize, blockSize);
    }
    else if (blockId === Blocks.DIRT.blockId)
    {
        let osx = blockPos.blockCoordX % 2 === 0;
        let osy = blockPos.blockCoordY % 2 === 0;
        ctx.fillStyle = `rgba(0, 0, 0, ${osx && osy ? 0.1 : 0})`;
        ctx.fillRect(0, 0, blockSize, blockSize);
    }
}

function drawBlockNeighbor(ctx, world, blockPos, blockSize)
{
    let neighbor = world.getBlockNeighbor(blockPos);
    ctx.drawImage(assets.meteorite, neighbor * 16, 0, 16, 16, 0, 0, blockSize, blockSize)
}
