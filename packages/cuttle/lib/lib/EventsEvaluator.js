/* eslint-env node */
const { createCustomEvent } = require('./CuttleProperty.js');

/**
 * @example
 * static get customEvents() {
 *   return [
 *     'customevent',
 *     'someupdate',
 *   ];
 * }
 * @param {import('@babel/core').NodePath} path 
 */
function evaluate(path)
{
    let dst = {};
    let methodNode = path.node;
    let returnStatement = methodNode.body.body[methodNode.body.body.length - 1];
    let returnedObject = returnStatement.argument;
    if (returnedObject.type === 'ArrayExpression')
    {
        for (let arrayElement of returnedObject.elements)
        {
            if (arrayElement.type === 'StringLiteral')
            {
                let event = arrayElement.value;
                if (!isGlobalEventHandler(event))
                {
                    dst[event] = createCustomEvent(
                        arrayElement,
                        arrayElement
                    );
                }
                else
                {
                    throw path.buildCodeFrameError('Cannot register a duplicate GlobalEventHandler event.');
                }
            }
            else
            {
                throw path.buildCodeFrameError('Unsupported event value type - must be a string.');
            }
        }

        return dst;
    }
    else
    {
        throw path.buildCodeFrameError('Unsupported properties object evaluation.');
    }
}

const GLOBAL_EVENT_HANDLER_KEYS = new Set([
    'onabort',
    'onblur',
    'onerror',
    'onfocus',
    'oncancel',
    'oncanplay',
    'onchange',
    'onclick',
    'onclose',
    'oncontextmenu',
    'oncuechange',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragexit',
    'ondragleave',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'onformdata',
    'ongotpointercapture',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadend',
    'onloadstart',
    'onresize',
    'ontransitioncancel',
    'ontransitionend',
]);

function isGlobalEventHandler(eventName)
{
    return GLOBAL_EVENT_HANDLER_KEYS.has(eventName);
}

module.exports = {
    evaluate
};
