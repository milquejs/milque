import { uuid } from '@milque/util';
import { getJunctionByIndex, getJunctionCoordsFromIndex, getJunctionLaneByIndex, isNullJunction } from '../junction/Junction.js';

export const NULL_JUNCTION_INDEX = -1;
export const NULL_SLOT_INDEX = -1;

export const NO_JUNCTION_INTENT = 0;
export const PASSING_JUNCTION_INTENT = 1;
export const PARKING_JUNCTION_INTENT = 2;

export const MAX_CART_SPEED = 4;

/**
 * @typedef {import('../junction/Junction.js').JunctionMap} JunctionMap
 * @typedef {import('../junction/Junction.js').JunctionIndex} JunctionIndex
 */

export class TrafficSimulator
{
    /**
     * @param {JunctionMap} junctionMap 
     */
    constructor(junctionMap, planner)
    {
        this.junctionMap = junctionMap;
        this.planner = planner;
        /**
         * @private
         * @type {Record<string, TrafficAgent>}
         */
        this.agents = {};
        /**
         * @private
         * @type {Record<string, Array<JunctionIndex>>}
         */
        this.paths = {};
        /** @private */
        this.ticks = 0;
    }

    spawnAgent(homeIndex)
    {
        const map = this.junctionMap;
        if (!map.hasJunction(homeIndex))
        {
            throw new Error('Cannot spawn agent on non-existant junction as home.');
        }
        let id = uuid();
        let agent = new TrafficAgent(id, homeIndex);
        this.agents[id] = agent;
        forceOnJunction(map, agent, homeIndex);
        acquireParking(map, agent, homeIndex);
        return agent;
    }

    getAgent(agentId)
    {
        return this.agents[agentId];
    }

    getAgents()
    {
        return Object.values(this.agents);
    }

    tick()
    {
        const map = this.junctionMap;
        let currentTick = this.ticks++;
        let agents = Object.values(this.agents);
        for(let agent of agents)
        {
            if (agent.lastUpdatedTick < currentTick)
            {
                agent.lastUpdatedTick = currentTick;
                // Passing releases at the start of each tick.
                let passingIndex = agent.passing;
                if (!isNullJunction(map, passingIndex))
                {
                    releasePassing(map, agent, passingIndex);
                }
                // Reset agent speeds
                agent.speed = agent.maxSpeed;
            }
        }
        this.moveAgents(agents);
    }

    /** @private */
    moveAgents(agents)
    {
        const map = this.junctionMap;
        let lookingForTargets = [];
        for(let agent of agents)
        {
            let targetIndex = agent.target;
            if (!isNullJunction(map, targetIndex))
            {
                // Already at the end!
                if (agent.junction === targetIndex)
                {
                    agent.clearTarget();
                    lookingForTargets.push(agent);
                    continue;
                }
                // Move the agent forward.
                let speed = agent.speed;
                if (speed > 0)
                {
                    let remaining = moveAgentTowards(map, agent, targetIndex, agent.intent, speed);
                    agent.speed = remaining;
                    // Did it move?
                    if (speed < remaining)
                    {
                        throw new Error('Agent gained speed after moving? How is that possible?');
                    }
                }
                // Reached the end! What next?
                if (agent.junction === targetIndex)
                {
                    agent.clearTarget();
                    lookingForTargets.push(agent);
                }
            }
        }
        // Plan next target.
        this.planner(lookingForTargets);
        if (lookingForTargets.length > 0)
        {
            // Move them again.
            this.moveAgents(lookingForTargets);
        }
    }
}

export class TrafficAgent
{
    constructor(id, homeIndex)
    {
        this.id = id;
        this.home = homeIndex;
        this.junction = NULL_JUNCTION_INDEX;
        // If outlet is defined, slot must be too.
        this.outlet = NULL_JUNCTION_INDEX;
        // If slot is defined, outlet must be too.
        this.slot = NULL_SLOT_INDEX;

        this.speed = 0;
        this.maxSpeed = MAX_CART_SPEED;

        // If parked, outlet and slot must be null.
        this.parking = NULL_JUNCTION_INDEX;
        this.passing = NULL_JUNCTION_INDEX;

        this.target = NULL_JUNCTION_INDEX;
        this.nextTarget = NULL_JUNCTION_INDEX;
        this.intent = NO_JUNCTION_INTENT;

        this.lastUpdatedTick = -1;
    }

    setTarget(outletIndex, nextIndex, intent)
    {
        this.target = outletIndex;
        this.nextTarget = nextIndex;
        this.intent = intent;
    }

    clearTarget()
    {
        this.target = NULL_JUNCTION_INDEX;
        this.nextTarget = NULL_JUNCTION_INDEX;
        this.intent = NO_JUNCTION_INTENT;
    }
}

/**
 * @param {JunctionMap} map 
 * @param {Agent} agent 
 * @param {JunctionIndex} outletIndex 
 * @param {number} speed 
 * @returns {number} The remaining speed untravelled.
 */
export function moveAgentTowards(map, agent, outletIndex, intent, speed)
{
    let juncIndex = agent.junction;
    let junc = map.getJunction(juncIndex);
    if (!junc.hasOutlet(outletIndex))
    {
        throw new Error(`Missing outlet '${getJunctionCoordsFromIndex(map, outletIndex)}' at junction '${getJunctionCoordsFromIndex(map, juncIndex)}' to move cart towards.`);
    }
    let lane = junc.getLane(outletIndex);
    if (isNullJunction(map, agent.outlet))
    {
        // Not on the way yet. Try to merge into a lane.
        let furthest = getFurthestAvailableSlotInLane(map, lane, 0);
        if (furthest > 0)
        {
            // Move the cart (it takes 1 step to move out of parking).
            let nextSlot = Math.min(furthest, speed - 1);
            enterLane(map, agent, juncIndex, outletIndex, nextSlot);
            return speed - nextSlot;
        }
        else
        {
            // Blocked at destination but unable to get into it.
            // Cannot move in as it is blocked.
            return 0;
        }
    }
    else if (agent.outlet !== outletIndex)
    {
        throw new Error('Agent is changing lanes!');
    }
    else
    {
        // Already on the way. Try to move forward.
        let prevSlot = agent.slot;
        let nextSlot = prevSlot + speed;
        let furthest = getFurthestAvailableSlotInLane(map, lane, prevSlot + 1);
        // There's no blockers and total movement will exit the lane
        if (furthest >= lane.length && nextSlot >= lane.length && intent !== NO_JUNCTION_INTENT)
        {
            switch(intent)
            {
                case PASSING_JUNCTION_INTENT:
                    if (isNullJunction(map, agent.nextTarget))
                    {
                        throw new Error('Agent must have next target if passing junction.');
                    }
                    else if (isJunctionPassable(map, outletIndex) && canJunctionLaneAcceptMore(map, outletIndex, agent.nextTarget))
                    {
                        // Move onto next junction's lane.
                        acquirePassing(map, agent, outletIndex);
                        forceOnJunction(map, agent, outletIndex);
                        enterLane(map, agent, outletIndex, agent.nextTarget, 0);
                        // Slow down based on junction resistance.
                        let resistance = getJunctionResistance(map, outletIndex);
                        return Math.max(0, nextSlot - lane.length - resistance);
                    }
                    else
                    {
                        // Move forward to blocker. Any remaining movement is ignored.
                        nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
                        moveOnLane(map, agent, juncIndex, outletIndex, nextSlot);
                        return 0;
                    }
                case PARKING_JUNCTION_INTENT:
                    if (isJunctionParkable(map, outletIndex))
                    {
                        // Parking. Any remaining movement is ignored.
                        forceOnJunction(map, agent, outletIndex);
                        acquireParking(map, agent, outletIndex);
                        return 0;
                    }
                    else
                    {
                        // Waiting to park. Move to end of lane.
                        nextSlot = lane.length - 1;
                        moveOnLane(map, agent, juncIndex, outletIndex, nextSlot);
                        return 0;
                    }
            }
        }
        else
        {
            // There are blockers and will stay within lane. Move as far as possible.
            nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
            moveOnLane(map, agent, juncIndex, outletIndex, nextSlot);
            return 0;
        }
    }
}

export function getJunctionResistance(map, juncIndex)
{
    let junc = getJunctionByIndex(map, juncIndex);
    return Math.max(0, junc.getInlets().length - 2);
}

function canJunctionLaneAcceptMore(junctionMap, inletIndex, outletIndex)
{
    if (inletIndex < 0 || outletIndex < 0) throw new Error('Junction index must be non-negative.');
    let lane = getJunctionLaneByIndex(junctionMap, inletIndex, outletIndex);
    if (!lane) throw new Error(`Cannot find lane for given inlet '${getJunctionCoordsFromIndex(junctionMap, inletIndex)}' and outlet '${getJunctionCoordsFromIndex(junctionMap, outletIndex)}'.`);
    let slot = getFurthestAvailableSlotInLane(junctionMap, lane, 0);
    return slot >= 0;
}

function getFurthestAvailableSlotInLane(map, lane, initialSlot)
{
    if (initialSlot < 0) throw new Error('Slot must be non-negative.');
    for(let i = initialSlot; i < lane.length; ++i)
    {
        if (lane.slots[i])
        {
            return i - 1;
        }
    }
    return lane.length;
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 */
export function isJunctionPassable(map, juncIndex)
{
    if (!map.hasJunction(juncIndex)) return false;
    let junc = map.getJunction(juncIndex);
    return junc.passing === null;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 */
export function acquirePassing(map, agent, juncIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot pass on non-existant junction.');
    }
    if (!isJunctionPassable(map, juncIndex))
    {
        throw new Error('Cannot pass on blocked junction.');
    }
    let junc = map.getJunction(juncIndex);
    agent.passing = juncIndex;
    junc.passing = agent.id;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 */
export function releasePassing(map, agent, juncIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot release pass on non-existant junction.');
    }
    if (agent.passing !== juncIndex)
    {
        throw new Error('Cannot release pass for agent not passing at junction.');
    }
    let junc = map.getJunction(juncIndex);
    agent.passing = NULL_JUNCTION_INDEX;
    junc.passing = null;
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 */
export function isJunctionParkable(map, juncIndex)
{
    if (!map.hasJunction(juncIndex)) return false;
    let junc = map.getJunction(juncIndex);
    return junc.parking < junc.parkingCapacity;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 */
export function acquireParking(map, agent, juncIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot park on non-existant junction.');
    }
    if (!isJunctionParkable(map, juncIndex))
    {
        throw new Error('Junction is already full for parking.');
    }
    let junc = map.getJunction(juncIndex);
    agent.parking = juncIndex;
    junc.parking += 1;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 */
export function releaseParking(map, agent, juncIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot release park on non-existant junction.');
    }
    if (agent.parking !== juncIndex)
    {
        throw new Error('Cannot release parking for agent not parked at junction.');
    }
    let junc = map.getJunction(juncIndex);
    if (junc.parking <= 0)
    {
        throw new Error('Cannot release parking at junction with no agents.');
    }
    agent.parking = NULL_JUNCTION_INDEX;
    junc.parking -= 1;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 * @param {JunctionIndex} outletIndex 
 * @param {number} slotIndex 
 */
export function enterLane(map, agent, juncIndex, outletIndex, slotIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot park on non-existant junction.');
    }
    if (agent.junction !== juncIndex)
    {
        throw new Error('Cannot enter lane with agent not on same junction.');
    }
    if (!isNullJunction(map, agent.outlet))
    {
        throw new Error('Cannot enter lane when agent already on another.');
    }
    let junc = map.getJunction(juncIndex);
    let lane = junc.lanes[outletIndex];
    agent.outlet = outletIndex;
    agent.slot = slotIndex;
    lane.slots[slotIndex] = agent.id;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 * @param {JunctionIndex} outletIndex 
 * @param {number} slotIndex 
 */
export function moveOnLane(map, agent, juncIndex, outletIndex, slotIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot park on non-existant junction.');
    }
    if (agent.junction !== juncIndex)
    {
        throw new Error('Cannot move on lane with agent not on same junction.');
    }
    if (agent.outlet !== outletIndex)
    {
        throw new Error('Cannot move on lane with agent not on same outlet.');
    }
    let junc = map.getJunction(juncIndex);
    let lane = junc.lanes[outletIndex];
    let prevSlot = agent.slot;
    agent.slot = slotIndex;
    lane.slots[prevSlot] = undefined;
    lane.slots[slotIndex] = agent.id;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 * @param {JunctionIndex} outletIndex 
 */
export function exitLane(map, agent, juncIndex, outletIndex)
{
    let junc = map.getJunction(juncIndex);
    let lane = junc.lanes[outletIndex];
    lane.slots[agent.slot] = undefined;
    agent.outlet = NULL_JUNCTION_INDEX;
    agent.slot = NULL_SLOT_INDEX;
}

/**
 * @param {JunctionMap} map 
 * @param {TrafficAgent} agent 
 * @param {JunctionIndex} juncIndex 
 */
export function forceOnJunction(map, agent, juncIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot force on non-existant junction.');
    }
    let agentIndex = agent.junction;
    // Has previous location?
    if (!isNullJunction(map, agentIndex))
    {
        // Get out of lane
        let outletIndex = agent.outlet;
        if (!isNullJunction(map, outletIndex))
        {
            exitLane(map, agent, agentIndex, outletIndex);
        }
        // Get out of parking
        let parkingIndex = agent.parking;
        if (!isNullJunction(map, parkingIndex))
        {
            releaseParking(map, agent, parkingIndex);
        }
    }
    // TODO: This is in limbo on a junction. This should ALWAYS be followed by a forceOnLane(), park(), etc.
    agent.junction = juncIndex;
    agent.outlet = NULL_JUNCTION_INDEX;
    agent.slot = NULL_SLOT_INDEX;
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {JunctionMap} map 
 * @param {TrafficSimulator} traffic 
 */
export function drawAgents(ctx, map, traffic, cellSize)
{
    let agentRadius = cellSize / 8;
    for(let agent of traffic.getAgents())
    {
        let [x, y] = getJunctionCoordsFromIndex(map, agent.junction);
        ctx.fillStyle = 'red';
        ctx.fillRect(
            (x + 0.5) * cellSize - agentRadius,
            (y + 0.5) * cellSize - agentRadius,
            agentRadius * 2,
            agentRadius * 2);
        if (agent.target !== -1)
        {
            let [targetX, targetY] = getJunctionCoordsFromIndex(map, agent.target);
            ctx.fillStyle = 'green';
            ctx.fillRect(
                (targetX + 0.5) * cellSize - agentRadius,
                (targetY + 0.5) * cellSize - agentRadius,
                agentRadius * 2,
                agentRadius * 2);
        }
        if (agent.outlet !== -1)
        {
            let [outletX, outletY] = getJunctionCoordsFromIndex(map, agent.outlet);
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                (outletX + 0.5) * cellSize - agentRadius,
                (outletY + 0.5) * cellSize - agentRadius,
                agentRadius * 2,
                agentRadius * 2);
        }
    }
}