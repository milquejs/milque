import * as self from './Draws.js';

export function withContext(ctx)
{
    let dst = {};
    for(let propName of Object.getOwnPropertyNames(self))
    {
        if (typeof self[propName] === 'function')
        {
            dst[propName] = self[propName].bind(dst, ctx);
        }
    }
    return dst;
}

export function clearScreen(ctx, width, height)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    return this;
}

export function text(ctx, text, x, y, fontSize = 16, color = 'white', radians = 0)
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    if (radians) ctx.rotate(-radians);
    ctx.translate(-x, -y);
    return this;
}

export function box(ctx, x, y, w = 16, h = w, color = 'white', radians = 0, outline = false)
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    if (!outline)
    {
        ctx.fillStyle = color;
        ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    else
    {
        ctx.strokeStyle = color;
        ctx.strokeRect(-w / 2, -h / 2, w, h);
    }
    if (radians) ctx.rotate(-radians);
    ctx.translate(-x, -y);
    return this;
}

export function circle(ctx, x, y, radius = 16, color = 'white', outline = false)
{
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (outline) ctx.stroke();
    else ctx.fill();
    return this;
}
