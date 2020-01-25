export class TileMap
{
    constructor(width, height = width)
    {
        this.data = new Array(width * height);

        this.width = width;
        this.height = height;
    }

    get(tileX, tileY)
    {
        return this.data[tileX + tileY * this.width];
    }

    set(tileX, tileY, value)
    {
        this.data[tileX + tileY * this.width] = value;
    }

    fill(value, fromTileX = 0, fromTileY = 0, toTileX = this.width, toTileY = this.height)
    {
        for(let i = fromTileY; i < toTileY; ++i)
        {
            for(let j = fromTileX; j < toTileX; ++j)
            {
                this.data[j + i * this.width] = value;
            }
        }
    }
}
