import 'milque';
import { INPUT_CONTEXT } from './input.js';

window.addEventListener('DOMContentLoaded', main);

async function main() {
  const display = document.querySelector('#main');
  const canvas = display.canvas;
  const ctx = canvas.getContext('2d');

  display.addEventListener('frame', () => {
    const DISPLAY_WIDTH = display.width;
    const DISPLAY_HEIGHT = display.height;
    const DISPLAY_HALF_WIDTH = DISPLAY_WIDTH / 2;
    const DISPLAY_HALF_HEIGHT = DISPLAY_HEIGHT / 2;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

    const WIDTH = 6;
    const HEIGHT = 6;
    const CELL_WIDTH = 64;
    const CELL_HEIGHT = 64;
    const CELL_MARGIN = CELL_WIDTH / 8;
    const CELL_STRIDE_X = CELL_WIDTH + CELL_MARGIN * 2;
    const CELL_STRIDE_Y = CELL_HEIGHT + CELL_MARGIN * 2;
    let playground = new Array(WIDTH * HEIGHT);

    const PointerX = INPUT_CONTEXT.getInputValue('PointerX');
    const PointerY = INPUT_CONTEXT.getInputValue('PointerY');

    const PointerDown = INPUT_CONTEXT.getInputValue('PointerDown');
    console.log(PointerDown);

    const PointerCellX = 0;
    const PointerCellY = 0;

    ctx.fillStyle = 'red';
    ctx.fillRect(PointerX * DISPLAY_WIDTH, PointerY * DISPLAY_HEIGHT, 4, 4);

    ctx.translate(DISPLAY_HALF_WIDTH, DISPLAY_HALF_HEIGHT);

    ctx.save();
    ctx.translate((-WIDTH / 2) * CELL_STRIDE_X, (-HEIGHT / 2) * CELL_STRIDE_Y);
    for (let y = 0; y < HEIGHT; ++y) {
      for (let x = 0; x < WIDTH; ++x) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          x * CELL_STRIDE_X,
          y * CELL_STRIDE_Y,
          CELL_WIDTH,
          CELL_HEIGHT
        );
      }
    }
    ctx.restore();

    ctx.translate(-DISPLAY_HALF_WIDTH, -DISPLAY_HALF_HEIGHT);
  });
}
