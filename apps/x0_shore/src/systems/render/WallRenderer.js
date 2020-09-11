export function WallRenderer(ctx, owner, entityManager)
{
    const renderable = entityManager.get('Renderable', owner);
    ctx.fillStyle = 'white';
    let halfWidth = renderable.width / 2;
    let halfHeight = renderable.height / 2;
    ctx.fillRect(-halfWidth, -halfHeight, renderable.width, renderable.height);
}
