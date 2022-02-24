export function toChunkId(chunkCoordX, chunkCoordY)
{
    return chunkCoordX + ',' + chunkCoordY;
}

export function toChunkCoords(chunkId)
{
    let separator = chunkId.indexOf(',');
    let chunkCoordX = Number(chunkId.substring(0, separator));
    let chunkCoordY = Number(chunkId.substring(separator + 1));
    return [ chunkCoordX, chunkCoordY ];
}

export class Chunk
{
    constructor(chunkManager, chunkId, chunkCoordX, chunkCoordY, chunkData)
    {
        this.chunkManager = chunkManager;
        this.chunkId = chunkId;
        this.chunkCoordX = chunkCoordX;
        this.chunkCoordY = chunkCoordY;
        this._data = chunkData;
    }

    get data()
    {
        return this._data;
    }
}

export class ChunkData
{
    constructor(width, height)
    {
        const length = width * height;
        this.block = new Uint8Array(length).fill(0);
        this.meta = new Uint8Array(length).fill(0);
        this.neighbor = new Uint8Array(length).fill(0b1111);
    }
}
