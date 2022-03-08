import { Random } from '@milque/random';
import { clamp } from '@milque/util';
import { hex } from 'src/renderer/color.js';
import { DrawContextFixedGLText } from 'src/renderer/drawcontext/DrawContextFixedGLText.js';

document.title = 'Moonsea';
/**
 * @param {import('../game/Game.js').Game} game
 */
export async function main(game) {
  const { display, assets } = game;
  const canvas = display.canvas;
  const ctx = new DrawContextFixedGLText(canvas.getContext('webgl'));
  ctx.reset();

  const star = assets.getAsset('image:star.png');
  const blurStroke = assets.getAsset('image:blur_stroke.png');
  const circle = assets.getAsset('image:circle.png');
  const mountains = assets.getAsset('image:mountains.png');
  const cloud = assets.getAsset('image:cloud.png');
  const waveA = assets.getAsset('image:wave1.png');
  const waveB = assets.getAsset('image:wave2.png');

  const STAR_COLORS = [
    0xfafafa
  ];
  const GRADIENT_TOP = 0x8278b4;
  const GRADIENT_BOTTOM = 0xb4bee6;
  const STREAK_COLORS = [
    0xb4a0e6,
    0xcdbff2,
  ];
  const SEA_COLUMN_COLORS = [
    0xa2bee5,
    0x5381c1,
    0x4c4593,
  ];
  const SEA_ROWS_COLORS = [
    0x4979bc,
    0x3865a5,
    0x1b4f99,
    0x184789,
  ];

  const stars = [];
  for(let i = 0; i < 40; ++i) {
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

  const streaks = [];
  for(let i = 0; i < 12; ++i) {
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
      x, y,
      color,
      progress: Random.range(0, canvas.height),
      speed: Random.range(0.1, 1.5),
      opacity: Random.range(0.1, 0.3),
      radius: Random.range(0.5, 1) * scale,
      length: Random.range(1, 2) * scale,
    });
  }

  const bigStreaks = [];
  for(let i = 0; i < 4; ++i) {
    let x = Random.range(-canvas.width / 2, canvas.width);
    let y = Random.rangeInt(0, canvas.height);
    let color = STREAK_COLORS[1];
    bigStreaks.push({
      x, y,
      color,
      progress: 0,
      speed: Random.range(0.1, 0.5),
      opacity: Random.range(0.1, 0.5),
      radius: Random.range(0.5, 1) * 3,
      length: Random.range(1, 2) * 3,
    });
  }

  const shades = [];
  for(let i = 0; i < 6; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(0, canvas.height);
    let color = hex.mix(GRADIENT_BOTTOM, GRADIENT_TOP, clamp(y / canvas.height -0.06, 0, 1));
    let height = Random.range(50, 80);
    shades.push({
      x,
      y,
      opacity: 1,
      color,
      height,
    });
  }

  const clouds = [];
  for(let i = 0; i < 8; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(0, canvas.height * 0.6);
    let w = Random.range(2, 4);
    let h = Random.range(0.2, 1);
    let highlight = 0xFFFFFF;
    let lowlight = 0xE0EEFF;
    clouds.push({
      x, y,
      w, h,
      highlight,
      lowlight,
      progress: 0,
      speed: Random.range(0.5, 3),
    });
  }

  const seaSparkles = [];
  for(let i = 0; i < 60; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(canvas.height - 190, canvas.height - 150);
    seaSparkles.push({
      x, y,
      sparkleOffset: Random.range(0, Math.PI * 2),
    });
  }

  const seaFoam = [];
  for(let i = 0; i < 40; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(canvas.height - 150, canvas.height);
    let wave = Random.choose([0, 1]);
    seaFoam.push({
      x, y,
      wave,
      opacity: Random.range(0, Math.PI * 2),
    });
  }

  const seaColumn = [];
  for(let i = 0; i < 10; ++i) {
    let x = Random.range(0, canvas.width);
    let color = Random.choose(SEA_COLUMN_COLORS);
    let width = Random.range(50, 100);
    seaColumn.push({
      x,
      color,
      width,
    });
  }

  const seaRows = [];
  for(let i = 0; i < 8; ++i) {
    let x = Random.range(0, canvas.width);
    let y = Random.range(canvas.height - 190, canvas.height - 20);
    let height = Random.range(20, 60);
    let color;
    if (Random.next() < 0.6) {
      let dy = ((y - (canvas.height - 190)) / 200);
      if (dy < 0.3) {
        color = SEA_ROWS_COLORS[0];
      } else if (dy < 0.6) {
        color = SEA_ROWS_COLORS[1];
      } else {
        color = SEA_ROWS_COLORS[2];
      }
    } else {
      color = Random.choose(SEA_ROWS_COLORS);
    }
    seaRows.push({
      x, y,
      color,
      height,
    });
  }
  
  display.addEventListener('frame', (e) => {
    let { deltaTime, now } = e.detail;

    const worldSpeed = 1;
    deltaTime *= worldSpeed;
    now *= worldSpeed;

    // Update
    for(let s of streaks) {
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
    for(let s of bigStreaks) {
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
    for(let c of clouds) {
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

    ctx.drawGradientRect(GRADIENT_TOP, GRADIENT_BOTTOM, 0, 0, canvas.width, canvas.height);

    // Shades
    for(let s of shades) {
      ctx.setColor(s.color);
      ctx.setScale(canvas.width / 16, s.height / 16);
      ctx.setTranslation(s.x, s.y);
      ctx.drawCircle();
      ctx.resetTransform();
    }

    // Streaks
    ctx.setTextureImage(2, blurStroke);
    ctx.setRotation(-45);
    for(let s of streaks) {
      let maxOpacity = s.progress / 100;
      ctx.setColor(s.color);
      ctx.setOpacityFloat(Math.min(maxOpacity, s.opacity));
      ctx.setScale(s.length, s.radius);
      ctx.setTranslation(s.x, s.y);
      ctx.drawTexturedBox(2, s.progress);
    }
    for(let s of bigStreaks) {
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
    for(let s of stars) {
      ctx.setColor(s.color);
      ctx.setOpacityFloat(s.opacity);
      ctx.setTextureImage(0, star);
      let f = Math.sin((now / 500) * s.wiggleSpeed + s.wiggleOffset) + 1;
      let x = (s.x + starOffsetX) % canvas.width;
      let y = (s.y + starOffsetY) % canvas.height;
      ctx.drawTexturedBox(0, x, canvas.height - y, 16 * s.scale, 16 * s.scale + f * s.scale * 8);
    }
    ctx.setOpacityFloat(1);

    // Moon
    ctx.setColor(STAR_COLORS[0]);
    ctx.setTextureImage(3, circle);
    ctx.drawTexturedBox(3, canvas.width * 0.66, 200);

    // Cloud
    ctx.setTextureImage(4, cloud);
    let cloudOffsetY = -cloud.height / 2;
    for(let c of clouds) {
      let x = c.x + c.progress;
      ctx.setColor(c.highlight);
      ctx.setScale(c.w * 1.2, c.h * 1.2);
      ctx.setTranslation(x, c.y);
      let ratio = (x / canvas.width);
      ctx.drawTexturedBox(4, (10 * (-ratio * 2 + 1)), cloudOffsetY);

      ctx.setColor(c.lowlight);
      ctx.setScale(c.w, c.h);
      ctx.setTranslation(x, c.y);
      ctx.drawTexturedBox(4, 0, cloudOffsetY);
    }
    ctx.resetTransform();

    // Sea
    let horizon = canvas.height - 200;
    ctx.setColor(0xFFFFFF);
    ctx.drawGradientRect(0x4979bc, 0x1b4f99, 0, horizon, canvas.width, canvas.height);
    
    // Sea Column
    ctx.setOpacityFloat(0.6);
    for(let s of seaColumn) {
      ctx.setColor(s.color);
      ctx.drawRect(s.x, horizon, s.x + s.width, canvas.height);
    }
    ctx.setOpacityFloat(1);

    // Sea Rows
    for(let s of seaRows) {
      ctx.setColor(s.color);
      ctx.setScale(s.height, 1);
      ctx.setTranslation(s.x, s.y);
      ctx.drawCircle();
    }
    ctx.resetTransform();

    let startSparkleY = canvas.height - 150;
    let sparkleRangeY = startSparkleY - horizon;
    // Sea Sparkles
    ctx.setRotation(45);
    for(let s of seaSparkles) {
      ctx.setColor(0xFFFFFF);
      let opacity = (Math.sin(now / 1000 + s.sparkleOffset) + 1) / 2;
      ctx.setOpacityFloat(opacity);
      let dx = 10 * (Math.sin(now / 5000 + s.sparkleOffset) + 1) / 2;
      ctx.setTranslation(s.x + dx, s.y);
      let dy = (horizon - s.y) / sparkleRangeY;
      ctx.setScale(0.5 + dy, 0.5 + dy);
      ctx.drawBox();
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();

    let foamRangeY = canvas.height - horizon;
    // Sea Foam
    for(let s of seaFoam) {
      ctx.setColor(0xFFFFFF);
      let opacity = clamp((Math.sin(now / 1000 + s.opacity) + 1) / 2 * 2, 0, 1);
      ctx.setOpacityFloat(opacity);
      let dx = 100 * (Math.sin(now / 5000 + s.opacity) + 1) / 2;
      ctx.setTranslation(s.x + dx, s.y);
      let dy = (s.y - startSparkleY) / foamRangeY;
      ctx.setScale(0.1 + dy, (0.1 + dy) * 0.5);
      let wave;
      switch(s.wave) {
        case 0:
          wave = waveA;
          break;
        default:
        case 1:
          wave = waveB;
          break;
      }
      ctx.setTextureImage(5, wave);
      ctx.drawTexturedBox(5);
    }
    ctx.setOpacityFloat(1);
    ctx.resetTransform();
  });
}
