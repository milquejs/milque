const VIEWS = new Map();
const VIEW = { id: null, canvas: null };

function attach(canvasElement, viewID = null)
{
    // Attaching an alternative view...
    if (viewID)
    {
        VIEWS.set(viewID, canvasElement);

        if (!VIEW.canvas)
        {
            bind(viewID);
        }
    }
    // Attaching a main view...
    else
    {
        if (!canvasElement)
        {
            canvasElement = document.createElement('canvas');
            canvasElement.setAttribute('width', 640);
            canvasElement.setAttribute('height', 480);
            document.body.appendChild(canvasElement);
        }

        VIEWS.set(null, canvasElement);
        bind(null);
    }
}

function detach(viewID)
{
    VIEWS.delete(viewID);
}

function bind(viewID = null)
{
    if (VIEWS.has(viewID))
    {
        const canvasElement = VIEWS.get(viewID);
        VIEW.id = viewID;
        VIEW.canvas = canvasElement;
    }
    else
    {
        unbind();
    }
}

function unbind()
{
    VIEW.id = null;
    VIEW.canvas = null;
}

function width()
{
    return VIEW.canvas.width;
}

function height()
{
    return VIEW.canvas.height;
}

function clear(color = '#000000')
{
    const ctx = VIEW.canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width(), height());
}

export {
    VIEW as VIEW,
    attach,
    detach,
    bind,
    unbind,
    width,
    height,
    clear,
};