var canvas;
var context;

// Default setup...
window.addEventListener('DOMContentLoaded', () => {
    if (!canvas)
    {
        let canvasElement = null;
        let canvasContext = null;

        // Try resolve to <display-port> if exists...
        let displayElement = document.querySelector('display-port');
        if (displayElement)
        {
            canvasElement = displayElement.getCanvas();
            canvasContext = displayElement.getContext();
        }
        // Otherwise, find a <canvas> element...
        else
        {
            canvasElement = document.querySelector('canvas');
        }

        if (canvasElement)
        {
            if (!canvasContext) canvasContext = canvasElement.getContext('2d');
            attachCanvas(canvasElement, canvasContext);
        }
    }
});

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
    getDrawContext().drawImage(ctx.canvas, viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight);
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
