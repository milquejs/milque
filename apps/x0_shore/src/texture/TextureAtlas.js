import { Texture } from './Texture.js';

export class TextureAtlas extends Texture
{
    constructor(image)
    {
        super(image);
        this.textures = {};
    }

    addSubTexture(name, u, v, width, height, cols = 1, rows = 1)
    {
        this.textures[name] = new SubTexture(this.source, u, v, width, height, cols, rows);
        return this;
    }

    remove(name)
    {
        delete this.textures[name];
        return this;
    }

    clear()
    {
        this.textures = {};
        return this;
    }

    /** @returns {SubTexture} The mapped texture for the given name. */
    getSubTexture(name)
    {
        let result = this.textures[name];
        if (result)
        {
            return result;
        }
        else
        {
            throw new Error(`Textue '${name}' does not exist in texture atlas.`);
        }
    }
}

export class SubTexture extends Texture
{
    constructor(image, u = 0, v = 0, unitWidth = image.width, unitHeight = image.height, cols = 1, rows = 1)
    {
        super(image);
        this.length = cols * rows;
        this.width = unitWidth * cols;
        this.height = unitHeight * rows;
        this.unitWidth = unitWidth;
        this.unitHeight = unitHeight;

        this.u = u;
        this.v = v;
    }

    /** @override */
    subDraw(ctx, x, y, u, v, width, height)
    {
        ctx.drawImage(this.source, this.u + u, this.v + v, width, height, x, y, width, height);
    }

    unitDraw(ctx, x, y, index)
    {
        const { unitWidth: uw, unitHeight: uh, length } = this;
        index = Math.abs(index % length);
        let u = (index % uw) * uw;
        let v = Math.floor(index / uw) * uh;
        this.subDraw(ctx, x, y, u, v, uw, uh);
    }
}
