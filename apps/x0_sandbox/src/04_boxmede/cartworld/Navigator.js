import { isNullJunction, randomOutletJunctionFromJunction } from '../laneworld/Junction.js';
import { getCartById, NULL_JUNCTION_INDEX } from './Cart.js';
import { PathFinder } from './PathFinder.js';

/**
 * @typedef {import('./Cart.js').Cart} Cart
 */

const SEARCH_VALID_DESTINATION_RATE = 0;
const PROCESSING_TICKS = 0;
const RESTING_TICKS = 0;
const FORCE_RANDOM_WALK = false;

const CART_STATE = {
    READY: 0,
    SENDING: 1,
    PROCESSING: 2,
    RETURNING: 3,
    RESTING: 4,
};

export class Navigator
{
    constructor(junctionMap)
    {
        this.junctionMap = junctionMap;
        this.pathFinder = new PathFinder(junctionMap);
    }

    updateNavigation(world, cartManager, cartId)
    {
        const junctionMap = this.junctionMap;
        const pathFinder = this.pathFinder;

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
    
                    let dest = findValidDestination(world, junctionMap, cart);
                    if (!isNullJunction(junctionMap, dest))
                    {
                        let pathId = pathFinder.acquirePath(cart.currentJunction, dest);
                        if (pathId)
                        {
                            cart.state = CART_STATE.SENDING;
                            cart.path = pathFinder.getPathById(pathId);
                            cart.pathId = pathId;
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
                        cart.currentJunction = cart.homeIndex;
                        cart.state = CART_STATE.RESTING;
                        cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                        if (cart.pathId)
                        {
                            pathFinder.releasePath(cart.pathId);
                            cart.pathId = null;
                            cart.path = [];
                            cart.pathIndex = -1;
                        }
                    }
                    else
                    {
                        ++i;
                        if (i >= cart.path.length)
                        {
                            // We reached the end!
                            cart.state = CART_STATE.PROCESSING;
                            cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                            if (cart.pathId)
                            {
                                pathFinder.releasePath(cart.pathId);
                                cart.pathId = null;
                                cart.path = [];
                                cart.pathIndex = -1;
                            }
                        }
                        else
                        {
                            // We are moving forward!
                            let juncIndex = cart.path[i];
                            if (!junctionMap.hasJunction(juncIndex))
                            {
                                // Path is no longer valid. Reset back to home.
                                cart.currentJunction = cart.homeIndex;
                                cart.state = CART_STATE.RESTING;
                                cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                                if (cart.pathId)
                                {
                                    pathFinder.releasePath(cart.pathId);
                                    cart.pathId = null;
                                    cart.path = [];
                                    cart.pathIndex = -1;
                                }
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
                    if (!isNullJunction(junctionMap, cart.homeIndex))
                    {
                        if (cart.pathId)
                        {
                            pathFinder.releasePath(cart.pathId);
                            cart.pathId = null;
                        }
                        let pathId = pathFinder.acquirePath(cart.currentJunction, cart.homeIndex);
                        if (pathId)
                        {
                            cart.state = CART_STATE.RETURNING;
    
                            cart.path = pathFinder.getPathById(pathId);
                            cart.pathId = pathId;
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
                        cart.currentJunction = cart.homeIndex;
                        cart.state = CART_STATE.RESTING;
                        cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                        if (cart.pathId)
                        {
                            pathFinder.releasePath(cart.pathId);
                            cart.pathId = null;
                            cart.path = [];
                            cart.pathIndex = -1;
                        }
                    }
                    else
                    {
                        ++i;
                        if (i >= cart.path.length)
                        {
                            // We reached the end!
                            cart.state = CART_STATE.RESTING;
                            cart.lastStateChangedTicks = cart.lastUpdatedTicks;
    
                            if (cart.pathId)
                            {
                                pathFinder.releasePath(cart.pathId);
                                cart.pathId = null;
                                cart.path = [];
                                cart.pathIndex = -1;
                            }
                        }
                        else
                        {
                            // We are moving forward!
                            let juncIndex = cart.path[i];
                            if (!junctionMap.hasJunction(juncIndex))
                            {
                                // Path is no longer valid. Reset back to home.
                                cart.currentJunction = cart.homeIndex;
                                cart.state = CART_STATE.RESTING;
                                cart.lastStateChangedTicks = cart.lastUpdatedTicks;
                                if (cart.pathId)
                                {
                                    pathFinder.releasePath(cart.pathId);
                                    cart.pathId = null;
                                    cart.path = [];
                                    cart.pathIndex = -1;
                                }
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
}

/**
 * @param {AcreWorld}
 * @param {JunctionMap} junctionMap 
 * @param {Cart} cart 
 */
function findValidDestination(world, junctionMap, cart)
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
