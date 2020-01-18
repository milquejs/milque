import * as MouseControls from './util/MouseControls.js';
import { ViewHelper, Utils } from './milque.js';
import { Camera2D } from './util/Camera2D.js';
import * as TileMap from './NaiveTileMap.js';

const TILE_MAP = `
0,0,6,3,0:
1. .1. .2. .
1.1.1. .1. .
1. .1. .1. .`;

const TILE_COLORS = [
    '',
    '#00FF00',
    '#0000FF',
];

const TILE_SIZE = 20;

function drawTileByColorMap(colorMap, tileSize, ctx, x, y, value)
{
    if (colorMap[value])
    {
        TileMap.drawTile(ctx, x, y, value, colorMap[value], tileSize);
    }
}

export function onStart()
{
    this.camera = new Camera2D();

    this.mouse = {
        x: 0, y: 0
    };

    this.tileMap = TileMap.parseTileMap(TILE_MAP);
}

export function onUpdate(dt)
{
    if (this.camera)
    {
        this.mouse.x = Math.floor(this.mouse.x / TILE_SIZE) * TILE_SIZE;
        this.mouse.y = Math.floor(this.mouse.y / TILE_SIZE) * TILE_SIZE;
    }
}

export function onRender(ctx, view, world)
{
    world.camera.setOffset(view.width / 2, view.height / 2);
    ViewHelper.setViewTransform(view, world.camera);
    {
        TileMap.drawTileMap(ctx, world.tileMap, drawTileByColorMap.bind(null, TILE_COLORS, TILE_SIZE));

        ctx.fillStyle = 'white';
        ctx.fillRect(world.mouse.x, world.mouse.y, TILE_SIZE, TILE_SIZE);

        world.mouse.x = MouseControls.POS_X.value * view.width + world.camera.transform.x - world.camera.offsetX;
        world.mouse.y = MouseControls.POS_Y.value * view.height + world.camera.transform.y - world.camera.offsetY;
    }
}
