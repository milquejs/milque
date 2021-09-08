import { createPrimitive } from './PrimitiveHelper.js';

export function createQuad()
{
    const x = 0;
    const y = 0;
    const z = 0;
    const width = 1;
    const height = 1;
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    let position = [
        x - halfWidth, y - halfHeight, z,
        x + halfWidth, y - halfHeight, z,
        x - halfWidth, y + halfHeight, z,
        x + halfWidth, y + halfHeight, z,
    ];
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
    return createPrimitive(position, texcoord, normal, indices);
}
