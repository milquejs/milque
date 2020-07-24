import { Random } from './lib.js';
import * as Fluids from './Fluids.js';
import * as Blocks from './Blocks.js';
import * as Tetrominoes from './Tetrominoes.js';

export const RESPAWN_PLACEMENT_TICKS = 30;

export function initialize()
{
    return {
        placing: false,
        shape: null,
        shapeType: null,
        value: 0,
        placeX: 0,
        placeY: 0,
        placeTicks: 0,
    };
}

export function update(dt, state, placeInput, rotateInput, blockMap, blockSize, cx, cy)
{
    const mapCenterX = Math.floor(blockMap.width / 2);
    
    // Block placement
    if (state.placing)
    {
        const shape = state.shape;

        const nextPlaceX = Math.min(blockMap.width - shape.w, Math.max(0, cx / blockSize - Math.floor((shape.w - 1) / 2)));
        const nextPlaceY = Math.min(blockMap.height - shape.h, Math.max(0, cy / blockSize - Math.floor((shape.h - 1) / 2)));

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
    }

    // Try placing and rotating
    if (state.placeTicks <= 0)
    {
        if (state.placing)
        {
            if (placeInput.value)
            {
                placeBlock(state.value, state.shape, state.placeX, state.placeY, blockMap);
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
        }
    }
    else
    {
        state.placeTicks -= dt;
    }
}

function intersectBlock(blockShape, blockX, blockY, blockMap)
{
    const blockMapData = blockMap.data;
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
                if (blockMapData[bi])
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeBlock(blockValue, blockShape, blockX, blockY, blockMap)
{
    const blockMapWidth = blockMap.width;
    const blockMapData = blockMap.data;
    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                let bi = (x + blockX) + (y + blockY) * blockMapWidth;
                blockMapData[bi] = blockValue;

                if (Blocks.isBlockFluid(blockValue))
                {
                    blockMap.meta[bi] = Fluids.MAX_FLUID_LEVELS;
                }
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
}
