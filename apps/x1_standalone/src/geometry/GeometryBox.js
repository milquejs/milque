import { createGeometry } from './Geometry.js';
import { vec3 } from 'gl-matrix';

/** @typedef {import('./Geometry.js').Geometry} Geometry */

/**
 * SOURCE: https://github.com/mrdoob/three.js/blob/master/src/geometries/BoxGeometry.js
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {number} depth 
 * @param {number} widthSegments 
 * @param {number} heightSegments 
 * @param {number} depthSegments 
 * @returns {Geometry}
 */
export function createGeometryBox(width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
    let geometry = createGeometry();
    addGeometryBoxFace(geometry, 2, 1, 0, -1, -1, depth, height, width, depthSegments, heightSegments);
    addGeometryBoxFace(geometry, 2, 1, 0, 1, -1, depth, height, -width, depthSegments, heightSegments);
    addGeometryBoxFace(geometry, 0, 2, 1, 1, 1, width, depth, height, widthSegments, depthSegments);
    addGeometryBoxFace(geometry, 0, 2, 1, 1, -1, width, depth, -height, widthSegments, depthSegments);
    addGeometryBoxFace(geometry, 0, 1, 2, 1, -1, width, height, width, widthSegments, heightSegments);
    addGeometryBoxFace(geometry, 0, 1, 2, -1, -1, width, height, width, widthSegments, heightSegments);
    return geometry;
}

/**
 * @param {Geometry} out
 * @param {number} cu 
 * @param {number} cv 
 * @param {number} cw 
 * @param {number} du 
 * @param {number} dv 
 * @param {number} width 
 * @param {number} height 
 * @param {number} depth 
 * @param {number} dx 
 * @param {number} dy 
 */
function addGeometryBoxFace(out, cu, cv, cw, du, dv, width, height, depth, dx, dy) {
    let segmentWidth = width / dx;
    let segmentHeight = height / dy;

    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let halfDepth = depth / 2;

    let dxx = dx + 1;
    let dyy = dy + 1;

    let vertexIndex = out.vertexCount;
    let v = vec3.create();
    for (let i = 0; i < dyy; ++i) {
        let y = i * segmentHeight - halfHeight;
        for (let j = 0; j < dxx; ++j) {
            let x = j * segmentWidth - halfWidth;
            v[cu] = x * du;
            v[cv] = y * dv;
            v[cw] = halfDepth;
            out.position.push(v[0], v[1], v[2]);
            v[cu] = 0;
            v[cv] = 0;
            v[cw] = depth > 0 ? 1 : -1;
            out.normal.push(v[0], v[1], v[2]);
            v[0] = j / dx;
            v[1] = 1 - (i / dy);
            out.texcoord.push(v[0], v[1]);
            ++out.vertexCount;
        }
    }
    for (let i = 0; i < dy; ++i) {
        for (let j = 0; j < dx; ++j) {
            let a = vertexIndex + j + dxx * i;
            let b = vertexIndex + j + dxx * (i + 1);
            let c = vertexIndex + (j + 1) + dxx * (i + 1);
            let d = vertexIndex + (j + 1) + dxx * i;

            out.indices.push(a, b, d);
            out.indices.push(b, c, d);
        }
    }
    return out;
}
