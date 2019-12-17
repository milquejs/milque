var canvas;
var context;

export function createCanvas(parentElement = document.body)
{
    const canvasElement = document.createElement('canvas');
    parentElement.appendChild(canvasElement);
    attachCanvas(canvasElement);
}

export function attachCanvas(canvasElement)
{
    canvasElement.style = 'width: 100%; image-rendering: pixelated;';
    
    canvas = canvasElement;
    context = canvas.getContext('2d');
}

export function getCanvas()
{
    return canvas;
}

export function getContext()
{
    return context;
}

export function getWidth()
{
    return canvas.width;
}

export function getHeight()
{
    return canvas.height;
}
