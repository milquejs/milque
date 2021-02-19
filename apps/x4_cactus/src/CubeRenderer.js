import { createBufferSource } from '@milque/mogli';

export class CubeRenderer
{
    constructor(gl, shaderProgram, cubeMeshData)
    {
        this.shaderProgram = shaderProgram;
        this.meshData = cubeMeshData;

        let meshData = cubeMeshData;
        {
            const bufferSource = createBufferSource(gl, gl.FLOAT, meshData.positions);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferSource, gl.STATIC_DRAW);
    
            this.positions = {
                source: bufferSource,
                buffer: buffer,
            };
        }

        {
            const bufferSource = createBufferSource(gl, gl.FLOAT, meshData.texcoords);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferSource, gl.STATIC_DRAW);
    
            this.texcoords = {
                source: bufferSource,
                buffer: buffer,
            };
        }

        {
            const bufferSource = createBufferSource(gl, gl.FLOAT, meshData.normals);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferSource, gl.STATIC_DRAW);
    
            this.normals = {
                source: bufferSource,
                buffer: buffer,
            };
        }
    
        const elementBufferSource = createBufferSource(gl, gl.UNSIGNED_SHORT, meshData.indices);
        const elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementBufferSource, gl.STATIC_DRAW);

        this.elements = {
            source: elementBufferSource,
            buffer: elementBuffer,
        };

        this._drawContext = new CubeRendererDrawContext(this);
    }

    begin(gl, projectionMatrix, viewMatrix)
    {
        let ctx = this.shaderProgram.bind(gl);
        ctx.uniform('u_projection', projectionMatrix);
        ctx.uniform('u_view', viewMatrix);
        this._drawContext.setProgramContext(ctx);
        return this._drawContext;
    }
}

export class CubeRendererDrawContext
{
    constructor(renderer)
    {
        this.renderer = renderer;
        this.ctx = null;
    }

    setProgramContext(ctx)
    {
        this.ctx = ctx;
        return this;
    }

    render(gl, modelMatrix, color = undefined)
    {
        const { ctx, renderer } = this;
        const { positions, texcoords, normals, elements } = renderer;
        ctx.attribute('a_position', gl.FLOAT, positions.buffer, 3);
        ctx.attribute('a_texcoord', gl.FLOAT, texcoords.buffer, 2);
        ctx.attribute('a_normal', gl.FLOAT, normals.buffer, 3);
        ctx.uniform('u_model', modelMatrix);
        if (color) ctx.uniform('u_color', color);
        ctx.draw(gl, gl.TRIANGLES, 0, elements.source.length, elements.buffer);
    }

    end(gl)
    {
        return this.renderer;
    }
}
