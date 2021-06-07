import { Chunk, ChunkData, toChunkCoords } from './chunk/Chunk.js';

export function loadChunk(chunkWidth, chunkHeight, jsonData)
{
    const length = chunkWidth * chunkHeight;
    const chunkId = jsonData.id;
    const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);

    let data = new ChunkData(chunkWidth, chunkHeight);
    for(let i = 0; i < length; ++i)
    {
        data.block[i] = jsonData.block[i];
        data.meta[i] = jsonData.meta[i];
        data.neighbor[i] = jsonData.neighbor[i];
    }
    return new Chunk(this, chunkId, chunkCoordX, chunkCoordY, data);
}

export function saveChunk(chunkWidth, chunkHeight, chunk)
{
    const length = chunkWidth * chunkHeight;
    const chunkId = chunk.chunkId;

    let result = {
        id: chunkId,
        block: new Array(length),
        meta: new Array(length),
        neighbor: new Array(length),
    };
    for(let i = 0; i < length; ++i)
    {
        result.block[i] = chunk.data.block[i];
        result.meta[i] = chunk.data.meta[i];
        result.neighbor[i] = chunk.data.neighbor[i];
    }
    return result;
}
