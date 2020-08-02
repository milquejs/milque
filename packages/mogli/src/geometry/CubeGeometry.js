import { mat4 } from '../../../../node_modules/gl-matrix/esm/index.js';
import { applyTransformation, joinGeometry } from './GeometryHelper.js';
import * as PlaneGeometry from './PlaneGeometry.js';

export function create(front = true, back = true, top = true, bottom = true, left = true, right = true)
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
        const frontPlane = PlaneGeometry.create(false);
        mat4.fromTranslation(transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, frontPlane);
        faces.push(frontPlane);
    }
    // Top
    if (top)
    {
        const topPlane = PlaneGeometry.create(false);
        mat4.fromXRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, topPlane);
        faces.push(topPlane);
    }
    // Back
    if (back)
    {
        const backPlane = PlaneGeometry.create(false);
        mat4.fromYRotation(transformationMatrix, Math.PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfDepth]);
        applyTransformation(transformationMatrix, backPlane);
        faces.push(backPlane);
    }
    // Bottom
    if (bottom)
    {
        const bottomPlane = PlaneGeometry.create(false);
        mat4.fromXRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfHeight]);
        applyTransformation(transformationMatrix, bottomPlane);
        faces.push(bottomPlane);
    }
    // Left
    if (left)
    {
        const leftPlane = PlaneGeometry.create(false);
        mat4.fromYRotation(transformationMatrix, -HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, leftPlane);
        faces.push(leftPlane);
    }
    // Right
    if (right)
    {
        const rightPlane = PlaneGeometry.create(false);
        mat4.fromYRotation(transformationMatrix, HALF_PI);
        mat4.translate(transformationMatrix, transformationMatrix, [0, 0, halfWidth]);
        applyTransformation(transformationMatrix, rightPlane);
        faces.push(rightPlane);
    }

    return joinGeometry(...faces);
}
