import { bresenhamLine } from '@milque/util';

/**
 * @typedef JuncMap
 * @property {Record<JuncId, Junc>} juncs
 * @property {Record<LaneId, Lane>} lanes
 * @property {number} nextAvailableJuncId
 * @property {number} nextAvailableLaneId
 * 
 * @typedef {number} Coord
 * @typedef {number} JuncId
 * @typedef {number} LaneId
 * @typedef {ReturnType<createJunction>} Junc
 * @typedef {ReturnType<createLane>} Lane
 */

export const JUNC_RADIUS = 16;
export const JUNC_SIZE = JUNC_RADIUS * 2;

export const LANE_TYPES = {
    FORWARD: 1,
};
export const LANE_STATUS = {
    YIELD: 0,
    GO: 1,
    STOP: 2,
};

/**
 * @returns {JuncMap}
 */
export function createJunctionMap() {
    return {
        nextAvailableJuncId: 1,
        nextAvailableLaneId: 1,
        juncs: {},
        lanes: {},
    };
}

/**
 * @param {JuncMap} map 
 * @param {JuncId} juncId
 */
export function createJunction(map, juncId, coordX, coordY) {
    let result = {
        juncId,
        coordX,
        coordY,
        lanes: [],
    };
    map.juncs[juncId] = result;
    return result;
}

export function deleteJunction(map, juncId) {
    let junc = map.juncs[juncId];
    if (junc.lanes.length > 0) {
        throw new Error('Cannot delete junction with connected lanes.');
    }
    delete map.juncs[juncId];
}

/**
 * @param {JuncMap} map 
 * @param {LaneId} laneId 
 * @param {JuncId} fromJuncId 
 * @param {JuncId} toJuncId 
 */
export function createLane(map, laneId, laneType, fromJuncId, toJuncId) {
    let result = {
        laneId,
        laneType,
        from: fromJuncId,
        to: toJuncId,
        status: LANE_STATUS.YIELD,
    };
    map.lanes[laneId] = result;
    let junc = map.juncs[fromJuncId];
    junc.lanes.push(laneId);
    return result;
}

/**
 * @param {JuncMap} map 
 * @returns {JuncId}
 */
export function nextAvailableJunctionId(map) {
    return map.nextAvailableJuncId++;
}

/**
 * @param {JuncMap} map 
 * @param {JuncId} laneId 
 */
export function deleteLane(map, laneId) {
    let lane = map.lanes[laneId];
    if (lane) {
        return;
    }
    delete map.lanes[laneId];
    let fromJuncId = lane.from;
    let junc = map.juncs[fromJuncId];
    junc.lanes.splice(junc.lanes.indexOf(laneId), 1);
}


/**
 * @param {JuncMap} map 
 * @returns {LaneId}
 */
export function nextAvailableLaneId(map) {
    return map.nextAvailableLaneId++;
}

/**
 * @param {[number, number]} out 
 * @param {JuncMap} map 
 * @param {Lane} lane 
 * @param {number} progress 
 */
export function getLanePoint(out, map, lane, progress) {
    let fromJunc = map.juncs[lane.from];
    let toJunc = map.juncs[lane.to];
    let prevX = fromJunc.coordX * JUNC_SIZE + JUNC_RADIUS;
    let prevY = fromJunc.coordY * JUNC_SIZE + JUNC_RADIUS;
    let nextX = toJunc.coordX * JUNC_SIZE + JUNC_RADIUS;
    let nextY = toJunc.coordY * JUNC_SIZE + JUNC_RADIUS;
    let dx = nextX - prevX;
    let dy = nextY - prevY;
    out[0] = prevX + dx * progress;
    out[1] = prevY + dy * progress;
    return out;
}

/**
 * @param {JuncMap} map 
 * @param {Coord} coordX 
 * @param {Coord} coordY 
 */
export function getJunctionByCoords(map, coordX, coordY) {
    for(let junc of Object.values(map.juncs)) {
        if (junc.coordX === coordX && junc.coordY === coordY) {
            return junc;
        }
    }
    return null;
}

/**
 * @param {Array<Lane>} out
 * @param {JuncMap} map 
 * @param {Coord} fromCoordX 
 * @param {Coord} fromCoordY 
 * @param {Coord} toCoordX 
 * @param {Coord} toCoordY
 */
export function getLanesByCoords(out, map, fromCoordX, fromCoordY, toCoordX, toCoordY) {
    let fromJunc = getJunctionByCoords(map, fromCoordX, fromCoordY);
    let toJunc = getJunctionByCoords(map, toCoordX, toCoordY);
    if (!fromJunc || !toJunc) {
        return null;
    }
    return getLanesByJunctions(out, map, fromJunc, toJunc);
}

/**
 * @param {Array<Lane>} out
 * @param {JuncMap} map 
 * @param {Junc} fromJunc 
 * @param {Junc} toJunc 
 */
export function getLanesByJunctions(out, map, fromJunc, toJunc) {
    if (!fromJunc || !toJunc) {
        return out;
    }
    let fromJuncId = fromJunc.juncId;
    let toJuncId = toJunc.juncId;
    for(let lane of Object.values(map.lanes)) {
        if (lane.from === fromJuncId && lane.to === toJuncId) {
            out.push(lane);
        }
    }
    return out;
}

export function getConnectedLanesByJunction(out, map, junc) {
    if (!junc) {
        return out;
    }
    let juncId = junc.juncId;
    for(let lane of Object.values(map.lanes)) {
        if (lane.from === juncId || lane.to === juncId) {
            out.push(lane);
        }
    }
    return out;
}

/**
 * @param {JuncMap} map 
 * @param {Coord} fromCoordX 
 * @param {Coord} fromCoordY 
 * @param {Coord} toCoordX 
 * @param {Coord} toCoordY 
 */
export function placeRoad(map, fromCoordX, fromCoordY, toCoordX, toCoordY) {
    fromCoordX = Math.floor(fromCoordX);
    fromCoordY = Math.floor(fromCoordY);
    toCoordX = Math.floor(toCoordX);
    toCoordY = Math.floor(toCoordY);
    if (fromCoordX === toCoordX && fromCoordY == toCoordY) {
        return false;
    }
    let dx = toCoordX - fromCoordX;
    let dy = toCoordY - fromCoordY;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        let prevX = fromCoordX;
        let prevY = fromCoordY;
        let flag = false;
        bresenhamLine(fromCoordX, fromCoordY, toCoordX, toCoordY, (x, y) => {
            flag ||= placeRoad(map, prevX, prevY, x, y);
            prevX = x;
            prevY = y;
        });
        return flag;
    }
    let fromJunc = getJunctionByCoords(map, fromCoordX, fromCoordY);
    let toJunc = getJunctionByCoords(map, toCoordX, toCoordY);
    let lanes = [];
    getLanesByJunctions(lanes, map, fromJunc, toJunc);
    getLanesByJunctions(lanes, map, toJunc, fromJunc);
    if (lanes.length > 0) {
        return false;
    }
    if (!fromJunc) {
        fromJunc = createJunction(map, nextAvailableJunctionId(map), fromCoordX, fromCoordY);
    }
    if (!toJunc) {
        toJunc = createJunction(map, nextAvailableJunctionId(map), toCoordX, toCoordY);
    }
    createLane(map, nextAvailableLaneId(map), LANE_TYPES.FORWARD, fromJunc.juncId, toJunc.juncId);
    createLane(map, nextAvailableLaneId(map), LANE_TYPES.FORWARD, toJunc.juncId, fromJunc.juncId);
    return true;
}

export function unplaceRoad(map, coordX, coordY) {
    coordX = Math.floor(coordX);
    coordY = Math.floor(coordY);
    let junc = getJunctionByCoords(map, coordX, coordY);
    let lanes = [];
    getConnectedLanesByJunction(lanes, map, junc);
    for(let lane of lanes) {
        deleteLane(map, lane.laneId);
    }
    deleteJunction(map, junc.juncId);
}
