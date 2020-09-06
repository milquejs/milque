import { AssetLoader } from '../lib.js';
import { BLOCKS } from './BlockRegistry.js';
import { GOLD, DIRT, GRASS } from './Blocks.js';
import { MAX_FLUID_LEVELS, AIR_COMPONENT } from './fluid/FluidSystem.js';

import * as NeighborBehavior from './NeighborBehavior.js';

let assets = {};
export async function load()
{
    assets.meteorite = await AssetLoader.loadAsset('image:sprite/meteorite.png', {});
}

export function renderBlock(ctx, world, blockPos, blockSize)
{
    let blockId = world.map.getBlockId(blockPos);
    if (BLOCKS.hasComponent('air', blockId)) return;
    if (BLOCKS.hasComponent('fluid', blockId))
    {
        renderBlockFluid(ctx, world, blockPos, blockSize, blockId);
        return;
    }
    if (BLOCKS.hasComponent('solid', blockId))
    {
        renderBlockSolid(ctx, world, blockPos, blockSize, blockId);
        return;
    }
}

function renderBlockFluid(ctx, world, blockPos, blockSize, blockId)
{
    const worldMap = world.map;
    const blockMeta = worldMap.getBlockMeta(blockPos);
    const fluidRatio = blockMeta <= 0 ? 1 : blockMeta / MAX_FLUID_LEVELS;
    const color = BLOCKS.getComponent('color', blockId);

    ctx.fillStyle = color;
    ctx.fillRect(0, (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);

    let time = Date.now() / 2000;
    let rx = blockPos.x / worldMap.chunkWidth;
    let ry = blockPos.y / worldMap.chunkHeight;
    let osx = blockPos.blockCoordX % 2 === 0;
    let osy = blockPos.blockCoordY % 2 === 0;
    let sfactor = Math.sin(time + rx - ry + (osx ? 0.3 : 0) + (osy ? 0.1 : 0));
    ctx.fillStyle = `rgba(0, 0, 100, ${((sfactor + 1) / 2) * 0.4})`;
    ctx.fillRect(0, (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
}

function renderBlockSolid(ctx, world, blockPos, blockSize, blockId)
{
    const worldMap = world.map;
    const color = BLOCKS.getComponent('color', blockId);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, blockSize, blockSize);

    if (blockId === GOLD.blockId)
    {
        let time = Date.now() / 500;
        let rx = blockPos.x / worldMap.chunkWidth;
        let ry = blockPos.y / worldMap.chunkHeight;
        let sfactor = Math.sin(time + rx * 4 + ry * 4);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, sfactor - 0.6)})`;
        ctx.fillRect(0, 0, blockSize, blockSize);
    }
    else if (blockId === DIRT.blockId)
    {
        let osx = blockPos.blockCoordX % 2 === 0;
        let osy = blockPos.blockCoordY % 2 === 0;
        ctx.fillStyle = `rgba(0, 0, 0, ${osx && osy ? 0.1 : 0})`;
        ctx.fillRect(0, 0, blockSize, blockSize);
        
        const blockNeighbor = worldMap.getBlockNeighbor(blockPos);

        const grassSize = Math.ceil(blockSize / 4);
        if (!NeighborBehavior.hasUpNeighbor(blockNeighbor))
        {
            let upBlockId = worldMap.getBlockId(blockPos.up());
            if (BLOCKS.hasComponent(AIR_COMPONENT, upBlockId))
            {
                ctx.fillStyle = 'limegreen';
                ctx.fillRect(0, 0, blockSize, grassSize);
            }
            blockPos.down();
        }
    }
    else if (blockId === GRASS.blockId)
    {
        let osx = blockPos.blockCoordX % 2 === 0;
        ctx.fillStyle = `rgba(0, 0, 0, ${osx ? 0.1 : 0})`;
        ctx.fillRect(0, 0, blockSize, blockSize);
    }
}

function renderBlockWithNeighbor(ctx, world, blockPos, blockSize)
{
    let neighbor = world.map.getBlockNeighbor(blockPos);
    ctx.drawImage(assets.meteorite, neighbor * 16, 0, 16, 16, 0, 0, blockSize, blockSize)
}
