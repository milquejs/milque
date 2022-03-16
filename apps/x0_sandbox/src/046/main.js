import { Random } from '@milque/random';
import { clamp } from '@milque/util';
import { hex } from 'src/renderer/color.js';
import { DrawContextFixedGLText } from './renderer/DrawContextFixedGLText.js';

document.title = 'Moonset';

/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const { display, assets } = game;
  const canvas = display.canvas;
  const ctx = new DrawContextFixedGLText(canvas.getContext('webgl'));
  ctx.reset();

  const image = assets.get('image:water_tile.png');
  const fontData = assets.get('fnt:m5x7.fnt');
  const fontImage = assets.get('image:m5x7.png');
  const star = assets.get('image:star.png');
  const blurStroke = assets.get('image:blur_stroke.png');
  const circle = assets.get('image:circle.png');
  const mountains = assets.get('image:mountains.png');
  const cloud = assets.get('image:cloud.png');

  const STAR_COLORS = [0xfafafa];
  const GRADIENT_TOP = 0x8278b4;
  const GRADIENT_BOTTOM = 0xb4bee6;
  const STREAK_COLORS = [0xb4a0e6, 0xcdbff2];

  let stars = [];
  let streaks = [];
  let bigStreaks = [];
  let shades = [];
  for (let i = 0; i < 40; ++i) {
    stars.push({
      x: Random.rangeInt(0, canvas.width),
      y: Random.rangeInt(0, canvas.height),
      scale: Random.range(0.1, 0.4),
      opacity: Random.range(0.3, 1),
      color: Random.choose(STAR_COLORS),
      wiggleSpeed: Random.range(0.8, 1.2),
      wiggleOffset: Random.range(0, 2),
    });
  }

  for (let i = 0; i < 12; ++i) {
    let x = Random.range(-canvas.width / 2, canvas.width);
    let y = Random.range(0, canvas.height);
    let color;
    if (y < canvas.width * 0.6) {
      color = STREAK_COLORS[0];
    } else {
      color = STREAK_COLORS[1];
    }
    let scale = Random.range(1, 2);
    streaks.push({
      x,
      y,
      color,
      progress: Random.range(0, canvas.height),
      speed: Random.range(0.1, 1.5),
      opacity: Random.range(0.1, 0.3),
      radius: Random.range(0.5, 1) * scale,
      length: Random.range(1, 2) * scale,
    });
  }

  for (let i = 0; i < 4; ++i) {
    let x = Random.range(-canvas.width / 2, canvas.width);
    let y = Random.rangeInt(0, canvas.height);
    let color = STREAK_COLORS[1];
    bigStreaks.push({
      x,
      y,
      color,
      progress: 0,
      speed: Random.range(0.1, 0.5),
      opacity: Random.range(0.1, 0.5),
      radius: Random.range(0.5, 1) * 3,
      length: Random.range(1, 2) * 3,
    });
  }

  for (let i = 0; i < 6; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(0, canvas.height);
    let color = hex.mix(
      GRADIENT_BOTTOM,
      GRADIENT_TOP,
      clamp(y / canvas.height - 0.06, 0, 1)
    );
    let height = Random.range(50, 80);
    shades.push({
      x,
      y,
      opacity: 1,
      color,
      height,
    });
  }

  let clouds = [];
  for (let i = 0; i < 8; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(0, canvas.height * 0.6);
    let w = Random.range(2, 4);
    let h = Random.range(0.2, 1);
    let highlight = 0xffffff;
    let lowlight = 0xe0eeff;
    clouds.push({
      x,
      y,
      w,
      h,
      highlight,
      lowlight,
      progress: 0,
      speed: Random.range(0.5, 3),
    });
  }

  display.addEventListener('frame', (e) => {
    let { deltaTime, now } = e.detail;

    const worldSpeed = 30;
    deltaTime *= worldSpeed;
    now *= worldSpeed;

    // Update
    for (let s of streaks) {
      s.progress += (deltaTime / 50) * s.speed;
      if (s.progress > s.y * 2 + s.length) {
        let x = Random.range(-canvas.width / 2, canvas.width);
        s.x = x;
        s.y = canvas.height;
        s.progress = 0;
        s.speed = Random.range(0.1, 2);
        s.opacity = Random.range(0.1, 0.3);
        s.radius = Random.range(0.5, 1);
        s.length = Random.range(1, 2);
      }
    }
    for (let s of bigStreaks) {
      s.progress += (deltaTime / 50) * s.speed;
      if (s.progress > s.y * 2 + s.length) {
        let x = Random.range(-canvas.width / 2, canvas.width);
        s.x = x;
        s.y = canvas.height;
        s.progress = 0;
        s.speed = Random.range(0.1, 0.5);
        s.opacity = Random.range(0.1, 0.5);
        s.radius = Random.range(0.5, 1) * 3;
        s.length = Random.range(1, 2) * 3;
      }
    }
    for (let c of clouds) {
      c.progress += (deltaTime / 100) * c.speed;
      if (c.progress > canvas.width - c.x + 300) {
        c.w = Random.range(2, 4);
        c.h = Random.range(0.2, 1);
        c.x = -canvas.width;
        c.y = Random.range(0, canvas.height * 0.6);
        c.progress = 0;
        c.speed = Random.range(0.5, 3);
      }
    }

    // Draw
    ctx.resize();
    ctx.reset();

    ctx.drawGradientRect(
      GRADIENT_TOP,
      GRADIENT_BOTTOM,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Shades
    for (let s of shades) {
      ctx.setColor(s.color);
      ctx.setScale(canvas.width / 16, s.height / 16);
      ctx.setTranslation(s.x, s.y);
      ctx.drawCircle();
      ctx.resetTransform();
    }

    // Streaks
    ctx.setTextureImage(2, blurStroke);
    ctx.setRotation(-45);
    for (let s of streaks) {
      let maxOpacity = s.progress / 100;
      ctx.setColor(s.color);
      ctx.setOpacityFloat(Math.min(maxOpacity, s.opacity));
      ctx.setScale(s.length, s.radius);
      ctx.setTranslation(s.x, s.y);
      ctx.drawTexturedBox(2, s.progress);
    }
    for (let s of bigStreaks) {
      let maxOpacity = s.progress / 100;
      ctx.setColor(s.color);
      ctx.setOpacityFloat(Math.min(maxOpacity, s.opacity));
      ctx.setScale(s.length, s.radius);
      ctx.setTranslation(s.x, s.y);
      ctx.drawTexturedBox(2, s.progress);
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();

    // Stars
    let starOffsetX = (now / 400) % canvas.width;
    let starOffsetY = (now / 400) % canvas.height;
    for (let s of stars) {
      ctx.setColor(s.color);
      ctx.setOpacityFloat(s.opacity);
      ctx.setTextureImage(0, star);
      let f = Math.sin((now / 500) * s.wiggleSpeed + s.wiggleOffset) + 1;
      let x = (s.x + starOffsetX) % canvas.width;
      let y = (s.y + starOffsetY) % canvas.height;
      ctx.drawTexturedBox(
        0,
        x,
        canvas.height - y,
        16 * s.scale,
        16 * s.scale + f * s.scale * 8
      );
    }
    ctx.setOpacityFloat(1);

    // Moon
    ctx.setColor(STAR_COLORS[0]);
    ctx.setTextureImage(3, circle);
    ctx.drawTexturedBox(3, canvas.width * 0.66, 60);

    // Cloud
    ctx.setTextureImage(4, cloud);
    let cloudOffsetY = -cloud.height / 2;
    for (let c of clouds) {
      let x = c.x + c.progress;
      ctx.setColor(c.highlight);
      ctx.setScale(c.w * 1.2, c.h * 1.2);
      ctx.setTranslation(x, c.y);
      let ratio = x / canvas.width;
      ctx.drawTexturedBox(4, 10 * (-ratio * 2 + 1), cloudOffsetY);

      ctx.setColor(c.lowlight);
      ctx.setScale(c.w, c.h);
      ctx.setTranslation(x, c.y);
      ctx.drawTexturedBox(4, 0, cloudOffsetY);
    }
    ctx.resetTransform();

    // Ground
    ctx.setColor(0x726351);
    ctx.drawRect(0, canvas.height - 100, canvas.width, canvas.height);

    // Mountains
    ctx.setColor(0xeed0ff);
    ctx.setTextureImage(4, mountains);
    ctx.drawTexturedBox(4, canvas.width / 2, canvas.height - 100);

    /*
    ctx.setColor(0xFFFFFF);
    ctx.setTextureImage(2, blurStroke);
    ctx.drawTexturedBox(2, 200, 100, 16, 16);

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
    */
  });
}

function drawStreak(ctx, x, y, angle, radius, length) {
  ctx.pushTransform();
  ctx.setTranslation(x, y);
  ctx.setRotation(angle);
  ctx.setScale(1, length);
  ctx.drawCircle(0, 0, radius);
  ctx.popTransform();
}

function drawCapsule(ctx, x, y, radius, length) {
  ctx.drawCircle(x - length, y, radius);
  ctx.drawBox(x, y, length, radius);
  ctx.drawCircle(x + length, y, radius);
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
