import '@milque/display';
import '@milque/input';
import { OrthographicCamera } from '@milque/scene';
import { mat4, vec3 } from 'gl-matrix';

import { TexturedQuadRenderer } from './TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './ColoredQuadRenderer.js';

window.addEventListener('DOMContentLoaded', main);
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
    let colorVector = vec3.fromValues(0, 1, 0);

    let texture = loadTexture(gl, 'color.png');
    let fontTexture = loadTexture(gl, 'font.png');

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

/**
 * @param {WebGLRenderingContextBase} gl 
 * @param {string} url 
 */
function loadTexture(gl, url)
{
    let handle = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, handle);
    const level = 0;

    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(
        gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);
    
    let image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, handle);
        gl.texImage2D(
            gl.TEXTURE_2D, level, internalFormat,
            srcFormat, srcType, image);
        
        if (isPowerOf2(image.width) && isPowerOf2(image.height))
        {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        }
    };
    image.src = url;

    return handle;
}

function isPowerOf2(value)
{
    return (value & (value - 1)) == 0;
}
