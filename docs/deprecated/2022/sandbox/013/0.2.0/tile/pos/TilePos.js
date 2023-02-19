export function create(tileMap, x = 0, y = 0) {
  return {
    source: tileMap,
    x,
    y,
    index: x + y * tileMap.width,
  };
}

export function fromPosition(out, x, y) {
  out.x = x;
  out.y = y;
  out.index = x + y * out.source.width;
  return out;
}

export function fromIndex(out, index) {
  out.index = index;
  out.x = index % out.source.width;
  out.y = Math.trunc(index / out.source.width);
  return out;
}

export function copy(out, pos) {
  out.source = pos.source;
  out.x = pos.x;
  out.y = pos.y;
  out.index = pos.index;
  return out;
}

export function offset(out, pos = out, dx = 0, dy = 0) {
  let a = pos.x + dx;
  if (a < 0) a = 0;
  else if (a >= pos.source.width) a = pos.source.width - 1;

  let b = pos.y + dy;
  if (b < 0) b = 0;
  else if (b >= pos.source.height) b = pos.source.height - 1;

  out.x = a;
  out.y = b;
  out.index = a + b * pos.source.width;
  return out;
}

export function right(out, pos = out, offset = 1) {
  let a = pos.x + offset;
  if (a >= pos.source.width) {
    out.x = pos.source.width - 1;
    out.index = pos.index + (pos.source.width - pos.x - 1);
  } else {
    out.x = a;
    out.index = pos.index + offset;
  }
  return out;
}

export function left(out, pos = out, offset = 1) {
  let a = pos.x - offset;
  if (a < 0) {
    out.x = 0;
    out.index = pos.index - pos.x;
  } else {
    out.x = a;
    out.index = pos.index - offset;
  }
  return out;
}

export function up(out, pos = out, offset = 1) {
  let b = pos.y - offset;
  if (b < 0) {
    out.y = 0;
    out.index = pos.index - pos.y * pos.source.width;
  } else {
    out.y = b;
    out.index = pos.index - offset * pos.source.width;
  }
  return out;
}

export function down(out, pos = out, offset = 1) {
  let b = pos.y + offset;
  if (b >= pos.source.height) {
    out.y = pos.source.height - 1;
    out.index = pos.index + (pos.source.height - pos.y - 1);
  } else {
    out.y = b;
    out.index = pos.index + offset;
  }
  return out;
}

export function next(out, pos, amount = 1) {
  let c = pos.index + amount;
  if (c > pos.source.data.length) {
    out.index = pos.source.data.length - 1;
    out.x = pos.source.width - 1;
    out.y = pos.source.height - 1;
  } else {
    out.index = c;
    out.x = c % pos.source.width;
    out.y = Math.trunc(c / pos.source.width);
  }
  return out;
}

export function prev(out, pos, amount = 1) {
  let c = pos.index - amount;
  if (c < 0) {
    out.index = 0;
    out.x = 0;
    out.y = 0;
  } else {
    out.index = c;
    out.x = c % pos.source.width;
    out.y = Math.trunc(c / pos.source.width);
  }
  return out;
}

export function hasPrev(pos, amount = 1) {
  return pos.index > amount;
}

export function hasNext(pos, amount = 1) {
  return pos.index < pos.source.width + amount;
}

export function withinBounds(pos, dx = 0, dy = 0) {
  const x = pos.x + dx;
  const y = pos.y + dy;
  if (x < 0) return false;
  if (x >= pos.source.width) return false;
  if (y < 0) return false;
  if (y >= pos.source.height) return false;
  return true;
}
