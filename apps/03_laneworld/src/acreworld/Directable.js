/**
 * @typedef {import('../junction/Junction.js').JunctionMap} JunctionMap
 */

import {
  DIRECTIONAL_ENCODING_BITS,
  DIRECTIONAL_ENCODING_NULL,
  getDirectionalVectorFromEncoding,
  rotateDirectionalEncoding,
} from '../util/Directional.js';
import {
  connectJunctions,
  getJunctionCoordsFromIndex,
  getJunctionIndexFromCoords,
  isJunctionConnectedTo,
  isJunctionWithinBounds,
} from '../junction/Junction.js';

export class Directable {
  /**
   * @param {JunctionMap} junctionMap
   */
  constructor(junctionMap) {
    this.junctionMap = junctionMap;
    this.directs = new Array(junctionMap.length).fill(-1);
  }

  markDirectableJunction(juncIndex, childIndex) {
    const map = this.junctionMap;
    if (!map.hasJunction(juncIndex)) {
      throw new Error('Cannot mark directable for non-existant junction.');
    }
    if (!map.hasJunction(childIndex)) {
      throw new Error('Cannot mark directable child as non-existant junction.');
    }
    let childDirectable = this.directs[childIndex];
    if (childDirectable !== -1) {
      throw new Error(
        'Cannot mark directable child as another directable junction.'
      );
    }
    let prevDirectable = this.directs[juncIndex];
    if (prevDirectable !== -1) {
      throw new Error(
        'Cannot mark directable for junction already directable.'
      );
    }
    this.directs[juncIndex] = childIndex;
  }

  unmarkDirectableJunction(juncIndex) {
    let prevDirectable = this.directs[juncIndex];
    if (prevDirectable === -1) {
      throw new Error(
        'Cannot unmark directable for junction already non-directable.'
      );
    }
    this.directs[juncIndex] = -1;
  }

  isDirectableJunction(juncIndex) {
    return this.directs[juncIndex] !== -1;
  }

  getDirectableJunctionChild(juncIndex) {
    return this.directs[juncIndex];
  }

  redirectDirectableJunction(juncIndex, prevChildIndex, newChildIndex) {
    const map = this.junctionMap;
    if (prevChildIndex === newChildIndex) {
      throw new Error('Cannot redirect directable junction to the same child.');
    }
    if (!this.isDirectableJunction(juncIndex)) {
      throw new Error('Cannot redirect non-directable junction.');
    }
    if (this.isDirectableJunction(newChildIndex)) {
      throw new Error(
        'Cannot redirect directable junction to another directable junction.'
      );
    }
    if (this.getDirectableJunctionChild(juncIndex) !== prevChildIndex) {
      throw new Error('Found mismatched child index for directable junction.');
    }
    if (!map.hasJunction(newChildIndex)) {
      throw new Error('Cannot redirect junction to non-existant child.');
    }
    // NOTE: This does not destroy the previous directed junction.
    this.directs[juncIndex] = newChildIndex;
    if (!isJunctionConnectedTo(map, juncIndex, newChildIndex)) {
      connectJunctions(map, juncIndex, newChildIndex);
    }
    if (!isJunctionConnectedTo(map, newChildIndex, juncIndex)) {
      connectJunctions(map, newChildIndex, juncIndex);
    }
  }
}

export function tryFindValidChildDirectionForDirectable(
  map,
  juncIndex,
  initialDirection,
  validChildCallback
) {
  let [x, y] = getJunctionCoordsFromIndex(map, juncIndex);
  let direction = initialDirection;
  for (let i = 0; i < DIRECTIONAL_ENCODING_BITS; ++i) {
    let [dx, dy] = getDirectionalVectorFromEncoding(direction);
    let xx = x + dx;
    let yy = y + dy;
    if (!isJunctionWithinBounds(map, xx, yy)) {
      continue;
    }
    let childIndex = getJunctionIndexFromCoords(map, xx, yy);
    if (validChildCallback(childIndex)) {
      return direction;
    }
    direction = rotateDirectionalEncoding(direction);
  }
  return DIRECTIONAL_ENCODING_NULL;
}
