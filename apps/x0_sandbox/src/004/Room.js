import * as Scene3D from './Scene3D.js';
const { vec3, mat4, quat, mat3 } = glMatrix;

document.title = 'room';

Milque.Display.attach(document.querySelector('canvas'));
const gl = Milque.Display.VIEW.canvas.getContext('webgl2');
if (!gl) throw new Error('Your browser does not support WebGL.');

const TEXTURE_WOOD = Scene3D.createTexture(gl, './res/wood.jpg');
const TEXTURE_GRASS = Scene3D.createTexture(gl, './res/grass.jpg');
const TEXTURE_DIRT = Scene3D.createTexture(gl, './res/dirt.jpg');
const TEXTURE_ROCKS = Scene3D.createTexture(gl, './res/rocks.jpg');
const TEXTURE_STONE = Scene3D.createTexture(gl, './res/stone.jpg');
const TEXTURE_WALL = Scene3D.createTexture(gl, './res/wall-cut.png');
const TEXTURE_WATER = Scene3D.createTexture(gl, './res/water.jpg');

function MainScene() {
  const scene = Scene3D.init(gl);

  const camera = scene.camera;
  vec3.set(camera.transform.translation, 0, 0.8, 1.5);
  quat.fromEuler(camera.transform.rotation, -30, 0, 0);
  camera.pitch = -30;
  camera.yaw = 0;

  const models = [];
  const floor = Scene3D.createModelGeometry(
    gl,
    scene.shaderProgram,
    Mogli.Geometry.Plane.create(false)
  );
  vec3.set(floor.transform.translation, 0, -0.5, 0);
  quat.fromEuler(floor.transform.rotation, -90, 0, 0);
  floor.drawInfo.uniforms.u_texture = TEXTURE_STONE.handle;
  floor.update();
  models.push(floor);

  const wallLeft = Scene3D.createModelGeometry(
    gl,
    scene.shaderProgram,
    Mogli.Geometry.Plane.create(false)
  );
  vec3.set(wallLeft.transform.translation, -0.5, 0, 0);
  quat.fromEuler(wallLeft.transform.rotation, 0, 90, 0);
  wallLeft.drawInfo.uniforms.u_texture = TEXTURE_WOOD.handle;
  wallLeft.update();
  models.push(wallLeft);

  const wallRight = Scene3D.createModelGeometry(
    gl,
    scene.shaderProgram,
    Mogli.Geometry.Plane.create(false)
  );
  vec3.set(wallRight.transform.translation, 0.5, 0, 0);
  quat.fromEuler(wallRight.transform.rotation, 0, -90, 0);
  wallRight.drawInfo.uniforms.u_texture = TEXTURE_WOOD.handle;
  wallRight.update();
  models.push(wallRight);

  const wallBack = Scene3D.createModelGeometry(
    gl,
    scene.shaderProgram,
    Mogli.Geometry.Plane.create(false)
  );
  vec3.set(wallBack.transform.translation, 0, 0, -0.5);
  quat.fromEuler(wallBack.transform.rotation, 0, 0, 0);
  wallBack.drawInfo.uniforms.u_texture = TEXTURE_WALL.handle;
  wallBack.update();
  models.push(wallBack);

  const background = Scene3D.createModelGeometry(
    gl,
    scene.shaderProgram,
    Mogli.Geometry.Plane.create(false)
  );
  vec3.set(background.transform.translation, 0, 0, -0.51);
  quat.fromEuler(background.transform.rotation, 0, 0, 0);
  background.drawInfo.uniforms.u_texture = TEXTURE_WATER.handle;
  background.update();
  models.push(background);

  // UPDATING...
  Milque.Game.on('update', (dt) => {});

  // RENDERING...
  Milque.Game.on('update', (dt) => {
    Scene3D.draw(
      gl,
      scene,
      models.map((model) => model.drawInfo)
    );
  });
}

MainScene();

Milque.play();
