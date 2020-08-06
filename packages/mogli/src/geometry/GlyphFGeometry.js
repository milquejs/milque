import { mat4 } from '../../../../deps.js';
import { applyColor, applyTransformation, joinGeometry } from './GeometryHelper.js';
import * as CubeGeometry from './CubeGeometry.js';

export function create()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = mat4.create();

    const topRung = CubeGeometry.create(true, true, true, true, false, true);
    mat4.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
    mat4.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, topRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = CubeGeometry.create(true, true, true, true, false, true);
    mat4.fromScaling(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
    applyTransformation(transformationMatrix, bottomRung);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = CubeGeometry.create(true, true, true, true, true, true);
    mat4.fromTranslation(transformationMatrix, [-fifthSize, 0, 0]);
    mat4.scale(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
    applyTransformation(transformationMatrix, leftBase);
    applyColor(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinGeometry(leftBase, topRung, bottomRung);
}
