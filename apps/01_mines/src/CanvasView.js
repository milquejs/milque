export class CanvasView
{
    constructor()
    {
        this.prevTransformMatrix = null;

        this.domProjectionMatrix = new DOMMatrix();
        this.domViewMatrix = new DOMMatrix();

        this.ctx = null;
    }

    begin(ctx, viewMatrix, projectionMatrix)
    {
        if (this.ctx)
        {
            throw new Error('View already begun - maybe missing end() call?');
        }

        if (viewMatrix) setDOMMatrix(this.domViewMatrix, viewMatrix);
        if (projectionMatrix) setDOMMatrix(this.domProjectionMatrix, projectionMatrix);

        this.prevTransformMatrix = ctx.getTransform();

        ctx.setTransform(this.domProjectionMatrix);
        const { a, b, c, d, e, f } = this.domViewMatrix;
        ctx.transform(a, b, c, d, e, f);

        this.ctx = ctx;
    }

    end(ctx)
    {
        ctx.setTransform(this.prevTransformMatrix);
        
        this.ctx = null;
    }
}

export function setDOMMatrix(domMatrix, glMatrix)
{
    domMatrix.a = glMatrix[0];
    domMatrix.b = glMatrix[1];
    domMatrix.c = glMatrix[4];
    domMatrix.d = glMatrix[5];
    domMatrix.e = glMatrix[12];
    domMatrix.f = glMatrix[13];
    return domMatrix;
}
