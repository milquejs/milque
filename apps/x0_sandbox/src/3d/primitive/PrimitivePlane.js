import { mat4 } from 'gl-matrix';
import { applyColorToPrimitive, applyTransformationToPrimitive, joinPrimitives } from './PrimitiveHelper.js';
import { createQuad } from './PrimitiveQuad.js';

export function createPlane(doubleSided = true)
{
    const frontPlane = createQuad(true);
    if (doubleSided)
    {
        const backPlane = createQuad(true);
        const transformationMatrix = mat4.fromYRotation(mat4.create(), Math.PI);
        applyTransformationToPrimitive(transformationMatrix, backPlane);
        applyColorToPrimitive(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
        return joinPrimitives(frontPlane, backPlane);
    }
    else
    {
        return frontPlane;
    }
}
