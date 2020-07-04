import { CanvasView, Camera2D, Downloader, Uploader } from './lib.js';

import { saveChunkData, ChunkLoader, CHUNK_DATA_LENGTH } from '../ChunkManager.js';
import { TileMap, renderTileMap, TILE_SIZE, renderTile } from '../TileMap.js';
import * as BuilderControls from './BuilderControls.js';

class FileChunkLoader extends ChunkLoader
{
    constructor(worldData)
    {
        super();

        this.worldData = worldData;
    }

    /** @override */
    async loadChunkData(world, chunk)
    {
        let filename = `world${chunk.chunkX}_${chunk.chunkY}.cnk`;
        if (this.worldData.chunks.includes(filename))
        {
            for(let chunkData of this.worldData.datas)
            {
                if (chunkData.chunkId === chunk.chunkId)
                {
                    for(let i = 0; i < CHUNK_DATA_LENGTH; ++i)
                    {
                        chunk.data.tiles[i] = chunkData.tiles[i];
                    }
                    return;
                }
            }
        }
    }
}

export async function load()
{
    BuilderControls.BUILDER_INPUT_CONTEXT.attach(this.display);
    this.camera = new Camera2D();
    this.view = new CanvasView();

    this.importButton = document.querySelector('#import');
    this.exportButton = document.querySelector('#export');
    this.clearButton = document.querySelector('#clear');

    this.importButton.addEventListener('click', () => {
        Uploader.uploadFile(['.wld'])
            .then(fileList => fileList[0].text())
            .then(textData => {
                let jsonData = JSON.parse(textData);
                this.tileMap.chunkManager.unloadLoadedChunks(this);
                this.tileMap.chunkManager.clearChunkLoaders();
                this.tileMap.chunkManager.addChunkLoader(new FileChunkLoader(jsonData));

                for(let chunkData of jsonData.datas)
                {
                    this.tileMap.chunkManager.loadChunk(this, chunkData.chunkId, chunkData.chunkX, chunkData.chunkY);
                }
            });
    });
    this.exportButton.addEventListener('click', () => {
        let chunks = [];
        let datas = [];
        let result = {
            chunks,
            datas,
        };
        for(let chunk of this.tileMap.chunkManager.getChunks())
        {
            let filename = `world${chunk.chunkX}_${chunk.chunkY}.cnk`;
            chunks.push(filename);
            datas.push(saveChunkData(chunk));
        }
        Downloader.downloadText(`world.wld`, JSON.stringify(result));
    });
    this.clearButton.addEventListener('click', () => {
        this.tileMap.chunkManager.unloadLoadedChunks(this);
    });
}

export function start()
{
    this.tileMap = new TileMap(this);
    this.tileMap.chunkManager.addChunkLoader(new ChunkLoader());

    this.worldX = 0;
    this.worldY = 0;

    this.viewX = 0;
    this.viewY = 0;

    this.prevWorldX = 0;
    this.prevWorldY = 0;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragging = false;

    this.tileId = 0;
}

export function update(dt)
{
    BuilderControls.BUILDER_INPUT_CONTEXT.poll();

    let buildX = BuilderControls.BuildX.value * this.display.width - this.display.width / 2;
    let buildY = BuilderControls.BuildY.value * this.display.height - this.display.height / 2;

    if (this.dragging)
    {
        if (BuilderControls.BuildDragStop.value)
        {
            this.dragging = false;
        }
        else
        {
            this.worldX = this.prevWorldX - (buildX - this.dragStartX);
            this.worldY = this.prevWorldY - (buildY - this.dragStartY);
        }
    }
    else
    {
        if (BuilderControls.BuildDragStart.value)
        {
            this.prevWorldX = this.worldX;
            this.prevWorldY = this.worldY;
            this.dragStartX = buildX;
            this.dragStartY = buildY;
            this.dragging = true;
        }
    }

    let pos = this.camera.screenToWorld(buildX, buildY);
    this.viewX = Math.floor(pos[0]);
    this.viewY = Math.floor(pos[1]);

    this.camera.moveTo(this.worldX, this.worldY, 0, 0.2);

    if (BuilderControls.BuildNextTile.value)
    {
        this.tileId++;
    }
    
    if (BuilderControls.BuildPrevTile.value)
    {
        this.tileId--;
    }

    if (BuilderControls.BuildAction.value)
    {
        let chunk = this.tileMap.chunkAt(this.viewX, this.viewY, true);
        let index = chunk.getTileIndex(this.viewX, this.viewY);
        let tile = chunk.getTile(index);
        let nextTile = this.tileId;
        if (tile !== nextTile)
        {
            chunk.setTile(index, nextTile);
        }
    }
}

export function render(ctx)
{
    const halfDisplayWidth = this.display.width / 2;
    const halfDisplayHeight = this.display.height / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.display.width, this.display.height);

    this.view.setViewMatrix(this.camera.getViewMatrix());
    this.view.setProjectionMatrix(this.camera.getProjectionMatrix());

    try
    {
        this.view.begin(ctx, halfDisplayWidth, halfDisplayHeight);

        renderTileMap(ctx, this.tileMap,
            this.camera.x - halfDisplayWidth,
            this.camera.y - halfDisplayHeight,
            this.camera.x + halfDisplayWidth,
            this.camera.y + halfDisplayHeight);
        
        let tileX = Math.floor(this.viewX / TILE_SIZE) * TILE_SIZE;
        let tileY = Math.floor(this.viewY / TILE_SIZE) * TILE_SIZE;

        ctx.translate(tileX, tileY);
        {
            renderTile(ctx, this.tileId);

            ctx.strokeStyle = 'lime';
            ctx.strokeRect(0, 0, 10, 10);
        }
        ctx.translate(-tileX, -tileY);
    }
    finally
    {
        this.view.end(ctx);
    }
}
