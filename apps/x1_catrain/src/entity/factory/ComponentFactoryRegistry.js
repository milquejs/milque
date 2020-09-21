import { MultiObjectComponentFactory } from './object/MultiObjectComponentFactory.js';
import { ObjectComponentFactory } from './object/ObjectComponentFactory.js';
import { TagComponentFactory } from './object/TagComponentFactory.js';

/**
 * @param {Function|Object|String} componentType The component type to create the factory for.
 * @returns {import('./ComponentFactory.js').ComponentFactory} The associated component factory.
 */
export function createComponentFactory(entityManager, componentType)
{
    if (typeof componentType === 'string')
    {
        return TagComponentFactory.fromString(entityManager, componentType);
    }
    else
    {
        try
        {
            let multiple = 'multiple' in componentType ? Boolean(componentType.multiple) : false;
            if (multiple)
            {
                return MultiObjectComponentFactory.from(entityManager, componentType);
            }
            else
            {
                return ObjectComponentFactory.from(entityManager, componentType);
            }
        }
        catch(e)
        {
            throw new Error('Unsupported component factory options - ' + e.message);
        }
    }
}
