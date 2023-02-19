import {
  BufferHelper,
  BufferInfoBuilder,
  ProgramInfoBuilder,
} from '@milque/mogli';
import { OrthographicCamera } from '@milque/scene';
import { mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';

import { hex } from '../../renderer/color.js';
import { FixedGLRenderer2d } from './FixedGLRenderer2d.js';

const WEBGL_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main()
{
    vec4 position = u_projection_view * u_model
        * vec4(a_position.xy, 0.0, 1.0);
    v_texcoord = a_texcoord;
    gl_Position = position;
}`;

const WEBGL_FRAGMENT_SHADER_SOURCE = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform vec4 u_sprite;
uniform vec3 u_color;

void main()
{
    float spriteWidth = u_sprite.z - u_sprite.x;
    float spriteHeight = u_sprite.w - u_sprite.y;
    vec2 texcoord = vec2(
        (u_sprite.x / u_texture_size.x) + v_texcoord.x * (spriteWidth / u_texture_size.x),
        (u_sprite.y / u_texture_size.y) + v_texcoord.y * (spriteHeight / u_texture_size.y));
    vec4 texcolor = texture2D(u_texture, texcoord);
    if (texcolor.a < 0.5) discard;
    gl_FragColor = vec4(
        texcolor.r * u_color.r,
        texcolor.g * u_color.g,
        texcolor.b * u_color.b,
        texcolor.a);
}`;

const QUAD_VERTICES = [
  // Top-Left
  0, 0, 1, 0, 0, 1,
  // Bottom-Right
  1, 1, 1, 0, 0, 1,
];

export class FixedSpriteGLRenderer2d extends FixedGLRenderer2d {
  constructor(canvas) {
    super(canvas);
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    /**
     * @protected
     * @type {ProgramInfo}
     */
    this.program = new ProgramInfoBuilder(gl)
      .shader(gl.VERTEX_SHADER, WEBGL_VERTEX_SHADER_SOURCE)
      .shader(gl.FRAGMENT_SHADER, WEBGL_FRAGMENT_SHADER_SOURCE)
      .link();
    /** @protected */
    this.meshQuad = {
      /** @type {BufferInfo} */
      position: new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
        .data(BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES))
        .build(),
      /** @type {BufferInfo} */
      texcoord: new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
        .data(BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES))
        .build(),
    };
    this.program
      .bind(gl)
      .attribute('a_position', gl.FLOAT, this.meshQuad.position.handle)
      .attribute('a_texcoord', gl.FLOAT, this.meshQuad.texcoord.handle);
    /** @protected */
    this.camera = new OrthographicCamera();
    /** @protected */
    this.projectionViewMatrix = mat4.create();
    /** @protected */
    this.modelMatrix = mat4.create();
    /** @protected */
    this.spriteVector = vec4.fromValues(0, 0, 1, 1);
    /** @protected */
    this.textureSize = vec2.fromValues(1, 1);
    /** @protected */
    this.textureHandle = null;
    /** @protected */
    this.textureList = new Array(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
    /** @protected */
    this.frameMap = {};
    /** @protected */
    this.spriteMap = {};
    /** @protected */
    this.defaultSprite = { frames: [] };
    /** @protected */
    this.spriteColor = vec3.fromValues(1, 1, 1);
    this.program.bind(gl).uniform('u_color', this.spriteColor);
    /** @protected */
    this.spriteDepth = 0;
  }

  prepare() {
    this.resetTransform();
    this.resize();
    this.clear();
    this.color(0xffffff);
    this.zLevel(0);
  }

  resize() {
    const gl = this.gl;
    const viewportWidth = gl.canvas.width;
    const viewportHeight = gl.canvas.height;

    gl.viewport(0, 0, viewportWidth, viewportHeight);

    let camera = this.camera;
    camera.resize(viewportWidth, viewportHeight);

    let projViewMatrix = this.projectionViewMatrix;
    mat4.mul(projViewMatrix, camera.projectionMatrix, camera.viewMatrix);

    // Set the projection view matrix
    let program = this.program;
    program.bind(gl).uniform('u_projection_view', projViewMatrix);
  }

  clear(color = 0x000000) {
    const gl = this.gl;
    gl.clearColor(
      hex.redf(color),
      hex.greenf(color),
      hex.bluef(color),
      hex.alphaf(color)
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.resetTransform();
  }

  /**
   * Registers a texture for the given texture unit slot.
   *
   * @param {number} textureUnit The unique texture unit slot to use for
   * this image.
   * @param {Image} image The texture image source.
   * @param {string} [frameName] If defined, a full texture frame will
   * be created for the given name.
   * @returns {FixedSpriteGLRenderer2d}
   */
  texture(textureUnit, image, frameName = undefined) {
    let maxTextureCount = this.textureList.length;
    if (textureUnit < 0 || textureUnit >= maxTextureCount) {
      throw new Error(
        `Invalid texture unit - must be within range [0, ${
          maxTextureCount - 1
        }]`
      );
    }
    const gl = this.gl;
    let prevTexture = this.textureList[textureUnit];
    if (prevTexture) destroyTexture(gl, prevTexture.handle);
    this.textureList[textureUnit] = createTexture(gl, image);
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    if (typeof frameName !== 'undefined') {
      this.frame(frameName, textureUnit);
    }
    return this;
  }

  /**
   *
   * @param {string} frameName The name of the frame.
   * @param {number} [textureUnit=0] The texture unit slot to use as the
   * texture source for the frame.
   * @param {number} [u=0] The left coordinate of the frame in the texture.
   * @param {number} [v=0] The top coordinate of the frame in the texture.
   * @param {number} [s] The right coordinate of the frame in the texture.
   * If undefined, will be set to the bound texture width.
   * @param {number} [t] The bottom coordinate of the frame in the texture.
   * If undefined, will be set to the bound texture height.
   * @returns {FixedSpriteGLRenderer2d}
   */
  frame(
    frameName,
    textureUnit = 0,
    u = 0,
    v = 0,
    s = undefined,
    t = undefined
  ) {
    let texture = this.textureList[textureUnit];
    if (!texture) {
      throw new Error(`Missing bound texture for texture unit ${textureUnit}.`);
    }
    if (typeof s === 'undefined') s = texture.width;
    if (typeof t === 'undefined') t = texture.height;
    let frameMap = this.frameMap;
    frameMap[frameName] = [textureUnit, u, v, s, t];
    return this;
  }

  sprite(spriteName, frames) {
    let spriteMap = this.spriteMap;
    spriteMap[spriteName] = {
      frames,
    };
    return this;
  }

  color(color = 0xffffff) {
    const gl = this.gl;
    let program = this.program;
    let colorVector = this.spriteColor;
    vec3.set(colorVector, hex.redf(color), hex.greenf(color), hex.bluef(color));
    // Set the sprite color vector
    program.bind(gl).uniform('u_color', colorVector);
    return this;
  }

  zLevel(level = 0) {
    this.spriteDepth = level;
    return this;
  }

  drawRect(
    spriteName,
    frameIndex = 0,
    left = 0,
    top = 0,
    right = left,
    bottom = top
  ) {
    let spriteMap = this.spriteMap;
    let sprite;
    if (spriteName in spriteMap) {
      sprite = spriteMap[spriteName];
    } else {
      let frameMap = this.frameMap;
      let defaultSprite = this.defaultSprite;
      let defaultFrames = defaultSprite.frames;
      defaultFrames.length = 0;
      if (spriteName in frameMap) {
        defaultFrames.push(spriteName);
      }
      sprite = defaultSprite;
    }
    let frameCount = sprite.frames.length;
    if (frameCount <= 0) return this;
    frameIndex = Math.floor(frameIndex) % frameCount;

    let frameMap = this.frameMap;
    let frameName = sprite.frames[frameIndex];
    let frame = frameMap[frameName];
    const [textureUnit, u, v, s, t] = frame;
    let texture = this.textureList[textureUnit];
    const { handle, width, height } = texture;

    this.textureHandle = handle;
    vec2.set(this.textureSize, width, height);
    vec4.set(this.spriteVector, u, v, s, t);

    let w = right - left;
    let h = bottom - top;
    let spriteW = s - u;
    let spriteH = t - v;
    let scaleX = w / spriteW;
    let scaleY = h / spriteH;
    let x = left + (spriteW / 2) * scaleX;
    let y = top + (spriteH / 2) * scaleY;
    const gl = this.gl;
    drawSprite(
      gl,
      this.program,
      this.meshQuad,
      this.peekTransform(),
      this.modelMatrix,
      this.textureHandle,
      this.textureSize,
      this.spriteVector,
      x,
      y,
      this.spriteDepth,
      0,
      scaleX,
      scaleY
    );
    return this;
  }

  draw(
    spriteName,
    frameIndex = 0,
    x = 0,
    y = 0,
    angle = 0,
    scaleX = 1,
    scaleY = scaleX
  ) {
    let spriteMap = this.spriteMap;
    let sprite;
    if (spriteName in spriteMap) {
      sprite = spriteMap[spriteName];
    } else {
      let frameMap = this.frameMap;
      let defaultSprite = this.defaultSprite;
      let defaultFrames = defaultSprite.frames;
      defaultFrames.length = 0;
      if (spriteName in frameMap) {
        defaultFrames.push(spriteName);
      }
      sprite = defaultSprite;
    }
    let frameCount = sprite.frames.length;
    if (frameCount <= 0) return this;
    frameIndex = Math.floor(frameIndex) % frameCount;

    let frameMap = this.frameMap;
    let frameName = sprite.frames[frameIndex];
    let frame = frameMap[frameName];
    const [textureUnit, u, v, s, t] = frame;
    let texture = this.textureList[textureUnit];
    const { handle, width, height } = texture;

    this.textureHandle = handle;
    vec2.set(this.textureSize, width, height);
    vec4.set(this.spriteVector, u, v, s, t);

    const gl = this.gl;
    drawSprite(
      gl,
      this.program,
      this.meshQuad,
      this.peekTransform(),
      this.modelMatrix,
      this.textureHandle,
      this.textureSize,
      this.spriteVector,
      x,
      y,
      this.spriteDepth,
      angle,
      scaleX,
      scaleY
    );
    return this;
  }
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {Image} image
 * @returns {{ handle: WebGLTexture, width: number, height: number }}
 */
function createTexture(gl, image) {
  if (!(image instanceof Image)) {
    throw new Error(`Not a valid image ${image}.`);
  }

  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;

  let handle = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, handle);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    image
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return {
    handle,
    width: image.width,
    height: image.height,
  };
}

/**
 * @param {WebGLRenderingContext} gl
 * @param {WebGLTexture} textureHandle
 */
function destroyTexture(gl, textureHandle) {
  gl.deleteTexture(textureHandle);
}

function drawSprite(
  gl,
  program,
  mesh,
  transformationMatrix,
  modelMatrix,
  textureHandle,
  textureSize,
  spriteVector,
  x,
  y,
  z,
  angle,
  scaleX,
  scaleY
) {
  const { position, texcoord } = mesh;
  let spriteWidth = spriteVector[2] - spriteVector[0];
  let spriteHeight = spriteVector[3] - spriteVector[1];
  mat4.fromRotationTranslationScaleOrigin(
    modelMatrix,
    quat.fromEuler(quat.create(), 0, 0, angle),
    vec3.fromValues(x - spriteWidth / 2, y - spriteHeight / 2, z),
    vec3.fromValues(scaleX, scaleY, 1),
    vec3.fromValues(spriteWidth / 2, spriteHeight / 2, 0)
  );
  // Scale with respect to top-left (instead of origin)
  mat4.scale(
    modelMatrix,
    modelMatrix,
    vec3.fromValues(spriteWidth, spriteHeight, 1)
  );
  if (transformationMatrix) {
    mat4.mul(modelMatrix, transformationMatrix, modelMatrix);
  }
  if (textureHandle) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureHandle);
  }
  program
    .bind(gl)
    .attribute('a_position', gl.FLOAT, position.handle)
    .attribute('a_texcoord', gl.FLOAT, texcoord.handle)
    .uniform('u_model', modelMatrix)
    .uniform('u_texture', 0)
    .uniform('u_sprite', spriteVector)
    .uniform('u_texture_size', textureSize)
    .draw(gl, gl.TRIANGLES, 0, 6);
}
