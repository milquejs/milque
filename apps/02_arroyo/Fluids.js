import { Random } from './lib.js';
import { BlockFluid } from './Block.js';
import * as Blocks from './Blocks.js';

export function updateChunkMap(world)
{
    let sortedChunks = world.getLoadedChunks().sort((a, b) => {
        if (a.chunkCoordY < b.chunkCoordY)
        {
            return 1;
        }
        else if (a.chunkCoordY > b.chunkCoordY)
        {
            return -1;
        }
        else if (a.chunkCoordX < b.chunkCoordX)
        {
            return 1;
        }
        else if (a.chunkCoordX > b.chunkCoordX)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    });
    
    for(let chunk of sortedChunks)
    {
        update(world, chunk);
    }
}

export function update(world, chunk)
{
    let blockPos = world.at(0, 0);
    const chunkX = chunk.chunkCoordX * world.chunkWidth;
    const chunkY = chunk.chunkCoordY * world.chunkHeight;
    // Do water physics.
    for(let y = world.chunkHeight - 1; y >= 0; --y)
    {
        for(let x = 0; x < world.chunkWidth; ++x)
        {
            blockPos.set(x + chunkX, y + chunkY);
            let blockId = world.getBlockId(blockPos);
            if (Blocks.isBlockFluid(blockId))
            {
                updateBlock(world, blockPos);
            }
        }
    }
}

function updateBlock(world, blockPos)
{
    if (!tryFlowWaterDown(world, blockPos) && !tryFlowWaterSide(world, blockPos))
    {
        /*
        // Is it stable? Probably not.
        if (world.getBlockMeta(blockPos) >= BlockFluid.MAX_FLUID_LEVELS)
        {
            let pos = blockPos.copy();
            let flag = true;
            flag &= !world.isWithinBounds(pos.down())
                || (!Blocks.isBlockAir(world.getBlockId(pos))
                    && !Blocks.isBlockFluid(world.getBlockId(pos)));
            pos.reset(blockPos);
            flag &= !world.isWithinBounds(pos.left())
                || (!Blocks.isBlockAir(world.getBlockId(pos))
                    && !Blocks.isBlockFluid(world.getBlockId(pos)));
            pos.reset(blockPos);
            flag &= !world.isWithinBounds(pos.right())
                || (!Blocks.isBlockAir(world.getBlockId(pos))
                    && !Blocks.isBlockFluid(world.getBlockId(pos)));
            pos.reset(blockPos);

            if (flag)
            {
                world.setBlockId(blockPos, 2)
                    .setBlockMeta(blockPos, 0);
            }
        }
        */
    }
}

function tryFlowWaterDown(world, blockPos)
{
    let toBlockPos = blockPos.copy().down();
    return flowWater(world, blockPos, toBlockPos, BlockFluid.MAX_FLUID_LEVELS);
}

function tryFlowWaterSide(world, blockPos)
{
    let flag = false;
    let meta = world.getBlockMeta(blockPos);
    let toBlockPos = blockPos.copy();
    if (meta <= 1)
    {
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(world, blockPos, toBlockPos, 1, false);
    }
    else
    {
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(world, blockPos, toBlockPos, 1, false);
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(world, blockPos, toBlockPos, 1, false);
    }
    return flag;
}

function flowWater(world, fromBlockPos, toBlockPos, amount, allowBackflow = true)
{
    if (world.isWithinBounds(toBlockPos) && world.isWithinLoaded(toBlockPos))
    {
        let fromBlock = world.getBlockId(fromBlockPos);
        let fromMeta = world.getBlockMeta(fromBlockPos);
        let toBlock = world.getBlockId(toBlockPos);
        let toMeta = world.getBlockMeta(toBlockPos);

        if (amount > fromMeta) amount = fromMeta;

        if (Blocks.isBlockAir(toBlock))
        {
            let remainder = fromMeta - amount;
            if (remainder <= 0)
            {
                world.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, fromMeta);
                world.setBlockId(fromBlockPos, 0)
                    .setBlockMeta(fromBlockPos, 0);
                return true;
            }
            else
            {
                world.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, amount);
                world.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
        else if (Blocks.isBlockFluid(toBlock) && toMeta < BlockFluid.MAX_FLUID_LEVELS)
        {
            if (!allowBackflow && fromMeta <= toMeta) return false;
            
            if (toMeta + amount <= BlockFluid.MAX_FLUID_LEVELS)
            {
                world.setBlockMeta(toBlockPos, toMeta + amount);

                if (amount >= fromMeta)
                {
                    world.setBlockId(fromBlockPos, 0)
                        .setBlockMeta(fromBlockPos, 0);
                }
                else
                {
                    world.setBlockMeta(fromBlockPos, fromMeta - amount);
                }
                return true;
            }
            else
            {
                world.setBlockMeta(toBlockPos, BlockFluid.MAX_FLUID_LEVELS);

                let remainder = amount - (BlockFluid.MAX_FLUID_LEVELS - toMeta);
                world.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
    }
    return false;
}
