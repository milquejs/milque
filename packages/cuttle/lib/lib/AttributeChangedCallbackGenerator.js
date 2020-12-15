/* eslint-env node */
const { types, template } = require('@babel/core');

const {
    isPropertyStringType,
    isPropertyEventCallbackType,
    isPropertyStaticallyUnobserved,
    CUTTLE_GENERATION_KEY,
} = require('./CuttleProperty.js');

const CALLBACK_CHANGE_BUILDER = template(`{
    let ownedPrev = this.KEY;
    let ownedValue = this.KEY = PARSER_EXPRESSION;
    (CALLBACK).call(INSTANCE, ownedValue, ownedPrev, attribute);
}`);
const STRING_CHANGE_BUILDER = template('this.KEY = VALUE;');
const ATTRIBUTE_CHANGE_BUILDER = template(`{
    this.KEY = PARSER_VALUE_EXPRESSION;
}`);
const EVENT_CHANGE_BUILDER = template(`{
    this.KEY = new Function('event', 'with(document){with(this){' + value + '}}').bind(INSTANCE);
}`);

function generate(properties, path)
{
    replaceAttributeChangedCallback(path, superPath => {
        let switchCases = [];
        for(let [key, property] of Object.entries(properties))
        {
            if (isPropertyStaticallyUnobserved(property)) continue;
            if (isPropertyEventCallbackType(property))
            {
                switchCases.push(
                    types.switchCase(
                        types.stringLiteral(key), [
                            EVENT_CHANGE_BUILDER({
                                KEY: types.identifier(key),
                                INSTANCE: types.thisExpression(),
                            }),
                            types.breakStatement()
                        ]
                    )
                );
            }
            else if (isPropertyStringType(property))
            {
                switchCases.push(
                    types.switchCase(
                        types.stringLiteral(key), [
                            STRING_CHANGE_BUILDER({ KEY: `_${key}`, VALUE: 'value' }),
                            types.breakStatement()
                        ]
                    )
                );
            }
            else
            {
                switchCases.push(
                    types.switchCase(
                        types.stringLiteral(key), [
                            ATTRIBUTE_CHANGE_BUILDER({
                                KEY: types.identifier('_' + key),
                                PARSER_VALUE_EXPRESSION: getParserExpressionByProperty(properties[key]),
                            }),
                            types.breakStatement()
                        ]
                    )
                );
            }
            /*
            if (key in context.attributeChangedCallbacks)
            {
                switchCases.push(
                    types.switchCase(
                        types.stringLiteral(key), [
                            ATTRIBUTE_CHANGE_BUILDER({
                                KEY: types.identifier('_' + key),
                                INSTANCE: context.attributeChangedCallbacks[key].instance,
                                PARSER_EXPRESSION: getParserExpressionByProperty(properties[key]),
                                CALLBACK: context.attributeChangedCallbacks[key].callback,
                            }),
                            types.breakStatement()
                        ]));
            }
            */
        }

        let statements = [];
        if (superPath)
        {
            let cuttleSwitchPath = superPath.get('body.body').find(({ node }) => {
                return node.type === 'SwitchStatement'
                    && node.leadingComments
                    && node.leadingComments.reduce((prev, current) => {
                        if (prev) return prev;
                        if (current.value === CUTTLE_GENERATION_KEY)
                        {
                            return true;
                        }
                    }, false);
            });

            if (cuttleSwitchPath)
            {
                cuttleSwitchPath.pushContainer('cases', switchCases);
                return null;
            }
            else
            {
                const superCallback = superPath.node;
                statements.push(
                    types.expressionStatement(
                        types.callExpression(
                            types.arrowFunctionExpression(superCallback.params, superCallback.body),
                            [
                                types.identifier('attribute'),
                                types.identifier('prev'),
                                types.identifier('value')
                            ]
                        )
                    )
                );
            }
        }

        let switchStatement = types.switchStatement(types.identifier('attribute'), switchCases);
        types.addComment(switchStatement, 'leading', CUTTLE_GENERATION_KEY);
        statements.unshift(switchStatement);
        
        return types.classMethod(
            'method',
            types.identifier('attributeChangedCallback'),
            [
                types.identifier('attribute'),
                types.identifier('prev'),
                types.identifier('value')
            ],
            types.blockStatement(statements)
        );
    });
}

function replaceAttributeChangedCallback(parentPath, callback)
{
    let childPath = parentPath.get('body').find(
        ({ node }) => {
            return node.type === 'ClassMethod'
            && node.kind === 'method'
            && node.key.type === 'Identifier'
            && node.key.name === 'attributeChangedCallback';
        });
    
    if (childPath)
    {
        let result = callback(childPath);
        if (result) childPath.replaceWith(result);
    }
    else
    {
        parentPath.pushContainer('body', callback(null));
    }
}

function getParserExpressionByProperty(property)
{
    switch(property.type.name)
    {
        case 'Boolean':
            return template.expression.ast('value !== null');
        case 'String':
            return template.expression.ast('value');
        default:
            return template.expression('PARSER(value)')({ PARSER: property.type });
    } 
}

function getCallbackNameForAttribute(attribute)
{
    if (attribute === '*')
    {
        return '__any__AttributeChangedCallback';
    }
    else
    {
        return '__' + attribute + 'AttributeChangedCallback';
    }
}

module.exports = {
    generate,
    getCallbackNameForAttribute
};
