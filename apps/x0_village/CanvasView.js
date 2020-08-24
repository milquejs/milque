const CANVAS_VIEW_TRANSFORM_CONTEXT = Symbol('canvasViewTransformContext');

function getCanvasViewTransformContext(ctx)
{
    if (!(CANVAS_VIEW_TRANSFORM_CONTEXT in ctx))
    {
        let canvasViewTransformContext = {
            prevTransformMatrix: null,
            domProjectionMatrix: new DOMMatrix(),
            domViewMatrix: new DOMMatrix(),
        };
        ctx[CANVAS_VIEW_TRANSFORM_CONTEXT] = canvasViewTransformContext;
        return canvasViewTransformContext;
    }
    else
    {
        return ctx[CANVAS_VIEW_TRANSFORM_CONTEXT];
    }
}

export function begin(ctx, viewMatrix = undefined, projectionMatrix = undefined)
{
    let canvasViewTransformContext = getCanvasViewTransformContext(ctx);

    if (canvasViewTransformContext.prevTransformMatrix !== null)
    {
        console.warn('View already begun - maybe missing end() call?');
    }

    if (viewMatrix) setDOMMatrix(canvasViewTransformContext.domViewMatrix, viewMatrix);
    if (projectionMatrix) setDOMMatrix(canvasViewTransformContext.domProjectionMatrix, projectionMatrix);

    canvasViewTransformContext.prevTransformMatrix = ctx.getTransform();

    ctx.setTransform(canvasViewTransformContext.domProjectionMatrix);
    const { a, b, c, d, e, f } = canvasViewTransformContext.domViewMatrix;
    ctx.transform(a, b, c, d, e, f);
}

export function end(ctx)
{
    let canvasViewTransformContext = getCanvasViewTransformContext(ctx);
    ctx.setTransform(canvasViewTransformContext.prevTransformMatrix);
    canvasViewTransformContext.prevTransformMatrix = null;
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
