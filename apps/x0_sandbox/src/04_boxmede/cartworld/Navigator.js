import { NULL_JUNCTION_INDEX } from './TrafficSimulator.js';

const CART_STATE = {
    READY: 0,
    SENDING: 1,
    PROCESSING: 2,
    RETURNING: 3,
    RESTING: 4,
};

/**
 * @param {AcreWorld} world 
 * @param {PathFinder} pathFinder 
 * @param {number} fromIndex 
 * @param {number} toIndex 
 * @returns 
 */
export function getPathToJunction(world, pathFinder, fromIndex, toIndex)
{
    return pathFinder.acquirePath(fromIndex, toIndex);
}

/**
 * @param {AcreWorld}
 * @param {JunctionMap} junctionMap 
 * @param {Cart} cart 
 */
export function findValidDestination(world, map)
{
    let factories = Object.values(world.factory);
    if (factories.length <= 0) return NULL_JUNCTION_INDEX;
    let i = Math.floor(Math.random() * factories.length);
    let factory = factories[i];
    let parking = factory.parking;
    if (parking.length <= 0) return NULL_JUNCTION_INDEX;
    i = Math.floor(Math.random() * parking.length);
    return parking[i];
}
