import { coords, createChunkDataById, createChunkMap, getChunkIdByCoords, getChunkIds, getChunkOriginById, getTileByOffset, setTile } from '../../core/ChunkMap.js';
import { addListener } from '../../core/Listenable.js';
import { getBlockById } from '../Block.js';

export const TILE_RADIUS = 8;
export const TILE_SIZE = TILE_RADIUS * 2;

export function ChunkSystem(m) {
    let map = createChunkMap(16, 16, 1);
    let v = [0, 0, 0];
    m.chunks = map;
    m.boundary = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    };

    addListener(m, 'init', () => {
        for (let [chunkX, chunkY] of coords(v, -4, -4, 0, 4, 4, 0)) {
            let chunkId = getChunkIdByCoords(map, chunkX, chunkY, 0);
            createChunkDataById(map, chunkId);
        }
        setTile(map, 0, 0, 0, 1);
        setTile(map, 1, 0, 0, 1);
        setTile(map, 0, 1, 0, 1);
        setTile(map, 1, 1, 0, 1);
        m.boundary.left = 0;
        m.boundary.right = 1;
        m.boundary.top = 0;
        m.boundary.bottom = 1;
    });

    addListener(m, 'render', (ctx) => {
        let v = [0, 0, 0];
        for(let chunkId of getChunkIds(map)) {
            let [posX, posY, posZ] = getChunkOriginById(v, map, chunkId);
            ctx.pushTransform();
            {
                ctx.setTranslation(posX * TILE_SIZE, posY * TILE_SIZE, posZ * TILE_SIZE);
                drawChunk(ctx, map, chunkId);
            }
            ctx.popTransform();
        }
    });
}

function drawChunk(ctx, chunkMap, chunkId) {
    ctx.pushTransform();
    for (let [x, y] of coords([0, 0, 0], 0, 0, 0, chunkMap.chunkWidth - 1, chunkMap.chunkHeight - 1, 0)) {
        let tile = getTileByOffset(chunkMap, chunkId, x, y, 0);
        if (tile) {
            let block = getBlockById(tile);
            block.renderer(ctx, x, y, tile);
        }
    }
    ctx.popTransform();
}
