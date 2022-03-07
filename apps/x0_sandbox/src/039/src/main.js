import '@milque/display';
import '@milque/input';
import './error.js';

import { vec2, vec3, vec4, mat4, quat } from 'gl-matrix';
import { OrthographicCamera, screenToWorldRay } from '@milque/scene';

import { ASSETS } from './assets/Assets.js';
import { TexturedQuadRenderer } from './renderer/TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './renderer/ColoredQuadRenderer.js';

import * as Scene1 from './scene1.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/display').FrameEvent} FrameEvent
 * @typedef {import('@milque/input').InputPort} InputPort
 */

window.addEventListener('DOMContentLoaded', main);

async function main() {
  /** @type {DisplayPort} */
  const display = document.querySelector('#display');
  /** @type {InputPort} */
  const input = document.querySelector('#input');
  input.src = {
    CursorX: 'Mouse:PosX',
    CursorY: 'Mouse:PosY',
    CursorInteract: 'Mouse:Button0',
  };
  /** @type {WebGLRenderingContext} */
  const gl = display.canvas.getContext('webgl');
  const camera = new OrthographicCamera(-10, -10, 10, 10, -10, 10);
  const assets = ASSETS;

  const game = {
    display,
    input,
    camera,
    gl,
    assets,
    scene: null,
  };

  await GameLoader(game);
  const updater = GameUpdater(game);
  const renderer = GameRenderer(game);

  const scene = {
    update: null,
    render: null,
  };
  game.scene = scene;
  await Scene1.onLoad.call(scene, game);
  scene.update = await Scene1.onUpdate.call(scene, game);
  scene.render = await Scene1.onRender.call(scene, game);

  display.addEventListener('frame', (e) => {
    const { deltaTime } = /** @type {FrameEvent} */ (e).detail;
    const dt = deltaTime / 60;

    updater(dt);
    renderer(gl);
  });
}

async function GameLoader(game) {
  const { assets, gl } = game;

  assets.registerAsset('texture', 'font', 'cloud/cube.png', { gl });
  await assets.loadAssets();
}

function GameUpdater(game) {
  const { camera, scene } = game;

  return function (dt) {
    let screenX = game.input.getInputState('CursorX') * 2 - 1;
    let screenY = 1 - game.input.getInputState('CursorY') * 2;
    let [cursorX, cursorY, cursorZ] = screenToWorldRay(
      vec3.create(),
      screenX,
      screenY,
      camera.projectionMatrix,
      camera.viewMatrix
    );

    if (scene.update) {
      scene.update(dt);
    }
  };
}

function GameRenderer(game) {
  const { display, camera, scene, gl } = game;

  gl.clearColor(0.1, 0.1, 0.1, 1);
  TexturedQuadRenderer.enableTransparencyBlend(gl);

  const texturedRenderer = new TexturedQuadRenderer(gl);
  const coloredRenderer = new ColoredQuadRenderer(gl);

  return function (gl) {
    const viewportWidth = gl.canvas.width;
    const viewportHeight = gl.canvas.height;
    gl.viewport(0, 0, viewportWidth, viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    camera.resize(viewportWidth, viewportHeight);

    texturedRenderer
      .setProjectionMatrix(camera.projectionMatrix)
      .setViewMatrix(camera.viewMatrix);
    coloredRenderer
      .setProjectionMatrix(camera.projectionMatrix)
      .setViewMatrix(camera.viewMatrix);

    coloredRenderer.draw(0, 0, 1, 1);

    if (scene.render) {
      scene.render(gl);
    }
  };
}
