import { TextLoader, OBJLoader, ImageLoader } from '@milque/asset';
import { ProgramInfo } from '@milque/mogli';

import { createMesh } from './mesh.js';

export async function main() {
  const display = document.querySelector('#main');
  const input = document.querySelector('#input');
  input.source.autopoll = true;

  /*
    window.addEventListener('error', e => {
        const { message, filename, lineno, colno, error } = e;
        alert(`${filename}@${lineno}:${colno} ${message} - ${error}`);
    });
    */

  /** @type {WebGLRenderingContext} */
  const gl = display.canvas.getContext('webgl');
  if (!gl) throw new Error('Your browser does not support WebGL.');
  gl.enable(gl.DEPTH_TEST);

  const vertShaderSource = await TextLoader('test.vert');
  const fragShaderSource = await TextLoader('test.frag');
  const testObj = await OBJLoader('test.obj');
  const testImage = await ImageLoader('color.png');

  const program = ProgramInfo.from(gl)
    .shader(gl.VERTEX_SHADER, vertShaderSource)
    .shader(gl.FRAGMENT_SHADER, fragShaderSource)
    .link();

  const testMesh = createMesh(gl, testObj);

  const testTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, testTexture);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    testImage
  );
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  display.addEventListener('frame', ({ deltaTime }) => {
    const PointerX = input.context.getInputValue('PointerX');
    const PointerY = input.context.getInputValue('PointerY');
    const PointerDown = input.context.getInputValue('PointerDown');

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, testTexture);

    program
      .bind(gl)
      .attribute('a_position', testMesh.position.type, testMesh.position.handle)
      .attribute('a_texcoord', testMesh.texcoord.type, testMesh.texcoord.handle)
      .uniform('u_color', [1, 0, 0])
      .uniform('u_texture', 0)
      .draw(
        gl,
        gl.TRIANGLES,
        testMesh.elementOffset,
        testMesh.elementCount,
        testMesh.element.handle
      );
  });
}
