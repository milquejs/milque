import { mat4, vec3, quat } from '../../node_modules/gl-matrix/esm/index.js';

import { Mouse, Keyboard } from '../../packages/input/src/index.js';
import { CanvasView } from './lib/CanvasView.js';
import { Camera2D } from './lib/camera/Camera2D.js';
import { TileMap, renderTileMap, CHUNK_DATA_LENGTH, CHUNK_SIZE, TILE_SIZE } from './lib/TileMap.js';
import { createIntersectionWorld } from './lib/intersection/IntersectionWorld.js';
import { createAABB, createRect } from './lib/intersection/IntersectionHelper.js';

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
}

export function start()
{
    this.tileMap = new TileMap();
    this.tileMap.chunksWithin([], -1, -1, 1, 1, true);

    setTimeout(() => {
        let statics = getStaticsForChunk(this.tileMap.chunkAt(0, 0));
        this.intersections.statics.push(...statics);
    }, 100);

    this.player = {
        x: 0,
        y: 0,
        aabb: createAABB(-10, -10, 4, 4),
    };

    this.intersections = createIntersectionWorld();
    this.intersections.dynamics.push(this.player.aabb);
}

export function update(dt)
{
    this.keyboard.poll();
    this.mouse.poll();

    const moveSpeed = 0.1;
    let dx = this.keyboard.ArrowRight.value - this.keyboard.ArrowLeft.value;
    let dy = this.keyboard.ArrowDown.value - this.keyboard.ArrowUp.value;

    this.player.aabb.dx = dx * moveSpeed;
    this.player.aabb.dy = dy * moveSpeed;

    this.camera.moveTo(this.player.x, this.player.y, 0, 0.05);

    const halfDisplayWidth = this.display.width / 2;
    const halfDisplayHeight = this.display.height / 2;

    this.tileMap.chunksWithin([],
        this.camera.x - halfDisplayWidth,
        this.camera.y - halfDisplayHeight,
        this.camera.x + halfDisplayWidth,
        this.camera.y + halfDisplayHeight, false);
    
    this.intersections.update(dt);

    this.player.x = Math.floor(this.player.aabb.x);
    this.player.y = Math.floor(this.player.aabb.y);
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

        this.intersections.render(ctx);
    }
    finally
    {
        this.view.end(ctx);
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(Math.floor(this.mouse.x * this.display.width), Math.floor(this.mouse.y * this.display.height), 10, 10);
}

function renderPlayer(ctx, player)
{
    ctx.fillStyle = 'red';
    ctx.fillRect(-4, -4, 8, 8);
}

function getStaticsForChunk(chunk)
{
    let statics = [];
    for(let i = 0; i < CHUNK_DATA_LENGTH; ++i)
    {
        if (chunk.getTile(i) === 0) {
            let tileX = chunk.x + (i % CHUNK_SIZE) * TILE_SIZE;
            let tileY = chunk.y + Math.floor(i / CHUNK_SIZE) * TILE_SIZE;
            statics.push(createRect(tileX, tileY, tileX + TILE_SIZE, tileY + TILE_SIZE));
        }
    }
    return statics;
}
