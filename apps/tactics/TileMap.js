
export function createTileMap(width, height = width, depth = 1)
{
    let tileData = new Array(width * height * depth);
    tileData.fill(0);

    for(let i = 0; i < tileData.length; ++i)
    {
        tileData[i] = Math.floor(Math.random() * 2);
    }

    return {
        width,
        height,
        depth,
        length: tileData.length,
        tileData,
    };
}

export function loadTileMap(tileMapData)
{
    let tilemap = createTileMap(tileMapData.width, tileMapData.height, tileMapData.depth);
    for(let i = 0; i < tilemap.length; ++i)
    {
        tilemap.tileData[i] = tileMapData.tileData[i];
    }
    return tilemap;
}

export function saveTileMap(tileMap)
{
    return {
        width: tileMap.width,
        height: tileMap.height,
        depth: tileMap.depth,
        tileData: tileMap.tileData,
    };
}
