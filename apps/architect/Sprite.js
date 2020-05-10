export class Sprite
{
    constructor(source, originX = 0, originY = 0)
    {
        this.source = source;
        this.originX = originX;
        this.originY = originY;
        
        this._image = new Image();
        this._image.src = source;
    }
    
    draw(ctx)
    {
        ctx.translate(-this.originX, -this.originY);
        ctx.drawImage(this._image, 0, 0, this._image.width, this._image.height);
        ctx.translate(this.originX, this.originY);
    }
}
