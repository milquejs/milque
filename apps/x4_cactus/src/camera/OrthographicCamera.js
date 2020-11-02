import { mat4 } from 'gl-matrix';

export function createOrthographicCamera(canvas, left, top, right, bottom, near = -1000, far = 1000)
{
    return new OrthographicCamera(canvas, left, top, right, bottom, near, far);
}

export class OrthographicCamera
{
    constructor(canvas, left, top, right, bottom, near, far)
    {
        this.canvas = canvas;
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
        const { left, top, right, bottom } = this.bounds;
        mat4.ortho(this.projectionMatrix, left * aspectRatio, right * aspectRatio, bottom, top, near, far);
    }
}
