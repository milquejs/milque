export class TileMap {
  constructor(width, height, arrayConstructor = Array) {
    const length = width * height;
    this.width = width;
    this.height = height;
    this.length = length;

    this.data = new arrayConstructor(length);
  }

  get(x, y) {
    return this.data[x + y * this.width];
  }

  set(x, y, value) {
    this.data[x + y * this.width] = value;
    return this;
  }
}
