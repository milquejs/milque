export class CanvasView
{
    constructor()
    {
        this.prevTransformMatrix = null;

        this.projectionMatrix = new DOMMatrix();
        this.viewMatrix = new DOMMatrix();

        this.ctx = null;
    }

    setProjectionMatrix(matrix)
    {
        setDOMMatrix(this.projectionMatrix, matrix);
        return this;
    }

    setViewMatrix(matrix)
    {
        setDOMMatrix(this.viewMatrix, matrix);
        return this;
    }

    begin(ctx, offsetX = 0, offsetY = 0)
    {
        if (this.ctx)
        {
            throw new Error('View already begun - maybe missing end() call?');
        }

        this.prevTransformMatrix = ctx.getTransform();

        ctx.setTransform(this.projectionMatrix);
        const { a, b, c, d, e, f } = this.viewMatrix;
        ctx.transform(a, b, c, d, e + offsetX, f + offsetY);

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
