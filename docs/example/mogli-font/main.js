const { vec3, mat4, quat, mat3 } = glMatrix;
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if (!gl) throw new Error('Your browser does not support WebGL.');

const VERTEX_SHADER_SOURCE = `#version 300 es
in vec4 a_position;
in vec3 a_normal;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;
uniform mat3 u_normal;

uniform vec3 u_viewWorldPosition;
uniform vec3 u_lightWorldPosition;

out vec4 v_color;
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
    gl_Position = u_projection * u_view * u_model * a_position;

    v_normal = u_normal * a_normal;

    vec3 surfaceWorldPosition = (u_model * a_position).xyz;
    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
    
    v_color = a_color;
}
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision mediump float;

in vec4 v_color;
in vec3 v_normal;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;
uniform vec3 u_lightDirection;
uniform float u_innerLimit;
uniform float u_outerLimit;

out vec4 fragColor;

void main()
{
    // Since it is varying, it is interpolated, so we must change it back to a unit vector.
    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
    
    float dotFromDirection = dot(surfaceToLightDirection, -u_lightDirection);
    float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection);
    float light = inLight * dot(normal, surfaceToLightDirection);
    float specular = inLight * pow(dot(normal, halfVector), u_shininess);

    fragColor = v_color;
    fragColor.rgb *= light * u_lightColor;
    fragColor.rgb += specular * u_specularColor;
}
`;

const TEXT_VERTEX_SHADER_SOURCE = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_model;

out vec2 v_texcoord;

void main()
{
    gl_Position = u_projection * u_view * u_model * a_position;

    v_texcoord = a_texcoord;
}
`;

const TEXT_FRAGMENT_SHADER_SOURCE = `#version 300 es
precision mediump float;

in vec2 v_texcoord;

uniform sampler2D u_texture;

out vec4 fragColor;

void main()
{
    fragColor = texture(u_texture, v_texcoord);
}
`;

function loadImage(url)
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

function loadEmptyTexture(gl, texture)
{
    gl.bindTexture(gl.TEXTURE_2D, texture.handle);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
}

const fontInfo = {
    charHeight: 8,
    spaceWidth: 8,
    textureWidth: 64,
    textureHeight: 40,
    glyphs: {
        'a': { x:  0, y:  0, width: 8, },
        'b': { x:  8, y:  0, width: 8, },
        'c': { x: 16, y:  0, width: 8, },
        'd': { x: 24, y:  0, width: 8, },
        'e': { x: 32, y:  0, width: 8, },
        'f': { x: 40, y:  0, width: 8, },
        'g': { x: 48, y:  0, width: 8, },
        'h': { x: 56, y:  0, width: 8, },
        'i': { x:  0, y:  8, width: 8, },
        'j': { x:  8, y:  8, width: 8, },
        'k': { x: 16, y:  8, width: 8, },
        'l': { x: 24, y:  8, width: 8, },
        'm': { x: 32, y:  8, width: 8, },
        'n': { x: 40, y:  8, width: 8, },
        'o': { x: 48, y:  8, width: 8, },
        'p': { x: 56, y:  8, width: 8, },
        'q': { x:  0, y: 16, width: 8, },
        'r': { x:  8, y: 16, width: 8, },
        's': { x: 16, y: 16, width: 8, },
        't': { x: 24, y: 16, width: 8, },
        'u': { x: 32, y: 16, width: 8, },
        'v': { x: 40, y: 16, width: 8, },
        'w': { x: 48, y: 16, width: 8, },
        'x': { x: 56, y: 16, width: 8, },
        'y': { x:  0, y: 24, width: 8, },
        'z': { x:  8, y: 24, width: 8, },
        '0': { x: 16, y: 24, width: 8, },
        '1': { x: 24, y: 24, width: 8, },
        '2': { x: 32, y: 24, width: 8, },
        '3': { x: 40, y: 24, width: 8, },
        '4': { x: 48, y: 24, width: 8, },
        '5': { x: 56, y: 24, width: 8, },
        '6': { x:  0, y: 32, width: 8, },
        '7': { x:  8, y: 32, width: 8, },
        '8': { x: 16, y: 32, width: 8, },
        '9': { x: 24, y: 32, width: 8, },
        '-': { x: 32, y: 32, width: 8, },
        '*': { x: 40, y: 32, width: 8, },
        '!': { x: 48, y: 32, width: 8, },
        '?': { x: 56, y: 32, width: 8, },
    }
};

function createGlyphVertices(fontInfo, glyphInfo, offsetX, offsetY, dst)
{
    const x = offsetX;
    const y = offsetY;

    const u = glyphInfo.x / fontInfo.textureWidth;
    const v = glyphInfo.y / fontInfo.textureHeight;
    const w = glyphInfo.width / fontInfo.textureWidth;
    const h = fontInfo.charHeight / fontInfo.textureHeight;

    dst.position.push(
        x, y,
        x, y + 1,
        x + 1, y + 1,
        x + 1, y,
        x, y,
        x + 1, y + 1,
    );
    dst.texcoord.push(
        u, v,
        u, v + h,
        u + w, v + h,
        u + w, v,
        u, v,
        u + w, v + h,
    );
    dst.vertexCount += 6;

    return dst;
}

function createGlyphVerticesFromString(fontInfo, string)
{
    let offsetX = 0;
    let offsetY = 0;

    const dst = {
        position: [],
        texcoord: [],
        vertexCount: 0
    };

    for(let i = 0; i < string.length; ++i)
    {
        const glyphInfo = fontInfo.glyphs[string[i]];
        if (glyphInfo)
        {
            createGlyphVertices(fontInfo, glyphInfo, offsetX, offsetY, dst);
            offsetX += 1;
        }
        else
        {
            offsetX += fontInfo.spaceWidth;
        }
    }

    return dst;
}

const drawInfos = [];
var drawTime = 0;

var transform;
var textVertexArray;

function init()
{
    const sharedAttributeLayout = [
        'a_position',
        'a_texcoord',
        'a_normal',
        'a_color',
    ];

    const program = Mogli.createShaderProgramInfo(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE, sharedAttributeLayout);
    const textProgram = Mogli.createShaderProgramInfo(gl, TEXT_VERTEX_SHADER_SOURCE, TEXT_FRAGMENT_SHADER_SOURCE, sharedAttributeLayout);

    const vertexArrayF = Mogli.createVertexArrayInfo(gl, sharedAttributeLayout);
    {
        const geometry = Mogli.Geometry.GlyphF.create();
        const positionBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.position, 3);
        const normalBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.normal, 3);
        const colorBuffer = Mogli.createBufferInfo(gl, gl.FLOAT, geometry.color, 3);
        const indicesBuffer = Mogli.createElementBufferInfo(gl, gl.UNSIGNED_BYTE, geometry.indices);

        gl.bindVertexArray(vertexArrayF.handle);
        vertexArrayF.sharedAttribute('a_position', positionBuffer);
        vertexArrayF.sharedAttribute('a_normal', normalBuffer);
        vertexArrayF.sharedAttribute('a_color', colorBuffer);
        vertexArrayF.elementAttribute(indicesBuffer);
        gl.bindVertexArray(null);
    }
    
    textVertexArray = Mogli.createVertexArrayInfo(gl, sharedAttributeLayout);
    {
        gl.bindVertexArray(textVertexArray.handle);
        const vertices = createGlyphVerticesFromString(fontInfo, "hello");
        const textPosition = Mogli.createBufferInfo(gl, gl.FLOAT, vertices.position, 2);
        const textTexcoord = Mogli.createBufferInfo(gl, gl.FLOAT, vertices.texcoord, 2);
        textVertexArray.sharedAttribute('a_position', textPosition);
        textVertexArray.sharedAttribute('a_texcoord', textTexcoord);
        textVertexArray.setElementCount(vertices.vertexCount);
        gl.bindVertexArray(null);
    }

    const fontTexture = Mogli.createTextureInfo(gl);
    {
        loadEmptyTexture(gl, fontTexture);
        loadImage('./font.png').then((image) => {
            gl.bindTexture(gl.TEXTURE_2D, fontTexture.handle);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        });
    }

    const projection = mat4.perspective(mat4.create(), 1, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    const camera = mat4.targetTo(mat4.create(), [1, 1.5, 2], [0, 0, 0], [0, 1, 0]);
    const view = mat4.invert(mat4.create(), camera);

    transform = Mogli.Transform.create();
    const drawInfo = Mogli.createDrawInfo(program, vertexArrayF, {
        u_projection: projection,
        u_view: view,
        get u_model()
        {
            if (!this.__u_model) this.__u_model = mat4.create();
            Mogli.Transform.getTransformationMatrix(transform, this.__u_model);
            return this.__u_model;
        },
        get u_normal()
        {
            if (!this.__u_normal) this.__u_normal = mat3.create();
            if (!this.__u_model) this.__u_model = mat4.create();
            return mat3.normalFromMat4(this.__u_normal, this.__u_model);
        },
        u_color: [0.2, 1, 0.2, 1],
        u_lightWorldPosition: [0.4, 0.6, 1.2],
        u_viewWorldPosition: [1, 1.5, 2],
        u_shininess: 150,
        u_lightColor: [1, 1, 1],
        u_specularColor: [1, 1, 1],
        u_lightDirection: vec3.create(),
        u_innerLimit: Math.cos(0.002),
        u_outerLimit: 1 //Math.cos(0.35),
    });
    drawInfos.push(drawInfo);

    const textTransform = Mogli.Transform.create();
    const textDrawInfo = Mogli.createDrawInfo(textProgram, textVertexArray, {
        u_projection: projection,
        u_view: view,
        u_model: Mogli.Transform.getTransformationMatrix(textTransform),
        u_texture: fontTexture.handle,
    });
    drawInfos.push(textDrawInfo);

    const lightPosition = drawInfo.uniforms.u_lightWorldPosition;
    const lightDirection = drawInfo.uniforms.u_lightDirection;
    const lightMat = mat4.targetTo(mat4.create(), lightPosition, transform.translation, [0, 1, 0]);
    lightDirection[0] = -lightMat[8];
    lightDirection[1] = -lightMat[9];
    lightDirection[2] = -lightMat[10];

    {
        const vertices = createGlyphVerticesFromString(fontInfo, 'boo');
        const positionBuffer = textVertexArray.attributeBuffers.a_position;
        const texcoordBuffer = textVertexArray.attributeBuffers.a_texcoord;
        positionBuffer.updateData(gl, vertices.position, 0, gl.DYNAMIC_DRAW);
        texcoordBuffer.updateData(gl, vertices.texcoord, 0, gl.DYNAMIC_DRAW);
        textVertexArray.setElementCount(vertices.vertexCount);
    }

    drawTime = performance.now();
    requestAnimationFrame(run);
}

function run(now)
{
    requestAnimationFrame(run);
    const dt = (drawTime - now) * 0.01;
    drawTime = now;
    
    // UPDATING...
    quat.rotateY(transform.rotation, transform.rotation, 0.2 * dt);

    // RENDERING...
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // FRONT-FACE = Counter-clockwise
    // BACK-FACE = Clockwise
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    Mogli.draw(gl, drawInfos);
}

init();