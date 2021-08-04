import { getCartById, getJunctionCoordsFromIndex, isNullJunction, NULL_JUNCTION_INDEX } from './Junction.js';
import { astarSearch } from './util/astar.js';

/**
 * @typedef {import('./LaneWorld.js').LaneWorld} LaneWorld
 */

const SEARCH_VALID_DESTINATION_RATE = 5;
const PROCESSING_TICKS = 5;
const RESTING_TICKS = 5;

const CART_STATE = {
    READY: 0,
    SENDING: 1,
    PROCESSING: 2,
    RETURNING: 3,
    RESTING: 4,
};

/**
 * @param {LaneWorld} world 
 * @param {string} cartId 
 */
export function updateNavigation(world, cartId)
{
    let cart = getCartById(world, cartId);
    switch(cart.state)
    {
        case CART_STATE.READY:
            if (cart.lastUpdatedTicks - cart.lastStateChangedTicks > SEARCH_VALID_DESTINATION_RATE)
            {
                cart.lastStateChangedTicks = cart.lastUpdatedTicks;

                let dest = findValidDestination(world, cart);
                if (!isNullJunction(world, dest))
                {
                    let path = findPathToJunction(world, cart.currentJunction, dest);
                    if (path.length > 0)
                    {
                        cart.state = CART_STATE.SENDING;

                        cart.path = path;
                        cart.pathIndex = 0;
                        return cart.path[1];
                    }
                }
            }
            break;
        case CART_STATE.SENDING:
            {
                let i = cart.path.indexOf(cart.currentJunction);
                if (i < 0)
                {
                    throw new Error('Cart not on path for index ' + i);
                }
                else
                {
                    ++i;
                    if (i >= cart.path.length)
                    {
                        // We reached the end!
                        cart.state = CART_STATE.PROCESSING;
                        cart.lastStateChangedTicks = cart.lastUpdatedTicks;

                        cart.path = [];
                        cart.pathIndex = -1;
                    }
                    else
                    {
                        // We are moving forward!
                        return cart.path[i];
                    }
                }
            }
            break;
        case CART_STATE.PROCESSING:
            if (cart.lastUpdatedTicks - cart.lastStateChangedTicks > PROCESSING_TICKS)
            {
                cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                if (!isNullJunction(world, cart.home))
                {
                    let path = findPathToJunction(world, cart.currentJunction, cart.home);
                    if (path.length > 0)
                    {
                        cart.state = CART_STATE.RETURNING;

                        cart.path = path;
                        cart.pathIndex = 0;
                        return cart.path[1];
                    }
                }
            }
            break;
        case CART_STATE.RETURNING:
            {
                let i = cart.path.indexOf(cart.currentJunction);
                if (i < 0)
                {
                    throw new Error('Cart not on path for index ' + i);
                }
                else
                {
                    ++i;
                    if (i >= cart.path.length)
                    {
                        // We reached the end!
                        cart.state = CART_STATE.RESTING;
                        cart.lastStateChangedTicks = cart.lastUpdatedTicks;

                        cart.path = [];
                        cart.pathIndex = -1;
                    }
                    else
                    {
                        // We are moving forward!
                        return cart.path[i];
                    }
                }
            }
            break;
        case CART_STATE.RESTING:
            if (cart.lastUpdatedTicks - cart.lastStateChangedTicks > RESTING_TICKS)
            {
                cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                cart.state = CART_STATE.READY;
            }
            break;
    }
    return NULL_JUNCTION_INDEX;
}

function findValidDestination(world, cart)
{
    let destinations = [];
    for(let i = 0; i < world.juncs.length; ++i)
    {
        let junc = world.juncs[i];
        if (junc && junc.parkingCapacity > 0)
        {
            destinations.push(i);
        }
    }
    return destinations[Math.floor(Math.random() * destinations.length)];
}

function findPathToJunction(world, fromJunc, toJunc)
{
    let path = astarSearch(fromJunc, toJunc, (juncIndex) => {
        let junc = world.juncs[juncIndex];
        if (junc)
        {
            return junc.outlets;
        }
        else
        {
            return [];
        }
    }, (fromIndex, toIndex) => {
        let [fromJuncX, fromJuncY] = getJunctionCoordsFromIndex(world, fromIndex);
        let [toJuncX, toJuncY] = getJunctionCoordsFromIndex(world, toIndex);
        return Math.abs(toJuncX - fromJuncX) + Math.abs(toJuncY - fromJuncY);
    });
    return path;
}
