const OPPOSITE_DIRECTION_METADATA_OFFSET = 4;
const CLOCKWISE_ORTHOGONAL_DIRECTION_METADATA_OFFSET = 2;
export const DIRECTION_METADATA_BITS = 8;
export const DIRECTION_METADATA = {
    EAST: 1 << 0,
    NORTHEAST: 1 << 1,
    NORTH: 1 << 2,
    NORTHWEST: 1 << 3,
    WEST: 1 << 4,
    SOUTHWEST: 1 << 5,
    SOUTH: 1 << 6,
    SOUTHEAST: 1 << 7,
};

export function randomDirectionMetadata()
{
    return 1 << Math.floor(Math.random() * DIRECTION_METADATA_BITS);
}

export function getOppositeDirectionIndex(directionIndex)
{
    return (directionIndex + OPPOSITE_DIRECTION_METADATA_OFFSET) % DIRECTION_METADATA_BITS;
}

export function getClockwiseOrthogonalDirectionIndex(directionIndex)
{
    return (directionIndex + CLOCKWISE_ORTHOGONAL_DIRECTION_METADATA_OFFSET) % DIRECTION_METADATA_BITS;
}

export function getDeltaVectorFromMetadata(metadata)
{
    switch(metadata)
    {
        case DIRECTION_METADATA.EAST:
            return [1, 0];
        case DIRECTION_METADATA.NORTHEAST:
            return [1, -1];
        case DIRECTION_METADATA.NORTH:
            return [0, -1];
        case DIRECTION_METADATA.NORTHWEST:
            return [-1, -1];
        case DIRECTION_METADATA.WEST:
            return [-1, 0];
        case DIRECTION_METADATA.SOUTHWEST:
            return [-1, 1];
        case DIRECTION_METADATA.SOUTH:
            return [0, 1];
        case DIRECTION_METADATA.SOUTHEAST:
            return [1, 1];
        default:
            throw new Error('Cannot get delta vector from multi-directional metadata.');
    }
}

export function getDirectionBitsFromMetadata(metadata)
{
    return [
        (metadata >> 0) & 0x1,
        (metadata >> 1) & 0x1,
        (metadata >> 2) & 0x1,
        (metadata >> 3) & 0x1,
        (metadata >> 4) & 0x1,
        (metadata >> 5) & 0x1,
        (metadata >> 6) & 0x1,
        (metadata >> 7) & 0x1,
    ];
}

export function getDirectionMetadataFromBits(ee, ne, nn, nw, ww, sw, ss, se)
{
    return ee << 0
        | ne << 1
        | nn << 2
        | nw << 3
        | ww << 4
        | sw << 5
        | ss << 6
        | se << 7;
}

export function getDirectionMetadataFromDelta(dx, dy)
{
    if (dx === 0 && dy === 0) return 0;
    let px = dx > 0;
    let py = dy > 0;
    let nx = dx < 0;
    let ny = dy < 0;
    let zx = !px && !nx;
    let zy = !py && !ny;
    return (px && zy ? 1 : 0) << 0 // East
        | (px && ny ? 1 : 0) << 1 // North East
        | (zx && ny ? 1 : 0) << 2 // North
        | (nx && ny ? 1 : 0) << 3 // North West
        | (nx && zy ? 1 : 0) << 4 // West
        | (nx && py ? 1 : 0) << 5 // Sout West
        | (zx && py ? 1 : 0) << 6 // South
        | (px && py ? 1 : 0) << 7; // South East
}
