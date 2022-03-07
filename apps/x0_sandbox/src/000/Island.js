import { Random } from '@milque/random';

export function generateNoisyIsland(island, width, height, opts = {}) {
  const rand = Random;
  const length = width * height;

  // Fill the island.
  for (let i = 0; i < length; ++i) {
    island.ground[i] = rand.choose([0, 1]);
  }

  return out;
}

export function generateBoxyIsland(island, width, height, opts) {
  const rand = Random;
  const length = width * height;
  const sizeFactor = width + height;

  const boxCount = Math.floor(sizeFactor * 0.08);
  const minBoxSize = Math.ceil(sizeFactor * 0.04);
  const maxBoxSize = Math.ceil(sizeFactor * 0.12);
  const lineRadius = Math.ceil(minBoxSize / 2);

  let ground = island.ground;
  let solid = island.solid;

  // Clear the island.
  for (let i = 0; i < length; ++i) {
    ground[i] = 0;
    solid[i] = 0;
  }

  // Add boxes on the island.
  let boxes = [];
  for (let count = boxCount; count >= 0; --count) {
    let x = Math.floor(rand.range(maxBoxSize, width - maxBoxSize));
    let y = Math.floor(rand.range(maxBoxSize, height - maxBoxSize));
    let w = Math.floor(rand.range(minBoxSize, maxBoxSize));
    let h = Math.floor(rand.range(minBoxSize, maxBoxSize));

    digBox(ground, width, height, x, y, w, h, 4);
    if (w > 6 && h > 6) {
      digBox(solid, width, height, x + 3, y + 3, w - 6, h - 6);
    }

    boxes.push({ x, y, w, h });
  }

  // Connect the boxes.
  for (let i = 0; i < boxes.length; ++i) {
    let box = boxes[i];
    let other = i + 1 >= boxes.length ? boxes[0] : boxes[i + 1];
    digLine(
      ground,
      width,
      height,
      box.x + Math.floor(box.w / 2),
      box.y + Math.floor(box.h / 2),
      other.x + Math.floor(other.w / 2),
      other.y + Math.floor(other.h / 2),
      lineRadius
    );

    if (lineRadius > 1) {
      digLine(
        solid,
        width,
        height,
        box.x + Math.floor(box.w / 2),
        box.y + Math.floor(box.h / 2),
        other.x + Math.floor(other.w / 2),
        other.y + Math.floor(other.h / 2),
        Math.floor(lineRadius * 0.6)
      );
    }
  }
  // Loop around and connect the first and last box.

  // Smooth out the island.
  for (let y = 1; y < height - 1; ++y) {
    for (let x = 1; x < width - 1; ++x) {
      let i = x + y * width;
      if (ground[i]) {
        let factor =
          ground[x + 1 + (y + 1) * width] +
          ground[x + 1 + (y + 0) * width] +
          ground[x + 0 + (y + 1) * width] +
          ground[x - 1 + (y + 1) * width] +
          ground[x + 1 + (y - 1) * width] +
          ground[x - 1 + (y + 0) * width] +
          ground[x + 0 + (y - 1) * width] +
          ground[x - 1 + (y - 1) * width];

        if (factor <= 3) {
          ground[i] = 0;
          solid[i] = 0;
        } else if (factor <= 4 && rand.next() < 0.4) {
          ground[i] = 0;
          solid[i] = 0;
        }
      }
    }
  }

  return island;
}

export function digBox(out, width, height, x, y, w, h) {
  for (let i = 0; i < h; ++i) {
    for (let j = 0; j < w; ++j) {
      let k = x + j + (y + i) * width;
      out[k] = 1;
    }
  }
}

// Bresenham's Line Algorithm
export function digLine(
  out,
  width,
  height,
  fromX,
  fromY,
  toX,
  toY,
  radius = 1
) {
  let dx = Math.abs(toX - fromX);
  let sx = fromX < toX ? 1 : -1;
  let dy = -Math.abs(toY - fromY);
  let sy = fromY < toY ? 1 : -1;
  let er = dx + dy;

  let x = fromX;
  let y = fromY;
  let index = x + y * width;
  out[index] = 1;

  let maxLength = dx * dx + dy * dy;
  let length = 0;
  while (length < maxLength && x !== toX && y !== toY) {
    // Make sure it doesn't go overboard.
    ++length;

    let er2 = er * 2;

    if (er2 >= dy) {
      er += dy;
      x += sx;
    }

    if (er2 <= dx) {
      er += dx;
      y += sy;
    }

    for (let i = -radius; i <= radius; ++i) {
      for (let j = -radius; j <= radius; ++j) {
        let index = x + i + (y + j) * width;
        out[index] = 1;
      }
    }
  }
}
