const DEFAULT_INFO = {
    x: 0, y: 0,
    width: 1,
    height: 1,
    spriteImage: null,
};
const INFO_KEY = Symbol('SpriteRendererInfo');

export class SpriteRenderer
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

            const spriteImage = resolveInfo('spriteImage', info, target, defaults);
            if (spriteImage)
            {
                const width = spriteImage.width;
                const height = spriteImage.height;

                ctx.translate(x, y);
                {
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;
    
                    ctx.drawImage(spriteImage, -halfWidth, -halfHeight);
                }
                ctx.translate(-x, -y);
            }
            else
            {
                const width = 10;
                const height = 10;

                ctx.translate(x, y);
                {
                    const halfWidth = width / 2;
                    const halfHeight = height / 2;

                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(-halfWidth, -halfHeight, width, height);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.strokeText('?', 0, 0, width);
                }
                ctx.translate(-x, -y);
            }
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