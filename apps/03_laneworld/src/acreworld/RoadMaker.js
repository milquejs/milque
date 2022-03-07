import { bresenhamLine } from '@milque/util';

export const CURSOR_ACTION = {
  NONE: 0,
  ACTIVATING: 1,
  DEACTIVATING: 2,
};

/**
 * @param {number} screenX
 * @param {number} screenY
 * @param {0|1|2} action
 * @param {object} state
 * @param {(fromX, fromY, toX, toY) => void} connector
 * @param {(cellX, cellY) => void} disconnector
 * @param {number} cellSize
 * @param {number} dragMargin
 */
export function tryRoadInteraction(
  screenX,
  screenY,
  action,
  interactionState,
  connector,
  disconnector,
  cellSize,
  dragMargin
) {
  let cellxf = screenX / cellSize;
  let cellyf = screenY / cellSize;
  let cellx = Math.floor(cellxf);
  let celly = Math.floor(cellyf);
  switch (action) {
    case CURSOR_ACTION.ACTIVATING:
      makeRoad(
        interactionState,
        cellx,
        celly,
        cellxf,
        cellyf,
        connector,
        dragMargin
      );
      break;
    case CURSOR_ACTION.DEACTIVATING:
      breakRoad(interactionState, cellx, celly, disconnector);
      break;
    case CURSOR_ACTION.NONE:
      interactionState.status = CURSOR_ACTION.NONE;
      break;
  }
}

function makeRoad(state, cellx, celly, cellxf, cellyf, connector, dragMargin) {
  let { status, dragCellX, dragCellY } = state;
  if (status !== CURSOR_ACTION.ACTIVATING) {
    state.status = CURSOR_ACTION.ACTIVATING;
    state.dragCellX = dragCellX = cellx;
    state.dragCellY = dragCellY = celly;
  }
  let prevCellX = dragCellX + 0.5;
  let prevCellY = dragCellY + 0.5;
  let nextCellX = cellxf;
  let nextCellY = cellyf;
  let dx = nextCellX - prevCellX;
  let dy = nextCellY - prevCellY;
  let dist = Math.sqrt(dx * dx + dy * dy);
  if (dist >= dragMargin) {
    prevCellX = dragCellX;
    prevCellY = dragCellY;
    nextCellX = cellx;
    nextCellY = celly;
    bresenhamLine(prevCellX, prevCellY, nextCellX, nextCellY, (x, y) => {
      connector.call(undefined, prevCellX, prevCellY, x, y);
      nextCellX = prevCellX = x;
      nextCellY = prevCellY = y;
    });
    state.dragCellX = nextCellX;
    state.dragCellY = nextCellY;
  }
}

function breakRoad(state, cellx, celly, disconnector) {
  let { status, dragCellX, dragCellY } = state;
  if (status !== CURSOR_ACTION.DEACTIVATING) {
    state.status = CURSOR_ACTION.DEACTIVATING;
    state.dragCellX = dragCellX = -1;
    state.dragCellY = dragCellY = -1;
  }
  if (cellx !== dragCellX || celly !== dragCellY) {
    disconnector.call(undefined, cellx, celly);
    state.dragCellX = cellx;
    state.dragCellY = celly;
  }
}
