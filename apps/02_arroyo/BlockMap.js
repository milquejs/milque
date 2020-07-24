export class BlockMap
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.length = width * height;
        
        this.data = new Uint8Array(this.length);
        this.meta = new Uint8Array(this.length);
        this.neighbor = new Uint8Array(this.length);
    }

    blockAt(x, y)
    {
        return this.data[x + y * this.width];
    }

    metaAt(x, y)
    {
        return this.meta[x + y * this.width];
    }

    neighborAt(x, y)
    {
        return this.neighbor[x + y * this.width];
    }

    at(x, y)
    {
        return new BlockPos(this, x, y);
    }
}

export class BlockPos
{
    constructor(blockMap, x, y)
    {
        this.blockMap = blockMap;
        this.x = x;
        this.y = y;
    }

    get block() { return this.blockMap.data[this.index]; }
    set block(value) { this.blockMap.data[this.index] = value; }
    get meta() { return this.blockMap.meta[this.index]; }
    set meta(value) { this.blockMap.meta[this.index] = value; }

    get neighbor() { return this.blockMap.neighbor[this.index]; }
    set neighbor(value) { this.blockMap.neighbor[this.index] = value; }
    
    get index() { return this.x + this.y * this.blockMap.width; }
    set index(value)
    {
        this.x = value % this.blockMap.width;
        this.y = Math.floor(value / this.blockMap.width);
    }

    set(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    down(out = this, offset = 1)
    {
        if (this.y + offset > this.blockMap.height)
        {
            return null;
        }
        else
        {
            out.x = this.x;
            out.y = this.y + offset;
            return out;
        }
    }

    up(out = this, offset = 1)
    {
        if (this.y - offset < 0)
        {
            return null;
        }
        else
        {
            out.x = this.x;
            out.y = this.y - offset;
            return out;
        }
    }

    left(out = this, offset = 1)
    {
        if (this.x - offset < 0)
        {
            return null;
        }
        else
        {
            out.x = this.x - offset;
            out.y = this.y;
            return out;
        }
    }

    right(out = this, offset = 1)
    {
        if (this.x + offset > this.blockMap.width)
        {
            return null;
        }
        else
        {
            out.x = this.x + offset;
            out.y = this.y;
            return out;
        }
    }
}
