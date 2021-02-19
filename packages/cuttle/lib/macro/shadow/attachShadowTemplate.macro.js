/* eslint-env node */
const { template, types } = require('@babel/core');

const { CUTTLE_GENERATION_KEY } = require('../../lib/CuttleProperty.js');

const TEMPLATE_KEY_EXPRESSION = template.expression.ast('Symbol.for("cuttleTemplate")');
const STYLE_KEY_EXPRESSION = template.expression.ast('Symbol.for("cuttleStyle")');

const TEMPLATE_FUNCTION_BODY_BUILDER = template(`
let t = document.createElement("template");
t.innerHTML = TEMPLATE_CONTENT;
Object.defineProperty(this, Symbol.for("cuttleTemplate"), {value:t});
return t;`);
const STYLE_FUNCTION_BODY_BUILDER = template(`
let s = document.createElement("style");
s.innerHTML = STYLE_CONTENT;
Object.defineProperty(this, Symbol.for("cuttleStyle"), {value:s});
return s;`);

const ATTACH_SHADOW_BUILDER = template(`
INSTANCE.attachShadow(SHADOW_OPTS)`);
const TEMPLATE_APPEND_BUILDER = template(`
INSTANCE.shadowRoot.appendChild(INSTANCE.constructor[Symbol.for("cuttleTemplate")].content.cloneNode(true));`);
const STYLE_APPEND_BUILDER = template(`
INSTANCE.shadowRoot.appendChild(INSTANCE.constructor[Symbol.for("cuttleStyle")].cloneNode(true));`);

function generateGetTemplateElement(classPath, templateValueExpression)
{
    let classMethod = types.classMethod(
        'get', TEMPLATE_KEY_EXPRESSION, [],
        types.blockStatement(TEMPLATE_FUNCTION_BODY_BUILDER({ TEMPLATE_CONTENT: templateValueExpression })),
        true, true);
    types.addComment(classMethod, 'leading', CUTTLE_GENERATION_KEY);
    classPath.unshiftContainer('body', classMethod);
}

function generateGetStyleElement(classPath, styleValueExpression)
{
    let classMethod = types.classMethod(
        'get', STYLE_KEY_EXPRESSION, [],
        types.blockStatement(STYLE_FUNCTION_BODY_BUILDER({ STYLE_CONTENT: styleValueExpression })),
        true, true);
    types.addComment(classMethod, 'leading', CUTTLE_GENERATION_KEY);
    classPath.unshiftContainer('body', classMethod);
}

function attachShadowTemplate({ references })
{
    for(let childPath of references.default)
    {
        // if (parentNode.static && parentNode.kind === 'get' && parentNode.key.name === 'template')

        let statementPath = childPath.getStatementParent();
        let callExpression = statementPath.get('expression').node;
        if (callExpression.arguments.length < 2)
        {
            throw childPath.buildCodeFrameError('Missing arguments.');
        }

        let instanceExpression = callExpression.arguments[0];
        let templateValueExpression = callExpression.arguments[1];
        let styleValueExpression = callExpression.arguments[2] || undefined;
        let shadowOptsValueExpression = callExpression.arguments[3] || undefined;

        // Create template element cache
        let parentPath = childPath.getFunctionParent();
        let classPath = parentPath.findParent(path => path.node.type === 'ClassBody');
        if (styleValueExpression) generateGetStyleElement(classPath, styleValueExpression);
        generateGetTemplateElement(classPath, templateValueExpression);

        // Append to shadow dom
        let statements = [
            ATTACH_SHADOW_BUILDER({ INSTANCE: instanceExpression, SHADOW_OPTS: shadowOptsValueExpression }),
            TEMPLATE_APPEND_BUILDER({ INSTANCE: instanceExpression }),
        ];
        if (styleValueExpression) statements.push(STYLE_APPEND_BUILDER({ INSTANCE: instanceExpression }));

        // Replace with new statements
        statementPath.replaceWithMultiple(statements);
    }
}

module.exports = attachShadowTemplate;
