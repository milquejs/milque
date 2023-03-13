import { vec3 } from 'gl-matrix';

/** @typedef {import('./Geometry.js').Geometry} Geometry */

/**
 * SOURCE: https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js
 * 
 * @param {Geometry} out
 * @param {number} radius
 * @param {number} widthSegments 
 * @param {number} heightSegments 
 * @param {number} phiStart
 * @param {number} phiLength
 * @param {number} thetaStart
 * @param {number} thetaLength
 * @returns {Geometry}
 */
export function createGeometrySphere(
    out,
    radius = 1, widthSegments = 32, heightSegments = 16,
    phiStart = 0, phiLength = Math.PI * 2,
    thetaStart = 0, thetaLength = Math.PI) {

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    let thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

    let grid = [];

    let vec = vec3.create();
    for(let i = 0; i <= heightSegments; ++i) {
        let row = [];

        let v = i / heightSegments;

        let du = 0;
        if (i === 0 && thetaStart === 0) {
            du = 0.5 / widthSegments;
        } else if (i === heightSegments && thetaEnd === Math.PI) {
            du = -0.5 / widthSegments;
        }

        for(let j = 0; j <= widthSegments; ++j) {
            let u = j / widthSegments;

            vec[0] = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            vec[1] = radius * Math.cos(thetaStart + v * thetaLength);
            vec[2] = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            out.position.push(vec[0], vec[1], vec[2]);

            vec3.normalize(vec, vec);
            out.normal.push(vec[0], vec[1], vec[2]);

            out.texcoord.push(u + du, 1 - v);
            row.push(out.vertexCount++);
        }
        grid.push(row);
    }

    for(let i = 0; i < heightSegments; ++i) {
        for(let j = 0; j < widthSegments; ++j) {
            let a = grid[i][j + 1];
            let b = grid[i][j];
            let c = grid[i + 1][j];
            let d = grid[i + 1][j + 1];

            if (i !== 0 || thetaStart > 0) {
                out.indices.push(a, b, d);
            }
            if (i !== heightSegments - 1 || thetaEnd < Math.PI) {
                out.indices.push(b, c, d);
            }
        }
    }
    return out;
}
