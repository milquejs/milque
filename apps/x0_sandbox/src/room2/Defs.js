import { AssetManager } from '@milque/asset';

/**
 * @param {AssetManager} assets 
 * @param {string} spriteName
 * @returns {import('./sprite/SpriteDef').SpriteDef}
 */
export function getSpriteDef(assets, spriteName) {
    return assets.get(spriteName);
}

/**
 * @param {AssetManager} assets 
 * @param {string} objectName
 * @returns {import('./object/ObjectDef').ObjectDef}
 */
export function getObjectDef(assets, objectName) {
    return assets.get(objectName);
}

/**
 * @param {AssetManager} assets 
 * @param {string} roomName
 * @returns {import('./room/RoomDef').RoomDef}
 */
export function getRoomDef(assets, roomName) {
    return assets.get(roomName);
}
