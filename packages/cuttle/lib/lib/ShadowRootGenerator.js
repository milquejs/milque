/* eslint-env node */
const { types, template } = require('@babel/core');

const SHADOW_ATTACH_BUILDER = template('this.attachShadow(OPTS);');

function generate(properties, path)
{
    replaceAttachShadow(path, superElements => {
    });
}

function replaceAttachShadow(parentPath, callback)
{
}

module.exports = {
    generate
};
