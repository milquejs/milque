import { vec3, mat3, mat4 } from './lib.js';

const HALF_PI = Math.PI / 2;

export function createCube(width = 1, height = 1, depth = 1, front = true, back = true, top = true, bottom = true, left = true, right = true)
{
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const halfDepth = depth * 0.5;
    const backface = true;

    let transformationMatrix = mat4.create();
    let faces = [];
    
    // Front
    if (front)
    {
        const frontPlane = createPlane(width, height, backface)
        mat4.fromTranslation(transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, frontPlane);
        faces.push(frontPlane);
    }
    // Top
    if (top)
    {
        const topPlane = createPlane(width, depth, backface);
        mat4.fromXRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, topPlane);
        faces.push(topPlane);
    }
    // Back
    if (back)
    {
        const backPlane = createPlane(width, height, backface);
        mat4.fromYRotation(transformationMatrix, Math.PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, backPlane);
        faces.push(backPlane);
    }
    // Bottom
    if (bottom)
    {
        const bottomPlane = createPlane(width, depth, backface);
        mat4.fromXRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, bottomPlane);
        faces.push(bottomPlane);
    }
    // Left
    if (left)
    {
        const leftPlane = createPlane(depth, height, backface);
        mat4.fromYRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, leftPlane);
        faces.push(leftPlane);
    }
    // Right
    if (right)
    {
        const rightPlane = createPlane(depth, height, backface);
        mat4.fromYRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, rightPlane);
        faces.push(rightPlane);
    }

    return joinGeometry(...faces);
}

export function createBackfaceOnlyCube(width = 1, height = 1, depth = 1, front = true, back = true, top = true, bottom = true, left = true, right = true)
{
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const halfDepth = depth * 0.5;

    let transformationMatrix = mat4.create();
    let faces = [];
    
    // Front
    if (front)
    {
        const frontPlane = createQuad(0, 0, halfDepth, width, height);
        faces.push(frontPlane);
    }
    // Top
    if (top)
    {
        const topPlane = createQuad(0, 0, 0, width, depth);
        mat4.fromXRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, topPlane);
        faces.push(topPlane);
    }
    // Back
    if (back)
    {
        const backPlane = createQuad(0, 0, 0, width, height);
        mat4.fromYRotation(transformationMatrix, Math.PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, backPlane);
        faces.push(backPlane);
    }
    // Bottom
    if (bottom)
    {
        const bottomPlane = createQuad(0, 0, 0, width, depth);
        mat4.fromXRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, bottomPlane);
        faces.push(bottomPlane);
    }
    // Left
    if (left)
    {
        const leftPlane = createQuad(0, 0, 0, depth, height);
        mat4.fromYRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, leftPlane);
        faces.push(leftPlane);
    }
    // Right
    if (right)
    {
        const rightPlane = createQuad(0, 0, 0, depth, height);
        mat4.fromYRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, rightPlane);
        faces.push(rightPlane);
    }

    return joinGeometry(...faces);
}

export function createPlane(width = 1, height = 1, backface = true)
{
    const frontQuad = createQuad(0, 0, 0, width, height);
    if (backface)
    {
        const backQuad = createQuad(0, 0, 0, width, height);
        let transformationMatrix = mat4.fromYRotation(mat4.create(), Math.PI);
        applyTransformation(transformationMatrix, backQuad);
        return joinGeometry(frontQuad, backQuad);
    }
    else
    {
        return frontQuad;
    }
}

export function createQuad(x = 0, y = 0, z = 0, width = 1, height = 1)
{
    const halfWidth = width * 0.5;
    const halfHeight = height * 0.5;
    const positions = [
        x - halfWidth, y - halfHeight, z,
        x + halfWidth, y - halfHeight, z,
        x - halfWidth, y + halfHeight, z,
        x + halfWidth, y + halfHeight, z,
    ];
    const texcoords = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];
    const normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];
    const indices = [
        0, 1, 2,
        2, 1, 3,
    ];

    return createGeometry(positions, texcoords, normals, indices);
}

export function createGeometry(positions, texcoords, normals, indices)
{
    return {
        positions,
        texcoords,
        normals,
        indices,
    };
}

export function applyTransformation(transformationMatrix, geometry)
{
    const position = geometry.positions;
    const normal = geometry.normals;

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
    const positions = [];
    const texcoords = [];
    const normals = [];
    const indices = [];

    let indexCount = 0;
    for(const geometry of geometries)
    {
        positions.push(...geometry.positions);
        texcoords.push(...geometry.texcoords);
        normals.push(...geometry.normals);
        indices.push(...geometry.indices.map(value => value + indexCount));

        indexCount += Math.floor(geometry.positions.length / 3);
    }

    return createGeometry(positions, texcoords, normals, indices);
}
