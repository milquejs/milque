
export async function loadTileSheet(sheetUrl, tileUrl)
{
    let dst = {};

    let img = new Image();
    img.src = sheetUrl;

    let data = await fetch(tileUrl);
    let stringData = await data.text();
    for(let line of stringData.split('\n'))
    {
        line = line.trim();
        if (line <= 0) continue;

        let args = [];
        let i = 0;
        let j = line.indexOf(' ');
        while(j >= 0)
        {
            args.push(line.substring(i, j));
            i = j + 1;
            j = line.indexOf(' ', i);
        }
        args.push(line.substring(i));

        let name = args[0];
        let u = Number.parseInt(args[1]);
        let v = Number.parseInt(args[2]);
        let w = Number.parseInt(args[3]);
        let h = Number.parseInt(args[4]);
        let frames = args.length >= 6 ? Number.parseInt(args[5]) : 1;

        dst[name] = {
            source: img,
            u, v,
            w, h,
            frames,
            name,
        };
    }
    return dst;
}

export class TileMap
{
    constructor(width, height, tileSize)
    {
        this.tileSize = tileSize;

        this.array = new Array(height);
        for(let i = 0; i < height; ++i)
        {
            this.array[i] = new Array(width);
        }
        this.width = width;
        this.height = height;
        
        this.registry = {};
        this.pointer = {
            x: 0, y: 0,
            value: 0,
        };
    }

    registerTile(id, tile)
    {
        this.registry[id] = tile;
        return this;
    }

    performCarve()
    {
        let tileX = Math.trunc(this.pointer.x / this.tileSize);
        let tileY = Math.trunc(this.pointer.y / this.tileSize);
        if (tileX >= 0 && tileY >= 0 && tileY < this.array.length && tileX < this.array[tileY].length)
        {
            this.array[tileY][tileX] = this.pointer.value;
        }
    }

    performNextSwatch()
    {
        this.pointer.value += 1;
        if (!(this.pointer.value in this.registry))
        {
            this.pointer.value = 0;
        }
    }

    updatePointer(view, x, y)
    {
        this.pointer.x = Math.trunc((x * view.width) / this.tileSize) * this.tileSize;
        this.pointer.y = Math.trunc((y * view.height) / this.tileSize) * this.tileSize;
    }

    draw(ctx)
    {
        drawTileMap(ctx, this.array, this.registry, this.tileSize);
        drawTilePointer(ctx, this.pointer.x, this.pointer.y, this.registry[this.pointer.value], this.tileSize);
    }
}

function drawTileMap(ctx, array, registry, tileSize)
{
    for(let y = 0; y < array.length; ++y)
    {
        for(let x = 0; x < array[y].length; ++x)
        {
            drawTile(ctx, x * tileSize, y * tileSize, registry[array[y][x]], tileSize);
        }
    }
}

function drawTile(ctx, x, y, tile, tileSize)
{
    if (!tile) return;

    if (tile.image)
    {
        let image = tile.image;
        ctx.drawImage(image.source, image.u, image.v, image.w, image.h, x, y, tileSize, tileSize);
    }
    else
    {
        ctx.fillStyle = tile.color || '#FFFFFF';
        ctx.fillRect(x, y, tileSize, tileSize);
    }
}

function drawTilePointer(ctx, x, y, tile, tileSize)
{
    const BORDER_WIDTH = 4;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - BORDER_WIDTH, y - BORDER_WIDTH, tileSize + BORDER_WIDTH * 2, tileSize + BORDER_WIDTH * 2);
    drawTile(ctx, x, y, tile, tileSize);
}
