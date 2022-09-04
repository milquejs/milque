import { screenToWorldRay } from '@milque/scene';
import { toDegrees } from '@milque/util';
import { addListener } from '../core/Listenable.js';
import { INPUTS } from '../inputs.js';
import { createJunctionMap, getLanePoint, JUNC_RADIUS, JUNC_SIZE, placeRoad, unplaceRoad } from './Junctions.js';

/**
 * @typedef {import('../renderer/drawcontext/DrawContextFixedGLGradient.js').DrawContextFixedGLGradient} DrawContext
 * @typedef {import('./Junctions.js').JuncMap} JuncMap
 * @typedef {import('./Junctions.js').Lane} Lane
 */

export function LaneSystem(m) {
    addListener(m, 'init', () => {
        CursorInit(m);
        LaneInit(m);
    });
    addListener(m, 'render', (ctx) => {
        LaneRenderer(m, ctx);
        CursorRenderer(m, ctx);
    });
}

function LaneInit(m) {
    let map = createJunctionMap();
    m.map = map;

    /*
    let id = 1;
    let fromX = 10;
    let fromY = 10;
    for(let x = -1; x <= 1; ++x) {
        for(let y = -1; y <= 1; ++y) {
            createJunction(map, id++, fromX + x, fromY + y);
        }
    }
    createLane(map, 1, LANE_TYPES.FORWARD, 5, 1);
    createLane(map, 2, LANE_TYPES.FORWARD, 5, 2);
    createLane(map, 3, LANE_TYPES.FORWARD, 5, 3);
    createLane(map, 4, LANE_TYPES.FORWARD, 5, 4);
    createLane(map, 5, LANE_TYPES.FORWARD, 5, 6);
    createLane(map, 6, LANE_TYPES.FORWARD, 5, 7);
    createLane(map, 7, LANE_TYPES.FORWARD, 5, 8);
    createLane(map, 8, LANE_TYPES.FORWARD, 5, 9);
    */
}

/**
 * @param {DrawContext} ctx
 */
function LaneRenderer(m, ctx) {
    ctx.setColor(0x444444);
    drawGrid(ctx, 600, 600);
    
    ctx.setColor(0xFFFFFF);
    drawJunctionMap(ctx, m.map);
}

const ACTION_NONE = 0;
const ACTION_PLACE = 1;
const ACTION_DELETE = 2;

function CursorInit(m) {
    m.cursor = {
        prevCoordX: 0,
        prevCoordY: 0,
        nextCoordX: 0,
        nextCoordY: 0,
        action: ACTION_NONE,
    };

    addListener(m, 'update', (dt) => {
        switch(m.cursor.action) {
            case ACTION_NONE:
                if (INPUTS.CursorMain.pressed) {
                    m.cursor.action = ACTION_PLACE;
                    m.cursor.prevCoordX = m.cursor.nextCoordX;
                    m.cursor.prevCoordY = m.cursor.nextCoordY;
                } else if (INPUTS.CursorAlt.pressed) {
                    m.cursor.action = ACTION_DELETE;
                    m.cursor.prevCoordX = m.cursor.nextCoordX;
                    m.cursor.prevCoordY = m.cursor.nextCoordY;
                }
                break;
            case ACTION_PLACE:
                if (INPUTS.CursorMain.released) {
                    m.cursor.action = ACTION_NONE;
                } else {
                    const {
                        prevCoordX, prevCoordY,
                        nextCoordX, nextCoordY,
                    } = m.cursor;
                    let dx = nextCoordX - prevCoordX;
                    let dy = nextCoordY - prevCoordY;
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                        // Place!
                        m.cursor.prevCoordX = m.cursor.nextCoordX;
                        m.cursor.prevCoordY = m.cursor.nextCoordY;
                        placeRoad(m.map, prevCoordX, prevCoordY, nextCoordX, nextCoordY);
                    }
                }
                break;
            case ACTION_DELETE:
                if (INPUTS.CursorAlt.released) {
                    m.cursor.action = ACTION_NONE;
                } else {
                    const {
                        prevCoordX, prevCoordY,
                        nextCoordX, nextCoordY,
                    } = m.cursor;
                    let dx = nextCoordX - prevCoordX;
                    let dy = nextCoordY - prevCoordY;
                    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                        // Place!
                        m.cursor.prevCoordX = m.cursor.nextCoordX;
                        m.cursor.prevCoordY = m.cursor.nextCoordY;
                        unplaceRoad(m.map, prevCoordX, prevCoordY);
                    }
                }
                break;
        }
    });
}

function CursorRenderer(m, ctx) {
    let x = (INPUTS.CursorX.value * 2) - 1;
    let y = 1 - (INPUTS.CursorY.value * 2);
    let [vx, vy] = screenToWorldRay([0, 0, 0], x, y, ctx.getProjectionMatrix(), ctx.getViewMatrix());
    m.cursor.nextCoordX = vx / JUNC_SIZE;
    m.cursor.nextCoordY = vy / JUNC_SIZE;
    drawCursor(ctx, m.cursor.nextCoordX * JUNC_SIZE, m.cursor.nextCoordY * JUNC_SIZE);
    drawCursor(ctx, m.cursor.prevCoordX * JUNC_SIZE, m.cursor.prevCoordY * JUNC_SIZE);
}

/**
 * @param {DrawContext} ctx
 */
function drawCursor(ctx, x, y) {
    x = Math.floor(x / JUNC_SIZE) * JUNC_SIZE;
    y = Math.floor(y / JUNC_SIZE) * JUNC_SIZE;
    ctx.setColor(0xFFFFFF);
    ctx.drawLineRect(
        x - 1, y - 1,
        x + JUNC_SIZE + 1,
        y + JUNC_SIZE + 1);
    ctx.setColor(0x000000);
    ctx.drawLineRect(
        x, y,
        x + JUNC_SIZE,
        y + JUNC_SIZE);
}

/**
 * @param {DrawContext} ctx 
 * @param {JuncMap} map 
 */
function drawJunctionMap(ctx, map) {
    for(let junc of Object.values(map.juncs)) {
        let x = junc.coordX;
        let y = junc.coordY;
        drawJunction(ctx, x * JUNC_SIZE, y * JUNC_SIZE);
    }

    for(let lane of Object.values(map.lanes)) {
        drawLane(ctx, map, lane);
    }

    for(let lane of Object.values(map.lanes)) {
        //drawLaneLayout(ctx, map, lane);
    }
}

/**
 * @param {DrawContext} ctx
 * @param {JuncMap} map
 * @param {Lane} lane
 */
function drawLane(ctx, map, lane) {
    let fromJunc = map.juncs[lane.from];
    let toJunc = map.juncs[lane.to];
    let fromX = fromJunc.coordX * JUNC_SIZE;
    let fromY = fromJunc.coordY * JUNC_SIZE;
    let toX = toJunc.coordX * JUNC_SIZE;
    let toY = toJunc.coordY * JUNC_SIZE;
    let dx = toX - fromX;
    let dy = toY - fromY;
    let dd = Math.sqrt(dy * dy + dx * dx) / 2;
    let dr = Math.atan2(dy, dx);
    ctx.pushTransform();
    let prevX = fromX + JUNC_RADIUS;
    let prevY = fromY + JUNC_RADIUS;
    ctx.setTranslation(prevX, prevY, 0);
    ctx.setRotation(0, 0, toDegrees(dr));
    ctx.setColor(0xFFFFFF);
    ctx.drawBox(dd, 0, dd, JUNC_RADIUS);
    ctx.popTransform();
}

/**
 * @param {DrawContext} ctx
 * @param {JuncMap} map
 * @param {Lane} lane
 */
function drawLaneLayout(ctx, map, lane) {
    let fromJunc = map.juncs[lane.from];
    let toJunc = map.juncs[lane.to];
    let fromX = fromJunc.coordX * JUNC_SIZE;
    let fromY = fromJunc.coordY * JUNC_SIZE;
    let toX = toJunc.coordX * JUNC_SIZE;
    let toY = toJunc.coordY * JUNC_SIZE;
    let prevX = fromX + JUNC_RADIUS;
    let prevY = fromY + JUNC_RADIUS;
    let nextX = toX + JUNC_RADIUS;
    let nextY = toY + JUNC_RADIUS;
    ctx.setColor(0xFF0000);
    drawArrow(ctx, prevX, prevY, nextX, nextY);

    ctx.setColor(0xFFAA00);
    /** @type {[0, 0]} */
    let v = [0, 0];
    for(let i = 0; i <= 1; i += 0.2) {
        let [x, y] = getLanePoint(v, map, lane, i);
        ctx.drawCircle(x, y, 4);
    }
}

function drawGrid(ctx, w, h) {
    for(let x = 0; x < w / JUNC_SIZE; ++x) {
        ctx.drawLine(x * JUNC_SIZE, 0, x * JUNC_SIZE, h);
    }
    for(let y = 0; y < h / JUNC_SIZE; ++y) {
        ctx.drawLine(0, y * JUNC_SIZE, w, y * JUNC_SIZE);
    }
}

function drawArrow(ctx, fromX, fromY, toX, toY) {
    let dfromX = toX - fromX;
    let dfromY = toY - fromY;
    let dist = Math.max(Math.sqrt(dfromX * dfromX + dfromY * dfromY) * 1/3, 8);
    let dradians = Math.atan2(dfromY, dfromX) - Math.PI * 7/8;
    let darrowX = Math.cos(dradians) * dist;
    let darrowY = Math.sin(dradians) * dist;
    ctx.drawLine(fromX, fromY, toX, toY);
    ctx.drawLine(toX, toY, toX + darrowX, toY + darrowY);
}

/**
 * @param {DrawContext} ctx
 */
function drawJunction(ctx, x, y) {
    ctx.drawCircle(x + JUNC_RADIUS, y + JUNC_RADIUS, JUNC_RADIUS);
}
