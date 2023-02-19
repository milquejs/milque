export function WallRenderer(ctx, owner, entityManager) {
  const wallInfo = entityManager.get('RenderWallInfo', owner);
  ctx.fillStyle = 'gray';
  let halfWidth = wallInfo.rx;
  let halfHeight = wallInfo.ry;
  ctx.fillRect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2 + 12);
}

export function RenderWallInfo(props) {
  const { rx, ry } = props;
  return {
    rx,
    ry,
  };
}
