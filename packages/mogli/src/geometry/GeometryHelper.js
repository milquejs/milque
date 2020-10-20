import { vec3, mat3 } from 'gl-matrix';

export function create(position, texcoord, normal, indices, color = undefined)
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
        normal,
        indices,
        color,
        elementSize: 3,
        elementCount: indices.length,
    };
}

export function applyColor(r, g, b, geometry)
{
    for(let i = 0; i < geometry.color.length; i += 3)
    {
        geometry.color[i + 0] = r;
        geometry.color[i + 1] = g;
        geometry.color[i + 2] = b;
    }
    return geometry;
}

export function applyTransformation(transformationMatrix, geometry)
{
    const position = geometry.position;
    const normal = geometry.normal;

    const inverseTransposeMatrix = mat3.create();
    mat3.normalFromMat4(inverseTransposeMatrix, transformationMatrix);

    const result = vec3.create();
    for(let i = 0; i < position.length; i += 3)
    {
        result[0] = position[i + 0];
        result[1] = position[i + 1];
        result[2] = position[i + 2];
        vec3.transformMat4(result, result, transformationMatrix);
        position[i + 0] = result[0];
        position[i + 1] = result[1];
        position[i + 2] = result[2];

        result[0] = normal[i + 0];
        result[1] = normal[i + 1];
        result[2] = normal[i + 2];
        vec3.transformMat3(result, result, inverseTransposeMatrix);
        normal[i + 0] = result[0];
        normal[i + 1] = result[1];
        normal[i + 2] = result[2];
    }

    return geometry;
}

export function joinGeometry(...geometries)
{
    const position = [];
    const texcoord = [];
    const normal = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        normal.push(...geometry.normal);
        color.push(...geometry.color);
        indices.push(...geometry.indices.map((value) => value + indexCount));

        indexCount += geometry.position.length / 3;
    }

    return create(position, texcoord, normal, indices, color);
}
