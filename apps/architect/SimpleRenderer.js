export function render(renderTarget, renderInfos)
{
    const ctx = renderTarget.getContext('2d');

    for(let renderInfo of renderInfos)
    {
        ctx.save();
        if (!renderInfo.hidden)
        {
            const { type, opts } = renderInfo;
            switch(type)
            {
                case 'clear':
                {
                    const { color } = opts;
                    ctx.fillStyle = color || 'black';
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                }
                break;
                case 'box':
                {
                    const { x, y, w, h, color } = opts;
                    ctx.fillStyle = color || 'white';
                    ctx.fillRect(x || 0, y || 0, w || 16, h || 16);
                }
                break;
                case 'text':
                {
                    const { x, y, text, color } = opts;
                    ctx.fillStyle = color || 'white';
                    ctx.fillText(text, x, y);
                }
                break;
            }
        }
        ctx.restore();
    }
}
