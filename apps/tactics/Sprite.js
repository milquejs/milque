export class Sprite
{
    constructor(texture, width, height, frames = [])
    {
        this.texture = texture;

        this.width = width;
        this.height = height;

        this.frames = frames;
        this.frameIndex = 0;
        this.frameSpeed = 1;
        this.frameTime = 0;
    }

    update(dt)
    {
        this.frameTime += dt * this.frameSpeed;
        if (this.frameTime > 1)
        {
            this.frameTime = 0;

            if (this.frameIndex >= this.frames.length - 1)
            {
                this.frameIndex = 0;
            }
            else
            {
                ++this.frameIndex;
            }
        }
    }
}

export function loadSpriteSheet(textureImage, atlasData)
{
    let result = {};
    for(let line of atlasData.split('\n'))
    {
        line = line.trim();
        if (!line) continue;

        let [ name, x, y, w, h, frameCount = 1 ] = line.split(' ');
        x = Number(x);
        y = Number(y);
        w = Number(w);
        h = Number(h);
        frameCount = Number(frameCount);

        let frames = [];
        for(let frameIndex = 0; frameIndex < frameCount; ++frameIndex)
        {
            frames.push({
                x: x + w * frameIndex,
                y: y,
            });
        }
        result[name] = new Sprite(textureImage, w, h, frames);
    }
    return result;
}
