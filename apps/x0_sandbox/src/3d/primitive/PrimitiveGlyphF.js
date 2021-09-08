import { mat4 } from 'gl-matrix';
import { applyColorToPrimitive, applyTransformationToPrimitive, joinPrimitives } from './PrimitiveHelper.js';
import { createCube } from './PrimitiveCube.js';

export function createGlyphF()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = mat4.create();

    const topRung = createCube(true, true, true, true, false, true);
    mat4.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2, 0]);
    mat4.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize, fifthSize]);
    applyTransformationToPrimitive(transformationMatrix, topRung);
    applyColorToPrimitive(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = createCube(true, true, true, true, false, true);
    mat4.fromScaling(transformationMatrix, [fifthSize, fifthSize, fifthSize]);
    applyTransformationToPrimitive(transformationMatrix, bottomRung);
    applyColorToPrimitive(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = createCube(true, true, true, true, true, true);
    mat4.fromTranslation(transformationMatrix, [-fifthSize, 0, 0]);
    mat4.scale(transformationMatrix, transformationMatrix, [fifthSize, size, fifthSize]);
    applyTransformationToPrimitive(transformationMatrix, leftBase);
    applyColorToPrimitive(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinPrimitives(leftBase, topRung, bottomRung);
}
