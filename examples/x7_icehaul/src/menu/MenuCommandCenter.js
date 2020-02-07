const { Eventable } = require('../lib/util.js');
const { say, ask, pause, branch } = require('../output/index.js');
const { Menu } = require('./Menu.js');

/**
 * @fires poweron
 * @fires poweroff
 */
module.exports = Menu(run);
module.exports.init = init;

async function init(world)
{
    let ctx = {
        first: true,
        powered: false,
        _list: new Map(),
        _addons: new Map(),
        addCommand(command, handle = command)
        {
            this._list.set(handle, command);
            return this;
        },
        removeCommand(handle)
        {
            this._list.delete(handle);
            return this;
        },
        clearCommands()
        {
            this._list.clear();
        }
    };
    Eventable.assign(ctx);

    world.state.commands = ctx;
    return ctx;
}

async function run(world)
{
    let ctx = world.state.commands;

    if (ctx.first)
    {
        await say.info(
            'You are on a derelict ship. Sitting in the cockpit, '
            + 'you see an empty control panel before you. '
            + 'Perhaps it still works?'
        );
        await say.newline();

        while (!await ask.confirm('Do you turn it on?'))
        {
            await say.newline();
            await say.info(
                'You decide against it. Maybe there is something else more relevant...'
            );
            
            await say.newline();
            await pause();

            await say.info(
                'You look around, but you cannot really make out anything in the dark. '
                + 'After a long uneventful search, you return to the blank control panel. '
                + 'Might as well try everything.'
            );
            await say.newline();
        }

        await commandPowerOnCallback(ctx);

        ctx.first = false;
    }
    
    if (ctx.powered)
    {
        await say('Welcome back, captain.');
    }
    else
    {
        await say('...');
    }

    await Promise.all(ctx.emit('info'));
    await say.newline();

    await branch('Command Center', getCommandOptions(ctx));
}

function getCommandOptions(ctx)
{
    let dst = {};
    let list = Array.from(ctx._list.values()).reverse();
    for(let command of list)
    {
        if (command.disabled) continue;
        let message = command.message;
        let callback = command.callback;
        if (!message || !callback) continue;
        dst[message] = callback;
    }
    return dst;
}

async function commandPowerOnCallback(ctx)
{
    await say.newline();
    await say('[SYSTEM] Powering up systems...');
    await say('[SYSTEM] Performing system diagnostics...');

    ctx.removeCommand('poweron');
    ctx.addCommand({
        message: '[SYSTEM] Power off.',
        callback: commandPowerOffCallback.bind(undefined, ctx),
    }, 'poweroff');

    ctx.powered = true;
    await Promise.all(ctx.emit('poweron'));
    await say.newline();
    await pause();
}

async function commandPowerOffCallback(ctx)
{
    await say.newline();
    await say('[SYSTEM] Powering down systems...');
    
    ctx.clearCommands();
    ctx.addCommand({
        message: '[SYSTEM] Power on.',
        callback: commandPowerOnCallback.bind(undefined, ctx),
    }, 'poweron');

    ctx.powered = false;
    await Promise.all(ctx.emit('poweroff'));
    await say.newline();
    await pause();

    process.exit(0);
}
