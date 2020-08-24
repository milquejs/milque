export function initialize(world)
{
    world.items = [
        { x: 50, y: 50, mask: { rx: 5, ry: 5 } },
    ];
    world.physics.statics.push({
        x: 50 + 5, y: 50 + 5,
        rx: 5, ry: 5,
    });
}

export function update(world, dt)
{

}

export function render(world, ctx)
{
    for(let item of world.items)
    {
        ctx.fillStyle = 'gold';
        ctx.fillRect(item.x, item.y, 10, 10);
    }
}
