/* eslint-env node */
const { createMacro } = require('babel-plugin-macros');

const propertiesMacro = require('./macro/properties.macro.js');
const customEventsMacro = require('./macro/customEvents.macro.js');
const attachShadowTemplateMacro = require('./macro/shadow/attachShadowTemplate.macro.js');

function cuttle({ references })
{
    const { properties, customEvents, attachShadowTemplate } = references;
    if (properties)
    {
        propertiesMacro({ references: { default: properties }});
    }

    if (customEvents)
    {
        customEventsMacro({ references: { default: customEvents }});
    }

    if (attachShadowTemplate)
    {
        attachShadowTemplateMacro({ references: { default: attachShadowTemplate }});
    }
}

module.exports = createMacro(cuttle);
