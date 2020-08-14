import { AssetLoader, mat4, MathHelper } from './lib.js';
import * as GLUtils from './gl/index.js';
import { createPerspectiveCamera } from './PerspectiveCamera.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');

    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support webgl.');

    gl.enable(gl.DEPTH_TEST);

    // 1. Create the program.
    const vertexShaderSource = await AssetLoader.loadAsset('text:main.vert');
    const fragmentShaderSource = await AssetLoader.loadAsset('text:main.frag');
    const programInfo = GLUtils.createProgramInfo(gl)
        .shader(gl.VERTEX_SHADER, vertexShaderSource)
        .shader(gl.FRAGMENT_SHADER, fragmentShaderSource)
        .link(gl);

    // 2. Prepare the data.
    const camera = createPerspectiveCamera(gl.canvas);
    mat4.fromTranslation(camera.viewMatrix, [0, 0, -5]);

    const cubeGeometry = await AssetLoader.loadAsset('obj:cube.obj', {}, '../../res/webgl');
    const cubeBuffers = {
        positions: GLUtils.createArrayBuffer(gl, gl.FLOAT, cubeGeometry.positions),
        texcoords: GLUtils.createArrayBuffer(gl, gl.FLOAT, cubeGeometry.texcoords),
        normals: GLUtils.createArrayBuffer(gl, gl.FLOAT, cubeGeometry.normals),
        indices: GLUtils.createElementArrayBuffer(gl, cubeGeometry.indices),
    };
    const cubeTransform = mat4.fromRotation(mat4.create(), MathHelper.toRadians(90), [0, 1, 1]);

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // 3. Use the program.
        programInfo.bind(gl)
        // 4. Bind the data.
        .uniform('u_projection', camera.projectionMatrix)
        .uniform('u_view', camera.viewMatrix)
        .uniform('u_model', cubeTransform)
        .uniform('u_color', [0.5, 1, 0, 1])
        .attribute('a_position', cubeBuffers.positions.handle, 3)
        .attribute('a_texcoord', cubeBuffers.texcoords.handle, 2)
        .attribute('a_normal', cubeBuffers.normals.handle, 3)
        // 5. Draw it.
        .draw(gl, gl.TRIANGLES, 0, cubeBuffers.indices.length, cubeBuffers.indices.handle);
    });
}
