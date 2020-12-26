import '@milque/display';
import '@milque/input';
import { TextLoader, OBJLoader, ImageLoader } from '@milque/asset';
import { ProgramInfo, BufferInfo } from '@milque/mogli';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#input');
    input.source.autopoll = true;

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    if (!gl) throw new Error('Your browser does not support WebGL.');
    gl.enable(gl.DEPTH_TEST);

    const programInfo = ProgramInfo.from(gl)
        .shader(gl.VERTEX_SHADER, await TextLoader('test.vert'))
        .shader(gl.FRAGMENT_SHADER, await TextLoader('test.frag'))
        .link();

    const quadObj = await OBJLoader('quad.obj');
    const testObj = await OBJLoader('test.obj');
    const testMesh = createMesh(gl, testObj);

    const testImage = await ImageLoader('color.png');
    const testTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, testTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, testImage);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    display.addEventListener('frame', ({ deltaTime }) => {
        const PointerX = input.context.getInputValue('PointerX');
        const PointerY = input.context.getInputValue('PointerY');
        const PointerDown = input.context.getInputValue('PointerDown');

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, testTexture);

        programInfo.bind(gl)
            .attribute('a_position', testMesh.position.type, testMesh.position.handle)
            .uniform('u_color', [0.1, 0, 0])
            .uniform('u_texture', 0)
            .draw(gl, gl.TRIANGLES, testMesh.elementOffset, testMesh.elementCount, testMesh.element.handle);
    });
}

function createMesh(gl, obj)
{
    const positionBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(obj.positions)
        .build();
    const texcoordBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(obj.texcoords)
        .build();
    const normalBufferInfo = BufferInfo.from(gl, gl.ARRAY_BUFFER)
        .data(obj.normals)
        .build();
    const elementBufferInfo = BufferInfo.from(gl, gl.ELEMENT_ARRAY_BUFFER)
        .data(obj.indices)
        .build();
    const elementOffset = 0;
    const elementCount = obj.indices.length;
    return {
        position: positionBufferInfo,
        texcoord: texcoordBufferInfo,
        normal: normalBufferInfo,
        element: elementBufferInfo,
        elementOffset,
        elementCount,
    };
}
