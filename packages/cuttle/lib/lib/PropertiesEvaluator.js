/* eslint-env node */

const { types } = require('@babel/core');
const { createProperty } = require('./CuttleProperty');

/**
 * @example
 * static get properties() {
 *   return {
 *     someFlag: Boolean,
 *     someNumber: Number,
 *     someProp: { type: String, value: "defaultValue", observed: true }
 *   };
 * }
 * @param {import('@babel/core').NodePath} path 
 */
function evaluate(path)
{
    let dst = {};
    let methodNode = path.node;
    let returnStatement = methodNode.body.body[methodNode.body.body.length - 1];
    let returnedObject = returnStatement.argument;
    if (returnedObject.type === 'ObjectExpression')
    {
        for (let objectProperty of returnedObject.properties)
        {
            if (objectProperty.type !== 'ObjectProperty')
            {
                throw path.buildCodeFrameError('Unsupported property type.');
            }

            let propertyName = objectProperty.key;
            let propertyType;
            let propertyDefaultValue;
            let propertyObserved;
            switch(objectProperty.value.type)
            {
                case 'Identifier':
                    propertyType = objectProperty.value;
                    propertyDefaultValue = types.identifier('undefined');
                    propertyObserved = types.booleanLiteral(true);
                    break;
                case 'ObjectExpression':
                    {
                        let props = objectProperty.value.properties;
                        propertyType = getPropertyValueNode(props, 'type', types.identifier('String'));
                        propertyDefaultValue = getPropertyValueNode(props, 'value', types.identifier('undefined'));
                        propertyObserved = getPropertyValueNode(props, 'observed', types.booleanLiteral(true));
                    }
                    break;
                default:
                    throw path.buildCodeFrameError('Unsupported property value type - must be either a type or object.');
            }
            
            dst[getPropertyKey(objectProperty)] = createProperty(
                objectProperty,
                propertyName,
                propertyType,
                propertyDefaultValue,
                propertyObserved
            );
        }

        return dst;
    }
    else
    {
        throw path.buildCodeFrameError('Unsupported properties object evaluation.');
    }
}

function getPropertyKey(objectProperty)
{
    let propertyName;
    switch(objectProperty.key.type)
    {
        case 'Identifier':
            propertyName = objectProperty.key.name;
            break;
        case 'StringLiteral':
            propertyName = objectProperty.key.value;
            break;
        default:
            throw new Error('Unsupported property name type - must be a string.');
    }
    return propertyName;
}

function getPropertyValueNode(objectProperties, name, defaultValueNode)
{
    for (let objectProperty of objectProperties)
    {
        let propertyKey = getPropertyKey(objectProperty);
        if (propertyKey === name)
        {
            return objectProperty.value;
        }
    }
    return defaultValueNode;
}

module.exports = {
    evaluate
};
