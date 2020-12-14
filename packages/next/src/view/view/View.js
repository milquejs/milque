/**
 * @version 1.1.0
 * @description
 * A view is a section of a world that is drawn onto a section of a
 * display. For every view, there must exist a camera and viewport.
 * However, there could exist multiple cameras in the same view
 * (albeit inactive).
 * 
 * A viewport is the section of the display that shows the content.
 * Since viewports generally change with the display, it is calculated
 * when needed rather than stored. Usually, you only want the full display
 * as a viewport.
 * 
 * A camera is the view in the world space itself. This usually means
 * it has the view and projection matrix. And because of its existance
 * within the world, it is often manipulated to change the world view.
 * 
 * Another way to look at it is that viewports hold the destination
 * dimensions of a view, whilst the camera holds the source transformations
 * that are applied to a view's source canvas (its buffer) dimension.
 * The size of the view buffer should never change (unless game resolution
 * and aspect ratio changes).
 */
export class View
{
    /**
     * Creates a view which facilitates rendering from world to screen space.
     */
    constructor(width = 640, height = 480)
    {
        this._buffer = createViewBuffer(width, height);
        this._width = width;
        this._height = height;
    }

    get canvas() { return this._buffer.canvas; }
    get context() { return this._buffer.context; }

    get width() { return this._width; }
    set width(value)
    {
        this._width = value;
        this._canvas.width = value;
    }
    get height() { return this._height; }
    set height(value)
    {
        this._height = value;
        this._canvas.height = value;
    }

    drawBufferToCanvas(
        targetCanvasContext,
        viewPortX = 0,
        viewPortY = 0,
        viewPortWidth = targetCanvasContext.canvas.clientWidth,
        viewPortHeight = targetCanvasContext.canvas.clientHeight)
    {
        targetCanvasContext.drawImage(this._buffer.canvas,
            viewPortX, viewPortY, viewPortWidth, viewPortHeight);
    }
}

function createViewBuffer(width, height)
{
    let canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.style = 'image-rendering: pixelated';
    let canvasContext = canvasElement.getContext('2d');
    canvasContext.imageSmoothingEnabled = false;
    return { canvas: canvasElement, context: canvasContext };
}
