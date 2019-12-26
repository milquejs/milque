var canvas;
var context;

export function createCanvas(width = 320, height = width, parentElement = document.body)
{
    const canvasElement = document.createElement('canvas');
    parentElement.appendChild(canvasElement);
    attachCanvas(canvasElement, width, height);
}

export function attachCanvas(canvasElement, width = 320, height = width)
{
    canvas = canvasElement;
    context = canvas.getContext('2d');

    // NOTE: canvas.clientWidth MUST be the same as client.width...
    // TODO: This needs to be enforced in the future when resizing somehow...
    canvas.width = width;
    canvas.height = height;
    canvas.style = `image-rendering: pixelated`;
    context.imageSmoothingEnabled = false;
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
