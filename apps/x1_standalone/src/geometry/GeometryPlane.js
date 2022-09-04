/** @typedef {import('./Geometry.js').Geometry} Geometry */

/**
 * SOURCE: https://github.com/mrdoob/three.js/blob/master/src/geometries/PlaneGeometry.js
 * 
 * @param {Geometry} out
 * @param {number} width 
 * @param {number} height 
 * @param {number} widthSegments 
 * @param {number} heightSegments 
 * @returns {Geometry}
 */
export function createGeometryPlane(out, width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const gridX = Math.floor(widthSegments);
    const gridY = Math.floor(heightSegments);
    const gridXX = gridX + 1;
    const gridYY = gridY + 1;

    const segmentWidth = width / gridX;
    const segmentHeight = height / gridY;

    const vertexIndex = out.vertexCount;
    for(let i = 0; i < gridYY; ++i) {
        let y = i * segmentHeight - halfHeight;
        for(let j = 0; j < gridXX; ++j) {
            let x = j * segmentWidth - halfWidth;
            out.position.push(x, -y, 0);
            out.normal.push(0, 0, 1);
            out.texcoord.push(j / gridX, 1 - (i / gridY));
            ++out.vertexCount;
        }
    }

    for(let i = 0; i < gridY; ++i) {
        for(let j = 0; j < gridX; ++j) {
            let a = vertexIndex + j + gridXX * i;
            let b = vertexIndex + j + gridXX * (i + 1);
            let c = vertexIndex + (j + 1) + gridXX * (i + 1);
            let d = vertexIndex + (j + 1) + gridXX * i;

            out.indices.push(a, b, d);
            out.indices.push(b, c, d);
        }
    }

    return out;
}
