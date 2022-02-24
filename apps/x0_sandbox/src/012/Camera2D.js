import { Utils } from './milque.js';
import { Transform } from './Transform.js';

import { Camera } from './Camera.js';

export class Camera2D extends Camera
{
    constructor(offsetX = 0, offsetY = 0, speed = 1)
    {
        super();
        this.target = null;
        this.speed = speed;
        this.transform = new Transform();

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
    update(dt)
    {
        if (this.target)
        {
            this.transform.x = Utils.lerp(this.transform.x, this.target.x, dt * this.speed);
            this.transform.y = Utils.lerp(this.transform.y, this.target.y, dt * this.speed);
        }
    }

    /** @override */
    getProjectionMatrix()
    {
        return [1, 0, 0, 1, this.offsetX, this.offsetY];
    }

    /** @override */
    getViewMatrix()
    {
        let dst = [ ...this.transform.matrix ];
        dst[4] = -dst[4];
        dst[5] = -dst[5];
        return dst;
    }
}
