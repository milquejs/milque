
/** @typedef {number} EntityId */

/**
 * Used to match for entity id in query result.
 * 
 * @param {number} [value]
 */
export function EntityId(value) {
  return /** @type {EntityId} */ (Math.trunc(Number(value ?? 0)));
}

EntityId.NONE = EntityId(0);
