import { SceneBase, Camera2D, Camera2DControls, CameraHelper } from './milque.js';

export class Scene2D extends SceneBase
{
    /** @override */
    onStart()
    {
        this.camera = new Camera2D();

        Camera2DControls.CONTEXT.enable();
        this.onSceneStart();
    }

    /** @override */
    onStop()
    {
        Camera2DControls.CONTEXT.disable();
        this.onSceneStop();
    } 

    /** @override */
    onUpdate(dt)
    {
        Camera2DControls.doCameraMove(this.camera);
        this.onSceneUpdate(dt);
    }

    /** @override */
    onRender(ctx, view, world)
    {
        CameraHelper.drawWorldGrid(ctx, view, this.camera);
        Camera2D.applyTransform(ctx, this.camera, view.width / 2, view.height / 2);
        {
            this.onSceneRender(ctx, view);
        }
        Camera2D.resetTransform(ctx);
        CameraHelper.drawWorldTransformGizmo(ctx, view, this.camera);

        this.onSceneUI(ctx, view);
    }

    onSceneStart() {}
    onSceneStop() {}
    onSceneUpdate(dt) {}
    onSceneRender(ctx, view) {}
    onSceneUI(ctx, view) {}
}
