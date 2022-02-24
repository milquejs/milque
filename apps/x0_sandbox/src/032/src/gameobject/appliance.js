/* * * * * * * * * * * * * * * * * * * * * * * * * * DISPENSER */

export function createDispenser(world)
{
    let dispenser = {
        x: 0,
        y: 0,
        itemType: 'tomato',
    };
    return dispenser;
}

export function drawDispenser(ctx, world, dispenser)
{
    let x = dispenser.x;
    let y = dispenser.y;
    ctx.translate(x, y);
    {
        ctx.fillStyle = '#666666';
        ctx.fillRect(-12, -12, 24, 24);
    }
    ctx.translate(-x, -y);
}

export function interactDispenser(world, user, dispenser)
{

}

/* * * * * * * * * * * * * * * * * * * * * * * * * * STOVE */

export function createStove(world)
{
    let stove = {
        x: 0,
        y: 0,
        slots: {
            top: null
        }
    };
    return stove;
}

export function drawStove(ctx, world, stove)
{

}
