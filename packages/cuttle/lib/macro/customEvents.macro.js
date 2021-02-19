/* eslint-env node */
const { types } = require('@babel/core');

const EventsEvaluator = require('../lib/EventsEvaluator.js');
const PropertyAccessorGenerator = require('../lib/PropertyAccessorGenerator.js');
const ConnectedCallbackGenerator = require('../lib/ConnectedCallbackGenerator.js');
const ObservedAttributesGenerator = require('../lib/ObservedAttributesGenerator.js');
const AttributeChangedCallbackGenerator = require('../lib/AttributeChangedCallbackGenerator.js');
const {
    createProperty,
    EVENT_CALLBACK,
} = require('../lib/CuttleProperty.js');

function customEvents({ references })
{
    for(let childPath of references.default)
    {
        // if (parentNode.static && parentNode.kind === 'get' && parentNode.key.name === 'customEvents')
        let parentPath = childPath.getFunctionParent();
        let customEvents = EventsEvaluator.evaluate(parentPath);
        let classPath = parentPath.findParent(path => path.node.type === 'ClassBody');

        // Generate code
        let eventProperties = {};
        for(let [eventName, customEvent] of Object.entries(customEvents))
        {
            let key = `on${eventName}`;
            eventProperties[key] = createProperty(
                customEvent.source,
                types.stringLiteral(key),
                { type: EVENT_CALLBACK },
                types.identifier('undefined'),
                types.booleanLiteral(true)
            );
        }
        PropertyAccessorGenerator.generate(eventProperties, parentPath);
        ConnectedCallbackGenerator.generate(eventProperties, classPath);
        ObservedAttributesGenerator.generate(eventProperties, classPath);
        AttributeChangedCallbackGenerator.generate(eventProperties, classPath);

        // Convert to simple identifier
        parentPath.node.computed = false;
    }
}

module.exports = customEvents;
