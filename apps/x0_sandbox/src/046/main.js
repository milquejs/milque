import { DrawContextFixedGLText } from './renderer/DrawContextFixedGLText.js';

/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const { display, assets } = game;
  const canvas = display.canvas;
  const ctx = new DrawContextFixedGLText(canvas.getContext('webgl'));
  ctx.reset();

  const image = assets.getAsset('image:water_tile.png');
  const fontData = assets.getAsset('fnt:m5x7.fnt');
  const fontImage = assets.getAsset('image:m5x7.png');

  display.addEventListener('frame', (e) => {
    const { deltaTime } = e.detail;
    ctx.resize();

    ctx.drawGradientRect(0xd9fcfa, 0xf2884f, 0, 0, canvas.width, canvas.height);

    ctx.setColor(0x0000aa);
    drawLineShapes(ctx);

    ctx.setColor(0x00aa66);
    drawFillShapes(ctx);

    ctx.setTranslation(100, 100, 0);
    ctx.setScale(2, 2);
    ctx.setRotation(45);
    ctx.setColor(0xffffff);
    drawLineShapes(ctx);
    drawFillShapes(ctx);
    ctx.setTextureImage(0, image);
    ctx.drawTexturedBox(0, 72, 32);
    ctx.setColor(0xff0000);
    ctx.setBMFontTexture(1, fontImage, fontData);
    ctx.drawText(1, 'Do we need more donuts?', 100, 32);
    ctx.resetTransform();

    ctx.setColor(0xffffff);
    ctx.setTextureImage(0, image);
    ctx.drawTexturedBox(0, 72, 32);

    ctx.setColor(0xff0000);
    ctx.setBMFontTexture(1, fontImage, fontData);
    ctx.drawText(1, 'Do we need more donuts?', 100, 32);

    ctx.setColor(0xffffff);
  });
}

function drawLineShapes(ctx) {
  ctx.drawLine(16, 16);
  ctx.drawLineBox(24, 32);
  ctx.drawLineRect(16, 48, 40, 64);
  ctx.drawLineCircle(24, 80);
}

function drawFillShapes(ctx) {
  ctx.drawRay(40, 16);
  ctx.drawBox(48, 32);
  ctx.drawRect(48, 48, 56, 64);
  ctx.drawCircle(48, 80);
}
