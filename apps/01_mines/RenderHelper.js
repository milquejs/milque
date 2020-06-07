export function drawBox(ctx, x, y, width, height, color)
{
    ctx.translate(x, y);
    {
        let halfWidth = width / 2;
        let halfHeight= height / 2;
        ctx.fillStyle = color;
        ctx.fillRect(-halfWidth, -halfHeight, width, height);
    }
    ctx.translate(-x, -y);
}

export function drawText(ctx, x, y, text, fontSize, color)
{
    ctx.translate(x, y);
    {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = color;
        ctx.fillText(text, 0, 0);
    }
    ctx.translate(-x, -y);
}
