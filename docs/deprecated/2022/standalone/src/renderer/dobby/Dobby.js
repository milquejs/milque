/**
 * @typedef DrawInfo
 * @property {Material} [material]
 * @property {Geometry} [geometry]
 * @property {UniformMap} [uniforms]
 * 
 * @typedef {Record<string, number|Float32List|Int32List|Uint32List>} UniformMap
 * @typedef {import('../../geometry/Geometry.js').Geometry} Geometry
 * 
 * @typedef {import('@milque/mogli').BufferHelper.BufferInfo} BufferInfo
 * @typedef {import('@milque/mogli').ProgramHelper.ProgramInfo} ProgramInfo
 * 
 * @typedef Material
 * @property {Array<string>} shaders
 * @property {UniformMap} uniforms
 * 
 * @typedef Mesh
 * @property {Geometry} geometry
 * @property {Material} material
 * 
 * @typedef {(ctx: Dobby, gl: WebGLRenderingContextBase, target: object) => DrawInfo} DrawInfoCallback
 */

import { BufferHelper, ProgramHelper } from '@milque/mogli';

export class Dobby {
    /**
     * @param {import('@milque/display').DisplayPort} display 
     */
    constructor(display) {
        this.display = display;
        /**
         * @protected
         * @type {Array<DrawInfoCallback>}
         */
        this.renderers = [];
        /**
         * @protected
         */
        this.bufferInfos = new Map();
        /**
         * @protected
         */
        this.programInfos = new Map();
    }

    /**
     * @param {Geometry} geometry
     * @param {BufferInfo} bufferInfo
     * @returns {Dobby}
     */
    setBufferInfo(geometry, bufferInfo) {
        this.bufferInfos.set(geometry, bufferInfo);
        return this;
    }

    /**
     * @param {WebGLRenderingContextBase} gl 
     * @param {Geometry} geometry
     * @returns {BufferInfo}
     */
    getBufferInfo(gl, geometry) {
        if (!geometry) {
            return null;
        } else if (this.bufferInfos.has(geometry)) {
            return this.bufferInfos.get(geometry); 
        } else {
            const bufferInfo = BufferHelper.createBufferInfo(gl, {
                a_position: { buffer: geometry.position },
                a_texcoord: { buffer: geometry.texcoord, size: 2 },
                a_normal: { buffer: geometry.normal },
            }, { buffer: geometry.indices });
            this.setBufferInfo(geometry, bufferInfo);
            return bufferInfo;
        }
    }

    /**
     * @param {Material} material 
     * @param {ProgramInfo} programInfo 
     * @returns {Dobby}
     */
    setProgramInfo(material, programInfo) {
        this.programInfos.set(material, programInfo);
        return this;
    }

    /**
     * @param {WebGLRenderingContextBase} gl
     * @param {Material} material 
     * @returns {ProgramInfo}
     */
    getProgramInfo(gl, material) {
        if (!material) {
            return null;
        } else if (this.programInfos.has(material)) {
            return this.programInfos.get(material);
        } else {
            const program = gl.createProgram();
            ProgramHelper.linkProgramShaders(gl, program, material.shaders);
            const programInfo = ProgramHelper.createProgramInfo(gl, program);
            this.setProgramInfo(material, programInfo);
            return programInfo;
        }
    }

    /**
     * @param {DrawInfoCallback} drawInfoCallback 
     * @returns {Dobby}
     */
    registerDrawInfo(drawInfoCallback) {
        this.renderers.push(drawInfoCallback);
        return this;
    }

    /**
     * @param {WebGLRenderingContextBase} gl 
     * @param {object} target 
     * @returns {DrawInfo}
     */
    getDrawInfo(gl, target) {
        for(let drawInfoCallback of this.renderers) {
            let result = drawInfoCallback(this, gl, target);
            if (typeof result === 'object') {
                return result;
            }
        }
        return {};
    }

    /**
     * @param {WebGLRenderingContextBase} gl 
     * @param {Array<object>} targets 
     * @param {UniformMap} globalUniforms 
     */
    render(gl, targets, globalUniforms = {}) {
        let prevProgramInfo = null;
        for(let target of targets) {
            let {
                material, geometry, uniforms: drawUniforms = {}
            } = this.getDrawInfo(gl, target);
            let programInfo = this.getProgramInfo(gl, material);
            if (!programInfo) continue;
            let bufferInfo = this.getBufferInfo(gl, geometry);
            if (!bufferInfo) continue;
            if (prevProgramInfo !== programInfo) {
                prevProgramInfo = programInfo;
                gl.useProgram(programInfo.handle);
            }
            ProgramHelper.bindProgramAttributes(gl, programInfo, bufferInfo);
            ProgramHelper.bindProgramUniforms(gl, programInfo, {
                ...material.uniforms,
                ...drawUniforms,
                ...globalUniforms,
            });
            BufferHelper.drawBufferInfo(gl, bufferInfo);
        }
    }
}

/**
 * @param {Array<string>} shaders 
 * @param {Record<string, any>} uniforms 
 * @returns {Material}
 */
export function createMaterial(shaders, uniforms) {
    return {
        shaders,
        uniforms,
    };
}

/**
 * @param {Geometry} geometry 
 * @param {Material} material 
 * @returns {Mesh}
 */
export function createMesh(geometry, material) {
    return {
        geometry,
        material,
    };
}
