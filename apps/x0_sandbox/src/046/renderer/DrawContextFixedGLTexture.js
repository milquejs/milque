import {
  BufferHelper,
  BufferInfoBuilder,
  ProgramInfoBuilder,
} from '@milque/mogli';
import { mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';
import {
  DrawContextFixedGLShape,
  QUAD_VERTICES,
} from './DrawContextFixedGLShape';

/** @typedef {import('@milque/mogli').BufferInfo} BufferInfo */

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform mat4 u_projection_view;
uniform mat4 u_model;

void main() {
    vec4 position = u_projection_view * u_model
        * vec4(a_position.xy, 0.0, 1.0);
    v_texcoord = a_texcoord;
    gl_Position = position;
}`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_texture_size;
uniform vec4 u_sprite;
uniform vec3 u_color;
uniform float u_opacity_inv;

void main() {
    float spriteWidth = u_sprite.z - u_sprite.x;
    float spriteHeight = u_sprite.w - u_sprite.y;
    vec2 texcoord = vec2(
        (u_sprite.x / u_texture_size.x) + v_texcoord.x * (spriteWidth / u_texture_size.x),
        (u_sprite.y / u_texture_size.y) + v_texcoord.y * (spriteHeight / u_texture_size.y));
    vec4 texcolor = texture2D(u_texture, texcoord);
    if (texcolor.a <= 0.0) discard;
    gl_FragColor = vec4(
        texcolor.r * u_color.r,
        texcolor.g * u_color.g,
        texcolor.b * u_color.b,
        texcolor.a * (1.0 - u_opacity_inv));
}`;

export class DrawContextFixedGLTexture extends DrawContextFixedGLShape {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {HTMLCanvasElement} [canvas]
   * @param {import('@milque/scene').Camera} [camera]
   */
  constructor(gl, canvas = undefined, camera = undefined) {
    super(gl, canvas, camera);
    /** @protected */
    this.texturedProgram = new ProgramInfoBuilder(gl)
      .shader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
      .shader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE)
      .link();
    /** @protected */
    this.meshQuadTextured = {
      /** @type {BufferInfo} */
      position: new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
        .data(BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES))
        .build(),
      /** @type {BufferInfo} */
      texcoord: new BufferInfoBuilder(gl, gl.ARRAY_BUFFER)
        .data(BufferHelper.createBufferSource(gl, gl.FLOAT, QUAD_VERTICES))
        .build(),
    };

    /** @protected */
    this.spriteVector = vec4.fromValues(0, 0, 1, 1);
    /** @protected */
    this.textureSize = vec2.fromValues(1, 1);
    /** @protected */
    this.textureHandle = null;
    /** @protected */
    this.textureList = new Array(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
  }

  /** @override */
  resize() {
    super.resize();
    this.texturedProgram
      .bind(this.gl)
      .uniform('u_projection_view', this.projectionViewMatrix);
  }

  /** @override */
  setColorVector(redf, greenf, bluef) {
    super.setColorVector(redf, greenf, bluef);
    this.texturedProgram.bind(this.gl).uniform('u_color', this.colorVector);
    return this;
  }

  /** @override */
  setOpacityFloat(opacity) {
    super.setOpacityFloat(opacity);
    this.texturedProgram.bind(this.gl).uniform('u_opacity_inv', 1 - this.opacityFloat);
    return this;
  }

  /**
   * Registers a texture for the given texture unit slot.
   *
   * @param {number} textureUnit The unique texture unit
   * slot to use for this image.
   * @param {Image} image The texture image source.
   */
  setTextureImage(textureUnit, image) {
    let textureList = this.textureList;
    let maxTextureCount = textureList.length;
    if (textureUnit < 0 || textureUnit >= maxTextureCount) {
      throw new Error(
        `Invalid texture unit - must be within range [0, ${
          maxTextureCount - 1
        }]`
      );
    }
    const gl = this.gl;
    const prevTexture = textureList[textureUnit];
    if (prevTexture) {
      destroyTexture(gl, prevTexture.handle);
    }
    let texture = createTexture(gl, image);
    textureList[textureUnit] = texture;
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture.handle);
    return this;
  }

  drawTexturedBox(
    textureUnit = 0,
    x = 0,
    y = 0,
    rx = undefined,
    ry = undefined,
    u = 0,
    v = 0,
    s = undefined,
    t = undefined
  ) {
    let { width: textureWidth, height: textureHeight } =
      this.textureList[textureUnit];
    vec2.set(this.textureSize, textureWidth, textureHeight);
    if (typeof s === 'undefined') {
      s = textureWidth;
    }
    if (typeof t === 'undefined') {
      t = textureHeight;
    }
    vec4.set(this.spriteVector, u, v, s, t);

    let spriteWidth = s - u;
    let spriteHeight = t - v;
    let flag = false;
    if (typeof rx === 'undefined') {
      rx = spriteWidth / 2;
    } else {
      flag = true;
    }
    if (typeof ry === 'undefined') {
      if (flag) {
        ry = rx;
      } else {
        ry = spriteHeight / 2;
      }
    }
    let width = rx * 2;
    let height = ry * 2;
    let scaleX = width / spriteWidth;
    let scaleY = height / spriteHeight;
    return this.drawTexturedQuadImpl(
      textureUnit,
      x,
      y,
      this.depthFloat,
      scaleX,
      scaleY
    );
  }

  drawTexturedRect(
    textureUnit = 0,
    left = 0,
    top = 0,
    right = undefined,
    bottom = undefined,
    u = 0,
    v = 0,
    s = undefined,
    t = undefined
  ) {
    let { width, height } = this.textureList[textureUnit];
    if (typeof s === 'undefined') {
      s = width;
    }
    if (typeof t === 'undefined') {
      t = height;
    }
    vec2.set(this.textureSize, width, height);
    vec4.set(this.spriteVector, u, v, s, t);

    if (typeof right === 'undefined') {
      right = left + width;
    }
    if (typeof bottom === 'undefined') {
      bottom = top + height;
    }
    let w = right - left;
    let h = bottom - top;
    let spriteWidth = s - u;
    let spriteHeight = t - v;
    let scaleX = w / spriteWidth;
    let scaleY = h / spriteHeight;
    let x = left + (spriteWidth / 2) * scaleX;
    let y = top + (spriteHeight / 2) * scaleY;
    return this.drawTexturedQuadImpl(
      textureUnit,
      x,
      y,
      this.depthFloat,
      scaleX,
      scaleY
    );
  }

  /** @private */
  drawTexturedQuadImpl(textureUnit, x, y, z, scaleX, scaleY) {
    const gl = this.gl;
    let spriteVector = this.spriteVector;
    let spriteWidth = spriteVector[2] - spriteVector[0];
    let spriteHeight = spriteVector[3] - spriteVector[1];
    let modelMatrix = this.modelMatrix;
    mat4.fromRotationTranslationScaleOrigin(
      modelMatrix,
      quat.fromEuler(quat.create(), 0, 0, 0),
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
    this.applyTransform(modelMatrix);
    let mesh = this.meshQuadTextured;
    let textureSize = this.textureSize;
    this.texturedProgram
      .bind(gl)
      .attribute('a_position', gl.FLOAT, mesh.position.handle)
      .attribute('a_texcoord', gl.FLOAT, mesh.texcoord.handle)
      .uniform('u_model', modelMatrix)
      .uniform('u_texture', textureUnit)
      .uniform('u_sprite', spriteVector)
      .uniform('u_texture_size', textureSize)
      .draw(gl, gl.TRIANGLES, 0, 6);
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
