import { TagComponentFactory } from './factory/TagComponentFactory.js';
import { CustomComponentFactory } from './factory/CustomComponentFactory.js';
import { CustomMultiComponentFactory } from './factory/CustomMultiComponentFactory.js';

/** @returns {import('./ComponentFactory.js').ComponentFactory} */
export function resolve(componentType)
{
    switch(typeof componentType)
    {
        case 'string': return createComponentFactoryFromOptions(componentType, true, undefined, undefined, undefined, undefined);
        case 'function':
            {
                const { tag, template, create = componentType, destroy, multiple } = componentType;
                return createComponentFactoryFromOptions(componentType, tag, template, create, destroy, multiple);
            }
        case 'object':
            {
                const { tag, template, create, destroy, multiple } = componentType;
                return createComponentFactoryFromOptions(componentType, tag, template, create, destroy, multiple);
            }
        default:
            throw new Error(`Unsupported component factory option type for ${componentType}`);
    }
}

/** @type {Map<any, import('./ComponentFactory.js').ComponentFactory>} */
export class AutoFactoryResolverMap extends Map
{
    constructor(componentTypes = [])
    {
        this.addAll(componentTypes);
    }

    add(componentType)
    {
        if (!this.has(componentType))
        {
            this.set(componentType, resolve(componentType));
        }
        return this;
    }

    addAll(componentTypes)
    {
        for(let componentType of componentTypes)
        {
            this.add(componentType);
        }
        return this;
    }

    /** @override */
    get(key)
    {
        let result = super.get(key);
        if (!result)
        {
            let factory = resolve(key);
            this.set(key, factory);
            return factory;
        }
        else
        {
            return result;
        }
    }
}

function createComponentFactoryFromOptions(componentType, tag, template, create, destroy, multiple)
{
    if (tag)
    {
        if (template)
        {
            throw new Error(`Invalid component factory options for ${componentType} - `
                + 'Cannot set template object for tag component.');
        }

        if (create || destroy)
        {
            throw new Error(`Invalid component factory options for ${componentType} - `
                + 'Cannot override create() or destroy() for tag component.');
        }

        if (multiple)
        {
            throw new Error(`Invalid component factory options for ${componentType} - `
                + 'Cannot enable \'multiple\' for tag component.');
        }

        return new TagComponentFactory(componentType);
    }
    else if (template)
    {
        if (tag)
        {
            throw new Error(`Invalid component factory options for ${componentType} - `
                + 'Cannot enable \'tag\' for template component.');
        }

        if (create || destroy)
        {
            throw new Error(`Invalid component factory options for ${componentType} - `
                + 'Cannot override create() or destroy() for template component.');
        }

        if (multiple)
        {
            return new TemplateMultiComponentFactory(componentType, template);
        }
        else
        {
            return new TemplateComponentFactory(componentType, template);
        }
    }
    else if (create)
    {
        if (multiple)
        {
            return new CustomMultiComponentFactory(componentType, create, destroy);
        }
        else
        {
            return new CustomComponentFactory(componentType, create, destroy);
        }
    }
    else
    {
        throw new Error(`Invalid component factory options for ${componentType} - `
            + 'Must define either tag boolean, template object, or create().');
    }
}
