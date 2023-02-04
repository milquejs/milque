import { DrawContextFixedGLGradient } from './DrawContextFixedGLGradient.js';

export class DrawContextFixedGLText extends DrawContextFixedGLGradient {
  /**
   * @param {WebGLRenderingContext} gl
   * @param {HTMLCanvasElement} [canvas]
   * @param {import('@milque/scene').Camera} [camera]
   */
  constructor(gl, canvas = undefined, camera = undefined) {
    super(gl, canvas, camera);

    /** @protected */
    this.bmFontMap = {};
  }

  setBMFontTexture(textureUnit, textureImage, bmFontData) {
    let chars = {};
    for (let c of bmFontData.chars) {
      let u = c.x;
      let v = c.y;
      let s = u + c.width;
      let t = v + c.height;
      chars[c.id] = {
        u,
        v,
        s,
        t,
      };
    }
    this.bmFontMap[textureUnit] = chars;
    this.setTextureImage(textureUnit, textureImage);
  }

  drawText(textureUnit, text, x, y) {
    let rootX = x;
    let spacingX = 13;
    let spacingY = 18;
    for (let i = 0; i < text.length; ++i) {
      let c = text.charAt(i);
      if (c === '\n') {
        y += spacingY;
        x = rootX;
        continue;
      } else if (c === ' ') {
        x += spacingX;
        continue;
      } else {
        x += spacingX;
        let charCode = text.charCodeAt(i);
        let { u, v, s, t } = this.bmFontMap[textureUnit][charCode];
        let w = s - u;
        let h = t - v;
        this.drawTexturedBox(textureUnit, x, y, w / 2, h / 2, u, v, s, t);
      }
    }
  }
}
