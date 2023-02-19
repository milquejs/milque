import { AssetLoader, OBJLoader, toRadians } from './lib.js';
import { mat4 } from 'gl-matrix';

import * as GLUtils from './gl/index.js';
import { createPerspectiveCamera } from './PerspectiveCamera.js';
import { createCube } from './Geometry.js';

document.addEventListener('DOMContentLoaded', main);

async function main() {
  const display = document.querySelector('display-port');
  const input = document.querySelector('input-context');

  const gl = display.canvas.getContext('webgl');
  if (!gl) throw new Error('Your browser does not support webgl.');

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  // 1. Create the program.
  const vertexShaderSource = await AssetLoader.loadAsset('text:main.vert');
  const fragmentShaderSource = await AssetLoader.loadAsset('text:main.frag');
  const programInfo = GLUtils.createProgramInfo(gl)
    .shader(gl.VERTEX_SHADER, vertexShaderSource)
    .shader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    .link(gl);

  // 2. Prepare the data.
  const camera = createPerspectiveCamera(gl.canvas);
  mat4.fromTranslation(camera.viewMatrix, [0, 0, -20]);
  mat4.rotateX(camera.viewMatrix, camera.viewMatrix, Math.PI / 8);
  mat4.rotateY(camera.viewMatrix, camera.viewMatrix, Math.PI / 8);

  const quadGeometry = createCube(1, 1, 1);
  const quadModel = createModel(gl, quadGeometry);

  const roomModel = createModel(gl, createCube(10, 10, 10, false));

  const cubeGeometry = await AssetLoader.loadAsset('obj:webgl/cube.obj');
  const cubeModel = createModel(gl, cubeGeometry);
  mat4.fromRotation(cubeModel.transform, toRadians(90), [0, 1, 1]);

  const astroGeometry = await OBJLoader.loadOBJ('webgl/astro2.obj');
  const astroModel = createModel(gl, astroGeometry);
  mat4.fromRotation(astroModel.transform, toRadians(90), [0, 1, 1]);

  display.addEventListener('frame', (e) => {
    const dt = e.detail.deltaTime / 1000;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // mat4.rotate(quadModel.transform, quadModel.transform, 1 * dt, [1, 1, 1]);
    mat4.rotate(cubeModel.transform, cubeModel.transform, 1 * dt, [1, 1, 1]);
    mat4.rotate(astroModel.transform, astroModel.transform, 1 * dt, [1, 1, 1]);

    drawModel(gl, programInfo, camera, roomModel, [0.5, 1, 0, 1]);
    drawModel(gl, programInfo, camera, quadModel, [0.5, 1, 0, 1]);
    drawModel(
      gl,
      programInfo,
      camera,
      cubeModel,
      [0, 1, 0.5, 1],
      mat4.translate(mat4.create(), cubeModel.transform, [0, 4, 0])
    );
    drawModel(
      gl,
      programInfo,
      camera,
      astroModel,
      [0, 0.5, 1, 1],
      mat4.translate(mat4.create(), astroModel.transform, [0, -4, 0])
    );
  });
}

function drawModel(
  gl,
  programInfo,
  camera,
  model,
  color,
  transform = model.transform
) {
  // 3. Use the program.
  programInfo
    .bind(gl)
    // 4. Bind the data.
    .uniform('u_projection', camera.projectionMatrix)
    .uniform('u_view', camera.viewMatrix)
    .uniform('u_model', transform)
    .uniform('u_color', color)
    .attribute('a_position', model.buffers.positions.handle, 3)
    .attribute('a_texcoord', model.buffers.texcoords.handle, 2)
    .attribute('a_normal', model.buffers.normals.handle, 3)
    // 5. Draw it.
    .draw(
      gl,
      gl.TRIANGLES,
      0,
      model.buffers.indices.length,
      model.buffers.indices.handle
    );
}

function createModel(gl, geometry) {
  return {
    buffers: createBuffersFromGeometry(gl, geometry),
    transform: mat4.create(),
  };
}

function createBuffersFromGeometry(gl, geometry) {
  return {
    positions: GLUtils.createArrayBuffer(gl, gl.FLOAT, geometry.positions),
    texcoords: GLUtils.createArrayBuffer(gl, gl.FLOAT, geometry.texcoords),
    normals: GLUtils.createArrayBuffer(gl, gl.FLOAT, geometry.normals),
    indices: GLUtils.createElementArrayBuffer(gl, geometry.indices),
  };
}
