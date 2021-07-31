/**
 * @typedef {import('../game/Game.js').Game} Game
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 * 
 * @typedef {import('./World.js').World} World
 * @typedef {import('./Cart.js').Cart} Cart
 */

/**
 * @param {Game} game
 */

export class Lane
{
    /**
     * @param {string} id 
     * @param {number} cellX 
     * @param {number} cellY 
     * @param {number} maxDistance 
     */
    constructor(id, cellX, cellY, maxDistance)
    {
        this.id = id;
        this.cellX = cellX;
        this.cellY = cellY;
        this.outlets = [];

        this.maxDistance = maxDistance;
        /** Index of first blocking entity (if is maxDistance then it is an empty road) */
        this.highWatermark = maxDistance;
        /** Carts in progress */
        this.cartProgress = new Array(maxDistance).fill(null);
    }

    addOutlet(outletLaneId)
    {
        if (!this.outlets.includes(outletLaneId))
        {
            this.outlets.push(outletLaneId);
        }
        return this;
    }
}

/**
 * @param {World} world 
 */
export function updateLanes(world)
{
    for(let laneId of Object.keys(world.lanes))
    {
        updateLaneTraffic(world, laneId);
    }
}

export function putCartOnLane(world, cartId, laneId, progress = 0)
{
    if (!(cartId in world.carts))
    {
        throw new Error(`Cannot move non-existant cart with id '${cartId}'.`);
    }

    let cart = world.carts[cartId];
    if (cart.currentLane)
    {
        let current = world.lanes[cart.currentLane];
        world.lanes[current].progress[cart.laneProgress] = null;
    }

    if (laneId in world.lanes)
    {
        let lane = world.lanes[laneId];
        if (lane.highWatermark <= progress)
        {
            throw new Error(`Cannot move cart to position ${progress} in a lane at position ${lane.highWatermark}!`);
        }
        lane.cartProgress[progress] = cartId;
        lane.highWatermark = progress;
        cart.cellX = lane.cellX;
        cart.cellY = lane.cellY;
        cart.currentLane = laneId;
        cart.laneProgress = progress;
    }
    else
    {
        // Lane does not exist.
        cart.cellX = -1;
        cart.cellY = -1;
        cart.currentLane = null;
        cart.laneProgress = 0;
    }
}

/**
 * @param {World} world 
 * @param {string} laneId
 */
function updateLaneTraffic(world, laneId)
{
    let lane = world.lanes[laneId];
    const { cartProgress, outlets, maxDistance } = lane;
    let isEndOpen = outlets.length > 0;
    let endDistance = maxDistance;
    for(let i = maxDistance - 1; i >= 0; --i)
    {
        let cartId = cartProgress[i];
        if (cartId)
        {
            /** @type {Cart} */
            let cart = world.carts[cartId];
            const { maxSpeed, targetLane } = cart;
            if (!targetLane || targetLane === laneId) continue;

            let distanceRemaining = (i + maxSpeed) - endDistance;
            if (distanceRemaining >= 0)
            {
                if (isEndOpen)
                {
                    if (!outlets.includes(targetLane))
                    {
                        throw new Error(`Target lane ${targetLane} does not exist as outlets for ${laneId}!`);
                    }
                    if (canAcceptIncomingTraffic(world, targetLane))
                    {
                        // Exiting to next segment.
                        cartProgress[i] = null;
                        cart.currentLane = null;
                        acceptIncomingTraffic(world, targetLane, cartId, distanceRemaining);
                    }
                    else
                    {
                        // Stopping early in this segment.
                        isEndOpen = false;
                        endDistance = endDistance - 1;
                        cartProgress[i] = null;
                        cartProgress[endDistance] = cartId;
                        cart.laneProgress = endDistance;
                    }
                }
                else
                {
                    // Stopping early in this segment.
                    isEndOpen = false;
                    endDistance = endDistance - 1;
                    cartProgress[i] = null;
                    cartProgress[endDistance] = cartId;
                    cart.laneProgress = endDistance;
                }
            }
            else
            {
                // Move forward in this segment.
                isEndOpen = false;
                endDistance = i + maxSpeed;
                cartProgress[i] = null;
                cartProgress[endDistance] = cartId;
                cart.laneProgress = endDistance;
            }
        }
        else
        {
            // There's nothing here...
        }
    }
    lane.highWatermark = endDistance;
}

function canAcceptIncomingTraffic(world, laneId)
{
    let lane = world.lanes[laneId];
    return lane && lane.highWatermark > 0;
}

function acceptIncomingTraffic(world, laneId, cartId, speedRemaining)
{
    let lane = world.lanes[laneId];
    const { highWatermark } = lane;
    if (highWatermark > speedRemaining)
    {
        if (lane.maxDistance <= speedRemaining)
        {
            throw new Error('Lane is too short! A cart is speeding out of it!');
        }
        // Go the distance! No blocking entities!
        putCartOnLane(world, cartId, laneId, speedRemaining);
    }
    else
    {
        // Go up to the watermark.
        let index = highWatermark - 1;
        putCartOnLane(world, cartId, laneId, index);
    }
}
