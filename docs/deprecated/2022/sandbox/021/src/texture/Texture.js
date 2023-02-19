export class Texture {
  constructor(image) {
    this.source = image;
    this.width = image.width;
    this.height = image.height;
  }

  draw(ctx, x, y) {
    this.subDraw(ctx, x, y, 0, 0, this.width, this.height);
  }

  subDraw(ctx, x, y, u, v, width, height) {
    ctx.drawImage(this.source, u, v, width, height, x, y, width, height);
  }
}
