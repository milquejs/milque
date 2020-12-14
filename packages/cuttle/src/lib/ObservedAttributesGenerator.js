/* eslint-env node */
const { types, template } = require('@babel/core');

const DYNAMIC_OBSERVED_VALUE_BUILDER = template('this.properties.KEY.observed');

function generate(properties, path)
{
    replaceObservedAttributes(path, superElements => {
        let returnArrayElements = [];
        for(let [key, value] of Object.entries(properties))
        {
            const { observed } = value;
            if (observed.type === 'BooleanLiteral')
            {
                if (observed.value)
                {
                    returnArrayElements.push(types.stringLiteral(key));
                }
                else
                {
                    // Override - do not observe.
                }
            }
            else
            {
                // It's dynamically calculated, so we need to reference `properties`.
                returnArrayElements.push(DYNAMIC_OBSERVED_VALUE_BUILDER({ KEY: key }));
            }
        }

        if (Array.isArray(superElements))
        {
            returnArrayElements.push(...superElements);
        }
        else if (superElements)
        {
            returnArrayElements.push(superElements);
        }
        
        return types.classMethod(
            'get',
            types.identifier('observedAttributes'), [],
            types.blockStatement([
                types.returnStatement(
                    types.arrayExpression(returnArrayElements)
                )
            ]),
            false, true
        );
    });
}

function replaceObservedAttributes(parentPath, callback)
{
    let childPath = parentPath.get('body').find(({ node }) => {
        return node.type === 'ClassMethod'
            && node.static
            && node.kind === 'get'
            && node.key.type === 'Identifier'
            && node.key.name === 'observedAttributes';
    });

    if (childPath)
    {
        let classMethod = childPath.node;
        let result;
        if (hasSimpleArrayElements(classMethod))
        {
            result = callback(getSimpleArrayElements(classMethod));
        }
        else
        {
            result = callback(
                types.spreadElement(
                    types.callExpression(
                        types.arrowFunctionExpression([], classMethod.body),
                        [])));
        }
        if (result) childPath.replaceWith(result);
    }
    else
    {
        parentPath.pushContainer('body', callback(null));
    }
}

function hasSimpleArrayElements(node)
{
    if (node && node.type === 'ClassMethod')
    {
        let blockStatement = node.body;
        if (blockStatement && blockStatement.body && blockStatement.body.length === 1)
        {
            let returnStatement = blockStatement.body[0];
            if (returnStatement.type === 'ReturnStatement' && returnStatement.argument)
            {
                if (returnStatement.argument.type === 'ArrayExpression')
                {
                    return true;
                }
            }
        }
    }
}

function getSimpleArrayElements(classMethodNode)
{
    return [...classMethodNode.body.body[0].argument.elements];
}

module.exports = {
    generate
};
