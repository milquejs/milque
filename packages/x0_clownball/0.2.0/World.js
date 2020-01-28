import { EntityManager } from './milque.js';
import { TileManager } from './TileManager.js';

export function createWorld(ctx = {})
{
    ctx.entities = new EntityManager();
    ctx.tiles = new TileManager();
    return ctx;
}
