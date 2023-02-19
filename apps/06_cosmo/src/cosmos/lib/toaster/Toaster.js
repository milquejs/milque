/**
 * @param {Record<?, import('@milque/input').InputBinding>} inputs 
 * @param {string} inputPortQuerySelector 
 * @returns {Promise<import('@milque/input').InputContext>}
 */
export async function connectInputs(inputs, inputPortQuerySelector = 'input-port') {
    /** @type {import('@milque/input').InputPort} */
    let inputPort = document.querySelector(inputPortQuerySelector);
    let ctx = inputPort.getContext('axisbutton');
    ctx.bindBindings(Object.values(inputs));
    return ctx;
}

/**
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {import('@milque/display').DisplayPort}
 */
export function getDisplayPort(root = document, selector = 'display-port') {
  return root.querySelector(selector);
}

/**
 * @param {ParentNode} root
 * @param {string} selector
 * @returns {import('@milque/input').InputPort}
 */
export function getInputPort(root = document, selector = 'input-port') {
  return root.querySelector(selector);
}
