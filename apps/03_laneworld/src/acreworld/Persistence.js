/**
 * @typedef {import('../junction/Junction.js').JunctionMap} JunctionMap
 * @typedef {import('../junction/Junction.js').JunctionIndex} JunctionIndex
 */

import { retainOnlyJunctionConnections } from '../junction/Junction.js';

export class Persistence {
  /**
   * @param {JunctionMap} junctionMap
   */
  constructor(junctionMap) {
    this.junctionMap = junctionMap;
    /** @type {Record<string, Array<JunctionIndex>>} */
    this.persists = {};
  }

  clear() {
    this.persists = {};
  }

  markPersistentJunction(juncIndex, dependentIndex = juncIndex) {
    this.markPersistentJunctionImpl(juncIndex, dependentIndex);
    if (juncIndex !== dependentIndex) {
      this.markPersistentJunctionImpl(dependentIndex, juncIndex);
    }
  }

  /** @private */
  markPersistentJunctionImpl(juncIndex, dependentIndex) {
    let list = this.persists[juncIndex];
    if (!list) {
      list = this.persists[juncIndex] = [];
    }
    let i = list.indexOf(dependentIndex);
    if (i < 0) {
      list.push(dependentIndex);
    } else {
      throw new Error(
        'Cannot mark persistence for junction already persistent.'
      );
    }
  }

  unmarkPersistentJunction(juncIndex, dependentIndex = juncIndex) {
    this.unmarkPersistentJunctionImpl(juncIndex, dependentIndex);
    if (juncIndex !== dependentIndex) {
      this.unmarkPersistentJunctionImpl(dependentIndex, juncIndex);
    }
  }

  /** @private */
  unmarkPersistentJunctionImpl(juncIndex, dependentIndex) {
    let list = this.persists[juncIndex];
    let i = list.indexOf(dependentIndex);
    if (i >= 0) {
      list.splice(i, 1);
    } else {
      throw new Error(
        'Cannot unmark persistence for junction already non-persistent.'
      );
    }
  }

  isPersistentJunction(juncIndex) {
    let list = this.persists[juncIndex];
    if (list) {
      return list.length > 0;
    } else {
      return false;
    }
  }

  retainOnlyPersistentJunctionConnections(juncIndex) {
    const map = this.junctionMap;
    let list = this.persists[juncIndex];
    if (!list || list.length <= 0) {
      throw new Error('Cannot retain non-persistent junction.');
    }
    retainOnlyJunctionConnections(map, juncIndex, list);
  }
}
