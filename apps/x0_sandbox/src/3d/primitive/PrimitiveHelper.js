import { vec3, mat3 } from 'gl-matrix';

export function createPrimitive(position, texcoord, normal, indices, color = undefined)
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
        elementCount: indices.length,
    };
}

export function applyColorToPrimitive(r, g, b, primitive)
{
    for(let i = 0; i < primitive.color.length; i += 3)
    {
        primitive.color[i + 0] = r;
        primitive.color[i + 1] = g;
        primitive.color[i + 2] = b;
    }
    return primitive;
}

export function applyTransformationToPrimitive(transformationMatrix, primitive)
{
    const position = primitive.position;
    const normal = primitive.normal;

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

    return primitive;
}

export function joinPrimitives(...primitives)
{
    const position = [];
    const texcoord = [];
    const normal = [];
    const indices = [];
    const color = [];

    let indexCount = 0;
    for(const primitive of primitives)
    {
        position.push(...primitive.position);
        texcoord.push(...primitive.texcoord);
        normal.push(...primitive.normal);
        color.push(...primitive.color);
        indices.push(...primitive.indices.map((value) => value + indexCount));

        indexCount += primitive.position.length / 3;
    }
    
    return createPrimitive(position, texcoord, normal, indices, color);
}
