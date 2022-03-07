import '@milque/display';
import '@milque/input';
import './error.js';

import { vec2, vec3, vec4, mat4, quat } from 'gl-matrix';
import { OrthographicCamera, screenToWorldRay } from '@milque/scene';

import { ASSETS } from './assets/Assets.js';
import { TexturedQuadRenderer } from './renderer/TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './renderer/ColoredQuadRenderer.js';

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
  const camera = new OrthographicCamera(-10, -10, 10, 10, -10, 10);

  const game = {
    display,
    input,
    camera,
    world: {},
    loader: null,
    updater: null,
    renderer: null,
  };

  game.loader = GameLoader(game);
  game.updater = GameUpdater(game);
  game.renderer = GameRenderer(game);

  await game.loader(game);
  display.addEventListener('frame', (e) => {
    const { deltaTime } = /** @type {FrameEvent} */ (e).detail;
    const dt = deltaTime / 60;

    game.updater(game);
    game.renderer(game);
  });
}

function GameLoader(game) {
  const gl = game.display.canvas.getContext('webgl');

  return async function () {
    ASSETS.registerAsset('texture', 'font', 'cloud/cube.png', { gl });
    await ASSETS.loadAssets();
  };
}

function GameUpdater(game) {
  const { world, camera } = game;

  return function () {
    let screenX = game.input.getInputState('CursorX') * 2 - 1;
    let screenY = 1 - game.input.getInputState('CursorY') * 2;
    let [cursorX, cursorY, cursorZ] = screenToWorldRay(
      vec3.create(),
      screenX,
      screenY,
      camera.projectionMatrix,
      camera.viewMatrix
    );
  };
}

function GameRenderer(game) {
  const { display, world, camera } = game;

  /** @type {WebGLRenderingContext} */
  const gl = display.canvas.getContext('webgl');
  gl.clearColor(0.1, 0.1, 0.1, 1);
  TexturedQuadRenderer.enableTransparencyBlend(gl);

  const texturedRenderer = new TexturedQuadRenderer(gl);
  const coloredRenderer = new ColoredQuadRenderer(gl);

  return function () {
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
  };
}

class TileMap {
  constructor(width, height = width, length = width * height) {
    this.data = new Uint32Array(length);
    this.length = length;
    this.width = width;
    this.height = height;
  }

  get(tileCoordX = 0, tileCoordY = 0) {
    return this.data[tileCoordX + tileCoordY * this.width];
  }

  set(tileCoordX = 0, tileCoordY = 0, tileValue = 1) {
    this.data[tileCoordX + tileCoordY * this.width] = tileValue;
  }
}

class TilePos {
  static fromValues(tileMap, x, y, z) {}

  static create(tileMap) {}

  static up(out, pos) {}

  constructor(tileMap) {
    this.tileMap = tileMap;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  copy() {
    let result = new TilePos(this.tileMap);
    result.x = this.x;
    result.y = this.y;
    result.z = this.z;
    return result;
  }
}

class LayeredTileMap extends TileMap {
  constructor(
    width,
    height = width,
    depth = 1,
    length = width * height * depth
  ) {
    super(width, height, length);
    this.depth = depth;
  }

  layer(tileCoordZ) {}

  get(tileCoordX = 0, tileCoordY = 0, layerIndex = 0) {}
}
