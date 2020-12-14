import { mat3 } from 'gl-matrix';
import { applyColor2D, applyTransformation2D, joinGeometry2D } from './Geometry2DHelper.js';
import * as Quad2DGeometry from './Quad2DGeometry.js';

export function create()
{
    const size = 1;
    const fifthSize = size * 0.2;

    const transformationMatrix = mat3.create();

    const topRung = Quad2DGeometry.create();
    mat3.fromTranslation(transformationMatrix, [fifthSize / 2, fifthSize * 2]);
    mat3.scale(transformationMatrix, transformationMatrix, [fifthSize * 2, fifthSize]);
    applyTransformation2D(transformationMatrix, topRung);
    applyColor2D(topRung.color[0], topRung.color[1], topRung.color[2], topRung);
    
    const bottomRung = Quad2DGeometry.create();
    mat3.fromScaling(transformationMatrix, [fifthSize, fifthSize]);
    applyTransformation2D(transformationMatrix, bottomRung);
    applyColor2D(topRung.color[0], topRung.color[1], topRung.color[2], bottomRung);

    const leftBase = Quad2DGeometry.create();
    mat3.fromTranslation(transformationMatrix, [-fifthSize, 0]);
    mat3.scale(transformationMatrix, transformationMatrix, [fifthSize, size]);
    applyTransformation2D(transformationMatrix, leftBase);
    applyColor2D(topRung.color[0], topRung.color[1], topRung.color[2], leftBase);

    return joinGeometry2D(leftBase, topRung, bottomRung);
}
