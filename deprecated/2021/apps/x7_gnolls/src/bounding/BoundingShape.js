/**
 * @typedef BoundingShapeLike
 * @property {string} type
 */

export class BoundingShape
{
    constructor(type)
    {
        if (!type)
        {
            throw new Error('Bounding shape must have unique type identifier.');
        }

        this.type = type;
    }
}
