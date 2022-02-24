const { TypePause } = require('./TypePause.js');
const chalk = require('chalk');

const DEFAULT_PAUSE_MESSAGE = `${chalk.gray('Press [SPACE] to continue...')}`;

const PAUSE = new TypePause(DEFAULT_PAUSE_MESSAGE);

async function pause()
{
    await PAUSE.pause();
}

module.exports = async function () { await pause(...arguments); };
module.exports.pause = pause;
