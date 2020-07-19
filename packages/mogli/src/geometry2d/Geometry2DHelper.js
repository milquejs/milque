export { applyColor as applyColor2D } from '../geometry/GeometryHelper.js';

export function create(position, texcoord, indices, color = undefined)
{
    if (!color)
    {
        const r = Math.random();
        const g = Math.random();
        const b = Math.random();
        color = [];
        for(let i = 0; i < position.length; i += 3)
        {
            color.push(r, g, b);
        }
    }

    return {
        position,
        texcoord,
        indices,
        color,
        elementSize: 2,
        elementCount: indices.length,
    };
}

export function applyTransformation2D(transformationMatrix, geometry)
{
    const position = geometry.position;

    const result = vec2.create();
    for(let i = 0; i < position.length; i += 2)
    {
        result[0] = position[i + 0];
        result[1] = position[i + 1];
        vec3.transformMat3(result, result, transformationMatrix);
        position[i + 0] = result[0];
        position[i + 1] = result[1];
    }

    return geometry;
}

export function joinGeometry2D(...geometries)
{
    const position = [];
    const texcoord = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        color.push(...geometry.color);

        for(let i = 0; i < geometry.indices.length; ++i)
        {
            const index = geometry.indices[i];
            indices.push(index + indexCount);
        }

        indexCount += geometry.position.length / 2;
    }

    return create(position, texcoord, indices, color);
}
