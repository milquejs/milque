import { ChunkHandler } from './chunk/ChunkHandler.js';
import { DefaultChunkLoader } from './chunk/loaders/DefaultChunkLoader.js';

export const DEFAULT_CHUNK_WIDTH = 16;
export const DEFAULT_CHUNK_HEIGHT = 16;
export const DEFAULT_TILE_WIDTH = 16;
export const DEFAULT_TILE_HEIGHT = 16;

export class TileManager
{
    constructor(chunkLoaders = [], opts = undefined)
    {
        this.chunkHandler = new ChunkHandler();
        this.tileWidth = opts ? opts.tileWidth : DEFAULT_TILE_WIDTH;
        this.tileHeight = opts ? opts.tileHeight : DEFAULT_TILE_HEIGHT;
        this.chunkWidth = opts ? opts.chunkWidth : DEFAULT_CHUNK_WIDTH;
        this.chunkHeight = opts ? opts.chunkHeight : DEFAULT_CHUNK_HEIGHT;

        this._tilePosSource = {
            width: this.chunkWidth,
            height: this.chunkHeight,
        };

        if (chunkLoaders.length <= 0)
        {
            let loader = new DefaultChunkLoader(this.chunkWidth, this.chunkHeight);
            chunkLoaders.push(loader);

            loader.load(0, 0)
                .then(chunk => this.chunkHandler.setDefaultChunk(chunk));
        }
    }

    get(posX, posY, layerIndex = 0)
    {
        let coordX = Math.trunc(posX / this.tileWidth);
        let coordY = Math.trunc(posY / this.tileHeight);
        let chunkX = Math.trunc(coordX / this.chunkWidth);
        let chunkY = Math.trunc(coordY / this.chunkHeight);
        let tileX = coordX % this.chunkWidth;
        let tileY = coordY % this.chunkHeight;
        return this.chunkHandler
            .getChunk(chunkX, chunkY)
            .layers[layerIndex]
            .get(tileX, tileY);
    }

    set(posX, posY, value, layerIndex = 0)
    {
        if (typeof value === 'number')
        {

        }
        else if (value instanceof TileMap)
        {
            for(let i = 0; i < value.height; ++i)
            {
                for(let j = 0; j < value.width; ++j)
                {
                    let v = value.get(j, i);
                    this.set(posX + j, posY + i, v, layerIndex);
                }
            }
            let coordX = Math.trunc(posX / this.tileWidth);
            let coordY = Math.trunc(posY / this.tileHeight);
            let chunkX = Math.trunc(coordX / this.chunkWidth);
            let chunkY = Math.trunc(coordY / this.chunkHeight);
            let tileX = coordX % this.chunkWidth;
            let tileY = coordY % this.chunkHeight;
        }
        else
        {
            throw new Error('Unsupported value type for tile.');
        }
        let coordX = Math.trunc(posX / this.tileWidth);
        let coordY = Math.trunc(posY / this.tileHeight);
        let chunkX = Math.trunc(coordX / this.chunkWidth);
        let chunkY = Math.trunc(coordY / this.chunkHeight);
        let tileX = coordX % this.chunkWidth;
        let tileY = coordY % this.chunkHeight;
        return this.chunkHandler
            .getChunk(chunkX, chunkY)
            .layers[layerIndex]
            .set(tileX, tileY, value);
    }

    posAt(posX, posY)
    {
        return new TilePosBase(
            this._tilePosSource,
            Math.trunc(posX / this.tileWidth),
            Math.trunc(posY / this.tileHeight)
        );
    }

    /**
     * Gets the tile at the world position.
     * @param {Number} posX The x position.
     * @param {Number} posY The y position.
     * @param {Number} layerIndex The layer index.
     */
    tileAt(posX, posY, layerIndex)
    {
        return this.getTileById(this.get(posX, posY, layerIndex));
    }

    chunkAt(posX, posY)
    {
        let coordX = Math.trunc(posX / this.tileWidth);
        let coordY = Math.trunc(posY / this.tileHeight);
        let chunkX = Math.trunc(coordX / this.chunkWidth);
        let chunkY = Math.trunc(coordY / this.chunkHeight);
        return this.chunkHandler.getChunk(chunkX, chunkY);
    }

    getTileById(tileId)
    {
        
    }
}
