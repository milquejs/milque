import { toRadians } from 'milque';
import { mat4 } from 'gl-matrix';

export function createPerspectiveCamera(canvas, fieldOfView = toRadians(40), near = 0.1, far = 1000)
{
    return new PerspectiveCamera(canvas, fieldOfView, near, far);
}

export class PerspectiveCamera
{
    constructor(canvas, fieldOfView = toRadians(40), near = 0.1, far = 1000)
    {
        this.canvas = canvas;
        this.fieldOfView = fieldOfView;
        this.clippingPlane = {
            near,
            far,
        };
        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();

        this.resize = this.resize.bind(this);

        canvas.addEventListener('resize', this.resize);
        this.resize();
    }

    destroy()
    {
        this.canvas.removeEventListener('resize', this.resize);
    }

    resize()
    {
        const aspectRatio = this.canvas.width / this.canvas.height;
        const { near, far } = this.clippingPlane;
        mat4.perspective(this.projectionMatrix, this.fieldOfView, aspectRatio, near, far);
    }
}
