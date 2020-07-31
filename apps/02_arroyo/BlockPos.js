export class BlockPosReadOnly
{
    constructor(blockMap)
    {
        this.blockMap = blockMap;
        this._x = 0;
        this._y = 0;
        this._index = 0;
    }

    get x() { return this._x; }
    get y() { return this._y; }
    get index() { return this._index; }

    /**
     * Creates a new instance of this BlockPos. This does not copy values, only initializes a new instance.
     * Because of this, this is useful when we the position is arbitrary, but we want a new instance to modify.
     */
    clone()
    {
        return new BlockPosReadOnly(this.blockMap);
    }

    set(x, y)
    {
        let result = this.clone();
        result._x = x;
        result._y = y;
        result._index = x + y * this.blockMap.width;
        return result;
    }

    copy(out = this.clone())
    {
        out._x = this.x;
        out._y = this.y;
        out._index = this.index;
        return out;
    }

    offset(out = this.clone(), dx = 0, dy = 0)
    {
        return out.set(this.x + dx, this.y + dy);
    }

    down(out = this.clone(), offset = 1)
    {
        return out.set(this.x, this.y + offset);
    }

    up(out = this.clone(), offset = 1)
    {
        return out.set(this.x, this.y - offset);
    }

    right(out = this.clone(), offset = 1)
    {
        return out.set(this.x + offset, this.y);
    }

    left(out = this.clone(), offset = 1)
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
}

export class BlockPos extends BlockPosReadOnly
{
    constructor(blockMap)
    {
        super(blockMap);
    }

    /** @override */
    get x() { return this._x; }
    /** @override */
    get y() { return this._y; }
    /** @override */
    get index() { return this._index; }

    set x(value)
    {
        this._x = value;
        this._index += value;
    }
    set y(value)
    {
        this._y = value;
        this._index += value * this.blockMap.width;
    }
    set index(value)
    {
        this._x = value % this.blockMap.width;
        this._y = Math.floor(value / this.blockMap.width);
        this._index = value;
    }

    /** @override */
    clone()
    {
        return new BlockPos(this.blockMap);
    }

    /** @override */
    set(x, y)
    {
        this._x = x;
        this._y = y;
        this._index = x + y * this.blockMap.width;
        return this;
    }

    /** @override */
    offset(out = this, dx = 0, dy = 0)
    {
        return out.set(this.x + dx, this.y + dy);
    }

    /** @override */
    down(out = this, offset = 1)
    {
        return out.set(this.x, this.y + offset);
    }

    /** @override */
    up(out = this, offset = 1)
    {
        return out.set(this.x, this.y - offset);
    }

    /** @override */
    right(out = this, offset = 1)
    {
        return out.set(this.x + offset, this.y);
    }

    /** @override */
    left(out = this, offset = 1)
    {
        return out.set(this.x - offset, this.y);
    }
}
