import { SceneBase, EntitySpawner, Camera2D, Camera2DControls, CameraHelper } from './milque.js';

const Pawn = EntitySpawner.createSpawner((x = 0, y = 0) => {
    return {
        x, y,
    };
});

Camera2DControls.CONTEXT.enable();

export class MainScene extends SceneBase
{
    /** @override */
    onStart()
    {
        this.camera = new Camera2D();
        Pawn.spawn();
    }

    /** @override */
    onUpdate(dt)
    {
        Camera2DControls.doCameraMove(this.camera);
    }

    /** @override */
    onRender(ctx, view, world)
    {
        CameraHelper.drawWorldGrid(ctx, view, this.camera);
        Camera2D.applyTransform(ctx, this.camera, view.width / 2, view.height / 2);
        {
            renderPawns(ctx);
        }
        Camera2D.resetTransform(ctx);
        CameraHelper.drawWorldTransformGizmo(ctx, view, this.camera);
    }
}

function renderPawns(ctx)
{
    for(let pawn of Pawn.entities)
    {
        ctx.fillStyle = 'red';
        ctx.fillRect(pawn.x, pawn.y, 16, 16);
    }
}
