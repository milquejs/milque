import { mat4, vec2, vec3 } from 'gl-matrix';

export const VERTEX_SHADER_SOURCE: string;
export const FRAGMENT_SHADER_SOURCE: string;

declare type Attribute = {
    location: number,
    type: GLenum,
    set: Function,
    length: number,
};

declare type Uniform = {
    location: number,
    type: GLenum,
    set: Function,
    length: number,
};

declare namespace Attributes {
    const a_position: Attribute;
    const a_texcoord: Attribute;
    const a_normal: Attribute;
}

declare namespace Uniforms {
    const u_model: Uniform;
    const u_view: Uniform;
    const u_projection: Uniform;
}
