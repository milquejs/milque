import { create as createGeometry3D } from './GeometryHelper.js';

export function create(centered = false)
{
    const x = 0;
    const y = 0;
    const z = 0;
    const width = 1;
    const height = 1;
    
    let position;
    if (centered)
    {
        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;
        position = [
            x - halfWidth, y - halfHeight, z,
            x + halfWidth, y - halfHeight, z,
            x - halfWidth, y + halfHeight, z,
            x + halfWidth, y + halfHeight, z,
        ];
    }
    else
    {
        position = [
            x, y, z,
            x + width, y, z,
            x, y + height, z,
            x + width, y + height, z,
        ];
    }

    const texcoord = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const normal = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];
    
    return createGeometry3D(position, texcoord, normal, indices);
}
