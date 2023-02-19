import { Random } from '@milque/random';
import { DisplayPortSystem } from './lib/DisplayPortSystem';
import { useDraw, useSystem, useUpdate } from './lib/M';

/**
 * What I learned:
 * - I need access to the current bound canvas, wherever this object
 * is being used.
 * - I should implement all things related to Starfield in here and
 * just expose an interface for the engine to connect to.
 */

export const STAR_SIZE_RANGE = [2, 4];
export const STAR_SPEED_RANGE = [0.3, 1];
export const STAR_PARTICLE_COUNT = 30;
export const STARFIELD_DRAW_LAYER_INDEX = 1;

/**
 * @param {import('./lib/system/SystemManager').SystemContext<StarfieldSystem>} m 
 */
export function StarfieldSystem(m) {
  const { canvas } = useSystem(m, DisplayPortSystem);
  const starfield = createStarfield(canvas.width, canvas.height);
  
  useUpdate(m, () => {
    updateStarfield(starfield);
  });

  useDraw(m, STARFIELD_DRAW_LAYER_INDEX, (ctx) => {
    renderStarfield(ctx, starfield);
  });
}

function createStarfield(width, height) {
  let result = {
    x: [],
    y: [],
    size: [],
    speed: [],
    length: 0,
    width,
    height,
  };
  for (let i = 0; i < STAR_PARTICLE_COUNT; ++i) {
    result.x.push(Random.range(0, width));
    result.y.push(Random.range(0, height));
    result.size.push(Random.range(STAR_SIZE_RANGE[0], STAR_SIZE_RANGE[1]));
    result.speed.push(Random.range(STAR_SPEED_RANGE[0], STAR_SPEED_RANGE[1]));
    result.length++;
  }
  return result;
}

function renderStarfield(ctx, starfield, color = 'white') {
  for (let i = 0; i < starfield.length; ++i) {
    let x = starfield.x[i];
    let y = starfield.y[i];
    let size = starfield.size[i];

    let halfSize = size / 2;
    ctx.fillStyle = color;
    ctx.fillRect(x - halfSize, y - halfSize, size, size);
  }
}

function updateStarfield(starfield, dx = 1, dy = 0) {
  const { length, width, height } = starfield;

  for (let i = 0; i < length; ++i) {
    let ddx = dx * starfield.speed[i];
    let ddy = dy * starfield.speed[i];

    starfield.x[i] += ddx;
    starfield.y[i] += ddy;

    if (ddx < 0) {
      if (starfield.x[i] < 0) {
        starfield.x[i] = width;
        starfield.y[i] = Random.range(0, height);
      }
    } else if (ddx > 0) {
      if (starfield.x[i] > width) {
        starfield.x[i] = 0;
        starfield.y[i] = Random.range(0, height);
      }
    }

    if (ddy < 0) {
      if (starfield.y[i] < 0) {
        starfield.x[i] = Random.range(0, width);
        starfield.y[i] = height;
      }
    } else if (ddy > 0) {
      if (starfield.y[i] > height) {
        starfield.x[i] = Random.range(0, width);
        starfield.y[i] = 0;
      }
    }
  }
}
