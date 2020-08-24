const TILE_SIZE = 16;

export function create()
{
    return {
        x: 0, y: 0,
    };
}

export function render(ctx, farmlands)
{
    for(let farmland of farmlands)
    {
        ctx.translate(farmland.x, farmland.y);
        {
            // Dirt
            ctx.fillStyle = 'saddlebrown';
            ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, TILE_SIZE * (2 / 3), TILE_SIZE, TILE_SIZE);
        }
        ctx.translate(-farmland.x, -farmland.y);
    }
}
