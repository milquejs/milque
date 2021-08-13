import { lerp, lookAt2, uuid } from '@milque/util';
import { connectJunctions, drawJunctions, drawOutlets, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, getJunctionIndexFromJunction, JunctionMap, putJunction } from '../laneworld/Junction.js';
import { drawGrid } from '../render2d.js';
import { drawCart } from './Cart.js';

/**
 * @typedef {import('../laneworld/Junction.js').JunctionIndex} JunctionIndex
 */

const CELL_SIZE = 64;

export class CartWorld
{
    constructor()
    {
        this.carts = {};
        this.junctionMap = new JunctionMap(8, 6);
    }

    createCart(homeIndex)
    {
        let id = uuid();
        let [x, y] = getJunctionCoordsFromIndex(this.junctionMap, homeIndex);
        let cart = new Cart(x, y, 0, homeIndex);
        this.carts[id] = cart;
        return cart;
    }
}

export class Cart
{
    constructor(coordX, coordY, radians, homeIndex)
    {
        this.coordX = coordX;
        this.coordY = coordY;

        this.currentJunction = homeIndex;
        this.parking = true;

        this.nextJunction = -1;
        this.currentProgress = 0;

        this.homeIndex = homeIndex;
        
        this.x = 0;
        this.y = 0;
        this.radians = radians;

        this.nextX = 0;
        this.nextY = 0;
    }
}

export function createWorld()
{
    let world = new CartWorld();
    let map = world.junctionMap;
    world.createCart(getJunctionIndexFromCoords(map, 1, 1));
    putJunction(map, 1, 1, 0);
    putJunction(map, 4, 1, 0);
    connectJunctions(world.junctionMap,
        getJunctionIndexFromCoords(map, 1, 1),
        getJunctionIndexFromCoords(map, 4, 1));
    return world;
}

export function updateWorld(game, world)
{
    for(let cart of Object.values(world.carts))
    {
        if (cart.nextJunction !== -1)
        {
            // Move towrds destination.
            moveCart(world.junctionMap, cart, 0.01);
        }
        else
        {
            // Pick new destination.
            if (cart.currentJunction !== cart.homeIndex)
            {
                cart.nextJunction = cart.homeIndex;
            }
            else
            {
                cart.nextJunction = cart.homeIndex + 3;
            }
        }
    }
}

export function drawWorld(game, ctx, world)
{
    ctx.lineWidth = 1;
    let map = world.junctionMap;
    drawGrid(ctx, map.width, map.height, CELL_SIZE);
    drawOutlets(ctx, map, CELL_SIZE);
    drawJunctions(ctx, map, CELL_SIZE);
    drawCarts(ctx, world, CELL_SIZE);
}

export function drawCarts(ctx, world, cellSize)
{
    let dt = 0.5;
    for(let cart of Object.values(world.carts))
    {
        let prevX = cart.x;
        let prevY = cart.y;
        let nextX = cart.nextX;
        let nextY = cart.nextY;
        let currX = lerp(prevX, nextX, dt);
        let currY = lerp(prevY, nextY, dt);
        let dx = currX - prevX;
        let dy = currY - prevY;
        let nextRadians = Math.atan2(dy, dx);
        let prevRadians = cart.radians;
        let currRadians = lookAt2(prevRadians, nextRadians, dt);
        cart.x = currX;
        cart.y = currY;
        cart.radians = currRadians;
        drawCart(ctx, currX * cellSize, currY * cellSize, currRadians, cellSize);
    }
}

function moveCart(map, cart, dt)
{
    let progress = cart.currentProgress + dt;
    for(; progress >= 1; --progress)
    {
        moveToNextJunction(map, cart);
    }
    cart.currentProgress = progress;
    let junc = cart.currentJunction;
    let next = cart.nextJunction;
    if (next === -1)
    {
        // We've reached the end. Good-bye!
        return;
    }
    else
    {
        let [x, y] = getLanePosition(map, junc, next, 0, cart.currentProgress);
        cart.nextX = x;
        cart.nextY = y;
    }
}

function moveToNextJunction(map, cart)
{
    cart.currentJunction = cart.nextJunction;
    cart.nextJunction = -1;
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
    let lx = Math.cos(dr + HALF_PI) * (0.1 + 0.2 * laneIndex);
    let ly = Math.sin(dr + HALF_PI) * (0.1 + 0.2 * laneIndex);
    return [
        (inx + 0.5) + lx + dx * progress,
        (iny + 0.5) + ly + dy * progress,
    ];
}
