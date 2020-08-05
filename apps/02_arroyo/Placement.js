import { Random, Camera2D } from './lib.js';

import { ChunkMap } from './chunk/ChunkMap.js';

import * as Tetrominoes from './Tetrominoes.js';

import { BLOCKS } from './block/BlockRegistry.js';
import { FLUID_COMPONENT, AIR_COMPONENT, MAX_FLUID_LEVELS } from './block/fluid/FluidSystem.js';
import { placeBlock } from './block/placement/PlacementSystem.js';

export const RESPAWN_PLACEMENT_TICKS = 30;
export const PLACEMENT_BLOCK_IDS = [
    1, 3, 4, 5, 6,
];

export function initialize()
{
    return {
        placing: false,
        floating: true,
        shape: null,
        shapeType: null,
        shapeMap: new ChunkMap(0, 0, Tetrominoes.MAX_WIDTH, Tetrominoes.MAX_HEIGHT),
        value: 0,
        placeX: 0,
        placeY: 0,
        placeTicks: 0,
    };
}

export function update(dt, state, placeInput, rotateInput, world, cx, cy, onplace, onreset)
{
    const worldMap = world.map;

    // Block placement
    if (state.placing)
    {
        const shape = state.shape;

        const nextPlaceX = Math.min(worldMap.bounds.right - shape.w, Math.max(worldMap.bounds.left, cx - Math.floor((shape.w - 1) / 2)));
        const nextPlaceY = Math.min(worldMap.bounds.bottom - shape.h, Math.max(worldMap.bounds.top, cy - Math.floor((shape.h - 1) / 2)));

        if (state.floating)
        {
            const dx = Math.sign(nextPlaceX - state.placeX);
            const dy = Math.sign(nextPlaceY - state.placeY);
            if (!intersectBlock(shape, state.placeX + dx, state.placeY + dy, worldMap))
            {
                state.floating = false;
            }
            state.placeX += dx;
            state.placeY += dy;
            state.valid = false;
        }
        else
        {
            const prevPlaceX = state.placeX;
            if (prevPlaceX < nextPlaceX)
            {
                if (!intersectBlock(shape, prevPlaceX + 1, state.placeY, worldMap))
                {
                    state.placeX += 1;
                }
            }
            else if (prevPlaceX > nextPlaceX)
            {
                if (!intersectBlock(shape, prevPlaceX - 1, state.placeY, worldMap))
                {
                    state.placeX -= 1;
                }
            }
    
            const prevPlaceY = state.placeY;
            if (prevPlaceY < nextPlaceY)
            {
                if (!intersectBlock(shape, state.placeX, prevPlaceY + 1, worldMap))
                {
                    state.placeY += 1;
                }
            }
            else if (prevPlaceY > nextPlaceY)
            {
                if (!intersectBlock(shape, state.placeX, prevPlaceY - 1, worldMap))
                {
                    state.placeY -= 1;
                }
            }

            state.valid = canPlaceBlockShape(state.value, shape, state.placeX, state.placeY, worldMap);
        }
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

                onplace(state);
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
            state.floating = true;
            state.valid = false;

            onreset(state);
        }
    }
    else
    {
        state.placeTicks -= dt;
    }
}

function intersectBlock(blockShape, blockX, blockY, worldMap)
{
    const { w, h, m } = blockShape;
    let blockPos = worldMap.at(0, 0);
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                blockPos.set(x + blockX, y + blockY);
                if (!worldMap.isWithinLoaded(blockPos))
                {
                    continue;
                }

                let blockId = worldMap.getBlockId(blockPos);
                if (BLOCKS.hasComponent(FLUID_COMPONENT, blockId))
                {
                    if (worldMap.getBlockMeta(blockPos) >= MAX_FLUID_LEVELS)
                    {
                        return true;
                    }
                }
                else if (!BLOCKS.hasComponent(AIR_COMPONENT, blockId))
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function canPlaceBlockShape(blockValue, blockShape, blockX, blockY, worldMap)
{
    if (BLOCKS.hasComponent(FLUID_COMPONENT, blockValue)) return true;
    
    let blockPos = worldMap.at(blockX, blockY);
    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            blockPos.set(x + blockX, y + blockY);
            let i = x + y * w;
            if (m[i])
            {
                if (!worldMap.isWithinLoaded(blockPos))
                {
                    continue;
                }
                if (worldMap.getBlockNeighbor(blockPos) !== 0b1111)
                {
                    return true;
                }
            }
        }
    }
    return false;
}

function placeBlockShape(blockId, blockShape, blockX, blockY, world)
{
    const { w, h, m } = blockShape;
    let blockPos = world.map.at(0, 0);
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                blockPos.set(x + blockX, y + blockY);
                placeBlock(world, blockPos, blockId);
            }
        }
    }
}

function setBlockShape(blockId, blockShape, blockX, blockY, shapeMap)
{
    const { w, h, m } = blockShape;
    let blockPos = shapeMap.at(0, 0);
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                blockPos.set(x + blockX, y + blockY);
                shapeMap.setBlockId(blockPos, blockId);
            }
        }
    }
}

function randomizePlacement(state)
{
    const shapeType = Random.choose(Tetrominoes.ALL);
    const shapeIndex = Math.floor(Random.range(0, shapeType.length));

    const currentBlockId = state.value;
    let flag = false;
    switch(currentBlockId)
    {
        case 0:
            flag = true;
            break;
        case 1: // Water
            flag = Random.next() < (1 / 6);
            break;
        case 3: // Dirt
            flag = Random.next() < (1 / 10);
            break;
        case 4: // Gold
            flag = Random.next() < (1 / 2);
            break;
        case 5: // Grass
            flag = Random.next() < (1 / 2);
            break;
        case 6: // Stone
            flag = Random.next() < (1 / 10);
            break;
        default:
            flag = Random.next() < (1 / 5);
            break;
    }

    const nextBlockId = flag ? Random.choose(PLACEMENT_BLOCK_IDS) : currentBlockId;
    state.value = nextBlockId;
    state.shapeType = shapeType;
    state.shape = shapeType[shapeIndex];
    state.shapeMap.clear();
    setBlockShape(nextBlockId, state.shape, 0, 0, state.shapeMap);
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
