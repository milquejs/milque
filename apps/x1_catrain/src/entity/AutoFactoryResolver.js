import { TagComponentFactory } from './factory/TagComponentFactory.js';
import { CustomComponentFactory } from './factory/CustomComponentFactory.js';
import { CustomMultiComponentFactory } from './factory/CustomMultiComponentFactory.js';

/** @returns {import('./ComponentFactory.js').ComponentFactory} */
export function resolve(componentType)
{
    switch(typeof componentType)
    {
        case 'string': return new TagComponentFactory(componentType);
        case 'function':
            {
                let create = 'create' in componentType ? componentType.create : componentType;
                let destroy = 'destroy' in componentType ? componentType.destroy : undefined;
                if (componentType.multiple)
                {
                    return new CustomMultiComponentFactory(componentType, create, destroy);
                }
                else
                {
                    return new CustomComponentFactory(componentType, create, destroy);
                }
            }
        case 'object':
            {
                const { template, create, destroy, multiple } = componentType;
                if (template)
                {
                    if (create || destroy)
                    {
                        throw new Error(`Invalid component factory option object for ${componentType} - `
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
                    throw new Error(`Invalid component factory option object for ${componentType} - `
                        + 'Must define template object or create().');
                }
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
