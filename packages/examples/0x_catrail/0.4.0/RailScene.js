import { ViewHelper } from './milque.js';

import { Camera2D } from './Camera2D.js';

export function onStart(game)
{
    this.camera = new Camera2D();
}

export function onUpdate(dt)
{

}

export function onRender(ctx, view, scene)
{
    scene.camera.setOffset(view.width / 2, view.height / 2);
    ViewHelper.setViewTransform(view, scene.camera);
    {
        
    }
}
