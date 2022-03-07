// https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

import { AssetLoader } from './lib.js';

document.addEventListener('DOMContentLoaded', main);

async function main() {
  const display = document.querySelector('display-port');
  const input = document.querySelector('input-context');

  const CursorX = input.getInput('cursorX');
  const CursorY = input.getInput('cursorY');

  const gl = display.canvas.getContext('webgl');
  if (!gl) {
    throw new Error('Your browser does not support webgl.');
  }

  const vertexShaderSource = await AssetLoader.loadAsset('text:main.vert');
  const fragmentShaderSource = await AssetLoader.loadAsset('text:main.frag');
  const shaderProgram = Program(gl)
    .shader(gl.VERTEX_SHADER, vertexShaderSource)
    .shader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    .link();
  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    'a_position'
  );
  const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'u_color');

  const positions = [0, 0, 0, 0.5, 0.5, 0];
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  display.addEventListener('frame', (e) => {
    const dt = (e.detail.deltaTime / 1000) * 60;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(shaderProgram);
    {
      gl.uniform4f(
        colorUniformLocation,
        1 * CursorX.value,
        1 * CursorY.value,
        0.5,
        1
      );
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      {
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
          positionAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  });
}

function createShader(gl, type, shaderSource) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  let status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (status) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createShaderProgram(gl, program, shaders) {
  // Attach to the program.
  for (let shader of shaders) {
    gl.attachShader(program, shader);
  }

  // Link'em!
  gl.linkProgram(program);

  // Don't forget to clean up the shaders! It's no longer needed.
  for (let shader of shaders) {
    gl.detachShader(program, shader);
    gl.deleteShader(shader);
  }

  let status = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (status) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function Program(gl) {
  let program = gl.createProgram();
  let shaders = [];

  return {
    shader(type, shaderSource) {
      let shader = createShader(gl, type, shaderSource);
      shaders.push(shader);
      return this;
    },
    link() {
      createShaderProgram(gl, program, shaders);
      shaders.length = 0;
      return program;
    },
  };
}
