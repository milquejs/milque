export class Camera
{
    constructor(canvas, projectionMatrix, viewMatrix)
    {
        this.canvas = canvas;
        this.projectionMatrix = projectionMatrix;
        this.viewMatrix = viewMatrix;

        this.resize = this.resize.bind(this);

        canvas.addEventListener('resize', this.resize);
        setTimeout(this.resize, 0);
    }

    destroy()
    {
        this.canvas.removeEventListener('resize', this.resize);
    }

    /** @abstract */
    resize() {}
}
