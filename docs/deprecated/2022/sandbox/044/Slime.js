import { EntityBase } from './EntityBase.js';

export class Slime extends EntityBase {
  constructor() {
    super();
  }

  /**
   * @override
   * @param {import('./World.js').RenderContext} ctx
   */
  onRender(ctx) {
    const r = ctx.renderer;
    r.draw('slime');
  }
}
