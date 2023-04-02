import { JSONLoader } from '@milque/asset';
import { fromJSON } from './RoomDef';

/**
 * @param {string|ArrayBuffer} src 
 * @returns {Promise<import('./RoomDef').RoomDef>}
 */
export async function RoomDefLoader(src) {
    return fromJSON(await JSONLoader(src));
}
