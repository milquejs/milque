/**
 * @typedef {ReturnType<create>} ObjectDef
 */

/**
 * @param {string} sprite
 * @param {Array<string>} [children]
 */
export function create(sprite, children = []) {
    return {
        sprite,
        children,
        initial: {
            visible: true,
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
        }
    };
}

/**
 * @param {Partial<ObjectDef>} json
 */
export function fromJSON(json) {
    let {
        sprite,
        children = [],
        initial = undefined,
    } = json;
    const {
        visible = true,
        offsetX = 0,
        offsetY = 0,
        scaleX = 1,
        scaleY = 1,
        rotation = 0,
    } = initial || {};
    let result = create(sprite, children);
    result.initial.visible = visible;
    result.initial.offsetX = offsetX;
    result.initial.offsetY = offsetY;
    result.initial.scaleX = scaleX;
    result.initial.scaleY = scaleY;
    result.initial.rotation = rotation;
    return result;
}
