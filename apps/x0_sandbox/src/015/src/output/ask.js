const enquirer = require('enquirer');

async function prompt(message, type = 'input', opts = {}) {
  return await enquirer.prompt({
    type,
    message,
    ...opts,
  });
}

async function input(message, initial = '') {
  return await new enquirer.Input({
    message,
    initial,
  })
    .run()
    .catch((e) => null);
}

async function choose(message, options) {
  return await new enquirer.AutoComplete({
    message,
    choices: options,
    limit: 10,
  })
    .run()
    .catch((e) => null);
}

async function confirm(message) {
  return await new enquirer.Confirm({
    message,
  })
    .run()
    .catch((e) => null);
}

module.exports = async function () {
  await input(...arguments);
};
module.exports.prompt = prompt;
module.exports.input = input;
module.exports.choose = choose;
module.exports.confirm = confirm;
