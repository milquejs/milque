import { CanvasView, Camera2D } from './lib.js';

async function main() {
  const display = document.querySelector('display-port');
  const input = document.querySelector('input-context');
  const ctx = display.canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const view = new CanvasView();
  const camera = new Camera2D();

  const moveLeft = input.getInput('moveLeft');
  const moveRight = input.getInput('moveRight');
  const moveUp = input.getInput('moveUp');
  const moveDown = input.getInput('moveDown');
  const pointerX = input.getInput('pointerX');
  const pointerY = input.getInput('pointerY');
  const grabbing = input.getInput('grabbing');

  const cursor = { x: 0, y: 0 };

  const tileRegistry = {
    0: {
      render(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
    1: {
      render(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
    2: {
      render(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
    3: {
      render(ctx) {
        ctx.fillStyle = 'saddlebrown';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
    4: {
      render(ctx) {
        ctx.fillStyle = 'dodgerblue';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
    5: {
      render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
    6: {
      render(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, 16, 16);
      },
    },
  };
  const tileMap = [0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  const tileSize = 16;
  const mapWidth = 4;
  const mapHeight = 4;

  display.addEventListener('frame', (e) => {
    const dt = e.detail.deltaTime / 60;
    ctx.clearRect(0, 0, display.clientWidth, display.clientHeight);

    cursor.x = pointerX.value * display.width;
    cursor.y = pointerY.value * display.height;

    const cursorTileX = Math.floor(cursor.x / tileSize) * tileSize;
    const cursorTileY = Math.floor(cursor.y / tileSize) * tileSize;

    view.begin(ctx, camera.getViewMatrix(), camera.getProjectionMatrix());
    {
      let i = 0;
      for (let tileId in tileRegistry) {
        let x = i % mapWidth;
        let y = Math.floor(i / mapWidth);

        ctx.translate(x * tileSize, y * tileSize);
        {
          tileRegistry[tileId].render(ctx);
        }
        ctx.translate(-x * tileSize, -y * tileSize);
        ++i;
      }

      ctx.strokeStyle = 'white';
      ctx.strokeRect(cursorTileX, cursorTileY, tileSize, tileSize);
    }
    view.end(ctx);
  });
}

window.addEventListener('DOMContentLoaded', main);
