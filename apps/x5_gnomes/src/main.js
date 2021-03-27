import '@milque/display';
import '@milque/input';
import { OrthographicCamera } from '@milque/scene';
import { mat4 } from 'gl-matrix';

import { TexturedQuadRenderer } from './renderer/TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './renderer/ColoredQuadRenderer.js';
import * as WebGLTextureLoader from './WebGLTextureLoader.js';

window.addEventListener('error', error, true);
window.addEventListener('unhandledrejection', error, true);
function error(e)
{
    if (e instanceof PromiseRejectionEvent)
    {
        window.alert(e.reason.stack);
    }
    else if (e instanceof ErrorEvent)
    {
        window.alert(e.error.stack);
    }
    else
    {
        window.alert(JSON.stringify(e));
    }
}

window.addEventListener('DOMContentLoaded', main);
async function main()
{
    /** @type {import('@milque/display').DisplayPort}  */
    const display = document.querySelector('#display');
    /** @type {import('@milque/input').InputPort}  */
    const input = document.querySelector('#input');
    input.src = {
        MoveLeft: [ 'Keyboard:ArrowLeft', 'Keyboard:KeyA'],
        MoveRight: [ 'Keyboard:ArrowRight', 'Keyboard:KeyD' ],
        MoveUp: [ 'Keyboard:ArrowUp', 'Keyboard:KeyW' ],
        MoveDown: [ 'Keyboard:ArrowDown', 'Keyboard:KeyS' ],
    };

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');

    const world = {
        render: {
            display,
            frames: 0,
            gl,
        }
    };

    gl.clearColor(0, 0, 0, 0);

    let projectionViewMatrix = mat4.create();

    let texture = WebGLTextureLoader.load('color.png', { gl });
    let fontTexture = WebGLTextureLoader.load('webgl/font.png', { gl });

    let texturedRenderer = new TexturedQuadRenderer(gl);
    let coloredRenderer = new ColoredQuadRenderer(gl);
    let camera = new OrthographicCamera(0, 0, 10, 10, 0, 10);
    
    display.addEventListener('frame', e => {
        const { deltaTime } = e.detail;
        const dt = deltaTime / 60;

        world.render.frames += 1;
        let viewportWidth = gl.canvas.width;
        let viewportHeight = gl.canvas.height;
        gl.viewport(0, 0, viewportWidth, viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);

        camera.resize(viewportWidth, viewportHeight);
        mat4.multiply(projectionViewMatrix, camera.projectionMatrix, camera.viewMatrix);
        
        texturedRenderer.setProjectionViewMatrix(projectionViewMatrix);
        coloredRenderer.setProjectionViewMatrix(projectionViewMatrix);

        coloredRenderer
            .setColor(0, 1, 0)
            .draw(1, 2, 2, 3);
        coloredRenderer
            .setColor(1, 0, 0)
            .draw(4, 2, 2, 3);

        texturedRenderer
            .setTexture(texture, 16, 16)
            .setSprite(0, 0, 16, 16)
            .draw(0, 0, 1, 1);
        texturedRenderer
            .setTexture(fontTexture, 64, 40)
            .setSprite(0, 0, 8, 8)
            .draw(1, 0, 1, 1);
    });
}
