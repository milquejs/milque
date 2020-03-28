let canvas;
let context;

export function init()
{
    canvas = createCanvasElement();
    context = canvas.getContext('2d');
}

export function createCanvasElement()
{
    let canvas = document.createElement('canvas');
    canvas.style = 'width: 100%; image-rendering: pixelated;';
    document.body.appendChild(canvas);
    return canvas;
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
