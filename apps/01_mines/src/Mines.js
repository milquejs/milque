import { Random } from '@milque/random';

export class Mines
{
    constructor(width, height, rand = new Random())
    {
        this.width = width;
        this.height = height;
        this.length = width * height;
        this.rand = rand;

        this.dangerCount = this.length * 0.2;
        
        this.data = {
            tiles: new Array(length),
            overlay: new Array(length),
            regions: new Array(length),
            solids: new Array(length),
            marks: new Array(length),
        };

        setupChunkData(this, this.dangerCount, this.rand);
    }

    dig(tileX, tileY)
    {
        const chunkWidth = this.width;
        const chunkHeight = this.height;
        let chunkData = this.data;

        let tileIndex = tileX + tileY * chunkWidth;
        if (chunkData.solids[tileIndex] <= 0) return true;
        if (chunkData.marks[tileIndex] > 0) return true;
        
        // Got the bad square :(
        if (chunkData.tiles[tileIndex] > 0)
        {
            chunkData.solids[tileIndex] = 0;
            return false;
        }
    
        let visited = new Set();
        let unchecked = [];
        unchecked.push(tileIndex);
        while(unchecked.length > 0)
        {
            let next = unchecked.pop();
            visited.add(next);
    
            let nextX = next % chunkWidth;
            let nextY = Math.floor(next / chunkWidth);
    
            chunkData.solids[next] = 0;
            if (chunkData.overlay[next] <= 0)
            {
                let neighbors = getNeighbors(nextX, nextY, chunkWidth, chunkHeight);
                for(let neighbor of neighbors)
                {
                    if (!visited.has(neighbor) && chunkData.marks[neighbor] <= 0)
                    {
                        unchecked.push(neighbor);
                    }
                }
            }
        }
    
        return true;
    }

    mark(tileX, tileY)
    {
        const chunkWidth = this.width;
        let chunkData = this.data;
        
        let tileIndex = tileX + tileY * chunkWidth;
        if (chunkData.solids[tileIndex] <= 0) return false;
    
        if (chunkData.marks[tileIndex] > 0)
        {
            chunkData.marks[tileIndex] = 0;
        }
        else
        {
            chunkData.marks[tileIndex] = 1;
        }
        return true;
    }

    checkWinCondition()
    {
        const chunkData = this.data;
        for(let i = 0; i < chunkData.tiles.length; ++i)
        {
            if (chunkData.solids[i] > 0 && chunkData.tiles[i] <= 0)
            {
                return false;
            }
        }
        return true;
    }

    reset()
    {
        setupChunkData(this, this.dangerCount, this.rand);
    }

    clear()
    {
        let chunkData = this.data;
        for(let i = 0; i < this.length; ++i)
        {
            chunkData.tiles[i] = 0;
            chunkData.overlay[i] = 0;
            chunkData.solids[i] = 1;
            chunkData.regions[i] = 0;
            chunkData.marks[i] = 0;
        }
    }
}

function setupChunkData(mines, mineCount, rand)
{
    mines.clear();
    
    const chunkWidth = mines.width;
    const chunkHeight = mines.height;
    const chunkRand = mines.rand;
    let chunkData = mines.data;

    for(let i = 0; i < mineCount; ++i)
    {
        let x = Math.floor(rand.range(0, chunkWidth));
        let y = Math.floor(rand.range(0, chunkHeight));
        let tileIndex = x + y * chunkWidth;

        let tile = 1;
        if (chunkData.tiles[tileIndex] === 0)
        {
            chunkData.tiles[tileIndex] += tile;
            chunkData.overlay[tileIndex] = Infinity;
            for(let neighbor of getNeighbors(x, y, chunkWidth, chunkHeight))
            {
                chunkData.overlay[neighbor] += tile;
            }
        }
        else
        {
            --i;
        }
    }

    const regions = Array.from(
        regionize(chunkData, chunkWidth, chunkHeight, i => chunkData.overlay[i] > 0).values()
    ).sort((a, b) => a.count - b.count);
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
    let targetRegion = chunkRand.choose(medianRegions);
    let targetTileIndex = targetRegion.tileIndex;

    let digX = targetTileIndex % chunkWidth;
    let digY = Math.floor(targetTileIndex / chunkWidth);
    mines.dig(digX, digY);
}

function regionize(chunkData, chunkWidth, chunkHeight, isSeparator)
{
    const length = chunkData.tiles.length;

    let regionMapping = new Map();
    let tileToRegionMapping = new Map();

    let regionIndex = 1;
    for(let i = 0; i < length; ++i)
    {
        if (isSeparator(i))
        {
            chunkData.regions[i] = -1;
        }
        else
        {
            let result = subRegionize(chunkData, chunkWidth, chunkHeight, i, regionIndex++, isSeparator);
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

function subRegionize(chunkData, chunkWidth, chunkHeight, index, regionIndex, isSeparator)
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

        let nextX = next % chunkWidth;
        let nextY = Math.floor(next / chunkWidth);
        
        chunkData.regions[next] = regionIndex;
        if (next < minIndex) minIndex = next;
        
        let neighbors = getNeighbors(nextX, nextY, chunkWidth, chunkHeight);
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

function getNeighbors(tileX, tileY, chunkWidth, chunkHeight)
{
    let dst = [];
    let tileIndex = tileX + tileY * chunkWidth;
    // Cardinals
    if (tileX > 0) dst.push(tileIndex - 1);
    if (tileX < chunkWidth - 1) dst.push(tileIndex + 1);
    if (tileY > 0) dst.push(tileIndex - chunkWidth);
    if (tileY < chunkHeight - 1) dst.push(tileIndex + chunkWidth);
    // Inter-Cardinals
    if (tileX > 0 && tileY > 0) dst.push(tileIndex - 1 - chunkWidth);
    if (tileX < chunkWidth - 1 && tileY > 0) dst.push(tileIndex + 1 - chunkWidth);
    if (tileX > 0 && tileY < chunkHeight - 1) dst.push(tileIndex - 1 + chunkWidth);
    if (tileX < chunkWidth - 1 && tileY < chunkHeight - 1) dst.push(tileIndex + 1 + chunkWidth);
    return dst;
}
