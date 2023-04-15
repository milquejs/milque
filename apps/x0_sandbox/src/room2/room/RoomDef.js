import { ComponentClass, EntityManager, Query, SceneGraph } from '@milque/scene';
import { AssetManager } from '@milque/asset';

import { ObjectDef } from '../object';
import { getObjectDef } from '../Defs';

/** @module RoomDef */

/**
 * @typedef {ReturnType<create>} RoomDef
 * @typedef {ReturnType<createRoomInstance>} RoomInstance
 * 
 * @typedef ViewDef
 * @property {number} offsetX
 * @property {number} offsetY
 * @property {number} width
 * @property {number} height
 * 
 * @typedef InstanceDef
 * @property {string} objectName
 * @property {number} x
 * @property {number} y
 * @property {number} scaleX
 * @property {number} scaleY
 * @property {number} rotation
 */

/**
 * @param {Array<ViewDef>} views
 * @param {Array<InstanceDef>} instances
 */
export function create(views, instances) {
    return {
        views,
        instances,
        initial: {
            background: 0x000000,
        },
    };
}

/**
 * @param {Partial<RoomDef>} json
 */
export function fromJSON(json) {
    let {
        views = [],
        instances = [],
        initial = undefined,
    } = json;
    const {
        background = 0x000000,
    } = initial || {};
    let result = create(views, instances);
    result.initial.background = background;
    return result;
}

function createViewDef(offsetX, offsetY, width, height) {
    return {
        offsetX,
        offsetY,
        width,
        height,
    };
}

function createInstanceDef(objectName, x, y, scaleX, scaleY, rotation) {
    return {
        objectName,
        x, y,
        scaleX, scaleY,
        rotation,
    };
}

export const RoomComponent = new ComponentClass('room', () => createRoomInstance(null, 0, 0x000000));
export const RoomQuery = new Query(RoomComponent);

/**
 * @param {string} roomName 
 * @param {import('@milque/scene').EntityId} roomId 
 * @param {number} background
 */
function createRoomInstance(roomName, roomId, background) {
    return {
        roomName,
        roomId,
        roomTag: new ComponentClass(`room:${roomName}`),
        /** @type {Record<string, { tag: ComponentClass<null>, query: Query }>} */
        objectQueries: {},
        background,
    };
}

/**
 * @param {EntityManager} ents
 * @param {AssetManager} assets
 * @param {RoomDef} roomDef 
 * @param {string} roomName 
 * @returns {RoomInstance}
 */
export function newInstance(ents, sceneGraph, assets, roomDef, roomName) {
    let roomId = ents.create();
    let room = createRoomInstance(roomName, roomId, roomDef.initial.background);
    for (let instanceDef of roomDef.instances) {
        spawn(ents, sceneGraph, assets,
            room, instanceDef.objectName,
            instanceDef.x, instanceDef.y,
            instanceDef.scaleX, instanceDef.scaleY,
            instanceDef.rotation);
    }
    return room;
}

/**
 * @param {EntityManager} ents 
 * @param {import('@milque/scene').EntityId} roomId
 */
export function getInstance(ents, roomId) {
    return ents.get(roomId, RoomComponent);
}

/**
 * @param {EntityManager} ents 
 * @param {SceneGraph} sceneGraph 
 * @param {AssetManager} assets 
 * @param {RoomInstance} room 
 * @param {string} objectName 
 * @param {number} x 
 * @param {number} y 
 * @param {number} [scaleX] 
 * @param {number} [scaleY] 
 * @param {number} [rotation]
 */
export function spawn(ents, sceneGraph, assets, room, objectName, x, y, scaleX = 1, scaleY = 1, rotation = 0) {
    let objectDef = getObjectDef(assets, objectName);
    let result = ObjectDef.newInstance(ents, sceneGraph, assets, objectDef, objectName);
    ents.attach(result.objectId, room.roomTag);
    if (!(objectName in room.objectQueries)) {
        let tag = new ComponentClass(`object:${objectName}`);
        room.objectQueries[objectName] = {
            tag,
            query: new Query(ObjectDef.ObjectComponent, tag),
        };
    }
    ents.attach(result.objectId, getObjectTag(room, objectName));
    result.x += x;
    result.y += y;
    result.scaleX *= scaleX;
    result.scaleY *= scaleY;
    result.rotation += rotation;
    return result;
}

/**
 * @param {RoomInstance} room
 * @returns {ComponentClass<?>}
 */
export function getRoomTag(room) {
    return room.roomTag;
}

/**
 * @param {RoomInstance} room 
 * @param {string} objectName 
 * @returns {ComponentClass<null>}
 */
export function getObjectTag(room, objectName) {
    return room.objectQueries[objectName].tag;
}

/**
 * @param {EntityManager} ents
 * @param {RoomInstance} room 
 * @param {string} objectName 
 */
export function* findAllByObject(ents, room, objectName) {
    for(let result of room.objectQueries[objectName].query.findComponents(ents, ObjectDef.ObjectComponent)) {
        yield result;
    }
}

/**
 * @param {EntityManager} ents
 * @param {RoomInstance} room 
 * @param {string} objectName 
 */
export function findAnyByObject(ents, room, objectName) {
    let { value } = room.objectQueries[objectName].query.findComponents(ents, ObjectDef.ObjectComponent).next();
    return value;
}
