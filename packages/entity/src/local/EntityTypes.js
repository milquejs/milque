import './LocalEntityPool'; // This is necessary to include this file in js.

/**
 * @typedef EntityPoolLike
 * @property {Record<string, import('./ComponentInstanceMap').ComponentInstanceMap<any>>} components
 * @property {import('./EntityId').EntityId} nextAvailableEntityId
 * @property {Array<import('./EntityId').EntityId>} unclaimedEntityIds
 * @property {Array<import('./EntityId').EntityId>} deadEntityIds
 */
