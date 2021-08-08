/**
 * @typedef {import('../game/Game.js').Game} Game
 */

import { lookAt2, uuid } from '@milque/util';
import * as Render2D from '../render2d.js';

/**
 * @param {Game} game
 */
export async function main(game)
{
    const display = game.display;
    const input = game.inputs;
    input.bindAxis('cursorX', 'Mouse', 'PosX');
    input.bindAxis('cursorY', 'Mouse', 'PosY');
    input.bindButton('activate', 'Mouse', 'Button0');
    input.bindButton('deactivate', 'Mouse', 'Button2');
    const ctx = display.getContext('2d');

    let world = createWorld();
    game.on('frame', () => {
        updateWorld(game, world);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        drawWorld(game, ctx, world);
    });
}

class MuleWorld
{
    constructor()
    {
        this.juncs = {};
        this.lanes = {};
        this.carts = {};
    }
}

function createWorld()
{
    let world = new MuleWorld();
    let ja = createJunction(world, 64, 64);
    let jb = createJunction(world, 128, 128);
    let jc = createJunction(world, 64, 196);

    let lab = createLane(world, ja, jb, 4);
    let lbc = createLane(world, jb, jc, 4);

    createCart(world, ja);

    return world;
}

function updateWorld(game, world)
{
}

function drawWorld(game, ctx, world)
{
    const width = 8;
    const height = 6;
    const cellSize = 32;
    ctx.lineWidth = 3;
    Render2D.drawGrid(ctx, width, height, cellSize * 2);
    ctx.lineWidth = 1;
    Render2D.drawGrid(ctx, width * 2, height * 2, cellSize);

    Junction.draw(ctx, world);
    Lane.draw(ctx, world);
    Cart.draw(ctx, world);
}

function createJunction(world, x, y)
{
    let id = uuid();
    let junc = new Junction(id, new LanePoint(x, y));
    world.juncs[id] = junc;
    return junc;
}

function createLane(world, fromJunction, toJunction, slotCount = 1)
{
    let id = uuid();
    let from = fromJunction.center;
    let to = toJunction.center;
    let lane = new Lane(id, from, to, slotCount);
    world.lanes[id] = lane;
    return lane;
}

function getJunctionById(world, juncId)
{
    return world.juncs[juncId];
}

function createCart(world, homeJunction)
{
    let id = uuid();
    let home = homeJunction.center;
    let cart = new Cart(id, home.x, home.y);
    world.carts[id] = cart;
    return cart;
}

// ---------------------------------------------------------------

class LanePoint
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class LaneSlot
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Lane
{
    constructor(id, fromPoint, toPoint, slotCount)
    {
        this.id = id;
        this.from = fromPoint;
        this.to = toPoint;

        let slots = [];
        let dx = toPoint.x - fromPoint.x;
        let dy = toPoint.y - fromPoint.y;
        let progress = 0;
        for(let i = 0; i < slotCount; ++i)
        {
            progress = (i + 0.5) / slotCount;
            let x = fromPoint.x + progress * dx;
            let y = fromPoint.y + progress * dy;
            slots[i] = new LaneSlot(x, y);
        }
        this.slots = slots;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {MuleWorld} world 
     */
    static draw(ctx, world)
    {
        let radius = 4;
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = radius;
        ctx.lineCap = 'round';
        for(let lane of Object.values(world.lanes))
        {
            let { x: fromX, y: fromY } = lane.from;
            let { x: toX, y: toY } = lane.to;
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            for(let slot of lane.slots)
            {
                ctx.lineTo(slot.x, slot.y);
                ctx.arc(slot.x, slot.y, radius, 0, Math.PI * 2);
                ctx.moveTo(slot.x, slot.y);
            }
            ctx.lineTo(toX, toY);
            ctx.stroke();
        }
    }
}

class Junction
{
    constructor(id, centerPoint)
    {
        this.id = id;
        this.center = centerPoint;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {MuleWorld} world 
     */
    static draw(ctx, world)
    {
        let hw = 8;
        let hh = 8;
        ctx.strokeStyle = 'aqua';
        for(let junc of Object.values(world.juncs))
        {
            let { x, y } = junc.center;
            ctx.lineWidth = 6;
            ctx.strokeRect(x - hw, y - hh, hw * 2, hh * 2);
        }
    }
}

class Cart
{
    constructor(id, x, y)
    {
        this.id = id;
        this.x = x;
        this.y = y;

        this.next = null;

        this.rotation = 0;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {MuleWorld} world 
     */
    static draw(ctx, world)
    {
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 8;
        for(let cart of Object.values(world.carts))
        {
            if (cart.next)
            {
                cart.rotation = lookAt2(cart.rotation, cart.rotation, 0.3);
            }
            ctx.beginPath();
            ctx.arc(cart.x, cart.y, 8, Math.PI + cart.rotation, Math.PI * 2 + cart.rotation);
            ctx.stroke();
        }
    }
}
