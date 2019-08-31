import Eventable from '../util/Eventable.js';

let CURRENT_VIEW = null;
const DISPLAY_MANAGER = {
    VIEWS: new Map()
};
Eventable.assign(DISPLAY_MANAGER);

function createView(viewID, canvasElement)
{
    const view = {
        id: viewID,
        canvas: canvasElement
    };
    return view;
}

function createCanvas(width, height)
{
    const canvasElement = document.createElement('canvas');
    canvasElement.setAttribute('width', width);
    canvasElement.setAttribute('height', height);
    document.body.appendChild(canvasElement);
    return canvasElement;
}

function attach(canvasElement, viewID = null)
{
    let view;

    // Attaching an alternative view...
    if (viewID)
    {
        view = createView(viewID, canvasElement);
        DISPLAY_MANAGER.VIEWS.set(viewID, view);

        // Bind it if there are none bound yet...
        if (!CURRENT_VIEW) bind(viewID);
    }
    // Attaching a main view...
    else
    {
        if (!canvasElement) canvasElement = createCanvas(640, 480);

        view = createView(null, canvasElement);
        DISPLAY_MANAGER.VIEWS.set(null, view);

        // Always bind a default canvas...
        bind(null);
    }

    // Setup the view
    DISPLAY_MANAGER.emit('attach', viewID, view);
}

function detach(viewID)
{
    const view = DISPLAY_MANAGER.VIEWS.get(viewID);
    DISPLAY_MANAGER.emit('detach', viewID, view);
    DISPLAY_MANAGER.VIEWS.delete(viewID);
}

function bind(viewID = null)
{
    if (DISPLAY_MANAGER.VIEWS.has(viewID))
    {
        if (CURRENT_VIEW) unbind();
        CURRENT_VIEW = DISPLAY_MANAGER.VIEWS.get(viewID);
        DISPLAY_MANAGER.emit('bind', viewID, CURRENT_VIEW);
    }
    else
    {
        unbind();
    }
}

function unbind()
{
    if (CURRENT_VIEW)
    {
        DISPLAY_MANAGER.emit('unbind', CURRENT_VIEW.id, CURRENT_VIEW);
        CURRENT_VIEW = null;
    }
}

function width()
{
    return CURRENT_VIEW.canvas.width;
}

function height()
{
    return CURRENT_VIEW.canvas.height;
}

function clear(color = '#000000')
{
    const ctx = CURRENT_VIEW.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width(), height());
}

export {
    DISPLAY_MANAGER,
    CURRENT_VIEW as VIEW,
    attach,
    detach,
    bind,
    unbind,
    width,
    height,
    clear,
};