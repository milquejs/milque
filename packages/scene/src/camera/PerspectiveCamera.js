import { mat4 } from 'gl-matrix';
import { Camera } from './Camera.js';

const DEFAULT_FOVY = Math.PI / 3;

export class PerspectiveCamera extends Camera
{
    constructor(fieldOfView = DEFAULT_FOVY, near = 0.1, far = 1000)
    {
        super(mat4.create(), mat4.create());

        this.fieldOfView = fieldOfView;
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
        mat4.perspective(this.projectionMatrix, this.fieldOfView, aspectRatio, near, far);
        return this;
    }
}
