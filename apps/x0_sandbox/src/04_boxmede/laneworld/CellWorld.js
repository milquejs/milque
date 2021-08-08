import { uuid } from '@milque/util';
import { connectJunction, createCart, getJunctionByIndex, getJunctionIndexFromCoords, isJunctionOutletForJunction, putJunction } from './Junction.js';

export const CELL_SIZE = 128;

export class CellWorld
{
    constructor(laneWorld, width, height)
    {
        this.laneWorld = laneWorld;
        this.width = width;
        this.height = height;
        this.housing = {};
    }    
}

export function getJunctionCoordsFromCell(cellWorld, cellX, cellY)
{
    return [
        cellX * 2 + 1,
        cellY * 2 + 1,
    ];
}

export function putHousing(cellWorld, cellX, cellY)
{
    let world = cellWorld.laneWorld;
    let id = uuid();
    let [juncX, juncY] = getJunctionCoordsFromCell(cellWorld, cellX, cellY);
    putJunction(world, juncX, juncY, 2);
    createCart(world, juncX, juncY);
    let housing = {
        cellX,
        cellY,
    };
    cellWorld.housing[id] = housing;
    return housing;
}

export function putFactory(cellWorld, cellX, cellY)
{
    
}

export function putTwoWayRoad(cellWorld, fromCellX, fromCellY, toCellX, toCellY)
{
    let world = cellWorld.laneWorld;
    let [ fromJuncX, fromJuncY ] = getJunctionCoordsFromCell(cellWorld, fromCellX, fromCellY);
    let [ toJuncX, toJuncY ] = getJunctionCoordsFromCell(cellWorld, toCellX, toCellY);
    let fromJuncIndex = getJunctionIndexFromCoords(world, fromJuncX, fromJuncY);
    let fromJunc = getJunctionByIndex(world, fromJuncIndex);
    let toJuncIndex = getJunctionIndexFromCoords(world, toJuncX, toJuncY);
    let toJunc = getJunctionByIndex(world, toJuncIndex);
    if (!fromJunc)
    {
        putJunction(world, fromJuncX, fromJuncY, 0);
    }
    if (!toJunc)
    {
        putJunction(world, toJuncX, toJuncY, 0);
    }
    if (!isJunctionOutletForJunction(world, toJuncIndex, fromJuncIndex))
    {
        connectJunction(world, fromJuncIndex, toJuncIndex, 4);
    }
    if (!isJunctionOutletForJunction(world, fromJuncIndex, toJuncIndex))
    {
        connectJunction(world, toJuncIndex, fromJuncIndex, 4);
    }
}

export function putOneWayRoad(cellWorld, fromCellX, fromCellY, toCellX, toCellY)
{
    let world = cellWorld.laneWorld;
    let [ fromJuncX, fromJuncY ] = getJunctionCoordsFromCell(cellWorld, fromCellX, fromCellY);
    let [ toJuncX, toJuncY ] = getJunctionCoordsFromCell(cellWorld, toCellX, toCellY);
    let fromJuncIndex = getJunctionIndexFromCoords(world, fromJuncX, fromJuncY);
    let fromJunc = getJunctionByIndex(world, fromJuncIndex);
    let toJuncIndex = getJunctionIndexFromCoords(world, toJuncX, toJuncY);
    let toJunc = getJunctionByIndex(world, toJuncIndex);
    if (!fromJunc)
    {
        putJunction(world, fromJuncX, fromJuncY, 0);
    }
    if (!toJunc)
    {
        putJunction(world, toJuncX, toJuncY, 0);
    }
    if (!isJunctionOutletForJunction(world, toJuncIndex, fromJuncIndex))
    {
        connectJunction(world, fromJuncIndex, toJuncIndex, 4);
    }
}

export function drawHousings(ctx, cellWorld)
{
    for(let housing of Object.values(cellWorld.housing))
    {
        let { cellX, cellY } = housing;
        let size = CELL_SIZE * 0.8;
        let margin = (CELL_SIZE * 0.2) / 2;
        let x = cellX * CELL_SIZE + margin;
        let y = cellY * CELL_SIZE + margin;
        ctx.fillStyle = 'lime';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = 'green';
        ctx.fillRect(x, y + (size / 2), size, size / 2);
    }
}