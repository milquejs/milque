export function WallRenderer(ctx, owner, entityManager)
{
    const renderable = entityManager.get('Renderable', owner);
    const wallInfo = entityManager.get('RenderWallInfo', owner);
    ctx.fillStyle = 'gray';
    let halfWidth = wallInfo.rx;
    let halfHeight = wallInfo.ry;
    ctx.fillRect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2);
}

export function RenderWallInfo(props)
{
    const { rx, ry } = props;
    return {
        rx,
        ry,
    };
}
