export async function load(world)
{

}

export function create(x, y, dx, dy, age = 100)
{
    return {
        x, y, dx, dy, age
    };
}

export function update(dt, world, bullets)
{
    for(let bullet of bullets)
    {
        bullet.x += bullet.dx * dt;
        bullet.y += bullet.dy * dt;
        --bullet.age;
        if (bullet.age <= 0)
        {
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }
}

export function render(ctx, world, bullets)
{
    for(let bullet of bullets)
    {
        ctx.translate(bullet.x, bullet.y);
        ctx.fillStyle = 'gold';
        ctx.fillRect(-2, -2, 4, 4);
        ctx.translate(-bullet.x, -bullet.y);
    }
}
