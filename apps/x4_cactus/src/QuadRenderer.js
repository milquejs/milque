import { createBufferSource } from './gl/GLHelper.js';

export class QuadRenderer
{
    constructor(gl, shaderProgram, quadMeshData)
    {
        this.shaderProgram = shaderProgram;
        this.meshData = quadMeshData;

        let meshData = quadMeshData;
        const positionBufferSource = createBufferSource(gl, gl.FLOAT, meshData.positions);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionBufferSource, gl.STATIC_DRAW);

        this.positions = {
            source: positionBufferSource,
            buffer: positionBuffer,
        };

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

        this._drawContext = new QuadRendererDrawContext(this);
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

export class QuadRendererDrawContext
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
        ctx.attribute('a_position', positions.buffer, 3);
        ctx.attribute('a_texcoord', texcoords.buffer, 2);
        ctx.attribute('a_normal', normals.buffer, 3);
        ctx.uniform('u_model', modelMatrix);
        if (color) ctx.uniform('u_color', color);
        ctx.draw(gl, gl.TRIANGLES, 0, elements.source.length, elements.buffer);
    }

    end(gl)
    {
        return this.renderer;
    }
}
