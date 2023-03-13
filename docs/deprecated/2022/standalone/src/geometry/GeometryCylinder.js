import { vec3 } from 'gl-matrix';

/** @typedef {import('./Geometry.js').Geometry} Geometry */

/**
 * SOURCE: https://github.com/mrdoob/three.js/blob/master/src/geometries/CylinderGeometry.js
 * 
 * @param {Geometry} out
 * @param {number} radiusTop 
 * @param {number} radiusBottom 
 * @param {number} height 
 * @param {number} radialSegments 
 * @param {number} heightSegments 
 * @param {boolean} openEnded 
 * @param {number} thetaStart 
 * @param {number} thetaLength 
 * @returns {Geometry}
 */
export function createGeometryCylinder(out, radiusTop = 1, radiusBottom = 1, height = 1, radialSegments = 8, heightSegments = 1, openEnded = false, thetaStart = 0, thetaLength = Math.PI * 2) {
    addGeometryCylinderBody(out, radiusTop, radiusBottom, height, radialSegments, heightSegments, thetaStart, thetaLength);
    if (!openEnded) {
        if (radiusTop > 0) {
            addGeometryCylinderCap(out, true, radiusTop, radiusBottom, height, radialSegments, thetaStart, thetaLength);
        }
        if (radiusBottom > 0) {
            addGeometryCylinderCap(out, false, radiusTop, radiusBottom, height, radialSegments, thetaStart, thetaLength);
        }
    }
    return out;
}

/**
 * @param {Geometry} out 
 * @param {number} radiusTop 
 * @param {number} radiusBottom 
 * @param {number} height 
 * @param {number} radialSegments 
 * @param {number} heightSegments 
 * @param {number} thetaStart 
 * @param {number} thetaLength
 */
function addGeometryCylinderBody(out, radiusTop, radiusBottom, height, radialSegments, heightSegments, thetaStart, thetaLength) {
    const halfHeight = height / 2;
    const slope = (radiusBottom - radiusTop) / height;
    let indexArray = [];
    let vec = vec3.create();
    for(let y = 0; y <= heightSegments; ++y) {
        let indexRow = [];
        let v = y / heightSegments;
        let r = v * (radiusBottom - radiusTop) + radiusTop;
        for(let x = 0; x <= radialSegments; ++x) {
            let u = x / radialSegments;
            let theta = u * thetaLength + thetaStart;

            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            vec[0] = r * sinTheta;
            vec[1] = -v * height + halfHeight;
            vec[2] = r * cosTheta;
            out.position.push(vec[0], vec[1], vec[2]);

            vec[0] = sinTheta;
            vec[1] = slope;
            vec[2] = cosTheta;
            vec3.normalize(vec, vec);
            out.normal.push(vec[0], vec[1], vec[2]);

            vec[0] = u;
            vec[1] = 1 - v;
            out.texcoord.push(v[0], v[1]);

            let i = ++out.vertexCount;
            indexRow.push(i);
        }
        indexArray.push(indexRow);
    }
    for(let x = 0; x < radialSegments; ++x) {
        for(let y = 0; y < heightSegments; ++y) {
            let a = indexArray[y][x];
            let b = indexArray[y + 1][x];
            let c = indexArray[y + 1][x + 1];
            let d = indexArray[y][x + 1];

            out.indices.push(a, b, d);
            out.indices.push(b, c, d);
        }
    }
    return out;
}

/**
 * @param {Geometry} out 
 * @param {boolean} isTop
 * @param {number} radiusTop 
 * @param {number} radiusBottom 
 * @param {number} radialSegments 
 * @param {number} thetaStart 
 * @param {number} thetaLength
 */
function addGeometryCylinderCap(out, isTop, radiusTop, radiusBottom, height, radialSegments, thetaStart, thetaLength) {
    const halfHeight = height / 2;
    const sign = isTop ? 1 : -1;
    const radius = isTop ? radiusTop : radiusBottom;

    let centerIndexStart = out.vertexCount;
    for(let x = 1; x <= radialSegments; ++x) {
        out.position.push(0, halfHeight * sign, 0);
        out.normal.push(0, sign, 0);
        out.texcoord.push(0.5, 0.5);
        ++out.vertexCount;
    }

    let vec = vec3.create();
    let centerIndexEnd = out.vertexCount;
    for(let x = 0; x <= radialSegments; ++x) {
        let u = x / radialSegments;
        let theta = u * thetaLength + thetaStart;
        let cosTheta = Math.cos(theta);
        let sinTheta = Math.sin(theta);

        vec[0] = radius * sinTheta;
        vec[1] = halfHeight * sign;
        vec[2] = radius * cosTheta;
        out.position.push(vec[0], vec[1], vec[2]);

        out.normal.push(0, sign, 0);

        vec[0] = (cosTheta * 0.5) + 0.5;
        vec[1] = (sinTheta * 0.5 * sign) + 0.5;
        out.texcoord.push(vec[0], vec[1]);

        ++out.vertexCount;
    }

    for(let x = 0; x < radialSegments; ++x) {
        let ca = centerIndexStart + x;
        let cb = centerIndexEnd + x;
        if (isTop) {
            out.indices.push(cb, cb + 1, ca);
        } else {
            out.indices.push(cb + 1, cb, ca);
        }
    }
    return out;
}
