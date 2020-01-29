import { SceneBase } from './milque.js';
import { Camera2D } from './util/Camera2D.js';
import * as CameraHelper from './util/CameraHelper.js';
import { TileMap } from './tile/TileMap.js';

export class MainScene extends SceneBase
{
    /** @override */
    onStart()
    {
        this.camera = new Camera2D();

        this.tileSet = new TileSet();
        this.tileSet.add('grass');
        this.tileSet.add('stone');

        this.tileMap = new TileMap(16, 16);
        this.tileMap.fill(1);
    }

    /** @override */
    onUpdate(dt)
    {
    }

    onRender(ctx, view, world)
    {
        CameraHelper.drawWorldGrid(ctx, view, world.camera);
        Camera2D.applyTransform(ctx, world.camera, view.width / 2, view.height / 2);
        {
            renderTiles(ctx, world.tileMap);
        }
        Camera2D.resetTransform(ctx);
        CameraHelper.drawWorldTransformGizmo(ctx, view, world.camera);
    }
}

function renderTiles(ctx, tileMap, offsetX = 0, offsetY = 0, tileWidth = 16, tileHeight = 16)
{
    for(let x = 0; x < tileMap.width; ++x)
    {
        for(let y = 0; y < tileMap.height; ++y)
        {
            renderTile(ctx, tileMap.get(x, y), offsetX + x * tileWidth, offsetY + y * tileHeight, tileWidth, tileHeight);
        }
    }
}

function renderTile(ctx, tileValue, offsetX = 0, offsetY = 0, width = 16, height = 16)
{
    switch(tileValue)
    {
        case 0:
            break;
        case 1:
            ctx.fillStyle = 'green';
            ctx.fillRect(offsetX, offsetY, width, height);
            break;
        case 2:
            ctx.fillStyle = 'dodgerblue';
            ctx.fillRect(offsetX, offsetY, width, height);
            break;
    }
}
