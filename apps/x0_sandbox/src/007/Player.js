export function initialize(world)
{
    world.player = {
        x: 0,
        y: 0,
    };
}

export function update(world, dt)
{
    const { input } = world;

    const moveSpeed = 1;
    const moveDirX = input.getInputValue('right') - input.getInputValue('left');
    const moveDirY = input.getInputValue('down') - input.getInputValue('up');

    if (moveDirX !== 0 || moveDirY !== 0)
    {
        const moveRads = Math.atan2(moveDirY, moveDirX);
    
        world.player.x += moveSpeed * Math.cos(moveRads);
        world.player.y += moveSpeed * Math.sin(moveRads);
    }
}

export function render(world, ctx)
{
    ctx.fillStyle = 'red';
    ctx.fillRect(world.player.x, world.player.y, 10, 10);
}
