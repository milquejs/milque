let BOXES = [];

class Box {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;

    this.width = 16;
    this.height = 16;

    this.color = 'white';
    this.text = '';
    this.textColor = 'blue';
  }

  setRect(left, top, right = left + this.width, bottom = top + this.height) {
    this.width = right - left;
    this.height = bottom - top;
    this.x = left + this.width / 2;
    this.y = top + this.height / 2;
    return this;
  }

  get left() {
    return this.x - this.width / 2;
  }
  get top() {
    return this.y - this.height / 2;
  }
  get right() {
    return this.x + this.width / 2;
  }
  get bottom() {
    return this.y + this.height / 2;
  }
}

export function create(x = 0, y = 0, opts = {}) {
  let result = new Box(x, y);
  for (let key of Object.keys(opts)) {
    result[key] = opts[key];
  }
  BOXES.push(result);
  return result;
}

export function destroy(box) {
  BOXES.splice(BOXES.indexOf(box), 1);
}

export function render(view) {
  let ctx = view.context;
  ctx.save();
  for (let box of BOXES) {
    renderBox(ctx, box);
  }
  ctx.restore();
}

export function intersects(a, b) {
  return (
    Math.abs(a.x - b.x) * 2 < a.width + b.width &&
    Math.abs(a.y - b.y) * 2 < a.height + b.height
  );
}

function renderBox(ctx, box) {
  ctx.fillStyle = box.color;
  ctx.fillRect(box.left, box.top, box.width, box.height);

  if (box.text) {
    const FONT_SIZE = Math.max(Math.ceil(box.width / 8), 8);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${FONT_SIZE}px monospace`;
    ctx.fillStyle = box.textColor;

    let lines = box.text.split('\n');
    let offsetX = box.x;
    let offsetY = box.y - ((lines.length - 1) / 2) * FONT_SIZE;
    for (let line of lines) {
      ctx.fillText(line, offsetX, offsetY);
      offsetY += FONT_SIZE;
    }
  }
}

export function values() {
  return BOXES;
}

export function clear() {
  BOXES.length = 0;
}
