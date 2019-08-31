import { create as createGeometry2D } from './Geometry2DHelper.js';

export function create(centered = false)
{
    const x = 0;
    const y = 0;
    const width = 1;
    const height = 1;
    
    let position;
    if (centered)
    {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        position = [
            x - halfWidth, y - halfHeight,
            x + halfWidth, y - halfHeight,
            x - halfWidth, y + halfHeight,
            x + halfWidth, y + halfHeight,
        ];
    }
    else
    {
        position = [
            x, y,
            x + width, y,
            x, y + height,
            x + width, y + height,
        ];
    }

    const texcoord = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];
    
    return createGeometry2D(position, texcoord, indices);
}
