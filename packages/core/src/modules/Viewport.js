export function createView(width = 320, height = width)
{
    let canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.style = 'image-rendering: pixelated';
    let canvasContext = canvasElement.getContext('2d');
    canvasContext.imageSmoothingEnabled = false;

    let result = {
        canvas: canvasElement,
        context: canvasContext,
        width,
        height,
        offsetX: 0,
        offsetY: 0
    };
    return result;
}