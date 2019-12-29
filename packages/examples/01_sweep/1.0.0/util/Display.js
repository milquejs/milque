var canvas;
var context;

export function createCanvas(width = 320, height = width, parentElement = document.body)
{
    const canvasElement = document.createElement('canvas');
    parentElement.appendChild(canvasElement);
    attachCanvas(canvasElement, width, height);
}

export function attachCanvas(canvasElement, canvasContext, width = 320, height = width)
{
    canvas = canvasElement;
    context = canvasContext;
    canvas.width = width;
    canvas.height = height;
}

export function drawBufferToScreen(ctx, viewportOffsetX = 0, viewportOffsetY = 0, viewportWidth = getClientWidth(), viewportHeight = getClientHeight())
{
    context.drawImage(ctx.canvas, viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight);
}

export function getCanvas()
{
    return canvas;
}

export function getDrawContext()
{
    return context;
}

export function getClientWidth()
{
    return canvas.clientWidth;
}

export function getClientHeight()
{
    return canvas.clientHeight;
}

export function getClientOffsetX()
{
    return canvas.offsetLeft;
}

export function getClientOffsetY()
{
    return canvas.offsetTop;
}
