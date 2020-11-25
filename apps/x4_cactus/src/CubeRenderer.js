import { createBufferSource } from './gl/GLHelper.js'

export class CubeRenderer
{
    constructor(gl, shaderProgram, cubeMeshData)
    {
        this.shaderProgram = shaderProgram;
        this.meshData = cubeMeshData;
        
        const positionBufferSource = createBufferSource(gl, gl.FLOAT, cubeMeshData.positions);
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positionBufferSource, gl.STATIC_DRAW);

        this.positions = {
            source: positionBufferSource,
            buffer: positionBuffer,
        };
        
        const texcoordBufferSource = createBufferSource(gl, gl.FLOAT, cubeMeshData.texcoords);
        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texcoordBufferSource, gl.STATIC_DRAW);

        this.texcoords = {
            source: texcoordBufferSource,
            buffer: texcoordBuffer,
        };
    
        const elementBufferSource = createBufferSource(gl, gl.UNSIGNED_SHORT, cubeMeshData.indices);
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
        const { positions, texcoords, elements } = renderer;
        ctx.attribute('a_position', positions.buffer, 3);
        ctx.attribute('a_texcoord', texcoords.buffer, 2);
        ctx.uniform('u_model', modelMatrix);
        if (color) ctx.uniform('u_color', color);
        ctx.draw(gl, gl.TRIANGLES, 0, elements.source.length, elements.buffer);
    }

    end(gl)
    {
        return this.renderer;
    }
}
