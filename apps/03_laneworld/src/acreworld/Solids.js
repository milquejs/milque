/**
 * @typedef {import('../junction/Junction.js').JunctionMap} JunctionMap
 * @typedef {import('../junction/Junction.js').JunctionIndex} JunctionIndex
 */

export class Solids {
  /**
   * @param {JunctionMap} junctionMap
   */
  constructor(junctionMap) {
    this.junctionMap = junctionMap;
    /** @type {Record<string, Array<JunctionIndex>>} */
    this.solids = new Uint8Array(junctionMap.length);
  }

  clear() {
    this.solids = {};
  }

  markSolidJunction(juncIndex) {
    this.solids[juncIndex] = 1;
  }

  unmarkSolidJunction(juncIndex) {
    this.solids[juncIndex] = 0;
  }

  isSolidJunction(juncIndex) {
    return this.solids[juncIndex];
  }
}

export function drawSolids(ctx, world, map, cellSize, color = '#663366') {
  for (let y = 0; y < map.height; ++y) {
    for (let x = 0; x < map.width; ++x) {
      let i = x + y * map.width;
      if (world.solids.isSolidJunction(i)) {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}
