export function drawGrid(
  ctx,
  gridCols,
  gridRows,
  gridCellSize,
  color = '#222222'
) {
  for (let y = 0; y < gridRows; ++y) {
    for (let x = 0; x < gridCols; ++x) {
      let xx = x * gridCellSize;
      let yy = y * gridCellSize;
      ctx.strokeStyle = color;
      ctx.strokeRect(xx, yy, gridCellSize, gridCellSize);
    }
  }
}
