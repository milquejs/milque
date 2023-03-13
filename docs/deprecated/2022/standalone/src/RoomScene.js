import { mat4, quat, vec3 } from "gl-matrix";

export function transform(offsetX = 0, offsetY = 0, offsetZ = 0, scaleX = 1, scaleY = 1, scaleZ = 1, rotateX = 0, rotateY = 0, rotateZ = 0) {
    return node(
        'transform',
        mat4.fromRotationTranslationScale(
            mat4.create(),
            quat.fromEuler(quat.create(), rotateX, rotateY, rotateZ),
            vec3.fromValues(offsetX, offsetY, offsetZ),
            vec3.fromValues(scaleX, scaleY, scaleZ)));
}

export function uniforms(uniforms) {
    return node('uniforms', uniforms);
}

export function mesh(geometry, material) {

}

export function node(type, value = null) {
    return {
        type,
        value,
        nodes: [],
        children(nodes) {
            this.nodes = nodes;
            return this;
        }
    };
}

export function scene() {
    return node('scene');
}

export const RoomScene = scene().children([
    transform(0, 10, 0).children([
        uniforms({ u_color: [0, 1, 0] }).children([
            mesh(geometry, material),
        ])
    ]),
]);

export function RoomSystem(m) {
    
}
