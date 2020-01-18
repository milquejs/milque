import { POS_X, POS_Y, LEFT_DOWN } from './util/MouseControls.js';
import { Random } from './milque.js';

const TILE_SIZE = 32;

export function onStart()
{
    this.tileMap = [
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.tileRegistry = {
        0: { color: '#FF0000' },
        1: { color: '#00FF00' },
        2: { color: '#0000FF' },
        3: { color: '#AAAAAA' },
        4: { color: '#333333' },
    };

    this.tilePointer = {
        x: 0, y: 0
    };
}

export function onUpdate(dt)
{
    if (LEFT_DOWN.value)
    {
        let tileX = Math.trunc(this.tilePointer.x / TILE_SIZE);
        let tileY = Math.trunc(this.tilePointer.y / TILE_SIZE);
        if (tileX >= 0 && tileY >= 0 && tileY < this.tileMap.length && tileX < this.tileMap[tileY].length)
        {
            this.tileMap[tileY][tileX] = Random.randomChoose(Object.keys(this.tileRegistry));
        }
    }
}

export function onRender(ctx, view, world)
{
    drawTileMap(ctx, world.tileMap, world.tileRegistry, TILE_SIZE);

    this.tilePointer.x = Math.trunc((POS_X.value * view.width) / TILE_SIZE) * TILE_SIZE;
    this.tilePointer.y = Math.trunc((POS_Y.value * view.height) / TILE_SIZE) * TILE_SIZE;
    drawTilePointer(ctx, this.tilePointer.x, this.tilePointer.y, TILE_SIZE);
}

function drawTileMap(ctx, tileMap, tileRegistry, tileSize)
{
    for(let y = 0; y < tileMap.length; ++y)
    {
        for(let x = 0; x < tileMap[y].length; ++x)
        {
            drawTile(ctx, x * tileSize, y * tileSize, tileRegistry[tileMap[y][x]], tileSize);
        }
    }
}

function drawTile(ctx, x, y, tile, tileSize)
{
    ctx.fillStyle = tile.color || '#FF0000';
    ctx.fillRect(x, y, tileSize, tileSize);
}

function drawTilePointer(ctx, x, y, tileSize)
{
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(x, y, tileSize, tileSize);
}