import { CanvasView, Camera2D, Random, Discrete } from './lib.js';
import * as Tetrominoes from './Tetrominoes.js';
import * as Blocks from './Blocks.js';
import { BlockMap } from './BlockMap.js';

document.addEventListener('DOMContentLoaded', main);

const RESPAWN_PLACEMENT_TICKS = 30;
const MAX_BLOCK_TICKS = 10;

const MAX_FLUID_LEVELS = 3;

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');

    const CursorX = input.getInput('cursorX');
    const CursorY = input.getInput('cursorY');
    const Place = input.getInput('place');
    const Rotate = input.getInput('rotate');

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const view = new CanvasView();
    const camera = new Camera2D();

    const blockSize = 5;
    const blockMap = new BlockMap(20, 30);
    let blockTicks = 0;
    {
        let centerX = Math.floor(blockMap.width / 2);
        let centerY = Math.floor(blockMap.height / 2);
        blockMap.at(centerX, centerY).block = Blocks.GOLD.blockId;
        blockMap.at(centerX - 1, centerY + 0).block = Blocks.DIRT.blockId;
        blockMap.at(centerX + 1, centerY + 0).block = Blocks.DIRT.blockId;
        blockMap.at(centerX + 0, centerY - 1).block = Blocks.GRASS.blockId;
        blockMap.at(centerX + 0, centerY + 1).block = Blocks.DIRT.blockId;

        blockMap.at(centerX - 1, centerY - 1).block = Blocks.GRASS.blockId;
        blockMap.at(centerX + 1, centerY - 1).block = Blocks.GRASS.blockId;
        blockMap.at(centerX + 1, centerY + 1).block = Blocks.DIRT.blockId;
        blockMap.at(centerX - 1, centerY + 1).block = Blocks.DIRT.blockId;
    }

    camera.moveTo(-display.width / 2 + (blockSize * blockMap.width / 2), 0);

    let placement = null;
    let placeX = 0;
    let placeY = 0;
    let placeTicks = 0;

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000 * 60;
        ctx.clearRect(0, 0, display.width, display.height);

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        let [ cx, cy ] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        cx = Math.floor(cx / blockSize) * blockSize;
        cy = Math.floor(cy / blockSize) * blockSize;

        // Block placement
        if (placement)
        {
            let nextPlaceX = Math.min(blockMap.width - placement.shape.w, Math.max(0, cx / blockSize - Math.floor((placement.shape.w - 1) / 2)));
            let nextPlaceY = Math.min(blockMap.height - placement.shape.h, Math.max(0, cy / blockSize - Math.floor((placement.shape.h - 1) / 2)));

            placeX = nextPlaceX;
            placeY = nextPlaceY;
        }

        // Try placing and rotating
        {
            if (placeTicks <= 0)
            {
                if (placement)
                {
                    if (Place.value)
                    {
                        placeBlock(placement.value, placement.shape, placeX, placeY, blockMap);
                        placement = null;
                        placeY = 0;
                        placeTicks = RESPAWN_PLACEMENT_TICKS;
                    }

                    if (Rotate.value)
                    {
                        placement.rotate();
                    }
                }
                else
                {
                    placement = randomizePlacement();
                    placeX = placement.shape.w;
                    placeY = 0;
                }
            }
            else
            {
                placeTicks -= dt;
            }
        }

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // Do water physics.
            for(let y = blockMap.height - 1; y >= 0; --y)
            {
                for(let x = 0; x < blockMap.width; ++x)
                {
                    let i = x + y * blockMap.width;
                    let block = blockMap.data[i];
                    if (Blocks.isBlockFluid(block))
                    {
                        if (!tryFlowWaterDown(blockMap, x, y) && !tryFlowWaterSide(blockMap, x, y))
                        {
                            /*
                            // Is it stable? Probably not.
                            let flag = true;

                            let pos = blockMap.at(x, y);
                            flag &= !pos.down() || (!isBlockAir(pos.block) && !isBlockFluid(pos.block));
                            pos.set(x, y);
                            flag &= !pos.left() || (!isBlockAir(pos.block) && !isBlockFluid(pos.block));
                            pos.set(x, y);
                            flag &= !pos.right() || (!isBlockAir(pos.block) && !isBlockFluid(pos.block));
                            pos.set(x, y);

                            if (flag)
                            {
                                blockMap.data[i] = 2;
                                blockMap.meta[i] = 0;
                            }
                            */
                        }
                    }
                }
            }
        }
        else
        {
            blockTicks -= dt;
        }

        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            drawBlockMap(ctx, blockMap, blockSize);

            if (placement)
            {
                ctx.fillStyle = Blocks.getBlockColor(placement.value);
                ctx.translate(placeX * blockSize, placeY * blockSize);
                drawBlock(ctx, placement.shape, blockSize);
                ctx.translate(-placeX * blockSize, -placeY * blockSize);
            }
        }
        view.end(ctx);
    });
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

function drawBlockMap(ctx, blockMap, blockSize)
{
    const blockMapWidth = blockMap.width;
    const blockMapHeight = blockMap.height;
    const blockMapMeta = blockMap.meta;
    const blockMapData = blockMap.data;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            let i = x + y * blockMapWidth;
            let block = blockMapData[i];
            if (!Blocks.isBlockAir(block))
            {
                if (Blocks.isBlockFluid(block))
                {
                    let meta = blockMapMeta[i];
                    let fluidRatio = meta / MAX_FLUID_LEVELS;
                    let color = Blocks.getBlockColor(block);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * blockSize, y * blockSize + (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
                }
                else
                {
                    let color = Blocks.getBlockColor(block);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}

function drawBlock(ctx, blockShape, blockSize)
{
    const { w, h, m } = blockShape;
    for(let y = 0; y < h; ++y)
    {
        for(let x = 0; x < w; ++x)
        {
            let i = x + y * w;
            if (m[i])
            {
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            }
        }
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
                    blockMap.meta[bi] = MAX_FLUID_LEVELS;
                }
            }
        }
    }
}

function randomizePlacement()
{
    return {
        value: Random.choose([1, 3, 4, 5, 1, 1, 1]),
        shapeType: Random.choose(Tetrominoes.ALL),
        shapeIndex: 0,
        get shape() { return this.shapeType[this.shapeIndex]; },
        rotate()
        {
            ++this.shapeIndex;
            if (this.shapeIndex >= this.shapeType.length)
            {
                this.shapeIndex = 0;
            }
            return this;
        }
    };
}
