export function randomHexColor()
{
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

export function clearScreen(ctx, width, height)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

export function drawBox(ctx, x, y, radians, w, h = w, color = 'white')
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
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

export function withinRadius(from, to, radius)
{
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius
}