export function mapIndexOfCoord(array, stride, coordX, coordY)
{
    return coordX + coordY * stride;
}

export function mapCoordOfIndex(array, stride, arrayIndex)
{
    return [
        mapCoordXOfIndex(array, stride, arrayIndex),
        mapCoordYOfIndex(array, stride, arrayIndex)
    ];
}

export function mapCoordXOfIndex(array, stride, arrayIndex)
{
    return arrayIndex % stride;
}

export function mapCoordYOfIndex(array, stride, arrayIndex)
{
    return Math.floor(arrayIndex / stride);
}

export function mapWidth(array, stride)
{
    return stride;
}

export function mapHeight(array, stride)
{
    return Math.ceil(array.length / stride);
}

export function isMapCoordWithinBounds(array, stride, coordX, coordY)
{
    return coordX >= 0
        && coordY >= 0
        && coordX < mapWidth(array, stride)
        && coordY < mapHeight(array, stride);
}

export function offsetMapIndex(array, stride, arrayIndex, offsetX, offsetY)
{
    return (arrayIndex + offsetX) + offsetY * stride;
}

export function offsetMapIndexBounded(array, stride, arrayIndex, offsetX, offsetY)
{
    const w = mapWidth(array, stride);
    const h = mapHeight(array, stride);
    let x = mapCoordXOfIndex(array, stride, arrayIndex) + offsetX;
    if (x < 0) x = 0;
    if (x >= w) x = w - 1;
    let y = mapCoordYOfIndex(array, stride, arrayIndex) + offsetY;
    if (y < 0) y = 0;
    if (y >= h) y = h - 1;
    return mapIndexOfCoord(array, stride, x, y);
}

export function offsetMapIndexWrapped(array, stride, arrayIndex, offsetX, offsetY)
{
    const w = mapWidth(array, stride);
    const h = mapHeight(array, stride);
    let x = mapCoordXOfIndex(array, stride, arrayIndex) + offsetX;
    x %= w;
    if (x < 0) x = w + x;
    let y = mapCoordYOfIndex(array, stride, arrayIndex) + offsetY;
    y %= h;
    if (y < 0) y = h + y;
    return mapIndexOfCoord(array, stride, x, y);
}
