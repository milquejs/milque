/* eslint-env node */
const { createMacro } = require('babel-plugin-macros');
const { template } = require('@babel/core');

function cuttle({ references })
{
    for(let path of references.observedProperties)
    {
        let classBody = path.findParent(path => path.node.type === 'ClassBody');
        if (!classBody)
        {
            throw path.buildCodeFrameError('cuttle() must be called from within a class body.');
        }
    }
}

module.exports = createMacro(cuttle);

function getClassMethod(classBodyPath, methodName)
{
    let body = classBodyPath.get('body')
        .find(path => path.node.type === 'ClassMethod' && path.node.key.name === methodName);
}