export class Sprite
{
    constructor(source, originX = 0, originY = 0)
    {
        this.source = source;
        this.originX = originX;
        this.originY = originY;
    }
    
    draw(ctx, world)
    {
        let image = world.assets.getAsset(this.source);
        ctx.translate(-this.originX, -this.originY);
        ctx.drawImage(image, 0, 0, image.width, image.height);
        ctx.translate(this.originX, this.originY);
    }
}
