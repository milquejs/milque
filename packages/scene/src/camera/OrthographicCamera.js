import { mat4 } from 'gl-matrix';
import { Camera } from './Camera.js';

export class OrthographicCamera extends Camera
{
    constructor(left, top, right, bottom, near, far)
    {
        super(mat4.create(), mat4.create());

        this.bounds = {
            left,
            top,
            right,
            bottom,
        };
        this.clippingPlane = {
            near,
            far,
        };
    }

    /** @override */
    resize(viewportWidth, viewportHeight)
    {
        const aspectRatio = viewportWidth / viewportHeight;
        const { near, far } = this.clippingPlane;
        const { left, top, right, bottom } = this.bounds;
        mat4.ortho(this.projectionMatrix, left * aspectRatio, right * aspectRatio, bottom, top, near, far);
        return this;
    }
}
