const chalk = require('chalk');
const { TypeWriter } = require('./TypeWriter.js');

const WRITER = new TypeWriter();

async function log(...messages)
{
    await write(...messages);
    await newline();
}

async function info(...messages)
{
    let result;
    if (messages.length > 0)
    {
        if (typeof messages[0] === 'object')
        {
            result = messages.map(value => JSON.stringify(value)).join(' ');
        }
        else
        {
            result = messages.join(' ');
        }
    }
    await WRITER.write(chalk.italic(result));
    await newline();
}

async function write(...messages)
{
    if (messages.length > 0)
    {
        if (typeof messages[0] === 'object')
        {
            await WRITER.write(messages.map(value => JSON.stringify(value)).join(' '));
        }
        else
        {
            await WRITER.write(messages.join(' '));
        }
    }
}

async function newline()
{
    await WRITER.write('\n');
}

const DIVIDER_LENGTH = 80;
async function divider(token)
{
    let count = Math.floor(DIVIDER_LENGTH / token.length);
    let remainder = DIVIDER_LENGTH - (count * token.length);
    let string = token.repeat(count);
    if (remainder > 0) string += token.substring(0, remainder);
    string += '\n';
    process.stdout.write(chalk.gray(string));
}

module.exports = async function () { await log(...arguments); };
module.exports.log = log;
module.exports.info = info;
module.exports.write = write;
module.exports.newline = newline;
module.exports.divider = divider;
