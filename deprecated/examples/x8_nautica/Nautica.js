import { Input, EntityManager, CameraHelper, Camera2D, Camera2DControls, View } from './milque.js';
import { TileMap } from './TileMap.js';
import * as TileMapRenderer from './TileMapRenderer.js';

export const POINTER_X = Camera2DControls.CONTEXT.registerRange('x', 'mouse[pos].x');
export const POINTER_Y = Camera2DControls.CONTEXT.registerRange('y', 'mouse[pos].y');
export const POINTER_ACTION = Camera2DControls.CONTEXT.registerState('action', {
    'mouse[0].up': 0,
    'mouse[0].down': 1,
});

export async function load(game)
{
    let world = {
        entities: new EntityManager(),
        tiles: new TileMap(16, 16),
        view: new View(),
        mouse: null,
    };

    return world;
}

export async function unload(game)
{
}

export function start()
{
    this.camera = new Camera2D();

    Camera2DControls.CONTEXT.enable();

    let savedData = localStorage.getItem('tilemap');
    if (savedData)
    {
        this.tiles = TileMap.parse(savedData);
    }
    else
    {
        this.tiles.fill(0);
    }
}

export function stop()
{
    Camera2DControls.CONTEXT.disable();

    localStorage.setItem('tilemap', TileMap.stringify(this.tiles));
}

export function preupdate(dt)
{
    
}

export function update(dt)
{
    Input.poll();

    this.mouse = transformViewToCameraSpace(
        this.camera,
        POINTER_X.value * this.view.width,
        POINTER_Y.value * this.view.height,
    );

    if (POINTER_ACTION.value)
    {
        if (this.mouse.x > 0
            && this.mouse.x < this.tiles.width * 16
            && this.mouse.y > 0
            && this.mouse.y < this.tiles.height * 16)
        {
            let tileX = Math.floor(this.mouse.x / 16);
            let tileY = Math.floor(this.mouse.y / 16);
            this.tiles.set(tileX, tileY, 1);
        }
    }
}

export function fixedupdate()
{
}

export function postupdate(dt)
{
}

export function render(view)
{
    Camera2DControls.doCameraMove(this.camera);

    let ctx = view.context;
    CameraHelper.drawWorldGrid(ctx, view, this.camera);
    Camera2D.applyTransform(ctx, this.camera, view.width / 2, view.height / 2);
    {
        TileMapRenderer.renderTileMap(ctx, this.tiles);
        TileMapRenderer.renderTilePointer(ctx, this.mouse.x, this.mouse.y);
    }
    Camera2D.resetTransform(ctx);
    CameraHelper.drawWorldTransformGizmo(ctx, view, this.camera);
    drawWorldPointer(ctx, POINTER_X.value * view.width, POINTER_Y.value * view.height);
}

function drawWorldPointer(ctx, viewSpaceX, viewSpaceY)
{
    let halfSize = 3;
    ctx.save();
    {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(viewSpaceX, viewSpaceY, halfSize, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.restore();
}

function transformViewToCameraSpace(camera, viewSpaceX, viewSpaceY)
{
    let result = new DOMMatrix(camera.getProjectionMatrix())
        .multiplySelf(new DOMMatrix(camera.getViewMatrix()))
        .invertSelf()
        .transformPoint(new DOMPoint(viewSpaceX, viewSpaceY));
    return result;
}
