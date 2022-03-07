const halfWidth = 16;
const halfHeight = 16;

export function NullRenderer(ctx, owner, entityManager) {
  ctx.fillStyle = 'rgb(255, 0, 255)';
  ctx.fillRect(-halfWidth, -halfHeight, halfWidth, halfHeight);
  ctx.fillRect(0, 0, halfWidth, halfHeight);
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, -halfHeight, halfWidth, halfHeight);
  ctx.fillRect(-halfWidth, 0, halfWidth, halfHeight);
}
