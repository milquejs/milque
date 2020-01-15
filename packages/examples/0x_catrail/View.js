/**
 * @module View
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
import * as Camera from './Camera.js';

/**
 * Creates a view which facilitates rendering from world to screen space.
 * @param {Camera} camera The camera in the world to view from.
 */
export function createView(camera = undefined, width = 640, height = 480)
{
    let { canvas, context } = createViewBuffer(width, height);
    return {
        canvas,
        context,
        camera: camera || Camera.createCamera(),
        width,
        height,
    };
}

export function createViewBuffer(width, height)
{
    let canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.style = 'image-rendering: pixelated';
    let canvasContext = canvasElement.getContext('2d');
    canvasContext.imageSmoothingEnabled = false;
    return { canvas: canvasElement, context: canvasContext };
}

export function applyViewTransform(view)
{
    view.context.setTransform(...view.camera.projectionMatrix);
    view.context.transform(...view.camera.viewMatrix);
}

export function resetViewTransform(view)
{
    view.context.setTransform(1, 0, 0, 1, 0, 0);
}

export function drawBufferToCanvas(
    targetCanvasContext,
    bufferCanvasElement,
    viewPortX = 0,
    viewPortY = 0,
    viewPortWidth = targetCanvasContext.canvas.clientWidth,
    viewPortHeight = targetCanvasContext.canvas.clientHeight)
{
    targetCanvasContext.drawImage(bufferCanvasElement,
        viewPortX, viewPortY, viewPortWidth, viewPortHeight);
}

/**
 * Creates a viewport for a display output. This serves as the output dimensions
 * of a view.
 * @param {HTMLElement} canvasElement The output canvas (or the display).
 * @param {RenderingContext} canvasContext The output canvas context.
 * @param {number} [x=0] The x position offset in the output.
 * @param {number} [y=0] The y position offset in the output.
 * @param {number} [width=canvasElement.clientWidth] The width of the viewport in the output.
 * @param {number} [height=canvasElement.clientHeight] The height of the viewport in the output.
 */
export function createViewPort(
    canvasElement,
    canvasContext,
    x = 0,
    y = 0,
    width = canvasElement.clientWidth,
    height = canvasElement.clientHeight)
{
    return {
        canvas: canvasElement,
        context: canvasContext,
        x, y,
        width, height,
        getCanvas()
        {
            return this.canvas;
        },
        getContext()
        {
            return this.context;
        }
    };
}
