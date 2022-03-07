import { Mouse, Keyboard, AssetLoader } from './lib.js';

import * as Camera from './Camera.js';
import * as Sprite from './Sprite.js';
import { Mask } from './Mask.js';
import { GameObjectManager } from './GameObject.js';
import * as TileMap from './TileMap.js';

document.title = 'tactics';

let assets = {};

async function load() {
  assets = await AssetLoader.loadAssetList(
    ['image:dungeon/dungeon.png', 'text:dungeon/dungeon.atlas'],
    '../../res'
  );
  assets.sprites = Sprite.loadSpriteSheet(
    assets['image:dungeon/dungeon.png'],
    assets['text:dungeon/dungeon.atlas']
  );
}

export async function main() {
  await load();

  const display = document.querySelector('display-port');
  const ctx = display.canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  let camera = createCamera();
  let mouse = new Mouse(display.canvas);
  let keyboard = new Keyboard(display.canvas);

  let world = {
    position: [0, 0],
    gameObjects: new GameObjectManager(),
    sprite: assets.sprites.necromancer_idle_anim,
    mask: new Mask(16, 16),
  };

  let tileMap;
  try {
    if (!localStorage.getItem('tilemap')) {
      throw new Error();
    }

    let tileMapData = JSON.parse(localStorage.getItem('tilemap'));
    tileMap = TileMap.loadTileMap(tileMapData);
  } catch (e) {
    tileMap = TileMap.createTileMap(16, 16, 1);
    let data = TileMap.saveTileMap(tileMap);
    localStorage.setItem('tilemap', JSON.stringify(data));
  }

  display.addEventListener('frame', (e) => {
    let dt = e.detail.deltaTime / 60;

    onUpdate(dt);
    onRender(ctx);
  });

  function onUpdate(dt) {
    mouse.poll();
    keyboard.poll();

    world.sprite.update(dt);
  }

  function onRender(ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, display.width, display.height);

    let width = display.width;
    let height = display.height;

    const viewMatrix = camera.viewMatrix;
    const projectionMatrix = camera.projectionMatrix;

    Camera.drawWorldGrid(
      ctx,
      width,
      height,
      camera.viewMatrix,
      camera.projectionMatrix
    );

    ctx.save();
    {
      ctx.setTransform(new DOMMatrix(camera.viewMatrix));
      TileMap.drawTileMap(ctx, tileMap);

      let x = 54;
      let y = 54;
      Sprite.drawSprite(ctx, world.sprite, x, y, 16, 16);
      drawMask(ctx, world.mask, x, y);
    }
    ctx.restore();

    Camera.drawWorldTransformGizmo(
      ctx,
      width,
      height,
      camera.viewMatrix,
      camera.projectionMatrix
    );

    ctx.fillStyle = 'white';
    ctx.fillRect(mouse.x * width - 32, mouse.y * height - 32, 64, 64);
    if (mouse.left.value) {
      camera.lookAt(mouse.x * width, mouse.y * height, 0, 1);
    }
  }
}

function drawMask(ctx, mask, offsetX = 0, offsetY = 0) {
  ctx.strokeStyle = 'lime';
  ctx.strokeRect(
    mask.offset.x + offsetX,
    mask.offset.y + offsetY,
    mask.width,
    mask.height
  );
}

function lerp(a, b, dt) {
  return (b - a) * dt + a;
}

function createCamera() {
  return {
    viewMatrix: [1, 0, 0, 1, 0, 0],
    projectionMatrix: [1, 0, 0, 1, 0, 0],
    lookAt(x, y, z, dt = 1) {
      this.viewMatrix[4] = x;
      this.viewMatrix[5] = y;
      return this;
    },
  };
}
