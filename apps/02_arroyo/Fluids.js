import { Random } from './lib.js';
import { BlockFluid } from './Block.js';
import * as Blocks from './Blocks.js';

export function updateChunkMap(chunkMap)
{
    let sortedChunks = chunkMap.getLoadedChunks().sort((a, b) => {
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
        update(chunkMap, chunk);
    }
}

export function update(chunkMap, chunk)
{
    let blockPos = chunkMap.at(0, 0);
    const chunkX = chunk.chunkCoordX * chunkMap.chunkWidth;
    const chunkY = chunk.chunkCoordY * chunkMap.chunkHeight;
    // Do water physics.
    for(let y = chunkMap.chunkHeight - 1; y >= 0; --y)
    {
        for(let x = 0; x < chunkMap.chunkWidth; ++x)
        {
            blockPos.set(x + chunkX, y + chunkY);
            let blockId = chunkMap.getBlockId(blockPos);
            if (Blocks.isBlockFluid(blockId))
            {
                updateBlock(chunkMap, blockPos);
            }
        }
    }
}

function updateBlock(chunkMap, blockPos)
{
    if (!tryFlowWaterDown(chunkMap, blockPos) && !tryFlowWaterSide(chunkMap, blockPos))
    {
        /*
        // Is it stable? Probably not.
        if (blockMap.getBlockMeta(blockPos) >= BlockFluid.MAX_FLUID_LEVELS)
        {
            let pos = blockPos.copy();
            let flag = true;
            flag &= !blockMap.isWithinBounds(pos.down())
                || (!Blocks.isBlockAir(blockMap.getBlockId(pos))
                    && !Blocks.isBlockFluid(blockMap.getBlockId(pos)));
            pos.reset(blockPos);
            flag &= !blockMap.isWithinBounds(pos.left())
                || (!Blocks.isBlockAir(blockMap.getBlockId(pos))
                    && !Blocks.isBlockFluid(blockMap.getBlockId(pos)));
            pos.reset(blockPos);
            flag &= !blockMap.isWithinBounds(pos.right())
                || (!Blocks.isBlockAir(blockMap.getBlockId(pos))
                    && !Blocks.isBlockFluid(blockMap.getBlockId(pos)));
            pos.reset(blockPos);

            if (flag)
            {
                blockMap.setBlockId(blockPos, 2)
                    .setBlockMeta(blockPos, 0);
            }
        }
        */
    }
}

function tryFlowWaterDown(chunkMap, blockPos)
{
    let toBlockPos = blockPos.copy().down();
    console.log(toBlockPos);
    return flowWater(chunkMap, blockPos, toBlockPos, BlockFluid.MAX_FLUID_LEVELS);
}

function tryFlowWaterSide(chunkMap, blockPos)
{
    let flag = false;
    let meta = chunkMap.getBlockMeta(blockPos);
    let toBlockPos = blockPos.copy();
    if (meta <= 1)
    {
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(chunkMap, blockPos, toBlockPos, 1, false);
    }
    else
    {
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(chunkMap, blockPos, toBlockPos, 1, false);
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(chunkMap, blockPos, toBlockPos, 1, false);
    }
    return flag;
}

function flowWater(chunkMap, fromBlockPos, toBlockPos, amount, allowBackflow = true)
{
    if (chunkMap.isWithinBounds(toBlockPos))
    {
        let fromBlock = chunkMap.getBlockId(fromBlockPos);
        let fromMeta = chunkMap.getBlockMeta(fromBlockPos);
        let toBlock = chunkMap.getBlockId(toBlockPos);
        let toMeta = chunkMap.getBlockMeta(toBlockPos);

        if (amount > fromMeta) amount = fromMeta;

        if (Blocks.isBlockAir(toBlock))
        {
            let remainder = fromMeta - amount;
            if (remainder <= 0)
            {
                chunkMap.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, fromMeta);
                chunkMap.setBlockId(fromBlockPos, 0)
                    .setBlockMeta(fromBlockPos, 0);
                return true;
            }
            else
            {
                chunkMap.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, amount);
                chunkMap.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
        else if (Blocks.isBlockFluid(toBlock) && toMeta < BlockFluid.MAX_FLUID_LEVELS)
        {
            if (!allowBackflow && fromMeta <= toMeta) return false;
            
            if (toMeta + amount <= BlockFluid.MAX_FLUID_LEVELS)
            {
                chunkMap.setBlockMeta(toBlockPos, toMeta + amount);

                if (amount >= fromMeta)
                {
                    chunkMap.setBlockId(fromBlockPos, 0)
                        .setBlockMeta(fromBlockPos, 0);
                }
                else
                {
                    chunkMap.setBlockMeta(fromBlockPos, fromMeta - amount);
                }
                return true;
            }
            else
            {
                chunkMap.setBlockMeta(toBlockPos, BlockFluid.MAX_FLUID_LEVELS);

                let remainder = amount - (BlockFluid.MAX_FLUID_LEVELS - toMeta);
                chunkMap.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
    }
    return false;
}
