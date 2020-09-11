import { Texture } from './Texture.js';

export class TextureAtlas extends Texture
{
    constructor(image)
    {
        super(image);
        this.textures = {};
    }

    addSubTexture(name, u, v, width, height)
    {
        this.textures[name] = new SubTexture(this.source, u, v, width, height);
        return this;
    }

    addTextureStrip(name, u, v, unitWidth, unitHeight, cols, rows)
    {
        this.textures[name] = new TextureStrip(this.source, u, v, unitWidth, unitHeight, cols, rows);
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

    /** @returns {TextureStrip} The mapped texture strip for the given name. */
    getTextureStrip(name)
    {
        let result = this.getSubTexture(name);
        if (result instanceof TextureStrip)
        {
            return result;
        }
        else
        {
            throw new Error(`Texture '${name}' is not a texture strip.`);
        }
    }
}

export class SubTexture extends Texture
{
    constructor(image, u = 0, v = 0, width = image.width, height = image.height)
    {
        super(image);
        this.width = width;
        this.height = height;

        this.u = u;
        this.v = v;
    }

    /** @override */
    subDraw(ctx, x, y, u, v, width, height)
    {
        ctx.drawImage(this.source, this.u + u, this.v + v, width, height, x, y, width, height);
    }
}

export class TextureStrip extends SubTexture
{
    constructor(image, u = 0, v = 0, unitWidth = image.width, unitHeight = image.height, cols = 1, rows = 1)
    {
        super(image, u, v, unitWidth * cols, unitHeight * rows);

        this.u = u;
        this.v = v;
        this.length = cols * rows;
        this.unitWidth = unitWidth;
        this.unitHeight = unitHeight;
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
