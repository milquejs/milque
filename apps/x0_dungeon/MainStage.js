import { Mouse, Keyboard, CanvasView, Camera2D, IntersectionWorld, IntersectionHelper } from './lib.js';

import { TileMap, renderTileMap, Chunk, CHUNK_DATA_LENGTH, CHUNK_SIZE, TILE_SIZE } from './TileMap.js';

export async function load()
{
    this.keyboard = new Keyboard(document, [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
    ]);
    this.mouse = new Mouse(this.display.canvas);

    this.camera = new Camera2D();
    this.view = new CanvasView();

    this.shootCooldown = 0;
    this.maxShootCooldown = 10;
    this.bullets = [];
}

export function start()
{
    this.tileMap = new TileMap(this, IntersectionChunk);

    this.player = {
        x: 0,
        y: 0,
        aabb: IntersectionHelper.createAABB(-10, 0, 4, 4),
    };

    this.intersections = IntersectionWorld.createIntersectionWorld();
    this.intersections.dynamics.push(this.player.aabb);

    this.tileMap.chunksWithin([], -1, -1, 1, 1, true);
}

export function update(dt)
{
    this.keyboard.poll();
    this.mouse.poll();

    if (this.shootCooldown <= 0)
    {
        if (this.mouse.left.value)
        {
            let pos = this.camera.screenToWorld(
                this.mouse.x * this.display.width - this.display.width / 2,
                this.mouse.y * this.display.height - this.display.height / 2);

            let bulletSpeed = 0.1;
            let dx = pos[0] - this.player.x;
            let dy = pos[1] - this.player.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let bullet = createBullet(this.player.x, this.player.y, (dx / dist) * bulletSpeed, (dy / dist) * bulletSpeed, 100);
            this.bullets.push(bullet);

            this.shootCooldown = this.maxShootCooldown;
        }
    }
    else
    {
        --this.shootCooldown;
    }

    updateBullets(dt, this.bullets);

    const moveSpeed = 0.1;
    let dx = this.keyboard.ArrowRight.value - this.keyboard.ArrowLeft.value;
    let dy = this.keyboard.ArrowDown.value - this.keyboard.ArrowUp.value;

    this.player.aabb.dx = dx * moveSpeed;
    this.player.aabb.dy = dy * moveSpeed;

    this.camera.moveTo(this.player.x, this.player.y, 0, 0.05);

    const halfDisplayWidth = this.display.width / 2;
    const halfDisplayHeight = this.display.height / 2;

    this.tileMap.markActiveWithin(
        this.camera.x - halfDisplayWidth,
        this.camera.y - halfDisplayHeight,
        this.camera.x + halfDisplayWidth,
        this.camera.y + halfDisplayHeight);
    
    this.intersections.update(dt);

    this.player.x = Math.round(this.player.aabb.x);
    this.player.y = Math.round(this.player.aabb.y);
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

        ctx.translate(this.player.x, this.player.y);
        renderPlayer(ctx, this.player);
        ctx.translate(-this.player.x, -this.player.y);

        for(let bullet of this.bullets)
        {
            ctx.translate(bullet.x, bullet.y);
            renderBullet(ctx, bullet);
            ctx.translate(-bullet.x, -bullet.y);
        }

        // this.intersections.render(ctx);
        let pos = this.camera.screenToWorld(this.mouse.x * this.display.width - this.display.width / 2, this.mouse.y * this.display.height - this.display.height / 2);
        ctx.fillStyle = 'black';
        ctx.fillRect(Math.floor(pos[0]), Math.floor(pos[1]), 10, 10);
    }
    finally
    {
        this.view.end(ctx);
    }

    ctx.fillStyle = 'white';
    // ctx.fillRect(Math.floor(this.mouse.x * this.display.width), Math.floor(this.mouse.y * this.display.height), 10, 10);
}

function renderPlayer(ctx, player)
{
    ctx.fillStyle = 'red';
    ctx.fillRect(-4, -4, 8, 8);
}

function updateBullets(dt, bullets)
{
    for(let bullet of bullets)
    {
        updateBullet(dt, bullet);

        if (bullet.age <= 0)
        {
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }
}

function updateBullet(dt, bullet)
{
    bullet.x += bullet.dx * dt;
    bullet.y += bullet.dy * dt;
    --bullet.age;
}

function renderBullet(ctx, bullet)
{
    ctx.fillStyle = 'gold';
    ctx.fillRect(-2, -2, 4, 4);
}

function createBullet(x, y, dx, dy, age = 100)
{
    return {
        x, y, dx, dy, age
    };
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
