const { vec3, mat4, quat, mat3 } = glMatrix;

export const DEFAULT_VERTEX_SHADER_SOURCE = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
in vec3 a_normal;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat3 u_normal;
uniform mat4 u_camera;

out vec2 v_texcoord;
out vec3 v_normal;
out vec4 v_color;

void main() {
    gl_Position = u_projection * u_view * u_model * a_position;

    v_texcoord = a_texcoord;
    v_normal = u_normal * a_normal;
    v_color = a_color;
}
`;

export const DEFAULT_FRAGMENT_SHADER_SOURCE = `#version 300 es
precision mediump float;

in vec2 v_texcoord;
in vec3 v_normal;
in vec4 v_color;

uniform vec4 u_color;
uniform sampler2D u_texture;

out vec4 fragColor;

void main()
{
    vec3 LIGHT_DIRECTION = vec3(1, 1.5, 2);

    // Since it is varying, it is interpolated, so we must change it back to a unit vector.
    vec3 normal = normalize(v_normal);

    vec4 texColor = texture(u_texture, v_texcoord);
    if (texColor.a < 0.1) discard;

    float ambient = 0.1;
    float light = dot(normal, LIGHT_DIRECTION);
    vec3 diffuse = mix(u_color.rgb, v_color.rgb * light, 0.5);
    // fragColor = max(vec4(ambient, ambient, ambient, ambient), vec4(diffuse, 1));
    fragColor = max(vec4(ambient), mix(vec4(diffuse, 1), texColor, 0.8));
}
`;

export const DEFAULT_SHARED_ATTRIBUTE_LAYOUT = [
    'a_position',
    'a_texcoord',
    'a_normal',
    'a_color',
];

export function init(gl)
{
    const context = {};
    context.shaderProgram = Mogli.createShaderProgramInfo(gl, DEFAULT_VERTEX_SHADER_SOURCE, DEFAULT_FRAGMENT_SHADER_SOURCE, DEFAULT_SHARED_ATTRIBUTE_LAYOUT);
    context.camera = createPerspectiveCamera();
    
    context.sharedUniforms = {
        get u_projection() { return context.camera.projectionMatrix; },
        get u_view() { return context.camera.viewMatrix; },
        get u_camera() { return context.camera.transformMatrix; },
    };
    return context;
}

export function draw(gl, context, drawInfos = [])
{
    resize(gl);

    gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);

    // FRONT-FACE = Counter-clockwise
    // BACK-FACE = Clockwise
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    context.camera.update(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
    Mogli.draw(gl, drawInfos, context.sharedUniforms);
}

export function resize(gl)
{
    const width = gl.canvas.clientWidth;
    const height = gl.canvas.clientHeight;
    if (width !== gl.canvas.width || height !== gl.canvas.height)
    {
        gl.canvas.width = width;
        gl.canvas.height = height;
        return true;
    }
    return false;
}

export function createPerspectiveCamera(fovy = 1, near = 0.01, far = 1000)
{
    return {
        transform: Mogli.Transform.create(),
        transformMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        projectionMatrix: mat4.create(),
        update(gl, displayWidth, displayHeight)
        {
            mat4.perspective(this.projectionMatrix, fovy, displayWidth / displayHeight, near, far);
            Mogli.Transform.getTransformationMatrix(this.transform, this.transformMatrix);
            mat4.invert(this.viewMatrix, this.transformMatrix);
        },
        lookAt(target)
        {
            Mogli.Transform.lookAt(this.transform, target);
        }
    };
}

export function createOrthographicCamera(offsetX = 0, offsetY = 0, near = 1, far = -1)
{
    return {
        transform: Mogli.Transform.create(),
        transformMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        projectionMatrix: mat4.create(),
        update(gl, displayWidth, displayHeight)
        {
            const halfWidth = displayWidth / 2;
            const halfHeight = displayHeight / 2;
            // This maintains the OpenGL coordinate system. Therefore, -Y is DOWN and +Y is UP.
            mat4.ortho(this.projectionMatrix, offsetX - halfWidth, offsetX + halfWidth, offsetY - halfHeight, offsetY + halfHeight, near, far);
            Mogli.Transform.getTransformationMatrix(this.transform, this.transformMatrix);
            mat4.invert(this.viewMatrix, this.transformMatrix);
        },
        lookAt(target)
        {
            Mogli.Transform.lookAt(this.transform, target);
        }
    };
}

export function createMesh(gl, geometry, sharedAttributeLayout)
{
    const vertexArray = Mogli.createVertexArrayInfo(gl, sharedAttributeLayout);

    const positionBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.position, 3);
    const texcoordBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.texcoord, 2);
    const normalBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.normal, 3);
    const colorBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.color, 3);
    const indicesBuffer = Mogli.createElementBufferInfo(gl, gl.UNSIGNED_SHORT, geometry.indices);

    gl.bindVertexArray(vertexArray.handle);
    vertexArray.sharedAttribute('a_position', positionBuffer);
    vertexArray.sharedAttribute('a_texcoord', texcoordBuffer);
    vertexArray.sharedAttribute('a_normal', normalBuffer);
    vertexArray.sharedAttribute('a_color', colorBuffer);
    vertexArray.elementAttribute(indicesBuffer);
    gl.bindVertexArray(null);

    return {
        vertexArray
    };
}

export function createModel(program, mesh, color = [0.2, 1, 0.2, 1])
{
    const model = {
        mesh,
        transform: Mogli.Transform.create(),
        transformMatrix: mat4.create(),
        normalMatrix: mat3.create(),
        drawInfo: null,
        update()
        {
            Mogli.Transform.getTransformationMatrix(this.transform, this.transformMatrix);
            mat3.normalFromMat4(this.normalMatrix, this.transformMatrix);
        }
    };
    model.drawInfo = Mogli.createDrawInfo(program, mesh.vertexArray, {
        u_model: model.transformMatrix,
        u_normal: model.normalMatrix,
        u_color: color
    });
    return model;
}

export function createModelGeometry(gl, program, geometry, color = [0.2, 1, 0.2, 1])
{
    return createModel(program, createMesh(gl, geometry, DEFAULT_SHARED_ATTRIBUTE_LAYOUT, color));
}

export function createTexture(gl, url)
{
    const texture = Mogli.createTextureInfo(gl);
    loadEmptyImage(gl, texture);
    loadImage(url).then(image => {
        gl.bindTexture(gl.TEXTURE_2D, texture.handle);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    });
    return texture;
}

export function loadImage(url)
{
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.addEventListener('error', (e) => {
            reject(e);
        });
    });
}

export function loadEmptyImage(gl, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture.handle);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
}
