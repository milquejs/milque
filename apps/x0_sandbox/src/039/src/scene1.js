const GRAVITY = 0.3;
const MAX_VELOCITY = 4;

export async function onLoad(game) {
  return;
}

export async function onUpdate(game) {
  let seg = createRopeSegment(0, 0, null);
  seg = createRopeSegment(10, 10, seg);
  seg = createRopeSegment(10, 20, seg);
  seg = createRopeSegment(10, 40, seg);
  seg = createRopeSegment(10, 50, seg);
  seg = createRopeSegment(10, 60, seg);
  return function (dt) {
    for (let rope of ROPE_SEGMENTS) {
      rope.dy += GRAVITY;
      rope.y += rope.dy;
    }
  };
}

export async function onRender(game) {
  return function (gl) {};
}

const ROPE_SEGMENTS = [];
function createRopeSegment(x, y, parent) {
  let result = {
    x,
    y,
    parent,
  };
  ROPE_SEGMENTS.push(result);
  return result;
}
