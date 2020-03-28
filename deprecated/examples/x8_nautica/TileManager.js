import { ChunkMap } from './chunk/ChunkMap.js';
import { ChunkLoaderBase } from './chunk/ChunkLoaderBase.js';

export class TileManager
{
    constructor()
    {
        this.chunkLoader = new ChunkLoaderBase();
        this.chunks = new ChunkMap();

        this._tileWidth = 16;
        this._tileHeight = this._tileWidth;
    }

    get tileWidth() { return this._tileWidth; }
    get tileHeight() { return this._tileHeight; }
    get chunkWidth() { return this.chunkLoader.chunkWidth; }
    get chunkHeight() { return this.chunkLoader.chunkHeight; }
    get chunkDepth() { return this.chunkLoader.chunkDepth; }

    setChunkLoader(chunkLoader)
    {
        this.chunkLoader = chunkLoader;
        return this;
    }

    setTileSize(tileWidth, tileHeight = tileWidth)
    {
        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;
        return this;
    }

    get(posX, posY, layerIndex = 0)
    {
        let tilePosX = Math.floor(posX / this.tileWidth);
        let tilePosY = Math.floor(posY / this.tileHeight);

        let chunkX = Math.floor(tilePosX / this.chunkWidth);
        let chunkY = Math.floor(tilePosY / this.chunkHeight);

        let tileX = tilePosX % this.chunkWidth;
        let tileY = tilePosY % this.chunkHeight;

        if (this.chunks.has(chunkX, chunkY))
        {
            return this.chunks.get(chunkX, chunkY).tiles.get(tileX, tileY, layerIndex);
        }
        else
        {
            this.chunks.load(chunkX, chunkY);
            return 0;
        }
    }

    set(posX, posY, value, layerIndex = 0)
    {
        let tilePosX = Math.floor(posX / this.tileWidth);
        let tilePosY = Math.floor(posY / this.tileHeight);

        let chunkX = Math.floor(tilePosX / this.chunkWidth);
        let chunkY = Math.floor(tilePosY / this.chunkHeight);

        let tileX = tilePosX % this.chunkWidth;
        let tileY = tilePosY % this.chunkHeight;

        if (this.chunks.has(chunkX, chunkY))
        {
            return this.chunks.get(chunkX, chunkY).tiles.set(tileX, tileY, value, layerIndex);
        }
        else
        {
            
        }
    }

    has(posX, posY, )
}
