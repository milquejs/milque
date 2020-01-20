export function drawNavigationInfo(view, offsetX, offsetY)
{
    const cellWidth = 32;
    const cellHeight = 32;
    const chunkWidth = 256;
    const chunkHeight = 256;

    drawGrid(view, offsetX, offsetY, cellWidth, cellHeight, 1, false);
    drawGrid(view, offsetX, offsetY, chunkWidth, chunkHeight, 4, true);

    let ctx = view.context;
    let fontSize = 10;
    let worldX = -Math.floor(offsetX - view.width / 2);
    let worldY = -Math.floor(offsetY - view.height / 2);
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(`(${worldX},${worldY})`, cellWidth / 2, cellHeight / 2);

    drawTransformGizmo(ctx,
        cellWidth / 4,
        cellHeight / 4,
        cellWidth / 2,
        cellHeight / 2
    );
}

export function drawGrid(view, offsetX, offsetY, cellWidth = 32, cellHeight = cellWidth, lineWidth = 1, showCoords = false)
{
    let ctx = view.context;

    ctx.beginPath();
    for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
    {
        ctx.moveTo(0, y);
        ctx.lineTo(view.width, y);
    }
    for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
    {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, view.height);
    }
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.lineWidth = 1;

    if (showCoords)
    {
        const fontSize = Math.min(cellWidth / 4, 16);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = '#333333';

        for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
        {
            for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
            {
                ctx.fillText(`(${Math.round((x - offsetX) / cellWidth)},${Math.round((y - offsetY) / cellHeight)})`, x + lineWidth * 2, y + lineWidth * 2);
            }
        }
    }
}

export function drawTransformGizmo(ctx, x, y, width, height = width)
{
    const fontSize = width * 0.6;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;

    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
    ctx.fillStyle = '#FF0000';
    ctx.fillText('x', width + fontSize, 0);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.strokeStyle = '#00FF00';
    ctx.stroke();
    ctx.fillStyle = '#00FF00';
    ctx.fillText('y', 0, height + fontSize);

    ctx.translate(-x, -y);
}
