import { Random } from './lib.js';
import { BlockFluid } from './Block.js';
import * as Blocks from './Blocks.js';

export function update(blockMap)
{
    let blockPos = blockMap.at(0, 0);
    // Do water physics.
    for(let y = blockMap.height - 1; y >= 0; --y)
    {
        for(let x = 0; x < blockMap.width; ++x)
        {
            blockPos.set(x, y);
            let block = blockMap.getBlockId(blockPos);
            if (Blocks.isBlockFluid(block))
            {
                updateBlock(blockMap, blockPos);
            }
        }
    }
}

function updateBlock(blockMap, blockPos)
{
    if (!tryFlowWaterDown(blockMap, blockPos) && !tryFlowWaterSide(blockMap, blockPos))
    {
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
    }
}

function tryFlowWaterDown(blockMap, blockPos)
{
    let toBlockPos = blockPos.copy().down();
    return flowWater(blockMap, blockPos, toBlockPos, BlockFluid.MAX_FLUID_LEVELS);
}

function tryFlowWaterSide(blockMap, blockPos)
{
    let flag = false;
    let meta = blockMap.getBlockMeta(blockPos);
    let toBlockPos = blockPos.copy();
    if (meta <= 1)
    {
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(blockMap, blockPos, toBlockPos, 1, false);
    }
    else
    {
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(blockMap, blockPos, toBlockPos, 1, false);
        blockPos.offset(toBlockPos, 1 * Random.sign(), 0);
        flag |= flowWater(blockMap, blockPos, toBlockPos, 1, false);
    }
    return flag;
}

function flowWater(blockMap, fromBlockPos, toBlockPos, amount, allowBackflow = true)
{
    const { x: fromX, y: fromY, index: fromIndex } = fromBlockPos;
    const { x: toX, y: toY, index: toIndex } = toBlockPos;

    if (toX >= 0 && toY >= 0 && toX < blockMap.width && toY < blockMap.height)
    {
        let fromBlock = blockMap.getBlockId(fromBlockPos);
        let fromMeta = blockMap.getBlockMeta(fromBlockPos);
        let toBlock = blockMap.getBlockId(toBlockPos);
        let toMeta = blockMap.getBlockMeta(toBlockPos);

        if (amount > fromMeta) amount = fromMeta;

        if (Blocks.isBlockAir(toBlock))
        {
            let remainder = fromMeta - amount;
            if (remainder <= 0)
            {
                blockMap.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, fromMeta);
                blockMap.setBlockId(fromBlockPos, 0)
                    .setBlockMeta(fromBlockPos, 0);
                return true;
            }
            else
            {
                blockMap.setBlockId(toBlockPos, fromBlock)
                    .setBlockMeta(toBlockPos, amount);
                blockMap.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
        else if (Blocks.isBlockFluid(toBlock) && toMeta < BlockFluid.MAX_FLUID_LEVELS)
        {
            if (!allowBackflow && fromMeta <= toMeta) return false;
            
            if (toMeta + amount <= BlockFluid.MAX_FLUID_LEVELS)
            {
                blockMap.setBlockMeta(toBlockPos, toMeta + amount);

                if (amount >= fromMeta)
                {
                    blockMap.setBlockId(fromBlockPos, 0)
                        .setBlockMeta(fromBlockPos, 0);
                }
                else
                {
                    blockMap.setBlockMeta(fromBlockPos, fromMeta - amount);
                }
                return true;
            }
            else
            {
                blockMap.setBlockMeta(toBlockPos, BlockFluid.MAX_FLUID_LEVELS);

                let remainder = amount - (BlockFluid.MAX_FLUID_LEVELS - toMeta);
                blockMap.setBlockMeta(fromBlockPos, remainder);
                return true;
            }
        }
    }
    return false;
}
