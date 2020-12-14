/* eslint-env node */
const { types, template } = require('@babel/core');

const {
    isPropertyStaticallyUnobserved,
    isPropertyStringType,
    isPropertyBooleanType,
    isPropertyEventCallbackType,
    getPropertyTypeNode,
    getPropertySourceNode,
} = require('./CuttleProperty.js');

function generate(properties, path)
{
    for (let [key, property] of Object.entries(properties))
    {
        // Create setter...
        createSetterFromProperty(path, key, property);
        // Create getter...
        createGetterFromProperty(path, key, property);
    }
}

const STATICALLY_UNOBSERVED_ATTRIBUTE_GET_EXPRESSION_BUILDER = template.expression('PARSER(this.getAttribute("KEY"))');
const STATICALLY_UNOBSERVED_BOOLEAN_GET_EXPRESSION_BUILDER = template.expression('this.hasAttribute("KEY")');

function createGetterFromProperty(path, key, property)
{
    let expression;
    if (isPropertyStaticallyUnobserved(property))
    {
        if (isPropertyStringType(property))
        {
            expression = template.expression.ast(`this.getAttribute("${key}")`);
        }
        else if (isPropertyBooleanType(property))
        {
            expression = STATICALLY_UNOBSERVED_BOOLEAN_GET_EXPRESSION_BUILDER({
                KEY: key
            });
        }
        else
        {
            expression = STATICALLY_UNOBSERVED_ATTRIBUTE_GET_EXPRESSION_BUILDER({
                PARSER: getPropertyTypeNode(property),
                KEY: key
            });
        }
    }
    else
    {
        expression = template.expression.ast(`this._${key}`);
    }
    
    let classMethod = types.classMethod(
        'get',
        types.identifier(key), [],
        types.blockStatement([types.returnStatement(expression)]));
    let sourceNode = getPropertySourceNode(property);
    if (sourceNode.leadingComments)
    {
        types.addComment(
            classMethod,
            'leading',
            sourceNode.leadingComments.map(node => node.value).join('\n')
        );
    }
    path.insertAfter(classMethod);
}

function createSetterFromProperty(path, key, property)
{
    let statement;
    if (isPropertyEventCallbackType(property))
    {
        // Assumes all event properties are prefixed with `on`.
        let event = key.substring(2);
        statement = `if (this._${key}) this.removeEventListener("${event}", this._${key});`
            + `this._${key} = value;`
            + `if (this._${key}) this.addEventListener("${event}", value);`;
        statement = template.ast(statement);
    }
    else
    {
        switch(getPropertyTypeNode(property).name)
        {
            case 'Boolean':
                statement = `this.toggleAttribute("${key}", value)`;
                break;
            case 'String':
                statement = `this.setAttribute("${key}", value)`;
                break;
            default:
                statement = `this.setAttribute("${key}", String(value))`;
        }
        statement = [template.ast(statement)];
    }
    let classMethod = types.classMethod(
        'set',
        types.identifier(key),
        [ types.identifier('value') ],
        types.blockStatement(statement)
    );
    path.insertAfter(classMethod);
}

module.exports = {
    generate
};
