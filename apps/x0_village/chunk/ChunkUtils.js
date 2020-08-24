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
