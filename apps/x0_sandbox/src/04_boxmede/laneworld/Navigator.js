import { getJunctionCoordsFromIndex, isNullJunction, randomOutletJunctionFromJunction } from './Junction.js';
import { getCartById, NULL_JUNCTION_INDEX } from './Cart.js';

import { astarSearch } from '../util/astar.js';

/**
 * @typedef {import('../LaneWorld.js').LaneWorld} LaneWorld
 */

const SEARCH_VALID_DESTINATION_RATE = 5;
const PROCESSING_TICKS = 5;
const RESTING_TICKS = 5;
const FORCE_RANDOM_WALK = false;

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
export function updateNavigation(cartManager, junctionMap, cartId)
{
    let cart = getCartById(cartManager, cartId);
    if (FORCE_RANDOM_WALK)
    {
        let next = randomOutletJunctionFromJunction(junctionMap, cart.currentJunction);
        cart.path = [next];
        cart.pathIndex = 0;
        return next;
    }
    switch(cart.state)
    {
        case CART_STATE.READY:
            if (cart.lastUpdatedTicks - cart.lastStateChangedTicks > SEARCH_VALID_DESTINATION_RATE)
            {
                cart.lastStateChangedTicks = cart.lastUpdatedTicks;

                let dest = findValidDestination(junctionMap, cart);
                if (!isNullJunction(junctionMap, dest))
                {
                    let path = findPathToJunction(junctionMap, cart.currentJunction, dest);
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
                    // Reset back to home.
                    cart.currentJunction = cart.home;
                    cart.state = CART_STATE.RESTING;
                    cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                    cart.path = [];
                    cart.pathIndex = -1;
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
                        let juncIndex = cart.path[i];
                        if (!junctionMap.hasJunction(juncIndex))
                        {
                            // Path is no longer valid. Reset back to home.
                            cart.currentJunction = cart.home;
                            cart.state = CART_STATE.RESTING;
                            cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                            cart.path = [];
                            cart.pathIndex = -1;
                        }
                        else
                        {
                            return juncIndex;
                        }
                    }
                }
            }
            break;
        case CART_STATE.PROCESSING:
            if (cart.lastUpdatedTicks - cart.lastStateChangedTicks > PROCESSING_TICKS)
            {
                cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                if (!isNullJunction(junctionMap, cart.home))
                {
                    let path = findPathToJunction(junctionMap, cart.currentJunction, cart.home);
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
                    // Reset back to home.
                    cart.currentJunction = cart.home;
                    cart.state = CART_STATE.RESTING;
                    cart.lastStateChangedTicks = cart.lastUpdatedTicks;

                    cart.path = [];
                    cart.pathIndex = -1;
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
                        let juncIndex = cart.path[i];
                        if (!junctionMap.hasJunction(juncIndex))
                        {
                            // Path is no longer valid. Reset back to home.
                            cart.currentJunction = cart.home;
                            cart.state = CART_STATE.RESTING;
                            cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                            cart.path = [];
                            cart.pathIndex = -1;
                        }
                        else
                        {
                            return juncIndex;
                        }
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

/**
 * 
 * @param {JunctionMap} junctionMap 
 * @param {*} cart 
 * @returns 
 */
function findValidDestination(junctionMap, cart)
{
    let destinations = [];
    for(let i = 0; i < junctionMap.length; ++i)
    {
        if (junctionMap.hasJunction(i))
        {
            let junc = junctionMap.getJunction(i);
            if (junc.parkingCapacity > 0)
            {
                destinations.push(i);
            }
        }
    }
    return destinations[Math.floor(Math.random() * destinations.length)];
}

/**
 * 
 * @param {LaneWorld} world 
 * @param {JunctionIndex} fromJunc 
 * @param {JunctionIndex} toJunc 
 * @returns 
 */
function findPathToJunction(junctionMap, fromJunc, toJunc)
{
    let path = astarSearch(fromJunc, toJunc, (juncIndex) => {
        let junc = junctionMap.getJunction(juncIndex);
        if (junc)
        {
            return junc.outlets;
        }
        else
        {
            return [];
        }
    }, (fromIndex, toIndex) => {
        let [fromJuncX, fromJuncY] = getJunctionCoordsFromIndex(junctionMap, fromIndex);
        let [toJuncX, toJuncY] = getJunctionCoordsFromIndex(junctionMap, toIndex);
        return Math.abs(toJuncX - fromJuncX) + Math.abs(toJuncY - fromJuncY);
    });
    return path;
}
