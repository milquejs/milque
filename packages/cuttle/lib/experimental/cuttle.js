const OWNER_KEY = Symbol('owner');

export function Properties(owner, object)
{
    let props = {
        [OWNER_KEY]: owner,
    };
    for(let [key, option] in Object.entries(object))
    {
        switch(typeof option)
        {
            case 'function':
                {
                    let attribute = kebabify(key);
                    props[key] = createProperty(key, attribute, option, undefined, true);
                }
                break;
            case 'object':
                {
                    let {
                        type = String,
                        value = undefined,
                        observed = true,
                        attribute = kebabify(key),
                    } = option;
                    props[key] = createProperty(key, attribute, type, value, observed);
                }
                break;
            default:
                throw new Error('Invalid property options.');
        }
    }
    return props;
}

function createProperty(propName, propAttribute, propType, propDefault, propObserved)
{
    return {
        name: propName,
        attribute: propAttribute,
        type: propType,
        value: propDefault,
        observed: propObserved,
    };
}

export function observedProperties(context, properties)
{
    return Object.values(properties)
        .filter(prop => prop.observed)
        .map(prop => prop.attribute);
}

export function upgradeProperties(context, properties)
{
    for(let { name } of Object.values(properties))
    {
        if (Object.prototype.hasOwnProperty.call(context, name))
        {
            let value = context[name];
            delete context[name];
            context[name] = value;
        }
    }
}

export function defaultProperties(context, properties)
{
    for(let { attribute, value } of Object.values(properties))
    {
        if (!context.hasAttribute(attribute))
        {
            context.setAttribute(attribute, value);
        }
    }
}

export function changeProperties(context, properties, attrib, prev, value)
{
}

const CAMEL_CASE_PATTERN = /^([A-Z])|[\s-_]+(\w)/g;
function camelize(text)
{
    return text.replace(
        CAMEL_CASE_PATTERN,
        (match, p1, p2, offset) =>
            p2 ? p2.toUpperCase() : p1.toLowerCase());
}

const KEBAB_CASE_ALPHA_PATTERN = /([a-z])([A-Z])/g;
const KEBAB_CASE_SEPARATOR_PATTERN = /[\s_]+/g;
function kebabify(text)
{
    return text.replace(
        KEBAB_CASE_ALPHA_PATTERN, '$1-$2')
        .replace(KEBAB_CASE_SEPARATOR_PATTERN, '-')
        .toLowerCase();
}
