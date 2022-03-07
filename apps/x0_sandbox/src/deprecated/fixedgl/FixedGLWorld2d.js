import { FixedSpriteGLRenderer2d } from './FixedSpriteGLRenderer2d.js';

const NULL_SPRITE_INFO = {
  spriteName: 'font.0',
  spriteIndex: 0,
  spriteSpeed: 0,
};
const FRAMES_PER_SECOND = 60;
const MILLIS_PER_FRAME = 1000 / FRAMES_PER_SECOND;
export class FixedGLWorld2d {
  constructor(game) {
    /** @private */
    this.game = game;
    /** @private */
    this.renderer = new FixedSpriteGLRenderer2d(game.display.canvas);
    /** @private */
    this.objects = [];
  }

  async load() {
    const { assets } = this.game;
    let renderer = this.renderer;
    renderer.texture(0, assets.getAsset('image:font.png'), 'font.all');
    loadFontSprite(renderer, 0);
  }

  registerTextureAtlas(textureUnit, image, atlas) {
    let renderer = this.renderer;
    renderer.texture(textureUnit, image);
    loadSpritesFromAtlas(renderer, 1, atlas);
    return this;
  }

  registerTexture(textureUnit, image, textureName = undefined) {
    let renderer = this.renderer;
    renderer.texture(textureUnit, image, textureName);
    return this;
  }

  createSprite(spriteName, x = 0, y = 0) {
    let obj = this.createObject(x, y);
    obj.renderType = 'sprite';
    obj.renderInfo = {
      spriteName: spriteName,
      spriteIndex: 0,
      spriteSpeed: 1,
      visible: true,
    };
    return obj;
  }

  createText(text, x = 0, y = 0) {
    let obj = this.createObject(x, y);
    obj.renderType = 'text';
    obj.renderInfo = {
      text: text,
      visible: true,
    };
    return obj;
  }

  createObject(x = 0, y = 0) {
    let obj = new FixedObject2d(this);
    obj.x = x;
    obj.y = y;
    this.objects.push(obj);
    return obj;
  }

  destroyObject(obj) {
    let i = this.objects.indexOf(obj);
    if (i >= 0) {
      this.objects.splice(i, 1);
    }
  }

  getObjects() {
    return this.objects;
  }

  draw() {
    const { deltaTime } = this.game;
    const dt = deltaTime / MILLIS_PER_FRAME;
    const renderer = this.renderer;
    renderer.prepare();
    for (let obj of this.objects) {
      // Update render info
      switch (obj.renderType) {
        case 'sprite':
          obj.renderInfo.spriteIndex += obj.renderInfo.spriteSpeed * dt;
          if (!obj.renderInfo.visible) continue;
          break;
        case 'text':
          if (!obj.renderInfo.visible) continue;
          break;
        default:
          break;
      }
      // Draw render info
      this.drawObject(obj);
    }
  }

  drawObject(obj) {
    const renderer = this.renderer;
    switch (obj.renderType) {
      case 'null':
        drawSprite(renderer, obj, NULL_SPRITE_INFO);
        break;
      case 'sprite':
        drawSprite(renderer, obj, obj.renderInfo);
        break;
      case 'text':
        drawText(renderer, obj, obj.renderInfo);
        break;
    }
  }
}

/**
 * @param {FixedSpriteGLRenderer2d} renderer
 */
function drawSprite(renderer, gameObject, spriteInfo) {
  renderer.draw(
    spriteInfo.spriteName,
    spriteInfo.spriteIndex,
    gameObject.x,
    gameObject.y,
    gameObject.rotation,
    gameObject.scaleX,
    gameObject.scaleY
  );
}

/**
 * @param {FixedSpriteGLRenderer2d} renderer
 */
function drawText(renderer, gameObject, textInfo) {
  let { x, y } = gameObject;
  let text = textInfo.text;

  let rootX = x;
  let rootIndex = 'A'.charCodeAt(0);
  text = text.toUpperCase();
  for (let i = 0; i < text.length; ++i) {
    let c = text.charAt(i);
    if (c === '\n') {
      y += 8;
      x = rootX;
      continue;
    } else if (c === ' ') {
      x += 8;
      continue;
    } else {
      x += 8;
      let frame = Math.abs(text.charCodeAt(i) - rootIndex) % 40;
      renderer.draw('font', frame, x, y);
    }
  }
}

class FixedObject2d {
  constructor(world) {
    this.world = world;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.renderType = 'null';
    this.renderInfo = null;
  }
}

/** @param {FixedSpriteGLRenderer2d} renderer */
function loadFontSprite(renderer, textureUnit) {
  let frames = [];
  let w = 8;
  let h = 8;
  for (let i = 0; i < 40; ++i) {
    let u = (i % 8) * w;
    let v = Math.floor(i / 8) * h;
    let s = u + w;
    let t = v + h;
    let name = `font.${i}`;
    frames.push(name);
    renderer.frame(name, textureUnit, u, v, s, t);
  }
  renderer.sprite('font', frames);
}

/** @param {FixedSpriteGLRenderer2d} renderer */
function loadSpritesFromAtlas(renderer, textureUnit, atlas) {
  for (let sprite of Object.values(atlas)) {
    const { u, v, w, h, cols, rows, name } = sprite;
    let frames = [];
    for (let i = 0; i < cols; ++i) {
      for (let j = 0; j < rows; ++j) {
        let frameName = `${name}.${i}`;
        frames.push(frameName);
        renderer.frame(
          frameName,
          textureUnit,
          u + i * w,
          v + j * h,
          u + (i + 1) * w,
          v + (j + 1) * h
        );
      }
    }
    renderer.sprite(`${name}`, frames);
  }
}
