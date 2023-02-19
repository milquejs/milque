import { AssetLoader } from './lib.js';
import { mat4, vec3 } from 'gl-matrix';

import * as GLHelper from './GLHelper.js';
import { createProgramInfo } from './ProgramInfo.js';

document.addEventListener('DOMContentLoaded', main);

async function main() {
  const display = document.querySelector('display-port');

  const gl = display.canvas.getContext('webgl');
  if (!gl) throw new Error('Your browser does not support webgl.');

  gl.enable(gl.DEPTH_TEST);

  // 1. Create the program.
  const vertexShaderSource = await AssetLoader.loadAsset('text:main.vert');
  const fragmentShaderSource = await AssetLoader.loadAsset('text:main.frag');
  const programInfo = createProgramInfo(gl)
    .shader(gl.VERTEX_SHADER, vertexShaderSource)
    .shader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    .link(gl);

  // 2. Prepare the data.
  const cubeGeometryData = await AssetLoader.loadAsset('obj:webgl/cube.obj');
  const positionBuffer = GLHelper.createArrayBuffer(
    gl,
    gl.FLOAT,
    gl.STATIC_DRAW,
    cubeGeometryData.positions
  );
  const texcoordBuffer = GLHelper.createArrayBuffer(
    gl,
    gl.FLOAT,
    gl.STATIC_DRAW,
    cubeGeometryData.texcoords
  );
  const normalBuffer = GLHelper.createArrayBuffer(
    gl,
    gl.FLOAT,
    gl.STATIC_DRAW,
    cubeGeometryData.normals
  );
  const indexBuffer = GLHelper.createElementArrayBuffer(
    gl,
    gl.UNSIGNED_SHORT,
    gl.STATIC_DRAW,
    cubeGeometryData.indices
  );

  const projectionMatrix = mat4.perspective(
    mat4.create(),
    (Math.PI * 40) / 180,
    gl.canvas.width / gl.canvas.height,
    0.1,
    1000
  );
  const viewMatrix = mat4.fromTranslation(
    mat4.create(),
    vec3.fromValues(0, 0, -5)
  );
  const modelMatrix = mat4.fromRotation(
    mat4.create(),
    Math.PI / 2,
    vec3.fromValues(0, 1, 1)
  );

  // Draw it.
  display.addEventListener('frame', (e) => {
    const dt = (e.detail.deltaTime / 1000) * 60;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    clear(gl);

    // 3. Use the program.
    programInfo
      .bind(gl)
      .uniform('u_projection', projectionMatrix)
      .uniform('u_view', viewMatrix)
      .uniform('u_model', modelMatrix)
      .uniform('u_color', [1, 0, 0.5, 1])
      .attribute('a_position', positionBuffer.handle, 3)
      .attribute('a_texcoord', texcoordBuffer.handle, 2)
      .attribute('a_normal', normalBuffer.handle, 3)
      .draw(gl, 0, indexBuffer.length, indexBuffer);
  });
}

function clear(gl) {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
