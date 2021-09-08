import { mat4 } from 'gl-matrix';
import { applyTransformationToPrimitive, joinPrimitives } from './PrimitiveHelper.js';
import { createPlane } from './PrimitivePlane.js';

export function createCube(front = true, back = true, top = true, bottom = true, left = true, right = true)
{
    const HALF_PI = Math.PI / 2;
    const halfWidth = 0.5;
    const halfHeight = 0.5;
    const halfDepth = 0.5;

    const transformationMatrix = mat4.create();
    const faces = [];
    
    // Front
    if (front)
    {
        const frontPlane = createPlane(false);
        mat4.fromTranslation(transformationMatrix, [0, 0, halfDepth]);
        applyTransformationToPrimitive(transformationMatrix, frontPlane);
        faces.push(frontPlane);
    }
    // Top
    if (top)
    {
        const topPlane = createPlane(false);
        mat4.fromXRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformationToPrimitive(transformationMatrix, topPlane);
        faces.push(topPlane);
    }
    // Back
    if (back)
    {
        const backPlane = createPlane(false);
        mat4.fromYRotation(transformationMatrix, Math.PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
        applyTransformationToPrimitive(transformationMatrix, backPlane);
        faces.push(backPlane);
    }
    // Bottom
    if (bottom)
    {
        const bottomPlane = createPlane(false);
        mat4.fromXRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformationToPrimitive(transformationMatrix, bottomPlane);
        faces.push(bottomPlane);
    }
    // Left
    if (left)
    {
        const leftPlane = createPlane(false);
        mat4.fromYRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformationToPrimitive(transformationMatrix, leftPlane);
        faces.push(leftPlane);
    }
    // Right
    if (right)
    {
        const rightPlane = createPlane(false);
        mat4.fromYRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformationToPrimitive(transformationMatrix, rightPlane);
        faces.push(rightPlane);
    }

    return joinPrimitives(...faces);
}
