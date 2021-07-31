import { astarSearch } from './util/astar.js';
import { fisherYatesShuffle } from './util/shuffle.js';

/**
 * @typedef {import('./World.js').World} World
 */

export const CART_VALID_DESTINATION_SEARCH_INTERVAL_MILLIS = 100;
export const CART_PROCESSING_TIME_MILLIS = 100;
export const CART_RESTING_TIME_MILLIS = 100;
export const CART_STATUS = {
    READY: 0,
    SENDING: 1,
    PROCESSING: 2,
    RETURNING: 3,
    RESTING: 4,
};

export class Cart
{
    constructor(id, cellX, cellY)
    {
        this.id = id;
        this.cellX = cellX;
        this.cellY = cellY;

        this.maxSpeed = 4;
        this.currentLane = null;
        this.laneProgress = 0;
        this.targetLane = null;

        this.homeX = cellX;
        this.homeY = cellY;
        this.homeJunction = null;

        this.destination = null;
        this.status = CART_STATUS.RESTING;
        this.pathIndex = -1;
        this.timer = 0;

        this.drawTicks = 0;
        this.x = cellX;
        this.y = cellY;
    }

    setHome(cellX, cellY, junctionId)
    {
        this.homeX = cellX;
        this.homeY = cellY;
        this.homeJunction = junctionId;
        return this;
    }
}

/**
 * @param {World} world
 * @param {string} sourceJunctionId 
 * @param {string} destinationJunctionId 
 */
function findPath(world, sourceJunctionId, destinationJunctionId)
{
    return astarSearch(sourceJunctionId, destinationJunctionId, (laneId) => {
        return world.lanes[laneId].outlets;
    }, (fromId, toId) => {
        let [, fromCellX, fromCellY] = fromId.split('-');
        let [, toCellX, toCellY] = toId.split('-');
        return Math.abs(toCellX - fromCellX) + Math.abs(toCellY - fromCellY);
    });
}

/**
 * @param {World} worldMap
 * @param {Cart} cart
 */
function findValidDestination(worldMap, cart)
{
    let unchecked = Object.values(worldMap.ports);
    fisherYatesShuffle(unchecked);
    while(unchecked.length > 0)
    {
        const { factoryId, x, y, junctionId } = unchecked.pop();
        let result = findPath(worldMap, cart.currentLane, junctionId);
        if (result && result.length > 0)
        {
            return {
                path: result,
                ownerId: factoryId,
                cellX: x,
                cellY: y,
            };
        }
    }
    return null;
}

/**
 * @param {World} worldMap
 * @param {Cart} cart
 */
function findHomeDestination(worldMap, cart)
{
    let result = findPath(worldMap, cart.currentLane, cart.homeJunction);
    if (result && result.length > 0)
    {
        return {
            path: result,
            ownerId: cart.homeJunction,
            cellX: cart.homeX,
            cellY: cart.homeY,
        };
    }
    return null;
}

/**
 * @param {World} worldMap
 */
function startSendingToDestination(worldMap, cart, destination)
{
    cart.destination = destination;
    cart.pathIndex = 0;
    cart.status = CART_STATUS.SENDING;
    cart.targetLane = destination.path[0];
}

/**
 * @param {World} worldMap
 */
function stopSendingToDestination(worldMap, cart)
{
    cart.pathIndex = cart.destination.path.length - 1;
    cart.status = CART_STATUS.PROCESSING;
}

/**
 * @param {World} worldMap
 */
function startSendingToHomeDestination(worldMap, cart, destination)
{
    cart.destination = destination;
    cart.pathIndex = 0;
    cart.status = CART_STATUS.RETURNING;
}

function moveCartTowardsLane(worldMap, cart, laneId)
{
    if (cart.currentLane === laneId)
    {
        cart.targetLane = null;
        return true;
    }
    else
    {
        cart.targetLane = laneId;
        return false;
    }
}

/**
 * @param {World} worldMap
 */
function moveCartTowardsCell(worldMap, cart, nextCellX, nextCellY)
{
    if (cart.cellProgress > 1)
    {
        cart.speed = Math.random() * 0.01 + 0.01;
        cart.cellProgress = 0;
        cart.cellX = nextCellX;
        cart.cellY = nextCellY;
        return true;
    }
    else
    {
        let dx = nextCellX - cart.cellX;
        let dy = nextCellY - cart.cellY;
        cart.nextCellX = nextCellX;
        cart.nextCellY = nextCellY;

        let driveOn = true;
        let others = Object.values(worldMap.carts);
        for(let other of others)
        {
            if (other.cellX === nextCellX && other.cellY === nextCellY && other !== cart)
            {
                if (other.nextCellX === nextCellX && other.nextCellY === nextCellY)
                {
                    driveOn = false;
                    break;
                }
            }
        }

        if (driveOn)
        {
            cart.cellProgress += cart.speed;
        }
        let ratio = cart.cellProgress;
        cart.x = cart.cellX + dx * ratio;
        cart.y = cart.cellY + dy * ratio;
        return false;
    }
}

/**
 * @param {World} worldMap
 */
function stopReturningToSource(worldMap, cart)
{
    cart.destination = null;
    cart.pathIndex = -1;
    cart.status = CART_STATUS.RESTING;
}

/**
 * @param {World} worldMap
 */
export function updateCart(worldMap, cart)
{
    switch(cart.status)
    {
        case CART_STATUS.READY:
            if (++cart.timer >= CART_VALID_DESTINATION_SEARCH_INTERVAL_MILLIS)
            {
                cart.timer = 0;
                let dest = findValidDestination(worldMap, cart);
                if (dest)
                {
                    startSendingToDestination(worldMap, cart, dest);
                }
            }
            break;
        case CART_STATUS.SENDING:
            if (cart.pathIndex >= cart.destination.path.length)
            {
                stopSendingToDestination(worldMap, cart);
            }
            else
            {
                let laneId = cart.destination.path[cart.pathIndex];
                let result = moveCartTowardsLane(worldMap, cart, laneId);
                if (result)
                {
                    // Progress to the next node.
                    cart.pathIndex += 1;
                }
            }
            break;
        case CART_STATUS.PROCESSING:
            if (++cart.timer >= CART_PROCESSING_TIME_MILLIS)
            {
                cart.timer = 0;
                let dest = findHomeDestination(worldMap, cart);
                if (dest)
                {
                    startSendingToHomeDestination(worldMap, cart, dest);
                }
            }
            break;
        case CART_STATUS.RETURNING:
            if (cart.pathIndex < 0)
            {
                stopReturningToSource(worldMap, cart);
                cart.cellX = cart.homeX;
                cart.cellY = cart.homeY;
                cart.currentLane = cart.homeJunction;
                cart.targetLane = null;
            }
            else
            {
                let laneId = cart.destination.path[cart.pathIndex];
                let result = moveCartTowardsLane(worldMap, cart, laneId);
                if (result)
                {
                    // Progress to the next node.
                    cart.pathIndex += 1;
                }
            }
            break;
        case CART_STATUS.RESTING:
            if (++cart.timer >= CART_RESTING_TIME_MILLIS)
            {
                cart.timer = 0;
                cart.status = CART_STATUS.READY;
            }
            break;
    }
}
 