const { vec3, mat4, quat, mat3 } = glMatrix;
Milque.Display.attach(document.querySelector('canvas'));
const gl = Milque.Display.VIEW.canvas.getContext('webgl2');
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

function MainScene()
{
    const pointer = Milque.Controller.Pointer();
    const mover = Milque.Controller.Mover();

    const camera = {
        transform: Mogli.Transform.create(),
        _cameraMatrix: mat4.create(),
        _viewMatrix: mat4.create(),
        _forwardVector: vec3.create(),
        _rightVector: vec3.create(),
        getCameraMatrix()
        {
            return Mogli.Transform.getTransformationMatrix(this.transform, this._cameraMatrix);
        },
        getViewMatrix()
        {
            return mat4.invert(this._viewMatrix, this._cameraMatrix);
        },
        getForwardVector()
        {
            this._forwardVector[0] = -this._viewMatrix[2];
            this._forwardVector[1] = -this._viewMatrix[6];
            this._forwardVector[2] = -this._viewMatrix[10];
            return this._forwardVector;
        },
        getRightVector()
        {
            this._rightVector[0] = this._viewMatrix[0];
            this._rightVector[1] = this._viewMatrix[4];
            this._rightVector[2] = this._viewMatrix[8];
            return this._rightVector;
        },
        update()
        {
            this.getCameraMatrix();
            this.getViewMatrix();
            this.getForwardVector();
        }
    };
    camera.transform.translation[2] = 2;

    const sharedAttributeLayout = [
        'a_position',
        'a_texcoord',
        'a_normal',
        'a_color',
    ];

    const program = Mogli.createShaderProgramInfo(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE, sharedAttributeLayout);

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

    const projection = mat4.perspective(mat4.create(), 1, gl.canvas.clientWidth / gl.canvas.clientHeight, 1, 2000);
    const cameraMatrix = camera.getCameraMatrix();
    const viewMatrix = camera.getViewMatrix();

    const drawInfos = [];
    const transform = Mogli.Transform.create();
    const drawInfo = Mogli.createDrawInfo(program, vertexArrayF, {
        u_projection: projection,
        u_view: viewMatrix,
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

    const lightPosition = drawInfo.uniforms.u_lightWorldPosition;
    const lightDirection = drawInfo.uniforms.u_lightDirection;
    const lightMat = mat4.targetTo(mat4.create(), lightPosition, transform.translation, [0, 1, 0]);
    lightDirection[0] = -lightMat[8];
    lightDirection[1] = -lightMat[9];
    lightDirection[2] = -lightMat[10];

    // UPDATING...
    Milque.Game.on('update', (dt) => {
        quat.rotateY(transform.rotation, transform.rotation, 0.2 * dt);

        quat.rotateY(camera.transform.rotation, camera.transform.rotation, (-pointer.dx / 100) * dt);
        const moveSpeed = 0.1;
        if (mover.up)
        {
            vec3.scaleAndAdd(camera.transform.translation, camera.transform.translation, camera.getForwardVector(), moveSpeed);
        }
        if (mover.down)
        {
            vec3.scaleAndAdd(camera.transform.translation, camera.transform.translation, camera.getForwardVector(), -moveSpeed);
        }
        if (mover.left)
        {
            vec3.scaleAndAdd(camera.transform.translation, camera.transform.translation, camera.getRightVector(), -moveSpeed);
        }
        if (mover.right)
        {
            vec3.scaleAndAdd(camera.transform.translation, camera.transform.translation, camera.getRightVector(), moveSpeed);
        }
        camera.update();
    });

    // RENDERING...
    Milque.Game.on('update', (dt) => {
        resize(gl);

        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    
        // FRONT-FACE = Counter-clockwise
        // BACK-FACE = Clockwise
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
    
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        Mogli.draw(gl, drawInfos);
    });
}

function resize(gl)
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

MainScene();

Milque.play();