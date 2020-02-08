import { CameraHelper, Camera2D } from './milque.js';

export async function load(game)
{
}

export async function unload(game)
{
}

export function start()
{
    this.camera = new Camera2D();
}

export function stop()
{
}

export function preupdate(dt)
{
}

export function update(dt)
{
}

export function fixedupdate()
{
}

export function postupdate(dt)
{
}

export function render(view)
{
    let ctx = view.context;
    CameraHelper.drawWorldGrid(ctx, view, this.camera);
    Camera2D.applyTransform(ctx, this.camera, view.width / 2, view.height / 2);
    {
        
    }
    Camera2D.resetTransform(ctx);
    CameraHelper.drawWorldTransformGizmo(ctx, view, this.camera);
}
