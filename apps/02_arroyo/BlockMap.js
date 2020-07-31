import { Block, BlockFluid, BlockAir } from './Block.js';

export class BlockMap
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.length = width * height;

        this.data = {

        };
        
        this.block = new Uint8Array(this.length).fill(0);
        this.meta = new Uint8Array(this.length).fill(0);
        this.neighbor = new Uint8Array(this.length).fill(0b1111);
    }

    placeBlock(x, y, block)
    {
        let pos = this.at(x, y);
        if (!(block instanceof BlockFluid))
        {
            let prevBlockId = this.getBlockId(pos);
            let prevBlock = Block.getBlock(prevBlockId);
            prevBlock.onBlockBreak(this, pos);
        }
        else
        {
            let prevBlockId = this.getBlockId(pos);
            let prevBlock = Block.getBlock(prevBlockId);
            if (!(prevBlock instanceof BlockAir))
            {
                return this;
            }
        }
        this.setBlockId(pos, block.blockId);
        block.onBlockPlace(this, pos);
        return this;
    }

    isWithinBounds(blockPos)
    {
        if (!blockPos) return false;
        const { x, y } = blockPos;
        return (x <= this.width)
            && (x > 0)
            && (y <= this.height)
            && (y > 0);
    }

    getBlockId(blockPos)
    {
        return this.block[blockPos.index];
    }

    getBlockMeta(blockPos)
    {
        return this.meta[blockPos.index];
    }

    getBlockNeighbor(blockPos)
    {
        return this.neighbor[blockPos.index];
    }

    setBlockId(blockPos, value)
    {
        this.block[blockPos.index] = value;
        return this;
    }
    
    setBlockMeta(blockPos, value)
    {
        this.meta[blockPos.index] = value;
        return this;
    }

    setBlockNeighbor(blockPos, value)
    {
        this.neighbor[blockPos.index] = value;
        return this;
    }

    at(x, y)
    {
        return new BlockPos(this, x, y);
    }
}

export class BlockPosReadOnly
{
    constructor(blockMap, x, y)
    {
        this.blockMap = blockMap;
        this._x = x;
        this._y = y;
    }

    get x() { return this._x; }
    get y() { return this._y; }
}

export class BlockPos
{
    constructor(blockMap, x, y)
    {
        this.blockMap = blockMap;
        this.x = x;
        this.y = y;
    }
    
    get index() { return this.x + this.y * this.blockMap.width; }
    set index(value)
    {
        this.x = value % this.blockMap.width;
        this.y = Math.floor(value / this.blockMap.width);
    }

    copy()
    {
        return new BlockPos(this.blockMap, this.x, this.y);
    }

    set(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    offset(out, dx = 0, dy = 0)
    {
        let x = this.x + dx;
        if (x > this.blockMap.width)
        {
            return null;
        }
        else if (x <= 0)
        {
            return null;
        }

        let y = this.y + dy;
        if (y > this.blockMap.height)
        {
            return null;
        }
        else if (y <= 0)
        {
            return null;
        }

        out.x = x;
        out.y = y;
        return out;
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
