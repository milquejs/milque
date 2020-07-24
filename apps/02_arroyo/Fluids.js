import { Random } from './lib.js';
import * as Blocks from './Blocks.js';

export const MAX_FLUID_LEVELS = 3;

export function update(blockMap)
{
    // Do water physics.
    for(let y = blockMap.height - 1; y >= 0; --y)
    {
        for(let x = 0; x < blockMap.width; ++x)
        {
            let i = x + y * blockMap.width;
            let block = blockMap.data[i];
            if (Blocks.isBlockFluid(block))
            {
                updateBlock(blockMap, x, y, i, block);
            }
        }
    }
}

function updateBlock(blockMap, x, y, i, block)
{
    if (!tryFlowWaterDown(blockMap, x, y) && !tryFlowWaterSide(blockMap, x, y))
    {
        // Is it stable? Probably not.
        let pos = blockMap.at(x, y);
        if (pos.meta >= MAX_FLUID_LEVELS)
        {
            let flag = true;    
            flag &= !pos.down() || (!Blocks.isBlockAir(pos.block) && !Blocks.isBlockFluid(pos.block));
            pos.set(x, y);
            flag &= !pos.left() || (!Blocks.isBlockAir(pos.block) && !Blocks.isBlockFluid(pos.block));
            pos.set(x, y);
            flag &= !pos.right() || (!Blocks.isBlockAir(pos.block) && !Blocks.isBlockFluid(pos.block));
            pos.set(x, y);

            if (flag)
            {
                blockMap.data[i] = 2;
                blockMap.meta[i] = 0;
            }
        }
    }
}

function tryFlowWaterDown(blockMap, x, y)
{
    return flowWater(blockMap, x, y, x, y + 1, MAX_FLUID_LEVELS);
}

function tryFlowWaterSide(blockMap, x, y)
{
    let flag = false;
    let meta = blockMap.meta[x + y * blockMap.width];
    if (meta <= 1)
    {
        flag |= flowWater(blockMap, x, y, x + 1 * Random.sign(), y, 1, false);
    }
    else
    {
        flag |= flowWater(blockMap, x, y, x + 1 * Random.sign(), y, 1, false);
        flag |= flowWater(blockMap, x, y, x + 1 * Random.sign(), y, 1, false);
    }
    return flag;
}

function flowWater(blockMap, fromX, fromY, toX, toY, amount, allowBackflow = true)
{
    if (toX >= 0 && toY >= 0 && toX < blockMap.width && toY < blockMap.height)
    {
        let toIndex = toX + toY * blockMap.width;
        let toBlock = blockMap.data[toIndex];
        let toMeta = blockMap.meta[toIndex];

        let fromIndex = fromX + fromY * blockMap.width;
        let fromBlock = blockMap.data[fromIndex];
        let fromMeta = blockMap.meta[fromIndex];

        if (amount > fromMeta) amount = fromMeta;

        if (Blocks.isBlockAir(toBlock))
        {
            let remainder = fromMeta - amount;
            if (remainder <= 0)
            {
                blockMap.data[toIndex] = fromBlock;
                blockMap.meta[toIndex] = fromMeta;
                blockMap.data[fromIndex] = 0;
                blockMap.meta[fromIndex] = 0;
                return true;
            }
            else
            {
                blockMap.data[toIndex] = fromBlock;
                blockMap.meta[toIndex] = amount;
                blockMap.meta[fromIndex] = remainder;
                return true;
            }
        }
        else if (Blocks.isBlockFluid(toBlock) && toMeta < MAX_FLUID_LEVELS)
        {
            if (!allowBackflow && fromMeta <= toMeta) return false;
            
            if (toMeta + amount <= MAX_FLUID_LEVELS)
            {
                blockMap.meta[toIndex] = toMeta + amount;

                if (amount >= fromMeta)
                {
                    blockMap.data[fromIndex] = 0;
                    blockMap.meta[fromIndex] = 0;
                }
                else
                {
                    blockMap.meta[fromIndex] -= amount;
                }
                return true;
            }
            else
            {
                blockMap.meta[toIndex] = MAX_FLUID_LEVELS;

                let remainder = amount - (MAX_FLUID_LEVELS - toMeta);
                blockMap.meta[fromIndex] = remainder;
                return true;
            }
        }
    }
    return false;
}
