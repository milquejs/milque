const { TypeWriter } = require('./TypeWriter.js');

const WRITER = new TypeWriter();

async function log(...messages)
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
    await WRITER.write('\n');
}

module.exports = async function () { await log(...arguments); };
module.exports.log = log;
