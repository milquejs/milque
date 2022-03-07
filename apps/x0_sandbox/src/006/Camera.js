const CELL_SIZE = 32;
const ORIGIN_POINT = new DOMPointReadOnly(0, 0, 0, 1);
const CELL_POINT = new DOMPointReadOnly(CELL_SIZE, CELL_SIZE, 0, 1);
const INV_NATURAL_LOG_2 = 1 / Math.log(2);
const IDENTITY_MATRIX = [1, 0, 0, 1, 0, 0];

export function drawWorldGrid(
  ctx,
  viewWidth,
  viewHeight,
  view = IDENTITY_MATRIX,
  projection = IDENTITY_MATRIX
) {
  const viewMatrix = new DOMMatrixReadOnly(view);
  const projMatrix = new DOMMatrixReadOnly(projection);
  const transformMatrix = projMatrix.multiply(viewMatrix);
  const offsetPoint = transformMatrix.transformPoint(ORIGIN_POINT);
  const cellPoint = transformMatrix.transformPoint(CELL_POINT);

  const minCellWidth = cellPoint.x - offsetPoint.x;
  const minCellHeight = cellPoint.y - offsetPoint.y;
  const maxCellSize = Math.floor(
    (Math.log(viewWidth) - Math.log(minCellWidth)) * INV_NATURAL_LOG_2
  );

  let cellWidth = Math.pow(2, maxCellSize) * minCellWidth;
  let cellHeight = Math.pow(2, maxCellSize) * minCellHeight;
  if (cellWidth === 0 || cellHeight === 0) return;
  drawGrid(
    ctx,
    viewWidth,
    viewHeight,
    offsetPoint.x,
    offsetPoint.y,
    cellWidth,
    cellHeight,
    1,
    false
  );
  drawGrid(
    ctx,
    viewWidth,
    viewHeight,
    offsetPoint.x,
    offsetPoint.y,
    cellWidth / 2,
    cellHeight / 2,
    3 / 4,
    false
  );
  drawGrid(
    ctx,
    viewWidth,
    viewHeight,
    offsetPoint.x,
    offsetPoint.y,
    cellWidth / 4,
    cellHeight / 4,
    2 / 4,
    false
  );
  drawGrid(
    ctx,
    viewWidth,
    viewHeight,
    offsetPoint.x,
    offsetPoint.y,
    cellWidth / 8,
    cellHeight / 8,
    1 / 4,
    false
  );
}

export function drawWorldTransformGizmo(
  ctx,
  viewWidth,
  viewHeight,
  view = IDENTITY_MATRIX,
  projection = IDENTITY_MATRIX
) {
  const viewMatrix = new DOMMatrixReadOnly(view);
  const worldPoint = viewMatrix.transformPoint(ORIGIN_POINT);
  const fontSize = viewWidth / CELL_SIZE;
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = `${fontSize}px monospace`;
  ctx.fillText(
    `(${-Math.floor(worldPoint.x)},${-Math.floor(worldPoint.y)})`,
    CELL_SIZE,
    CELL_SIZE
  );
  drawTransformGizmo(ctx, CELL_SIZE / 4, CELL_SIZE / 4, CELL_SIZE, CELL_SIZE);
}

export function drawGrid(
  ctx,
  viewWidth,
  viewHeight,
  offsetX,
  offsetY,
  cellWidth = 32,
  cellHeight = cellWidth,
  lineWidth = 1,
  showCoords = false
) {
  ctx.beginPath();
  for (let y = offsetY % cellHeight; y < viewHeight; y += cellHeight) {
    ctx.moveTo(0, y);
    ctx.lineTo(viewWidth, y);
  }
  for (let x = offsetX % cellWidth; x < viewWidth; x += cellWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, viewHeight);
  }
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.lineWidth = 1;

  if (showCoords) {
    const fontSize = Math.min(cellWidth / 4, 16);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.fillStyle = '#333333';

    for (let y = offsetY % cellHeight; y < viewHeight; y += cellHeight) {
      for (let x = offsetX % cellWidth; x < viewWidth; x += cellWidth) {
        ctx.fillText(
          `(${Math.round((x - offsetX) / cellWidth)},${Math.round(
            (y - offsetY) / cellHeight
          )})`,
          x + lineWidth * 2,
          y + lineWidth * 2
        );
      }
    }
  }
}

export function drawTransformGizmo(ctx, x, y, width, height = width) {
  const fontSize = width * 0.6;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${fontSize}px monospace`;

  ctx.translate(x, y);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.strokeStyle = '#FF0000';
  ctx.stroke();
  ctx.fillStyle = '#FF0000';
  ctx.fillText('x', width + fontSize, 0);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.strokeStyle = '#00FF00';
  ctx.stroke();
  ctx.fillStyle = '#00FF00';
  ctx.fillText('y', 0, height + fontSize);

  const zSize = fontSize / 4;
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(-zSize / 2, -zSize / 2, zSize, zSize);
  ctx.fillText('z', fontSize / 2, fontSize / 2);

  ctx.translate(-x, -y);
}
