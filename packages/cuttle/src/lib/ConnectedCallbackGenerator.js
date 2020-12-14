/* eslint-env node */
const { types, template } = require('@babel/core');

const {
    hasPropertyDefaultValue,
    getPropertyDefaultValueNode,
} = require('./CuttleProperty.js');

const DEFAULT_BUILDER = template(`
if (!this.hasAttribute(KEY)) {
    this.setAttribute(KEY, DEFAULT_VALUE);
}`);

const UPGRADE_BUILDER = template(`
if (Object.prototype.hasOwnProperty.call(this, KEY)) {
    let value = this.KEY_IDENTIFIER;
    delete this.KEY_IDENTIFIER;
    this.KEY_IDENTIFIER = value;
}`);

function generate(properties, path)
{
    replaceConnectedCallback(path, superStatements => {
        let statements = [];

        // Upgrade properties...
        for(let key of Object.keys(properties))
        {
            statements.push(
                UPGRADE_BUILDER({
                    KEY: types.stringLiteral(key),
                    KEY_IDENTIFIER: types.identifier(key),
                })
            );
        }

        // Set default values...
        for (let [key, property] of Object.entries(properties))
        {
            if (hasPropertyDefaultValue(property))
            {
                statements.push(
                    DEFAULT_BUILDER({
                        KEY: types.stringLiteral(key),
                        DEFAULT_VALUE: getPropertyDefaultValueNode(property)
                    })
                );
            }
        }

        // User-defined callback...
        if (Array.isArray(superStatements))
        {
            statements.push(...superStatements);
        }
        else if (superStatements)
        {
            statements.push(superStatements);
        }
        
        return types.classMethod(
            'method',
            types.identifier('connectedCallback'), [],
            types.blockStatement(statements)
        );
    });
}

function replaceConnectedCallback(parentPath, callback)
{
    let parentNode = parentPath.node;
    for (let i = 0; i < parentNode.body.length; ++i)
    {
        let classMethod = parentNode.body[i];
        if (classMethod.type === 'ClassMethod'
            && classMethod.kind === 'method'
            && classMethod.key.type === 'Identifier'
            && classMethod.key.name === 'connectedCallback')
        {
            let methodBody = classMethod.body.body;
            parentNode.body[i] = callback(methodBody);
            return;
        }
    }
    parentNode.body.push(callback(null));
}

module.exports = {
    generate
};
