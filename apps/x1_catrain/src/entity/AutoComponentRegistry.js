import { MultiObjectComponentFactory } from './objectfactory/MultiObjectComponentFactory.js';
import { ObjectComponentFactory } from './objectfactory/ObjectComponentFactory.js';
import { TagComponentFactory } from './objectfactory/TagComponentFactory.js';

/**
 * @type {Map<any, import('./ComponentFactory.js').ComponentFactory>}
 */
export class AutoComponentRegistry extends Map
{
    static resolveComponentFactory(componentType)
    {
        if (typeof componentType === 'string')
        {
            return new TagComponentFactory(componentType);
        }
        else
        {
            try
            {
                let multiple = 'multiple' in componentType ? Boolean(componentType.multiple) : false;
                if (multiple)
                {
                    return MultiObjectComponentFactory.from(componentType);
                }
                else
                {
                    return ObjectComponentFactory.from(componentType);
                }
            }
            catch(e)
            {
                throw new Error('Unsupported component factory options - ' + e.message);
            }
        }
    }

    constructor(components = [])
    {
        super();

        for(let componentType of components)
        {
            this.set(componentType, AutoComponentRegistry.resolveComponentFactory(componentType));
        }
    }

    /** @override */
    get(key)
    {
        let result = super.get(key);
        if (!result)
        {
            let factory = AutoComponentRegistry.resolveComponentFactory(key);
            this.set(key, factory);
            return factory;
        }
        else
        {
            return result;
        }
    }
}
