import { JSONLoader } from '@milque/asset';
import { fromJSON } from './SpriteDef';

/**
 * @param {string|ArrayBuffer} src 
 * @returns {Promise<import('./SpriteDef').SpriteDef>}
 */
export async function SpriteDefLoader(src) {
    return fromJSON(await JSONLoader(src));
}
