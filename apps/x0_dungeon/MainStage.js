import { CanvasView, Camera2D, IntersectionWorld, IntersectionHelper } from './lib.js';

import { TileMap, renderTileMap, Chunk, ChunkLoader, CHUNK_DATA_LENGTH, CHUNK_SIZE, TILE_SIZE } from './TileMap.js';
import { ShootPosX, ShootPosY } from './PlayerControls.js';

import * as Players from './Players.js';
import * as Bullets from './Bullets.js';

export async function load()
{
    this.camera = new Camera2D();
    this.view = new CanvasView();

    this.shootCooldown = 0;

    await Players.load(this);
    await Bullets.load(this);

    this.players = [];
    this.bullets = [];
}

export function start()
{
    this.tileMap = new TileMap(new ChunkLoader(this, IntersectionChunk));
    this.intersections = IntersectionWorld.createIntersectionWorld();

    this.player = Players.create(this, -10, 0);
    this.players.push(this.player);

    this.tileMap.chunksWithin([], -1, -1, 1, 1, true);
}

export function update(dt)
{
    Players.update(dt, this, this.players);
    Bullets.update(dt, this, this.bullets);

    this.camera.moveTo(this.player.x, this.player.y, 0, 0.05);

    const halfDisplayWidth = this.display.width / 2;
    const halfDisplayHeight = this.display.height / 2;

    this.tileMap.markActiveWithin(
        this.camera.x - halfDisplayWidth,
        this.camera.y - halfDisplayHeight,
        this.camera.x + halfDisplayWidth,
        this.camera.y + halfDisplayHeight);
    
    this.intersections.update(dt);

    Players.postUpdate(dt, this, this.players);
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

        Players.render(ctx, this, this.players);
        Bullets.render(ctx, this, this.bullets);

        // this.intersections.render(ctx);
        let pos = this.camera.screenToWorld(ShootPosX.value * this.display.width - this.display.width / 2, ShootPosY.value * this.display.height - this.display.height / 2);
        ctx.fillStyle = 'black';
        ctx.fillRect(Math.floor(pos[0]), Math.floor(pos[1]), 10, 10);
    }
    finally
    {
        this.view.end(ctx);
    }

    ctx.fillStyle = 'white';
    // ctx.fillRect(Math.floor(ShootPosX.value * this.display.width), Math.floor(ShootPosY.value * this.display.height), 10, 10);
}

class IntersectionChunk extends Chunk
{
    /** @override */
    static async loadChunkData(chunk)
    {
        super.loadChunkData(chunk);

        chunk.data.statics = getStaticsForChunk(chunk);
        chunk.data.staticsEnabled = false;
    }

    constructor(chunkId, chunkX, chunkY)
    {
        super(chunkId, chunkX, chunkY);
    }

    /** @override */
    onChunkLoaded(world)
    {
        world.intersections.statics.push(...this.data.statics);
    }

    /** @override */
    onChunkUnloaded(world)
    {
        for(let collider of this.data.statics)
        {
            let i = world.intersections.statics.indexOf(collider);
            world.intersections.statics.splice(i, 1);
        }
    }
}

function getStaticsForChunk(chunk)
{
    let statics = [];
    for(let i = 0; i < CHUNK_DATA_LENGTH; ++i)
    {
        if (chunk.getTile(i) === 0) {
            let tileX = chunk.x + (i % CHUNK_SIZE) * TILE_SIZE;
            let tileY = chunk.y + Math.floor(i / CHUNK_SIZE) * TILE_SIZE;
            statics.push(IntersectionHelper.createRect(tileX, tileY, tileX + TILE_SIZE, tileY + TILE_SIZE));
        }
    }
    return statics;
}
