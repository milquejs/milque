export class Texture
{
    constructor(image)
    {
        this.source = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(ctx, x, y)
    {
        this.subDraw(ctx, x, y, 0, 0, this.width, this.height);
    }

    subDraw(ctx, x, y, u, v, width, height)
    {
        ctx.drawImage(this.source, u, v, width, height, x, y, width, height);
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

export class TextureAtlas extends Texture
{
    static from(image, atlasMapString)
    {
        let atlasMap = {};
        atlasMapString.split('\n').forEach(line =>
        {
            line = line.trim();
            if (line.length <= 0 || line.startsWith('#')) return;
            let [name, x, y, w, h, count] = line.split(/\s+/);
            x = Number(x);
            y = Number(y);
            w = Number(w);
            h = Number(h);
            if (typeof count !== 'undefined')
            {
                count = Number(count);
                atlasMap[name] = [x, y, count * w, h];
            }
            else
            {
                atlasMap[name] = [x, y, w, h];
            }
        });
        return new TextureAtlas(image, atlasMap);
    }

    constructor(image, subTextureMap)
    {
        super(image);
        let subTextures = {};
        for(let name in subTextureMap)
        {
            let [u, v, width, height] = subTextureMap[name];
            subTextures[name] = new SubTexture(image, u, v, width, height);
        }
        this.subTextures = subTextures;
    }

    getSubTexture(name)
    {
        return this.subTextures[name];
    }
}

export class Sprite
{
    /**
     * Constructs a sprite from the given source and dimensions.
     * 
     * @param {Texture} texture The source texture.
     * @param {Number} cols Number of cols of sprite frames in the texture.
     * @param {Number} rows Number of rows of sprite frames in the texture.
     */
    constructor(texture, cols, rows)
    {
        if (!texture) throw new Error('Invalid null texture.');
        this.texture = texture;
        this.length = rows * cols;
        this.spriteRows = rows;
        this.spriteCols = cols;
        this.spriteWidth = texture.width / cols;
        this.spriteHeight = texture.height / rows;
    }

    draw(ctx, spriteIndex = 0)
    {
        const { spriteCols, spriteWidth, spriteHeight } = this;
        const halfSpriteWidth = spriteWidth / 2;
        const halfSpriteHeight = spriteHeight / 2;
        const textureX = spriteIndex % spriteCols;
        const textureY = Math.floor(spriteIndex / spriteCols);
        this.texture.subDraw(ctx, -halfSpriteWidth, -halfSpriteHeight, textureX * spriteWidth, textureY * spriteHeight, spriteWidth, spriteHeight);
    }
}
