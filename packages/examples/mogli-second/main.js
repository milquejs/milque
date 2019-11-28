import { vec3, mat4, quat, mat3 } from '../../../node_modules/gl-matrix/esm/index.js';

Milque.Display.attach(document.querySelector('canvas'));
const gl = Milque.Display.VIEW.canvas.getContext('webgl2');
if (!gl) throw new Error('Your browser does not support WebGL.');

Milque.Display.VIEW.mouse.setCursorLock(true);
const POINTER = Milque.Controller.Pointer();
const MOVER = Milque.Controller.Mover3D();

const VERTEX_SHADER_SOURCE = `#version 300 es
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

const FRAGMENT_SHADER_SOURCE = `#version 300 es
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

    float ambient = 0.1;
    float light = dot(normal, LIGHT_DIRECTION);
    vec3 diffuse = mix(u_color.rgb, v_color.rgb * light, 0.5);
    fragColor = max(vec4(ambient, ambient, ambient, ambient), vec4(diffuse, 1));
    // max(vec4(ambient), mix(u_color, texture(u_texture, v_texcoord), 0.5));
}
`;

const SHARED_ATTRIBUTE_LAYOUT = [
    'a_position',
    'a_texcoord',
    'a_normal',
    'a_color',
];

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

function createModel(program, mesh, color = [0.2, 1, 0.2, 1])
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

function createDungeonGeometry(solidMap, width, height)
{
    const halfWidth = width / 2 - 0.5;
    const halfHeight = height / 2 - 0.5;
    const geometries = [];

    const transformation = mat4.create();
    for(let i = 0; i < height; ++i)
    {
        for(let j = 0; j < width; ++j)
        {
            const index = j + i * width;
            if (solidMap[index])
            {
                const cube = Mogli.Geometry.Cube.create();
                mat4.fromTranslation(transformation, [j - halfWidth, i - halfHeight, 0]);
                Mogli.Geometry.applyTransformation(transformation, cube);
                Mogli.Geometry.applyColor(0.3, 0.3, 0.3, cube);
                geometries.push(cube);
            }
            else
            {
                const quad = Mogli.Geometry.Quad.create(true);
                mat4.fromRotationTranslation(transformation, quat.fromEuler(quat.create(), 0, 0, 0), [j - halfWidth, i - halfHeight, -0.5]);
                Mogli.Geometry.applyTransformation(transformation, quad);
                Mogli.Geometry.applyColor(0.1, 0.1, 0.1, quad);
                geometries.push(quad);
            }
        }
    }
    const result = Mogli.Geometry.joinGeometry(...geometries);
    mat4.fromRotation(transformation, -Math.PI / 2, Mogli.Transform.XAXIS);
    Mogli.Geometry.applyTransformation(transformation, result);
    return result;
}

function animateBillboard(billboard, camera)
{
    const q = billboard.transform.rotation;
    quat.copy(q, camera.transform.rotation);
    q[0] = 0;
    q[2] = 0;
}

function MainScene()
{
    const program = Mogli.createShaderProgramInfo(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE, SHARED_ATTRIBUTE_LAYOUT);

    const camera = createPerspectiveCamera();
    vec3.set(camera.transform.translation, 1, 1.5, 2);
    quat.fromEuler(camera.transform.rotation, -30, 30, 0);
    camera.pitch = -30;
    camera.yaw = 30;
    
    const sharedUniforms = {
        get u_projection() { return camera.projectionMatrix; },
        get u_view() { return camera.viewMatrix; },
        get u_camera() { return camera.transformMatrix; },
    };

    const models = [];

    const meshF = createMesh(gl, Mogli.Geometry.GlyphF.create(), SHARED_ATTRIBUTE_LAYOUT);
    const modelF = createModel(program, meshF);
    models.push(modelF);

    const CHUNK_WIDTH = 8;
    const CHUNK_HEIGHT = 8;
    const dungeon = new Array(CHUNK_WIDTH * CHUNK_HEIGHT);
    dungeon.fill(1);
    for(let i = 0; i < dungeon.length; ++i)
    {
        dungeon[i] = Math.floor(Math.random() * 2);
    }

    const dungeonModel = createModel(program, createMesh(gl, createDungeonGeometry(dungeon, CHUNK_WIDTH, CHUNK_HEIGHT), SHARED_ATTRIBUTE_LAYOUT));
    models.push(dungeonModel);

    // Billboarding...
    /*
    const groundTexture = Mogli.createTextureInfo(gl);
    {
        loadImage('./ground.png').then((image) => {
            gl.bindTexture(gl.TEXTURE_2D, groundTexture.handle);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        });
    }
    */
    const billboardModel = createModel(program, createMesh(gl, Mogli.Geometry.Plane.create(), SHARED_ATTRIBUTE_LAYOUT));
    //billboardModel.drawInfo.uniforms.u_texture = groundTexture.handle;
    models.push(billboardModel);

    // Animation is basically an update loop to change properties over time through some function
    // We want to control animations. play(), step(), change(), stop(), pause(), resume(), reset(), end(), isPlaying(), isPaused(), getAnimationProgress(), getEndTime(), getStartTime(), getDuration()

    // To handle playing it. Whether it should restart, wait to finish, queue, etc.
    // Transitions, play, pause, step, stop, resume, reset, end
    // Animator: update, start, stop, etc.
    // CustomAnimator for special animations. Each handle GROUPS of animations.
    // Each animation only holds state and reference data. Therefore, animation info.
    // Each animator keeps tracks of its own animations.
    // TweenAnimator -> Updates the animation.
    // Tween -> Creates the animation states.

    // Tweening
    // Spritesheets
    // 3D Animations?
    // Transitions
    // Blending

    // UPDATING...
    Milque.Game.on('update', (dt) => {
        quat.rotateY(modelF.transform.rotation, modelF.transform.rotation, 0.2 * dt);

        moveFirstPersonCamera(camera, MOVER, 0.1);
        lookFirstPersonCamera(camera, POINTER, 0.3, 5);

        // Billboarding...
        animateBillboard(dt, billboardModel, camera);

        // Update draw info for models...
        for(const model of models)
        {
            model.update();
        }
    });

    // RENDERING...
    Milque.Game.on('update', (dt) => {
        resize(gl);

        gl.viewport(0, 0, gl.canvas.clientWidth, gl.canvas.clientHeight);
    
        // FRONT-FACE = Counter-clockwise
        // BACK-FACE = Clockwise
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
    
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        camera.update(gl, gl.canvas.clientWidth, gl.canvas.clientHeight);
        Mogli.draw(gl, models.map((v) => v.drawInfo), sharedUniforms);
    });
}

MainScene();

Milque.play();