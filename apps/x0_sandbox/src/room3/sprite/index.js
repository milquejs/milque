import { JSONLoader } from '@milque/asset';

import { createSpriteDefFromJSON } from './SpriteDef';

/**
 * @param {string|ArrayBuffer} src 
 * @returns {Promise<import('./SpriteDef').SpriteDef>}
 */
export async function SpriteLoader(src) {
    return createSpriteDefFromJSON(await JSONLoader(src));
}

export * from './SpriteDef';
export * from './SpriteInstance';
