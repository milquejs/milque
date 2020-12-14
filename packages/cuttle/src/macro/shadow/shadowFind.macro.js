/* eslint-env node */
const { createMacro } = require('babel-plugin-macros');
const { template } = require('@babel/core');

const QUERY_STATEMENT = template.ast('this.shadowRoot.querySelector');

/**
 * NOTE: A limitation that this MUST be called in the constructor.
 */
function shadowFind({ references })
{
    for(let path of references.default)
    {
        path.replaceWithMultiple(QUERY_STATEMENT);
    }
}

module.exports = createMacro(shadowFind);
