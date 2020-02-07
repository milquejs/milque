const { say, pause } = require('../output/index.js');

module.exports = { init };

async function init(world)
{
    if (!world.state.commands) throw new Error('Missing dependency.');

    world.state.commands.on('poweron', () => {
        world.state.commands.addCommand({
            message: '[SYSTEM] Run system diagnostics.',
            callback: runCommand,
        }, 'systemdiag');
    });
}

async function runCommand()
{
    await say.newline();
    await say('[SYSTEM] Running system diagnostics...');

    await say.newline();
    await pause();
}
