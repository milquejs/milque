/**
 * Creates a new component instance for this component type.
 * @callback create
 * @param {import('../World.js').World} world The world the component will be added to.
 * @param {import('../entity/Entity.js').EntityId} entityId The id of the entity this component is added to.
 */

/**
 * Copies a component instance from values.
 * @callback copy
 * @param {Object} dst The target component instance to modify.
 * @param {Object} values The source values to copy from.
 */

/**
 * Resets a component instance to be re-used or deleted.
 * @callback reset
 * @param {Object} dst The target component instance to reset.
 */

/**
 * @typedef ComponentFactory
 * A component factory handles the creation, modification, and deletion of component instances.
 * 
 * @property {create} create Creates a new component instance for this type.
 * @property {copy} [copy] Copies a component instance from values.
 * @property {reset} [reset] Resets a component instance to be re-used or deleted.
 */

/**
 * Creates a component factory given the passed-in handlers. This is not required
 * to create a component factory; any object with create(), copy(), and reset() can
 * be considered a component factory and used as is without this function. This
 * function is mostly for ease of use and readability.
 * 
 * @param {String} name The name of the component. This should be unique; it is used as its hash key.
 * @param {create} [create=defaultCreate] The function to create new components.
 * @param {copy} [copy=defaultCopy] The function to copy new components from values.
 * @param {reset} [reset=defaultReset] The function to reset a component to be re-used or deleted.
 * @returns {ComponentFactory} The created component factory.
 */
export function createComponentFactory(name, create = defaultCreate, copy = defaultCopy, reset = defaultReset)
{
    return {
        name,
        create,
        copy,
        reset
    };
}

function defaultCreate(world, entityId) { return {}; }
function defaultCopy(dst, values) { Object.assign(dst, values); }
function defaultReset(dst) { Object.getOwnPropertyNames(dst).forEach(value => delete dst[value]); }
