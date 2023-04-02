import { JSONLoader } from '@milque/asset';
import { fromJSON } from './ObjectDef';

/**
 * @param {string|ArrayBuffer} src 
 * @returns {Promise<import('./ObjectDef').ObjectDef>}
 */
export async function ObjectDefLoader(src) {
    return fromJSON(await JSONLoader(src));
}
