/*

What is good in Minesweeper?
- Inherant scaling difficulty as the game progresses (less tiles)
- Clean ruleset
    - Deductive reasoning and arithmetic (best forms of logic for play)
- Replay value (randomized maps)
- Pure form

deterministic, mostly.
High risk / High reward? (sadly, only high risk)

What is bad in minesweeper?
- Doesn't have a progression Curve.
- Don't have low risk options.
- DONT LIKE TIMED TASKS!!!
    - Hard ceiling
- CANNOT BE IMPOSSIBLE TO WIN

*/

import { Random, Utils } from './milque.js';

// Some of the bombs are treasures.
// Either chance it, use a life, or use a scanner.

export const TILE_SIZE = 16;
export const TILE_OFFSET_X = TILE_SIZE / 2;
export const TILE_OFFSET_Y = TILE_SIZE / 2;
export const CHUNK_WIDTH = 16;
export const CHUNK_HEIGHT = 16;

export const CHUNK_OFFSET_X = 32;
export const CHUNK_OFFSET_Y = 32;

const MINE_COUNT = 40;
const CHUNK_RAND = Random.createRandom(Math.random());

const TILE_IMAGE = Utils.loadImage('../res/tile.png');
const NUMS_IMAGE = Utils.loadImage('../res/nums.png');
const MARK_IMAGE = Utils.loadImage('../res/flag.png');

export function renderChunk(view, chunk)
{
    let ctx = view.context;
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, view.width, view.height);
    drawGrid(ctx, 0, 0, view.width, view.height, TILE_SIZE, TILE_SIZE);

    ctx.translate(CHUNK_OFFSET_X, CHUNK_OFFSET_Y);

    for(let y = 0; y < CHUNK_HEIGHT; ++y)
    {
        for(let x = 0; x < CHUNK_WIDTH; ++x)
        {
            let renderX = TILE_OFFSET_X + x * TILE_SIZE;
            let renderY = TILE_OFFSET_Y + y * TILE_SIZE;
            let tileIndex = x + y * CHUNK_WIDTH;

            if (chunk.solids[tileIndex] > 0)
            {
                ctx.drawImage(TILE_IMAGE, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                if (chunk.marks[tileIndex] > 0)
                {
                    ctx.drawImage(MARK_IMAGE, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                }
            }
            else
            {
                if (chunk.tiles[tileIndex] > 0)
                {
                    // ctx.drawImage(TILE_IMAGE, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                    Utils.drawBox(ctx, renderX, renderY, 0, TILE_SIZE, TILE_SIZE, 'rgba(0, 0, 0, 0.2)');
                    Utils.drawText(ctx, 'X', renderX, renderY, 0, 10, 'black');
                }
                else if (chunk.overlay[tileIndex] > 0)
                {
                    let num = chunk.overlay[tileIndex] - 1;
                    ctx.drawImage(NUMS_IMAGE, 32 * num, 0, 32, 32, renderX - TILE_SIZE / 2, renderY - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
                }
            }

            // Utils.drawText(ctx, chunk.regions[tileIndex], renderX, renderY, 0, 8, 'black');
        }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function createChunk()
{
    const length = CHUNK_WIDTH * CHUNK_HEIGHT;
    let result = {
        tiles: new Array(length),
        overlay: new Array(length),
        regions: new Array(length),
        solids: new Array(length),
        marks: new Array(length),
    };
    setupMap(result);
    return result;
}

export function setupMap(chunk)
{
    for(let i = 0; i < chunk.tiles.length; ++i)
    {
        chunk.tiles[i] = 0;
        chunk.overlay[i] = 0;
        chunk.solids[i] = 1;
        chunk.regions[i] = 0;
        chunk.marks[i] = 0;
    }

    for(let i = 0; i < MINE_COUNT; ++i)
    {
        let x = Math.floor(CHUNK_RAND.randomRange(0, CHUNK_WIDTH));
        let y = Math.floor(CHUNK_RAND.randomRange(0, CHUNK_HEIGHT));
        let tileIndex = x + y * CHUNK_WIDTH;

        let tile = 1;
        if (chunk.tiles[tileIndex] === 0)
        {
            chunk.tiles[tileIndex] += tile;
            chunk.overlay[tileIndex] = Infinity;
            for(let neighbor of getNeighbors(x, y))
            {
                chunk.overlay[neighbor] += tile;
            }
        }
        else
        {
            --i;
        }
    }

    const regions = Array.from(regionize(chunk, i => chunk.overlay[i] > 0).values()).sort((a, b) => a.count - b.count);
    const regionBySize = [ [ regions[0] ] ];
    let sizeIndex = 0;
    for(let region of regions)
    {
        if (regionBySize[sizeIndex][0].count !== region.count)
        {
            regionBySize[++sizeIndex] = [ region ];
        }
        else
        {
            regionBySize[sizeIndex].push(region);
        }
    }
    let medianRegions = regionBySize[Math.floor(regionBySize.length / 2)];
    let targetRegion = CHUNK_RAND.randomChoose(medianRegions);
    let targetTileIndex = targetRegion.tileIndex;
    digTiles(chunk, targetTileIndex % CHUNK_WIDTH, Math.floor(targetTileIndex / CHUNK_WIDTH));
}

function regionize(chunk, isSeparator)
{
    let regionMapping = new Map();
    let tileToRegionMapping = new Map();

    let regionIndex = 1;
    const length = CHUNK_WIDTH * CHUNK_HEIGHT;
    for(let i = 0; i < length; ++i)
    {
        if (isSeparator(i))
        {
            chunk.regions[i] = -1;
        }
        else
        {
            let result = subRegionize(chunk, i, regionIndex++, isSeparator);
            if (result)
            {
                if (tileToRegionMapping.has(result.tileIndex))
                {
                    const regionIndex = tileToRegionMapping.get(result.tileIndex);
                    regionMapping.delete(regionIndex);
                    tileToRegionMapping.delete(result.tileIndex);
                }
                tileToRegionMapping.set(result.tileIndex, result.regionIndex);
                regionMapping.set(result.regionIndex, result);
            }
        }
    }

    return regionMapping;
}

function subRegionize(chunk, index, regionIndex, isSeparator)
{
    let minIndex = Infinity;
    let visited = new Set();
    let unchecked = [];
    unchecked.push(index);
    while(unchecked.length > 0)
    {
        let next = unchecked.pop();
        if (isSeparator(next)) continue;

        visited.add(next);

        let nextX = next % CHUNK_WIDTH;
        let nextY = Math.floor(next / CHUNK_WIDTH);
        
        chunk.regions[next] = regionIndex;
        if (next < minIndex) minIndex = next;
        
        let neighbors = getNeighbors(nextX, nextY);
        for(let neighbor of neighbors)
        {
            if (!visited.has(neighbor))
            {
                unchecked.push(neighbor);
            }
        }
    }

    if (minIndex < Infinity)
    {
        return {
            tileIndex: minIndex,
            regionIndex,
            count: visited.size,
        };
    }
    else
    {
        return null;
    }
}

function drawGrid(ctx, offsetX, offsetY, width, height, tileWidth, tileHeight)
{
    ctx.strokeStyle = '#888888';
    ctx.beginPath();

    for(let y = 0; y < height; y += tileHeight)
    {
        ctx.moveTo(offsetX, y + offsetY);
        ctx.lineTo(offsetX + width, y + offsetY);
    }

    for(let x = 0; x < width; x += tileWidth)
    {
        ctx.moveTo(x + offsetX, offsetY);
        ctx.lineTo(x + offsetX, offsetY + height);
    }

    ctx.stroke();
}

export function markTile(chunk, tileX, tileY)
{
    let tileIndex = tileX + tileY * CHUNK_WIDTH;
    if (chunk.solids[tileIndex] <= 0) return false;

    if (chunk.marks[tileIndex] > 0)
    {
        chunk.marks[tileIndex] = 0;
    }
    else
    {
        chunk.marks[tileIndex] = 1;
    }
    return true;
}

export function digTiles(chunk, tileX, tileY)
{
    let tileIndex = tileX + tileY * CHUNK_WIDTH;
    if (chunk.solids[tileIndex] <= 0) return true;
    if (chunk.marks[tileIndex] > 0) return true;
    
    // Got the bad square :(
    if (chunk.tiles[tileIndex] > 0)
    {
        chunk.solids[tileIndex] = 0;
        return false;
    }

    let visited = new Set();
    let unchecked = [];
    unchecked.push(tileIndex);
    while(unchecked.length > 0)
    {
        let next = unchecked.pop();
        visited.add(next);

        let nextX = next % CHUNK_WIDTH;
        let nextY = Math.floor(next / CHUNK_WIDTH);

        chunk.solids[next] = 0;
        if (chunk.overlay[next] <= 0)
        {
            let neighbors = getNeighbors(nextX, nextY);
            for(let neighbor of neighbors)
            {
                if (!visited.has(neighbor) && chunk.marks[neighbor] <= 0)
                {
                    unchecked.push(neighbor);
                }
            }
        }
    }

    return true;
}

export function getNeighbors(tileX, tileY)
{
    let dst = [];
    let tileIndex = tileX + tileY * CHUNK_WIDTH;
    // Cardinals
    if (tileX > 0) dst.push(tileIndex - 1);
    if (tileX < CHUNK_WIDTH - 1) dst.push(tileIndex + 1);
    if (tileY > 0) dst.push(tileIndex - CHUNK_WIDTH);
    if (tileY < CHUNK_HEIGHT - 1) dst.push(tileIndex + CHUNK_WIDTH);
    // Diagonal Cardinals
    if (tileX > 0 && tileY > 0) dst.push(tileIndex - 1 - CHUNK_WIDTH);
    if (tileX < CHUNK_WIDTH - 1 && tileY > 0) dst.push(tileIndex + 1 - CHUNK_WIDTH);
    if (tileX > 0 && tileY < CHUNK_HEIGHT - 1) dst.push(tileIndex - 1 + CHUNK_WIDTH);
    if (tileX < CHUNK_WIDTH - 1 && tileY < CHUNK_HEIGHT - 1) dst.push(tileIndex + 1 + CHUNK_WIDTH);
    return dst;
}
