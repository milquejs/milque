const { choose } = require('./ask.js');

module.exports = async function branch(message, options = {}) {
  let key = await choose(message, Object.keys(options));
  if (key) return await options[key].call();
  else return null;
};
