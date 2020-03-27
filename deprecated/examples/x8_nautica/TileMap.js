/**
 * @version 1.1.0
 * # Changelog
 * ## 1.1.0
 * - Added generators for keys(), values(), and entries()
 * ## 1.0.0
 * - Created TileMap
 */
export class TileMap
{
    static parse(dataString)
    {
        let separator = dataString.indexOf(':');
        let size = dataString.substring(0, separator).split(',').map(v => Number(v));
        let data = dataString.substring(separator + 1).split(',').map(v => Number(v));
        let result = new TileMap(size[0], size[1], size[2]);
        for(let i = 0; i < data.length; ++i)
        {
            result.data[i] = data[i];
        }
        return result;
    }

    static stringify(tileMap)
    {
        let size = [tileMap.width, tileMap.height, tileMap.depth].join(',');
        let data = tileMap.data.join(',');
        return size + ':' + data;
    }

    constructor(width, height = width, depth = 1)
    {
        this.data = new Array(width * height * depth);

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.length = width * height;
    }

    get(tileX, tileY, layerIndex = 0)
    {
        return this.data[tileX + tileY * this.width + layerIndex * this.length];
    }

    set(tileX, tileY, value, layerIndex = 0)
    {
        this.data[tileX + tileY * this.width + layerIndex * this.length] = value;
    }

    fill(value, fromTileX = 0, fromTileY = 0, toTileX = this.width, toTileY = this.height, layerIndex = 0)
    {
        let offset = layerIndex * this.length;
        for(let i = fromTileY; i < toTileY; ++i)
        {
            for(let j = fromTileX; j < toTileX; ++j)
            {
                this.data[j + i * this.width + offset] = value;
            }
        }
    }

    *keys()
    {
        for(let y = 0; y < this.height; ++y)
        {
            for(let x = 0; x < this.width; ++x)
            {
                yield [x, y];
            }
        }
    }

    *values(layerIndex = 0)
    {
        let layerOffset = layerIndex * this.length;
        for(let y = 0; y < this.height; ++y)
        {
            let yOffset = y * this.width;
            for(let x = 0; x < this.width; ++x)
            {
                yield this.data[x + yOffset + layerOffset];
            }
        }
    }

    *entries(layerIndex = 0)
    {
        let layerOffset = layerIndex * this.length;
        for(let y = 0; y < this.height; ++y)
        {
            let yOffset = y * this.width;
            for(let x = 0; x < this.width; ++x)
            {
                yield [x, y, this.data[x + yOffset + layerOffset]];
            }
        }
    }
}
