import { Utils, AbstractCamera } from '@milque/core';
import { Transform2D } from './Transform2D.js';

export class Camera2D extends AbstractCamera
{
    static applyTransform(ctx, camera, viewOffsetX = 0, viewOffsetY = 0)
    {
        camera.setOffset(viewOffsetX, viewOffsetY);
        ctx.setTransform(...camera.getProjectionMatrix());
        ctx.transform(...camera.getViewMatrix());
    }

    static resetTransform(ctx)
    {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    static followTarget(camera, target, speed = 1)
    {
        if (target)
        {
            camera.transform.x = Utils.lerp(camera.transform.x, target.x, speed);
            camera.transform.y = Utils.lerp(camera.transform.y, target.y, speed);
        }
    }

    constructor(offsetX = 0, offsetY = 0, speed = 1)
    {
        super();
        this.target = null;
        this.speed = speed;
        this.transform = new Transform2D();

        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    setOffset(x, y)
    {
        this.offsetX = x;
        this.offsetY = y;
        return this;
    }

    /** @override */
    getProjectionMatrix()
    {
        // NOTE: Scaling must be applied here, instead of the view
        return [this.transform.matrix[0], 0, 0, this.transform.matrix[3],
            this.offsetX, this.offsetY];
    }

    /** @override */
    getViewMatrix()
    {
        let dst = [ ...this.transform.matrix ];
        dst[0] = Math.cos(this.transform.rotation);
        dst[3] = dst[0];
        dst[4] = -dst[4];
        dst[5] = -dst[5];
        return dst;
    }
}
