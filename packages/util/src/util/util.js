export function randomHexColor()
{
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export function loadImage(url)
{
    let image = new Image();
    image.src = url;
    return image;
}

export function clearScreen(ctx, width, height)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

export function drawText(ctx, text, x, y, radians = 0, fontSize = 16, color = 'white')
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
}

export function drawBox(ctx, x, y, radians = 0, w = 16, h = w, color = 'white', outline = false)
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
}

export function intersectBox(a, b)
{
    return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
        (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
}

export function applyMotion(entity, inverseFrictionX = 1, inverseFrictionY = inverseFrictionX)
{
    if (inverseFrictionX !== 1)
    {
        entity.dx *= inverseFrictionX;
    }
    if (inverseFrictionY !== 1)
    {
        entity.dy *= inverseFrictionY;
    }
    
    entity.x += entity.dx;
    entity.y += entity.dy;
}

export function onDOMLoaded(listener)
{
    window.addEventListener('DOMContentLoaded', listener);
}

export function drawCircle(ctx, x, y, radius = 16, color = 'white', outline = false)
{
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    if (outline) ctx.stroke();
    else ctx.fill();
}
