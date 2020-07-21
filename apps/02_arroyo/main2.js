import { CanvasView, Camera2D, Random } from './lib.js';
import * as Tetrominoes from './Tetrominoes.js';

document.addEventListener('DOMContentLoaded', main);

const MAX_PLACEMENT_TICKS = 100;
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

    const blockSize = 10;
    const blockMapWidth = 10;
    const blockMapHeight = 15;
    const blockMapLength = blockMapWidth * blockMapHeight;
    let blockMap = {
        width: blockMapWidth,
        height: blockMapHeight,
        length: blockMapLength,
        data: new Array(blockMapLength).fill(0),
        meta: new Array(blockMapLength).fill(0),
    };
    let blockTicks = 0;

    camera.moveTo(-display.width / 2 + (blockSize * blockMapWidth / 2), 0);

    let placement = null;
    let placeX = 0;
    let placeY = 0;
    let placeTicks = 0;

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000 * 60;
        ctx.clearRect(0, 0, display.width, display.height);

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // WorldPos (by block)
        let [ cx, cy ] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        cx = Math.floor(cx / blockSize) * blockSize;
        cy = Math.floor(cy / blockSize) * blockSize;

        // BlockPos

        // Compute placeX
        if (placement)
        {
            let nextPlaceX = Math.min(blockMapWidth - placement.shape.w, Math.max(0, cx / blockSize - Math.floor((placement.shape.w - 1) / 2)));
            for(; placeX < nextPlaceX; ++placeX)
            {
                if (intersectBlock(placement.shape, placeX + 1, placeY, blockMap, blockMapWidth, blockMapHeight))
                {
                    break;
                }
            }
            for(; placeX > nextPlaceX; --placeX)
            {
                if (intersectBlock(placement.shape, placeX - 1, placeY, blockMap, blockMapWidth, blockMapHeight))
                {
                    break;
                }
            }
        }

        // Compute placeY
        {
            if (placeTicks <= 0)
            {
                if (placement)
                {
                    if (!intersectBlock(placement.shape, placeX, placeY + 1, blockMap, blockMapWidth, blockMapHeight))
                    {
                        ++placeY;
                        placeTicks = MAX_PLACEMENT_TICKS;
                    }
                    else
                    {
                        placeBlock(placement.value, placement.shape, placeX, placeY, blockMap, blockMapWidth, blockMapHeight);
                        placement = null;
                        placeY = 0;
                        placeTicks = RESPAWN_PLACEMENT_TICKS;
                    }
                }
                else
                {
                    placement = randomizePlacement();
                    placeX = placement.shape.w;
                    placeY = 0;
                    placeTicks = MAX_PLACEMENT_TICKS;
                }
            }
            else if (placement && Place.value)
            {
                placeTicks -= dt * 60;
            }
            else
            {
                placeTicks -= dt;
            }
        }

        let potentialPlaceY = 0;
        if (placement)
        {
            for(potentialPlaceY = placeY; potentialPlaceY < blockMapHeight; ++potentialPlaceY)
            {
                if (intersectBlock(placement.shape, placeX, potentialPlaceY, blockMap, blockMapWidth, blockMapHeight))
                {
                    --potentialPlaceY;
                    break;
                }
            }
        }
        
        if (placement && Rotate.value)
        {
            placement.rotate();
            placeTicks = MAX_PLACEMENT_TICKS;
        }

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // Do water physics.
            for(let y = blockMapHeight - 1; y >= 0; --y)
            {
                for(let x = 0; x < blockMapWidth; ++x)
                {
                    let i = x + y * blockMapWidth;
                    let block = blockMap.data[i];
                    if (isBlockFluid(block))
                    {
                        if (!tryFlowWaterDown(blockMap, x, y) && !tryFlowWaterSide(blockMap, x, y))
                        {
                            /*
                            // Is it stable? Probably not.
                            let flag = true;

                            let pos = BlockPos(blockMap, x, y);
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
            drawBlockMap(ctx, blockMap, blockMapWidth, blockMapHeight, blockSize);

            if (placement)
            {
                ctx.fillStyle = getBlockColor(placement.value);
                ctx.translate(placeX * blockSize, placeY * blockSize);
                drawBlock(ctx, placement.shape, blockSize);
                ctx.translate(-placeX * blockSize, -placeY * blockSize);
    
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.translate(placeX * blockSize, potentialPlaceY * blockSize);
                drawBlock(ctx, placement.shape, blockSize);
                ctx.translate(-placeX * blockSize, -potentialPlaceY * blockSize);
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

        if (isBlockAir(toBlock))
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
        else if (isBlockFluid(toBlock) && toMeta < MAX_FLUID_LEVELS)
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

function drawBlockMap(ctx, blockMap, blockMapWidth, blockMapHeight, blockSize)
{
    const blockMapMeta = blockMap.meta;
    const blockMapData = blockMap.data;
    for(let y = 0; y < blockMapHeight; ++y)
    {
        for(let x = 0; x < blockMapWidth; ++x)
        {
            let i = x + y * blockMapWidth;
            let block = blockMapData[i];
            if (!isBlockAir(block))
            {
                if (isBlockFluid(block))
                {
                    let meta = blockMapMeta[i];
                    let fluidRatio = meta / MAX_FLUID_LEVELS;
                    let color = getBlockColor(block);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * blockSize, y * blockSize + (1 - fluidRatio) * blockSize, blockSize, blockSize * fluidRatio);
                }
                else
                {
                    let color = getBlockColor(block);
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

function intersectBlock(blockShape, blockX, blockY, blockMap, blockMapWidth, blockMapHeight)
{
    const blockMapData = blockMap.data;
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

function placeBlock(blockValue, blockShape, blockX, blockY, blockMap, blockMapWidth, blockMapHeight)
{
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

                if (isBlockFluid(blockValue))
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

function isBlockAir(block)
{
    return block === 0;
}

function isBlockFluid(block)
{
    return block === 1;
}

function BlockPos(blockMap, x, y)
{
    return {
        x, y,
        index: x + y * blockMap.width,
        get block() { return blockMap.data[this.index]; },
        get meta() { return blockMap.meta[this.index]; },
        set(x, y)
        {
            this.x = x;
            this.y = y;
            this.index = this.x + this.y * blockMap.width;
            return this;
        },
        down(offset = 1)
        {
            if (this.y + offset > blockMap.height)
            {
                return null;
            }
            else
            {
                this.y += offset;
                this.index = this.x + this.y * blockMap.width;
                return this;
            }
        },
        up(offset = 1)
        {
            if (this.y - offset < 0)
            {
                return null;
            }
            else
            {
                this.y -= offset;
                this.index = this.x + this.y * blockMap.width;
                return this;
            }
        },
        left(offset = 1)
        {
            if (this.x - offset < 0)
            {
                return null;
            }
            else
            {
                this.x -= offset;
                this.index = this.x + this.y * blockMap.width;
                return this;
            }
        },
        right(offset = 1)
        {
            if (this.x + offset > blockMap.width)
            {
                return null;
            }
            else
            {
                this.x += offset;
                this.index = this.x + this.y * blockMap.width;
                return this;
            }
        },
    };
}

function getBlockColor(block)
{
    switch(block)
    {
        case 1: return 'dodgerblue';
        case 2: return 'cornflowerblue';
        case 3: return 'saddlebrown';
        case 4: return 'gold';
        case 5: return 'limegreen';
        default: return 'white';
    }
}
