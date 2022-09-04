/**
 * @typedef {ReturnType<createChunkMap>} ChunkMap
 * @typedef {Uint8Array} ChunkData
 */

/**
 * @param {number} chunkWidth 
 * @param {number} chunkHeight 
 * @param {number} chunkDepth 
 */
export function createChunkMap(chunkWidth, chunkHeight, chunkDepth) {
    return {
        chunkWidth,
        chunkHeight,
        chunkDepth,
        /** @type {Record<number, ChunkData>} */
        chunks: {},
    };
}

/**
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z
 * @returns {ChunkData}
 */
export function createChunkData(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    return createChunkDataByCoords(map, x / w, y / h, z / d);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkX 
 * @param {number} chunkY 
 * @param {number} chunkZ 
 * @returns {ChunkData}
 */
export function createChunkDataByCoords(map, chunkX, chunkY, chunkZ) {
    let x = Math.floor(chunkX) & 0xFFFFFF;
    let y = Math.floor(chunkY) & 0xFFFFFF;
    let z = Math.floor(chunkZ) & 0xF;
    let chunkId = x << 28 | y << 4 | z;
    return createChunkDataById(map, chunkId);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 * @returns {ChunkData}
 */
export function createChunkDataById(map, chunkId) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    let chunkData = new Uint8Array(w * h * d);
    map.chunks[chunkId] = chunkData;
    return chunkData;
}

/**
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z
 */
export function deleteChunkData(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    deleteChunkDataByCoords(map, x / w, y / h, z / d);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkX 
 * @param {number} chunkY 
 * @param {number} chunkZ 
 */
export function deleteChunkDataByCoords(map, chunkX, chunkY, chunkZ) {
    let x = Math.floor(chunkX) & 0xFFFFFF;
    let y = Math.floor(chunkY) & 0xFFFFFF;
    let z = Math.floor(chunkZ) & 0xF;
    let chunkId = x << 28 | y << 4 | z;
    deleteChunkDataById(map, chunkId);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 */
export function deleteChunkDataById(map, chunkId) {
    delete map.chunks[chunkId];
}

/**
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {ChunkData}
 */
export function getChunkData(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    return getChunkDataByCoords(map, x / w, y / h, z / d);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkX 
 * @param {number} chunkY 
 * @param {number} chunkZ 
 * @returns {ChunkData}
 */
export function getChunkDataByCoords(map, chunkX, chunkY, chunkZ) {
    let x = Math.floor(chunkX) & 0xFFFFFF;
    let y = Math.floor(chunkY) & 0xFFFFFF;
    let z = Math.floor(chunkZ) & 0xF;
    let chunkId = x << 28 | y << 4 | z;
    return getChunkDataById(map, chunkId);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId
 * @returns {ChunkData}
 */
export function getChunkDataById(map, chunkId) {
    return map.chunks[chunkId];
}

/**
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z
 * @returns {boolean}
 */
export function hasChunkData(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    return hasChunkDataByCoords(map, x / w, y / h, z / d);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkX 
 * @param {number} chunkY 
 * @param {number} chunkZ 
 * @returns {boolean}
 */
export function hasChunkDataByCoords(map, chunkX, chunkY, chunkZ) {
    let x = Math.floor(chunkX) & 0xFFFFFF;
    let y = Math.floor(chunkY) & 0xFFFFFF;
    let z = Math.floor(chunkZ) & 0xF;
    let chunkId = x << 28 | y << 4 | z;
    return hasChunkDataById(map, chunkId);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 * @returns {boolean}
 */
export function hasChunkDataById(map, chunkId) {
    return chunkId in map.chunks;
}

/**
 * @param {ChunkMap} map 
 * @returns {Array<number>}
 */
export function getChunkIds(map) {
    return Object.keys(map.chunks).map(Number);
}

/**
 * @param {ChunkMap} map 
 * @param {number} x
 * @param {number} y 
 * @param {number} z 
 * @returns {number}
 */
export function getTile(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    let chunkX = Math.floor(x / w) & 0xFFFFFF;
    let chunkY = Math.floor(y / h) & 0xFFFFFF;
    let chunkZ = Math.floor(z / d) & 0xF;
    let chunkId = chunkX << 28 | chunkY << 4 | chunkZ;
    let offsetX = (x < 0 ? Math.floor(w + x) : Math.floor(x)) % w;
    let offsetY = (y < 0 ? Math.floor(h + y) : Math.floor(y)) % h;
    let offsetZ = (z < 0 ? Math.floor(d + z) : Math.floor(z)) % d;
    let tileIndex = offsetX + offsetY * w + offsetZ * w * h;
    return getTileByIndex(map, chunkId, tileIndex);
}

/**
 * Assumes offset is within bounds of chunk size.
 * 
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 * @param {number} offsetX 
 * @param {number} offsetY
 * @param {number} offsetZ 
 * @returns {number}
 */
export function getTileByOffset(map, chunkId, offsetX, offsetY, offsetZ) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let tileIndex = Math.floor(offsetX) + Math.floor(offsetY) * w + Math.floor(offsetZ) * w * h;
    return getTileByIndex(map, chunkId, tileIndex);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 * @param {number} tileIndex
 * @returns {number}
 */
export function getTileByIndex(map, chunkId, tileIndex) {
    return map.chunks[chunkId][tileIndex];
}

/**
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z
 * @param {number} tileId 
 */
export function setTile(map, x, y, z, tileId) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    let chunkX = Math.floor(x / w) & 0xFFFFFF;
    let chunkY = Math.floor(y / h) & 0xFFFFFF;
    let chunkZ = Math.floor(z / d) & 0xF;
    let chunkId = chunkX << 28 | chunkY << 4 | chunkZ;
    let offsetX = (x < 0 ? Math.floor(w + x) : Math.floor(x)) % w;
    let offsetY = (y < 0 ? Math.floor(h + y) : Math.floor(y)) % h;
    let offsetZ = (z < 0 ? Math.floor(d + z) : Math.floor(z)) % d;
    let tileIndex = offsetX + offsetY * w + offsetZ * w * h;
    setTileByIndex(map, chunkId, tileIndex, tileId);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} offsetZ
 * @param {number} tileId 
 */
export function setTileByOffset(map, chunkId, offsetX, offsetY, offsetZ, tileId) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let tileIndex = Math.floor(offsetX) + Math.floor(offsetY) * w + Math.floor(offsetZ) * w * h;
    setTileByIndex(map, chunkId, tileIndex, tileId);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 * @param {number} tileIndex 
 * @param {number} tileId 
 */
export function setTileByIndex(map, chunkId, tileIndex, tileId) {
    map.chunks[chunkId][tileIndex] = tileId;
}

/**
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {number}
 */
 export function getChunkId(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    return getChunkIdByCoords(map, x / w, y / h, z / d);
}

/**
 * @param {ChunkMap} map 
 * @param {number} chunkX 
 * @param {number} chunkY 
 * @param {number} chunkZ 
 * @returns {number}
 */
export function getChunkIdByCoords(map, chunkX, chunkY, chunkZ) {
    let x = Math.floor(chunkX) & 0xFFFFFF;
    let y = Math.floor(chunkY) & 0xFFFFFF;
    let z = Math.floor(chunkZ) & 0xF;
    let chunkId = x << 28 | y << 4 | z;
    return chunkId;
}

/**
 * @param {Array<number>} out
 * @param {ChunkMap} map 
 * @param {number} chunkId
 */
export function getChunkOriginById(out, map, chunkId) {
    getChunkCoordsById(out, map, chunkId);
    out[0] *= map.chunkWidth;
    out[1] *= map.chunkHeight;
    out[2] *= map.chunkDepth;
    return out;
}

/**
 * @param {Array<number>} out
 * @param {ChunkMap} map 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 */
export function getChunkCoords(out, map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    out[0] = Math.floor(x / w);
    out[1] = Math.floor(y / h);
    out[2] = Math.floor(z / d);
    return out;
}

/**
 * @param {Array<number>} out
 * @param {ChunkMap} map 
 * @param {number} chunkId 
 */
export function getChunkCoordsById(out, map, chunkId) {
    let id = chunkId;
    let chunkX = (id >> 28) & 0xFFFFFF;
    if ((chunkX & 0x800000)) {
        chunkX |= 0xFFFF_FFFF_0000_00;
    }
    let chunkY = (id >> 4) & 0xFFFFFF;
    if ((chunkY & 0x800000)) {
        chunkY |= 0xFFFF_FFFF_0000_00;
    }
    let chunkZ = id & 0xF;
    if ((chunkZ & 0x8)) {
        chunkZ |= 0xFFFF_FFFF_FFFF_F0;
    }
    out[0] = chunkX;
    out[1] = chunkY;
    out[2] = chunkZ;
    return out;
}

/**
 * @param {ChunkMap} map 
 * @param {number} x
 * @param {number} y 
 * @param {number} z 
 * @returns {number}
 */
export function getTileIndex(map, x, y, z) {
    let w = map.chunkWidth;
    let h = map.chunkHeight;
    let d = map.chunkDepth;
    let offsetX = Math.floor(x) % w;
    let offsetY = Math.floor(y) % h;
    let offsetZ = Math.floor(z) % d;
    let tileIndex = offsetX + offsetY * w + offsetZ * w * h;
    return tileIndex;
}

export function coords(out, fromX, fromY, fromZ, toX, toY, toZ) {
    return {
        [Symbol.iterator]: function*() {
            for(let k = fromZ; k <= toZ; ++k) {
                for(let j = fromY; j <= toY; ++j) {
                    for(let i = fromX; i <= toX; ++i) {
                        out[0] = i;
                        out[1] = j;
                        out[2] = k;
                        yield out;
                    }
                }
            }
        }
    };
}
