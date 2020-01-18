/**
 * A class to represent a component. This class is not required to
 * create a component; any class can be considered a component. To
 * override reset or copy behavior, simply implement the reset()
 * or copy() functions respectively for that class.
 * 
 * This class serves mostly as a quick and dirty default fallback. It
 * has defaults for all functionality except its properties (which are
 * usually unique to each component type).
 * 
 * Usually, you will use this class like so:
 * @example
 * class MyComponent extends ComponentBase
 * {
 *   constructor()
 *   {
 *     super();
 *     this.myValue = true;
 *     this.myString = 'Hello World';
 *   }
 * 
 *   // Feel free to override any default functionality when needed...
 * }
 */
const DEFAULT_UNDEFINED = Symbol('defaultUndefined');
export class ComponentBase
{
    static get defaultValues() { return null; }

    constructor(world, entityId, resetAsSelfConstructor = true)
    {
        if (!('defaultValues' in this.constructor))
        {
            if (resetAsSelfConstructor)
            {
                // NOTE: Must make sure 'defaultValues' exists before recursing into the constructor.
                this.constructor.defaultValues = null;
                this.constructor.defaultValues = new (this.constructor)();
            }
            else
            {
                this.constructor.defaultValues = DEFAULT_UNDEFINED;
            }
        }
    }
    
    copy(values)
    {
        for(let key of Object.getOwnPropertyNames(values))
        {
            this[key] = values[key];
        }
    }

    reset()
    {
        if ('defaultValues' in this.constructor)
        {
            let defaultValues = this.constructor.defaultValues;
            if (defaultValues === DEFAULT_UNDEFINED)
            {
                for(let key of Object.getOwnPropertyNames(this))
                {
                    this[key] = undefined;
                }
                return true;
            }
            else if (defaultValues)
            {
                this.copy(this, this.constructor.defaultValues);
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}
