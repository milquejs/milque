import { TileMap } from '../TileMap.js';

export class ChunkLoaderBase
{
    constructor(chunkWidth = 16, chunkHeight = chunkWidth, chunkDepth = 1)
    {
        this.chunkWidth = chunkWidth;
        this.chunkHeight = chunkHeight;
        this.chunkDepth = chunkDepth;
    }

    async load(chunkX, chunkY)
    {
        let tiles = new TileMap(this.chunkWidth, this.chunkHeight, this.chunkDepth);
        tiles.fill(0);
        let result = {
            chunkX,
            chunkY,
            tiles,
        };
        return result;
    }

    async unload(chunkX, chunkY, chunk)
    {
        chunk.tiles.fill(0);
    }
}