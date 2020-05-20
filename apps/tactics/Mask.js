export class Mask
{
    constructor(width, height, offsetX = width / 2, offsetY = height / 2)
    {
        this.offset = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
    }
}
