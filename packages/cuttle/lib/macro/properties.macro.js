/* eslint-env node */
const PropertiesEvaluator = require('../lib/PropertiesEvaluator.js');
const PropertyAccessorGenerator = require('../lib/PropertyAccessorGenerator.js');
const ConnectedCallbackGenerator = require('../lib/ConnectedCallbackGenerator.js');
const ObservedAttributesGenerator = require('../lib/ObservedAttributesGenerator.js');
const AttributeChangedCallbackGenerator = require('../lib/AttributeChangedCallbackGenerator.js');

function properties({ references })
{
    for(let childPath of references.default)
    {
        // if (parentNode.static && parentNode.kind === 'get' && parentNode.key.name === 'properties')
        let parentPath = childPath.getFunctionParent();
        let properties = PropertiesEvaluator.evaluate(parentPath);
        let classPath = parentPath.findParent(path => path.node.type === 'ClassBody');

        // Generate code
        PropertyAccessorGenerator.generate(properties, parentPath);
        ConnectedCallbackGenerator.generate(properties, classPath);
        ObservedAttributesGenerator.generate(properties, classPath);
        AttributeChangedCallbackGenerator.generate(properties, classPath);

        // Convert to simple identifier
        parentPath.node.computed = false;
    }
}

module.exports = properties;
