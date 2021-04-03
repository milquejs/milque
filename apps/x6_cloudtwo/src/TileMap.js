export class TileMap
{
    constructor(width, height, arrayConstructor = Array)
    {
        const length = width * height;
        this.width = width;
        this.height = height;
        this.length = length;

        this.data = new (arrayConstructor)(length);
    }

    get(x, y)
    {
        return this.data[x + y * this.width];
    }

    set(x, y, value)
    {
        this.data[x + y * this.width] = value;
        return this;
    }
}

export class ChunkMap
{
    constructor(width, height = width, depth = 1)
    {
        const length = width * height * depth;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.length = length;
        this.data = new Uint32Array(length);
    }

    get(x = 0, y = 0, z = 0)
    {
        return this.data[x + y * this.width + z * this.width * this.height];
    }

    set(x = 0, y = 0, z = 0, value = 1)
    {
        this.data[x + y * this.witdh + z * this.width * this.height] = value;
    }
}
