import { createGeometry } from './Geometry.js';

/** @typedef {import('./Geometry.js').Geometry} Geometry */

/**
 * SOURCE: https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js
 * 
 * @param {number} width 
 * @param {number} height 
 * @param {number} widthSegments 
 * @param {number} heightSegments 
 * @returns {Geometry}
 */
export function createGeometryPlane(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const gridX = Math.floor(widthSegments);
    const gridY = Math.floor(heightSegments);
    const gridXX = gridX + 1;
    const gridYY = gridY + 1;

    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    const geometry = createGeometry();
    for(let i = 0; i < gridYY; ++i) {
        let y = i * segmentHeight - halfHeight;
        for(let j = 0; j < gridXX; ++j) {
            let x = j * segmentWidth - halfWidth;
            geometry.position.push(x, -y, 0);
            geometry.normal.push(0, 0, 1);
            geometry.texcoord.push(j / gridX, 1 - (i / gridY));
            ++geometry.vertexCount;
        }
    }

    for(let i = 0; i < gridY; ++i) {
        for(let j = 0; j < gridX; ++j) {
            let a = j + gridXX * i;
            let b = j + gridXX * (i + 1);
            let c = (j + 1) + gridXX * (i + 1);
            let d = (j + 1) + gridXX * i;

            geometry.indices.push(a, b, d);
            geometry.indices.push(b, c, d);
        }
    }

    return geometry;
}
