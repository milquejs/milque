import { Random, Camera2D } from './lib.js';
import { BlockMap } from './BlockMap.js';
import { Block, BlockAir, BlockFluid } from './Block.js';
import * as Tetrominoes from './Tetrominoes.js';
import * as Blocks from './Blocks.js';

export const RESPAWN_PLACEMENT_TICKS = 30;
export const PLACEMENT_BLOCK_IDS = [
    1, 3, 4, 5, 6,
];

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

export function update(dt, state, placeInput, rotateInput, world, cx, cy, onplace, onreset)
{
    // Block placement
    if (state.placing)
    {
        const shape = state.shape;

        const nextPlaceX = Math.min(world.bounds.right - shape.w, Math.max(world.bounds.left, cx - Math.floor((shape.w - 1) / 2)));
        const nextPlaceY = Math.min(world.bounds.bottom - shape.h, Math.max(world.bounds.top, cy - Math.floor((shape.h - 1) / 2)));

        const prevPlaceX = state.placeX;
        if (prevPlaceX < nextPlaceX)
        {
            if (!intersectBlock(shape, prevPlaceX + 1, state.placeY, world))
            {
                state.placeX += 1;
            }
        }
        else if (prevPlaceX > nextPlaceX)
        {
            if (!intersectBlock(shape, prevPlaceX - 1, state.placeY, world))
            {
                state.placeX -= 1;
            }
        }

        const prevPlaceY = state.placeY;
        if (prevPlaceY < nextPlaceY)
        {
            if (!intersectBlock(shape, state.placeX, prevPlaceY + 1, world))
            {
                state.placeY += 1;
            }
        }
        else if (prevPlaceY > nextPlaceY)
        {
            if (!intersectBlock(shape, state.placeX, prevPlaceY - 1, world))
            {
                state.placeY -= 1;
            }
        }

        state.valid = canPlaceBlockShape(state.value, shape, state.placeX, state.placeY, world);
    }

    // Try placing and rotating
    if (state.placeTicks <= 0)
    {
        if (state.placing)
        {
            if (placeInput.value && state.valid)
            {
                placeBlockShape(state.value, state.shape, state.placeX, state.placeY, world);
                state.placing = false;
                state.placeTicks = RESPAWN_PLACEMENT_TICKS;

                onplace(state, world);
            }

            if (rotateInput.value)
            {
                state.placing = false;
            }
        }
        else
        {
            randomizePlacement(state);
            state.placing = true;
            state.valid = false;

            onreset(state, world);
        }
    }
    else
    {
        state.placeTicks -= dt;
    }
}

function intersectBlock(blockShape, blockX, blockY, world)
{
    const { w, h, m } = blockShape;
    let blockPos = world.at(0, 0);
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                blockPos.set(x + blockX, y + blockY);
                if (!world.isWithinLoaded(blockPos))
                {
                    continue;
                }

                let blockId = world.getBlockId(blockPos);
                let block = Block.getBlock(blockId);
                if (block instanceof BlockFluid)
                {
                    if (world.getBlockMeta(blockPos) >= BlockFluid.MAX_FLUID_LEVELS)
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

function canPlaceBlockShape(blockValue, blockShape, blockX, blockY, world)
{
    if (Blocks.isBlockFluid(blockValue)) return true;
    
    let blockPos = world.at(blockX, blockY);
    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            blockPos.set(x + blockX, y + blockY);
            let i = x + y * w;
            if (m[i])
            {
                if (!world.isWithinLoaded(blockPos))
                {
                    continue;
                }
                if (world.getBlockNeighbor(blockPos) !== 0b1111)
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeBlockShape(blockValue, blockShape, blockX, blockY, world)
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
                world.placeBlock(x + blockX, y + blockY, block);
            }
        }
    }
}

function randomizePlacement(state)
{
    const shapeType = Random.choose(Tetrominoes.ALL);
    const shapeIndex = Math.floor(Random.range(0, shapeType.length));
    const block = Random.choose(PLACEMENT_BLOCK_IDS);
    state.value = block;
    state.shapeType = shapeType;
    state.shape = shapeType[shapeIndex];
    for(let y = 0; y < state.shapeMap.chunkHeight; ++y)
    {
        for(let x = 0; x < state.shapeMap.chunkWidth; ++x)
        {
            state.shapeMap.placeBlock(x, y, Block.getBlock(0));
        }
    }
    placeBlockShape(block, state.shape, 0, 0, state.shapeMap);
}

export function getPlacementSpawnPosition(
    cursorX, cursorY, blockSize,
    displayWidth, displayHeight,
    viewMatrix, projectionMatrix)
{
    let resultX = 0;
    let resultY = 0;
    
    const quadIndex = (cursorX <= 0.5 ? 0 : 2) + (cursorY <= 0.5 ? 0 : 1);
    switch(quadIndex)
    {
        case 0: // TopLeft
        {
            let corner = Camera2D.screenToWorld(
                0, 0,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
        case 1: // BottomLeft
        {
            let corner = Camera2D.screenToWorld(
                0, displayHeight,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
        case 2: // TopRight
        {
            let corner = Camera2D.screenToWorld(
                displayWidth, 0,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
        case 3: // BottomRight
        {
            let corner = Camera2D.screenToWorld(
                displayWidth, displayHeight,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
    }

    return [
        Math.floor(resultX / blockSize),
        Math.floor(resultY / blockSize)
    ];
}
