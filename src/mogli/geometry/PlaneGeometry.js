import { mat4 } from 'gl-matrix';
import { applyColor, applyTransformation, joinGeometry } from './GeometryHelper.js';
import * as QuadGeometry from './QuadGeometry.js';

export function create(doubleSided = true)
{
    const frontPlane = QuadGeometry.create(true);
    if (doubleSided)
    {
        const backPlane = QuadGeometry.create(true);
        const transformationMatrix = mat4.fromYRotation(mat4.create(), Math.PI);
        applyTransformation(transformationMatrix, backPlane);
        applyColor(frontPlane.color[0], frontPlane.color[1], frontPlane.color[2], backPlane);
        return joinGeometry(frontPlane, backPlane);
    }
    else
    {
        return frontPlane;
    }
}
