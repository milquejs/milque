export class Geometry {
    constructor(vertexCount = 0, indices = [], position = [], texcoord = [], normal = []) {
        this.vertexCount = vertexCount;
        this.indices = indices;
        this.position = position;
        this.texcoord = texcoord;
        this.normal = normal;
    }
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
