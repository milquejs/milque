import { mat4, vec3, quat } from '../../node_modules/gl-matrix/esm/index.js';

import { Mouse, Keyboard } from '../../packages/input/src/index.js';
import { CanvasView } from './lib/CanvasView.js';
import { Camera2D } from './lib/Camera2D.js';
import { TileMap, renderTileMap, TILE_SIZE, CHUNK_SIZE } from './lib/TileMap.js';

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

    // this.tileMap.chunksWithin([], -1, -1, 1, 1);
    this.tileMap.chunkAt(0, 0);

    this.player = {
        x: 0,
        y: 0,
    };
}

export function update(dt)
{
    this.keyboard.poll();
    this.mouse.poll();

    const moveSpeed = 3;
    let dy = this.keyboard.ArrowDown.value - this.keyboard.ArrowUp.value;
    let dx = this.keyboard.ArrowRight.value - this.keyboard.ArrowLeft.value;

    this.player.x += dx * moveSpeed;
    this.player.y += dy * moveSpeed;

    this.camera.moveTo(this.player.x, this.player.y, 0, 0.05);

    const halfDisplayWidth = this.display.width / 2;
    const halfDisplayHeight = this.display.height / 2;

    this.tileMap.chunksWithin([],
        this.camera.x - halfDisplayWidth,
        this.camera.y - halfDisplayHeight,
        this.camera.x + halfDisplayWidth,
        this.camera.y + halfDisplayHeight);
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
