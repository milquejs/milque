/** @typedef {import('./TrafficSimulator.js').TrafficSimulator} TrafficSimulator */

import { cycle, lerp, lookAt2 } from '@milque/util';
import { getCargoMainColor, getCargoShadowColor } from '../acreworld/Cargo.js';
import { getJunctionCoordsFromIndex, getJunctionIndexFromCoords, LANE_LENGTH } from '../junction/Junction.js';

export const NULL_JUNCTION_INDEX = -1;
export const NULL_SLOT_INDEX = -1;

export const FRAMES_PER_TICK = 30;
export const FRAMES_PER_HALF_TICK = FRAMES_PER_TICK / 2;
export const OFFSET_FRAMES = 5;

export class CartManager
{
    /**
     * @param {TrafficSimulator} trafficSimulator 
     */
    constructor(junctionMap, trafficSimulator)
    {
        this.junctionMap = junctionMap;
        this.trafficSimulator = trafficSimulator;
        /** @type {Record<string, Cart>} */
        this.carts = {};
    }

    createCart(coordX, coordY, radians, cargo)
    {
        const map = this.junctionMap;
        const traffic = this.trafficSimulator;
        let homeIndex = getJunctionIndexFromCoords(map, coordX, coordY);
        let agent = traffic.spawnAgent(homeIndex);
        let cartId = agent.id;
        let cart = new Cart(cartId, coordX + 0.5, coordY + 0.5, radians, cargo);
        this.carts[cartId] = cart;
        return cart;
    }

    getCartById(cartId)
    {
        return this.carts[cartId];
    }

    getCartByAgentId(agentId)
    {
        return this.carts[agentId];
    }
}

export class Cart
{
    constructor(id, coordX, coordY, radians, cargo)
    {
        this.id = id;

        this.prevX = coordX;
        this.prevY = coordY;
        this.prevJunction = NULL_JUNCTION_INDEX;
        this.prevOutlet = NULL_JUNCTION_INDEX;
        this.prevSlot = NULL_SLOT_INDEX;

        this.x = coordX;
        this.y = coordY;
        this.radians = radians;

        this.cargo = cargo;
    }

    getAgentId()
    {
        return this.id;
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {CartManager} cartManager
 * @param {number} cellSize
 */
export function drawCarts(ctx, cartManager, framesToTick, framesPerTick, cellSize)
{
    const traffic = cartManager.trafficSimulator;
    const map = cartManager.junctionMap;

    const dt = framesToTick / framesPerTick;
    const LANE_SLOT_COUNT = LANE_LENGTH;
    for(let cart of Object.values(cartManager.carts))
    {
        let agent = traffic.getAgent(cart.getAgentId());
        let currentJunction = agent.junction;
        let currentOutlet = agent.outlet;
        let currentSlot = agent.slot;
        let currX = cart.x;
        let currY = cart.y;
        let currRadians = cart.radians;
        if (currentJunction !== -1 && currentOutlet !== -1)
        {
            if (framesToTick <= 0)
            {
                // Capture current state.
                cart.prevX = cart.x;
                cart.prevY = cart.y;
            }
            else if (framesToTick >= framesPerTick)
            {
                // Capture for next tick (this is the last frame)
                cart.prevJunction = currentJunction;
                cart.prevOutlet = currentOutlet;
                cart.prevSlot = currentSlot;
            }

            let nextX, nextY;
            // TODO: Although this is more accurate, it is less "smooth". The wrong way looks nicer.
            let remainingPrevSlots = cart.prevSlot !== NULL_SLOT_INDEX
                ? LANE_SLOT_COUNT - cart.prevSlot
                : 0;
            let remainingCurrentSlots = cart.currentSlot;
            let totalRemainingSlots = remainingCurrentSlots + remainingPrevSlots;
            if (dt < remainingPrevSlots / totalRemainingSlots)
            {
                // Travelling the remainder of the previous junction
                [nextX, nextY] = getLanePosition(map, cart.prevJunction, cart.prevOutlet, 0, 1);
            }
            else
            {
                // Travelling the remainder of the current junction
                [nextX, nextY] = getLanePosition(map, currentJunction, currentOutlet, 0, currentSlot / LANE_SLOT_COUNT);
            }
            let prevX = cart.prevX;
            let prevY = cart.prevY;
            let currX = lerp(prevX, nextX, dt);
            let currY = lerp(prevY, nextY, dt);
            let dx = nextX - prevX;
            let dy = nextY - prevY;
            let currRadians;
            if (Math.abs(dx) <= Number.EPSILON && Math.abs(dy) <= Number.EPSILON)
            {
                currRadians = cart.radians;
            }
            else
            {
                let nextRadians = Math.atan2(dy, dx);
                let prevRadians = cart.radians;
                let diffRadians = cycle(nextRadians - prevRadians, -Math.PI, Math.PI);
                currRadians = lookAt2(prevRadians, nextRadians, diffRadians / (Math.PI * 2));
            }
            cart.x = currX;
            cart.y = currY;
            cart.radians = currRadians;
        }
        let mainColor = getCargoMainColor(cart.cargo);
        let shadowColor = getCargoShadowColor(cart.cargo);
        drawCart(ctx, currX * cellSize, currY * cellSize, currRadians, mainColor, shadowColor, cellSize);
    }
}

export function drawCart(ctx, x, y, rotation, mainColor, shadowColor, cellSize)
{
    let width = cellSize * 0.2;
    let height = cellSize * 0.3;
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let padding = 2;
    let hoodSize = height * 0.4;
    let topSize = height * 0.2;
    ctx.translate(x, y);
    ctx.rotate(rotation + Math.PI / 2);
    {
        ctx.fillStyle = shadowColor;
        ctx.fillRect(-halfWidth, -halfHeight, width, height);
        ctx.fillStyle = mainColor;
        ctx.fillRect(-halfWidth + padding, -halfHeight + hoodSize, width - padding * 2, hoodSize + topSize);
        ctx.fillStyle = 'gold';
        ctx.fillRect(-halfWidth + padding, -halfHeight, padding, padding);
        ctx.fillRect(halfWidth - padding * 2, -halfHeight, padding, padding);
    }
    ctx.rotate(-rotation - Math.PI / 2);
    ctx.translate(-x, -y);
}

const HALF_PI = Math.PI * 0.5;

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletIndex 
 * @param {JunctionIndex} outletIndex 
 * @param {number} progress 
 */
function getLanePosition(map, inletIndex, outletIndex, laneIndex, progress)
{
    let [inx, iny] = getJunctionCoordsFromIndex(map, inletIndex);
    let [outx, outy] = getJunctionCoordsFromIndex(map, outletIndex);
    let dx = outx - inx;
    let dy = outy - iny;
    let dr = Math.atan2(dy, dx);
    let lx = Math.cos(dr + HALF_PI) * (0.15 + 0.2 * laneIndex);
    let ly = Math.sin(dr + HALF_PI) * (0.15 + 0.2 * laneIndex);
    return [
        (inx + 0.5) + lx + dx * progress,
        (iny + 0.5) + ly + dy * progress,
    ];
}
 