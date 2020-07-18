const DEFAULT_INFO = {
    x: 0, y: 0,
    width: 1,
    height: 1,
    color: 'dodgerblue',
    solid: true,
};
const INFO_KEY = Symbol('BoxRendererInfo');

export class BoxRenderer
{
    static get Info() { return INFO_KEY; }

    static draw(ctx, targets, defaultInfo = undefined)
    {
        const defaults = defaultInfo ? { ...DEFAULT_INFO, ...defaultInfo } : DEFAULT_INFO;

        let i = 0;
        for(let target of targets)
        {
            const info = target[INFO_KEY];
            
            const x = resolveInfo('x', info, target, defaults);
            const y = resolveInfo('y', info, target, defaults);
            const width = resolveInfo('width', info, target, defaults);
            const height = resolveInfo('height', info, target, defaults);
            const color = resolveInfo('color', info, target, defaults);
            const solid = resolveInfo('solid', info, target, defaults);

            ctx.translate(x, y);
            {
                const halfWidth = width / 2;
                const halfHeight = height / 2;

                if (solid)
                {
                    ctx.fillStyle = color;
                    ctx.fillRect(-halfWidth, -halfHeight, width, height);
                }
                else
                {
                    ctx.strokeStyle = color;
                    ctx.strokeRect(-halfWidth, -halfHeight, width, height);
                }
            }
            ctx.translate(-x, -y);
            ++i;
        }
    }
}

function resolveInfo(param, info, target, defaults)
{
    if (info)
    {
        if (param in info)
        {
            return info[param];
        }
        else if (param in target)
        {
            return target[param];
        }
        else
        {
            return defaults[param];
        }
    }
    else if (target)
    {
        if (param in target)
        {
            return target[param];
        }
        else
        {
            return defaults[param];
        }
    }
    else
    {
        return defaults[param];
    }
}