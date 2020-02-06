const { choose } = require('./ask.js');

module.exports = async function branch(message, options = {})
{
    let key = await choose(message, Object.keys(options));
    return await options[key].call();
};
