import { Mouse, Keyboard } from '../../packages/input/src/index.js';
import { mat3, mat4, vec3, quat } from '../../node_modules/gl-matrix/esm/index.js';
import { CanvasView } from './lib/CanvasView.js';
import { Camera2D } from './lib/Camera2D.js';

export async function load()
{
    this.keyboard = new Keyboard(document, [
        'ArrowUp'
    ]);
    this.mouse = new Mouse(this.display.canvas);

    this.camera = new Camera2D();
    this.view = new CanvasView();
}

export function start()
{
}

export function update(dt)
{
    this.keyboard.poll();
    this.mouse.poll();

    if (this.keyboard.ArrowUp.down)
    {
        console.log('WOOT');
    }
}

export function render(ctx)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.display.width, this.display.height);

    /*
    this.view.setViewMatrix(this.camera.getViewMatrix());
    this.view.setProjectionMatrix(this.camera.getProjectionMatrix());

    ctx.fillStyle = 'white';
    ctx.fillRect(Math.floor(this.mouse.x * this.display.width), Math.floor(this.mouse.y * this.display.height), 10, 10);

    this.view.begin(ctx);
    {
        ctx.fillRect(100, 100, 10, 10);
    }
    this.view.end(ctx);
    */
}
