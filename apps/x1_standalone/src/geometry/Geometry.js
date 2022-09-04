/**
 * @typedef {ReturnType<createGeometry>} Geometry
 * @typedef {ReturnType<bakeGeometry>} BakedGeometry
 */

export function createGeometry(vertexCount = 0, indices = [], position = [], texcoord = [], normal = []) {
    return {
        vertexCount,
        indices,
        position,
        texcoord,
        normal,
    };
}

/**
 * @param {Geometry} out 
 * @param  {...Geometry} geometries 
 * @returns {Geometry}
 */
export function joinGeometries(out, ...geometries) {
    let position = [];
    let texcoord = [];
    let normal = [];
    let indices = [];
    let indexOffset = 0;
    for (let geometry of geometries) {
        position.push(...geometry.position);
        texcoord.push(...geometry.texcoord);
        normal.push(...geometry.normal);
        indices.push(...geometry.indices.map(value => value + indexOffset));
        indexOffset += geometry.vertexCount;
    }
    out.position.push(...position);
    out.texcoord.push(...texcoord);
    out.normal.push(...normal);
    out.indices.push(...indices);
    out.vertexCount += indexOffset;
    return out;
}

/**
 * @param {Geometry} geometry
 */
export function bakeGeometry(geometry) {
    return {
        vertexCount: geometry.vertexCount,
        indices: new Uint16Array(geometry.indices),
        position: new Float32Array(geometry.position),
        texcoord: new Float32Array(geometry.texcoord),
        normal: new Float32Array(geometry.normal),
    };
}
