/**
 * @typedef {import('../junction/Junction.js').JunctionMap} JunctionMap
 * @typedef {import('../junction/Junction.js').JunctionIndex} JunctionIndex
 * @typedef {import('../cartworld/PathFinder.js').PathFinder} PathFinder
 * @typedef {import('./Persistence.js').Persistence} Persistence
 */

import {
  getJunctionCoordsFromIndex,
  removeOnlyJunctionConnections,
} from '../junction/Junction.js';

export class Demolition {
  /**
   * @param {JunctionMap} junctionMap
   * @param {PathFinder} pathFinder
   * @param {Persistence} persistence
   */
  constructor(junctionMap, pathFinder, persistence) {
    /** @private */
    this.junctionMap = junctionMap;
    /** @private */
    this.pathFinder = pathFinder;
    /** @private */
    this.persistence = persistence;

    /** @private */
    this.demolished = new Uint8Array(junctionMap.length);
    /** @private */
    this.lanes = {};
  }

  update() {
    let len = this.junctionMap.length;
    for (let i = 0; i < len; ++i) {
      if (this.isJunctionMarkedForDemolition(i)) {
        if (!this.junctionMap.hasJunction(i)) {
          throw new Error(
            'Trying to demolish non-existant, but marked, junction.'
          );
        }
        if (!this.pathFinder.isJunctionUsedForAnyPath(i)) {
          performDemolish(this.junctionMap, this.persistence, i, this.lanes[i]);
          this.unmarkForDemolition(i);
        }
      }
    }
  }

  clear() {
    let len = this.junctionMap.length;
    for (let i = 0; i < len; ++i) {
      if (this.isJunctionMarkedForDemolition(i)) {
        this.unmarkForDemolition(i);
      }
    }
  }

  markForDemolition(juncIndex) {
    let junc = this.junctionMap.getJunction(juncIndex);
    this.lanes[juncIndex] = junc.getOutlets();
    this.demolished[juncIndex] = 1;
    this.pathFinder.setWeight(juncIndex, Number.POSITIVE_INFINITY);
  }

  unmarkForDemolition(juncIndex) {
    this.demolished[juncIndex] = 0;
    delete this.lanes[juncIndex];
    this.pathFinder.resetWeight(juncIndex);
  }

  unmarkLaneForDemolition(juncIndex, outletIndex) {
    if (!this.isJunctionMarkedForDemolition(juncIndex)) return;
    let lanes = this.lanes[juncIndex];
    let i = lanes.indexOf(outletIndex);
    if (i < 0) return;
    lanes.splice(i, 1);
  }

  isJunctionMarkedForDemolition(juncIndex) {
    return this.demolished[juncIndex] > 0;
  }

  isLaneMarkedForDemolition(juncIndex, outletIndex) {
    return (
      this.isJunctionMarkedForDemolition(juncIndex) &&
      this.lanes[juncIndex].includes(outletIndex)
    );
  }
}

function performDemolish(map, persistence, juncIndex, outlets) {
  if (persistence.isPersistentJunction(juncIndex)) {
    let unpersistent = outlets.filter(
      (outlet) => !persistence.isPersistentJunction(outlet)
    );
    removeOnlyJunctionConnections(map, juncIndex, unpersistent);
  } else {
    removeOnlyJunctionConnections(map, juncIndex, outlets);
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {JunctionMap} map
 * @param {Demolition} demolition
 * @param {number} cellSize
 */
export function drawDemolition(ctx, map, demolition, cellSize) {
  const juncSize = cellSize / 2;
  const laneRadius = juncSize;
  ctx.lineWidth = laneRadius;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#660000';
  for (let y = 0; y < map.height; ++y) {
    for (let x = 0; x < map.width; ++x) {
      let i = x + y * map.width;
      if (!map.hasJunction(i)) continue;
      if (!demolition.isJunctionMarkedForDemolition(i)) continue;
      let junc = map.getJunction(i);
      let beginX = (x + 0.5) * cellSize;
      let beginY = (y + 0.5) * cellSize;
      for (let outlet of junc.outlets) {
        if (!demolition.isLaneMarkedForDemolition(i, outlet)) continue;
        let [xx, yy] = getJunctionCoordsFromIndex(map, outlet);
        let endX = (xx + 0.5) * cellSize;
        let endY = (yy + 0.5) * cellSize;
        ctx.beginPath();
        ctx.moveTo(beginX, beginY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
  }
}
