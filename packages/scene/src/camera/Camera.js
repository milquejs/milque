export class Camera
{
    constructor(projectionMatrix, viewMatrix)
    {
        this.projectionMatrix = projectionMatrix;
        this.viewMatrix = viewMatrix;
    }

    /** @abstract */
    resize(viewportWidth, viewportHeight)
    {
        return this;
    }
}
