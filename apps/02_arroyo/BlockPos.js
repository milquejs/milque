import { toChunkId } from './ChunkUtils.js';

export class BlockPos
{
    constructor(world)
    {
        // TODO: Should not have access to world
        this.world = world;
        
        this._x = 0;
        this._y = 0;

        this._blockCoordX = 0;
        this._blockCoordY = 0;
        this._index = 0;

        this._chunkCoordX = 0;
        this._chunkCoordY = 0;
        this._chunkId = null;
    }

    get x() { return this._x; }
    get y() { return this._y; }

    get blockCoordX() { return this._blockCoordX; }
    get blockCoordY() { return this._blockCoordY; }
    get index() { return this._index; }

    get chunkCoordX() { return this._chunkCoordX; }
    get chunkCoordY() { return this._chunkCoordY; }
    get chunkId() { return this._chunkId; }

    /**
     * Creates a new instance of this BlockPos. This does not copy values, only initializes a new instance.
     * Because of this, this is useful when we the position is arbitrary, but we want a new instance to modify.
     */
    clone()
    {
        return new BlockPos(this.world);
    }

    set(x, y)
    {
        this._x = x;
        this._y = y;

        const chunkWidth = this.world.chunkWidth;
        const chunkHeight = this.world.chunkHeight;

        if (x < 0)
        {
            this._blockCoordX = Math.abs(chunkWidth + Math.floor(x)) % chunkWidth;
        }
        else
        {
            this._blockCoordX = Math.floor(x) % chunkWidth;
        }

        if (y < 0)
        {
            this._blockCoordY = Math.abs(chunkHeight + Math.floor(y)) % chunkHeight;
        }
        else
        {
            this._blockCoordY = Math.floor(y) % chunkHeight;
        }
        
        this._index = this._blockCoordX + this._blockCoordY * chunkWidth;

        this._chunkCoordX = Math.floor(x / chunkWidth);
        this._chunkCoordY = Math.floor(y / chunkHeight);
        this._chunkId = toChunkId(this._chunkCoordX, this._chunkCoordY);
        return this;
    }

    copy(out = this.clone())
    {
        out._x = this.x;
        out._y = this.y;

        out._blockCoordX = this.blockCoordX;
        out._blockCoordY = this.blockCoordY;
        out._index = this.index;

        out._chunkCoordX = this.chunkCoordX;
        out._chunkCoordY = this.chunkCoordY;
        out._chunkId = this.chunkId;
        return out;
    }

    offset(out = this, dx = 0, dy = 0)
    {
        return out.set(this.x + dx, this.y + dy);
    }

    down(out = this, offset = 1)
    {
        return out.set(this.x, this.y + offset);
    }

    up(out = this, offset = 1)
    {
        return out.set(this.x, this.y - offset);
    }

    right(out = this, offset = 1)
    {
        return out.set(this.x + offset, this.y);
    }

    left(out = this, offset = 1)
    {
        return out.set(this.x - offset, this.y);
    }
    
    reset(src = null)
    {
        if (src)
        {
            return src.copy(this);
        }
        else
        {
            return this.set(0, 0);
        }
    }

    equals(blockPos)
    {
        return Math.abs(this.x - blockPos.x) < Number.EPSILON
            && Math.abs(this.y - blockPos.y) < Number.EPSILON;
    }

    /** @override */
    toString(details = false)
    {
        return `BlockPos(${this.x},${this.y})`
        + (details
            ? `:Chunk[${this.chunkId}]@{${this.blockCoordX},${this.blockCoordY}}[${this.index}],`
            + `${this.world.isWithinBounds(this)}`
            : '');
    }
}
