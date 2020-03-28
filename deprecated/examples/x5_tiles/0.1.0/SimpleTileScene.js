import * as TilePos from './TilePos.js';

export class TileMap
{
    constructor(width = 16, height = width, tileSize = 16)
    {
        this.tiles = new Array2D(Int32Array, width, height);
        this.metas = new Array2D(Int8Array, width, height);

        this.offsetX = 0;
        this.offsetY = 0;
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
    }
    
    setOffset(x, y)
    {
        this.offsetX = x;
        this.offsetY = y;
        return this;
    }

    tileAt(posX, posY)
    {
        const x = Math.trunc((posX - this.offsetX) / this.tileSize);
        const y = Math.trunc((posY - this.offsetY) / this.tileSize);
        return this.tiles.get(x, y);
    }

    setTile(posX, posY, tile)
    {
        const x = Math.trunc((posX - this.offsetX) / this.tileSize);
        const y = Math.trunc((posY - this.offsetY) / this.tileSize);
        return this.tiles.set(x, y, tile);
    }

    addLayer()
}

export class Array2D
{
    constructor(arrayType = Array, width = 16, height = width)
    {
        this.type = arrayType;
        this.array = new arrayType(width * height);
        this.width = width;
        this.height = height;
    }

    fill(value)
    {
        this.array.fill(value);
        return this;
    }

    get(x, y)
    {
        return this.array[x + y * this.width];
    }

    set(x, y, value)
    {
        this.array[x + y * this.width] = value;
        return this;
    }

    keys()
    {
        return {
            [Symbol.iterator]()
            {
                if (this.width <= 0 || this.height <= 0) return { next() { return { done: true }; }};

                return {
                    source: this,
                    pos: TilePos.create(this, -1),
                    next()
                    {
                        if (TilePos.hasNext(this.pos, 1))
                        {
                            TilePos.next(this.pos, this.pos, 1);
                            return { value: this.pos };
                        }
                        else
                        {
                            return { done: true };
                        }
                    }
                }
            }
        };
    }

    values()
    {
        return this.array;
    }

    entries()
    {
        return {
            [Symbol.iterator]()
            {
                if (this.width <= 0 || this.height <= 0) return { next() { return { done: true }; }};

                return {
                    source: this,
                    pos: TilePos.create(this),
                    next()
                    {
                        if (TilePos.hasNext(this.pos, 1))
                        {
                            TilePos.next(this.pos, this.pos, 1);
                            return { value: [ this.pos, this.source.array[this.pos.index] ] };
                        }
                        else
                        {
                            return { done: true };
                        }
                    }
                }
            }
        };
    }

    [Symbol.iterator]() { return this.entries()[Symbol.iterator]; }
}
