import { Random } from './lib.js';
import { BlockMap } from './BlockMap.js';
import { Block, BlockAir, BlockFluid } from './Block.js';
import * as Tetrominoes from './Tetrominoes.js';
import * as Blocks from './Blocks.js';

export const RESPAWN_PLACEMENT_TICKS = 30;

export function initialize()
{
    return {
        placing: false,
        shape: null,
        shapeType: null,
        shapeMap: new BlockMap(Tetrominoes.MAX_WIDTH, Tetrominoes.MAX_HEIGHT),
        value: 0,
        placeX: 0,
        placeY: 0,
        placeTicks: 0,
    };
}

export function update(dt, state, placeInput, rotateInput, blockMap, cx, cy)
{
    const mapCenterX = Math.floor(blockMap.width / 2);
    
    // Block placement
    if (state.placing)
    {
        const shape = state.shape;

        const nextPlaceX = Math.min(blockMap.width - shape.w, Math.max(0, cx - Math.floor((shape.w - 1) / 2)));
        const nextPlaceY = Math.min(blockMap.height - shape.h, Math.max(0, cy - Math.floor((shape.h - 1) / 2)));

        const prevPlaceX = state.placeX;
        if (prevPlaceX < nextPlaceX)
        {
            if (!intersectBlock(shape, prevPlaceX + 1, state.placeY, blockMap))
            {
                state.placeX += 1;
            }
        }
        else if (prevPlaceX > nextPlaceX)
        {
            if (!intersectBlock(shape, prevPlaceX - 1, state.placeY, blockMap))
            {
                state.placeX -= 1;
            }
        }

        const prevPlaceY = state.placeY;
        if (prevPlaceY < nextPlaceY)
        {
            if (!intersectBlock(shape, state.placeX, prevPlaceY + 1, blockMap))
            {
                state.placeY += 1;
            }
        }
        else if (prevPlaceY > nextPlaceY)
        {
            if (!intersectBlock(shape, state.placeX, prevPlaceY - 1, blockMap))
            {
                state.placeY -= 1;
            }
        }

        state.valid = canPlaceBlockShape(state.value, shape, state.placeX, state.placeY, blockMap);
    }

    // Try placing and rotating
    if (state.placeTicks <= 0)
    {
        if (state.placing)
        {
            if (placeInput.value && state.valid)
            {
                placeBlockShape(state.value, state.shape, state.placeX, state.placeY, blockMap);
                state.placing = false;
                state.placeY = 0;
                state.placeTicks = RESPAWN_PLACEMENT_TICKS;
            }

            if (rotateInput.value)
            {
                state.placing = false;
                state.placeY = 0;
            }
        }
        else
        {
            randomizePlacement(state);
            state.placing = true;
            state.placeX = mapCenterX;
            state.placeY = 0;
            state.valid = false;
        }
    }
    else
    {
        state.placeTicks -= dt;
    }
}

function intersectBlock(blockShape, blockX, blockY, blockMap)
{
    const blockMapWidth = blockMap.width;
    const blockMapHeight = blockMap.height;
    const { w, h, m } = blockShape;
    if (blockX + w > blockMapWidth) return true;
    if (blockY + h > blockMapHeight) return true;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                let bi = (x + blockX) + (y + blockY) * blockMapWidth;
                let blockId = blockMap.data[bi];
                let block = Block.getBlock(blockId);
                if (block instanceof BlockFluid)
                {
                    if (blockMap.meta[bi] >= BlockFluid.MAX_FLUID_LEVELS)
                    {
                        return true;
                    }
                }
                else if (!(block instanceof BlockAir))
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function canPlaceBlockShape(blockValue, blockShape, blockX, blockY, blockMap)
{
    if (Blocks.isBlockFluid(blockValue)) return true;

    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i] && blockMap.neighborAt(x + blockX, y + blockY) !== 0b1111)
            {
                return true;
            }
        }
    }
    return false;
}

function placeBlockShape(blockValue, blockShape, blockX, blockY, blockMap)
{
    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                let block = Block.getBlock(blockValue);
                blockMap.placeBlock(x + blockX, y + blockY, block);
            }
        }
    }
}

function randomizePlacement(state)
{
    const shapeType = Random.choose(Tetrominoes.ALL);
    const shapeIndex = Math.floor(Random.range(0, shapeType.length));
    const block = Random.choose([1, 3, 4, 5, 1, 1, 1, 6]);
    state.value = block;
    state.shapeType = shapeType;
    state.shape = shapeType[shapeIndex];
    for(let y = 0; y < state.shapeMap.height; ++y)
    {
        for(let x = 0; x < state.shapeMap.width; ++x)
        {
            state.shapeMap.placeBlock(x, y, Block.getBlock(0));
        }
    }
    placeBlockShape(block, state.shape, 0, 0, state.shapeMap);
}