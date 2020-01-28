import { SceneBase } from './milque.js';
import { Camera2D } from './util/Camera2D.js';
import * as CameraHelper from './util/CameraHelper.js';

export class MainScene extends SceneBase
{
    /** @override */
    onStart()
    {
        this.camera = new Camera2D();
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

        }
        Camera2D.resetTransform(ctx);
        CameraHelper.drawWorldTransformGizmo(ctx, view, world.camera);
    }
}
