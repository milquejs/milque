import { uuid } from '@milque/util';
import { connectJunctions, getJunctionIndexFromCoords, getJunctionIndexFromJunction, isJunctionWithinBounds, putJunction } from '../laneworld/Junction.js';
import { getDirectionalVectorFromEncoding } from '../util/Directional.js';
import { getCargoMainColor, getCargoShadowColor, randomCargo } from './Cargo.js';

/** @typedef {import('./AcreWorld.js').AcreWorld} AcreWorld */

/**
 * @param {AcreWorld} world 
 * @param {juncX} juncX 
 * @param {juncY} juncY 
 */
export function placeHousing(world, juncX, juncY, outletDirection)
{
    const map = world.junctionMap;
    let [dx, dy] = getDirectionalVectorFromEncoding(outletDirection);
    let outletX = juncX + dx;
    let outletY = juncY + dy;
    if (!isJunctionWithinBounds(map, outletX, outletY))
    {
        throw new Error('Cannot place outlet outside of boundary.');
    }
    let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
    let offsetIndex = getJunctionIndexFromCoords(map, outletX, outletY);
    putJunction(map, juncX, juncY, 2);
    world.solids.markSolidJunction(juncIndex);
    if (!map.hasJunction(offsetIndex))
    {
        putJunction(world.junctionMap, outletX, outletY, 0);
    }
    world.directable.markDirectableJunction(juncIndex, offsetIndex);
    world.persistence.markPersistentJunction(juncIndex, offsetIndex);
    connectJunctions(map, juncIndex, offsetIndex);
    connectJunctions(map, offsetIndex, juncIndex);

    let id = uuid();
    let cargo = randomCargo();
    let cartA = world.cartManager.createCart(juncX, juncY, Math.atan2(dy, dx), cargo);
    let cartB = world.cartManager.createCart(juncX, juncY, Math.atan2(dy, dx), cargo);
    world.housing[id] = {
        coordX: juncX,
        coordY: juncY,
        junction: juncIndex,
        cargo,
        carts: [
            cartA.id,
            cartB.id,
        ]
    };
}

/**
 * @param {AcreWorld} world 
 * @param {juncX} juncX 
 * @param {juncY} juncY 
 */
export function placeFactory(world, juncX, juncY)
{
    const map = world.junctionMap;
    if (!isJunctionWithinBounds(map, juncX, juncY)
        || !isJunctionWithinBounds(map, juncX + 3, juncY + 3))
    {
        throw new Error('Cannot place factory out of bounds.');
    }

    for(let i = 0; i < 2; ++i)
    {
        for(let j = 0; j < 3; ++j)
        {
            let juncIndex = (juncX + i + 1) + (juncY + j) * map.width;
            world.solids.markSolidJunction(juncIndex);
        }
    }
    let juncA = putJunction(map, juncX, juncY + 2, 0);
    let indexA = getJunctionIndexFromJunction(map, juncA);
    let juncB = putJunction(map, juncX + 1, juncY + 2, 4);
    let indexB = getJunctionIndexFromJunction(map, juncB);
    world.persistence.markPersistentJunction(indexA, indexB);
    connectJunctions(map, indexA, indexB);
    connectJunctions(map, indexB, indexA);
    let id = uuid();
    let cargo = randomCargo();
    world.factory[id] = {
        coordX: juncX,
        coordY: juncY,
        cargo,
        entries: [
            indexA,
        ],
        parking: [
            indexB,
        ]
    };
}
 
export function drawHousings(ctx, world, cellSize)
{
    for(let housing of Object.values(world.housing))
    {
        drawHousing(
            ctx, housing.coordX, housing.coordY,
            getCargoMainColor(housing.cargo),
            getCargoShadowColor(housing.cargo),
            cellSize);
    }
}

function drawHousing(ctx, cellX, cellY, mainColor, shadowColor, cellSize)
{
    let size = cellSize * 0.8;
    let margin = (cellSize * 0.2) / 2;
    let x = cellX * cellSize + margin;
    let y = cellY * cellSize + margin;
    ctx.fillStyle = mainColor;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = shadowColor;
    ctx.fillRect(x, y + (size / 2), size, size / 2);
}

export function drawFactories(ctx, world, cellSize)
{
    for(let factory of Object.values(world.factory))
    {
        let mainColor = getCargoMainColor(factory.cargo);
        let shadowColor = getCargoShadowColor(factory.cargo);
        drawFactory(ctx, factory.coordX, factory.coordY, mainColor, shadowColor, cellSize);
    }
}

function drawFactory(ctx, cellX, cellY, mainColor, shadowColor, cellSize)
{
    let margin = cellSize * 0.1;
    let x = cellX * cellSize + margin;
    let y = cellY * cellSize + margin;
    ctx.fillStyle = '#666666';
    ctx.fillRect(x + cellSize, y, cellSize * 2 - margin * 2, cellSize * 3 - margin * 2);
    let padding = cellSize * 0.1;
    ctx.fillStyle = mainColor;
    let xx = x + cellSize + padding;
    let yy = y + padding;
    let ww = cellSize * 2 - margin * 2 - padding * 2;
    let hh = cellSize * 2 - margin * 2 - padding * 2;
    ctx.fillRect(xx, yy, ww, hh);
    ctx.fillStyle = shadowColor;
    ctx.fillRect(xx, yy + hh / 2, ww, hh / 2);
}
