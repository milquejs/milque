const { Eventable } = require('../lib/util.js');
const { say, pause, branch } = require('../output/index.js');
const { Menu } = require('./Menu.js');

module.exports = Menu(run);
module.exports.init = init;

async function init(world)
{
    let ctx = Eventable.create({
        first: false,
        powered: false,
        _list: new Map(),
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
        get options()
        {
            let dst = {};
            for(let command of this._list.values())
            {
                if (command.disabled) continue;
                let message = command.message;
                let callback = command.callback;
                if (!message || !callback) continue;
                dst[message] = callback;
            }
            return dst;
        }
    });

    ctx.addCommand(COMMAND_POWER(world));

    world.state.commands = ctx;
    return ctx;
}

async function run(world)
{
    if (!world.state.commands.first)
    {
        await say.info('You are on a derelict ship. Sitting in the cockpit, you see an empty control panel before you. Perhaps it still works?');
        await say.newline();
    }
    else
    {
        if (world.state.commands.powered)
        {
            await say('Welcome back, captain.');
        }
        else
        {
            await say('...');
        }
        await say.newline();
    }
    
    await branch('Command Center', world.state.commands.options);
}

function COMMAND_POWER(world)
{
    return {
        _world: world,
        _on: commandCenterPowerOn.bind(undefined, world),
        _off: commandCenterPowerOff.bind(undefined, world),
        get message()
        {
            return this._world.state.commands.powered ? '[SYSTEM] Power off.' : '[SYSTEM] Power on.';
        },
        get callback()
        {
            return this._world.state.commands.powered ? this._off : this._on;
        },
    };
}

async function commandCenterPowerOn(world)
{
    await say.newline();
    await say('[SYSTEM] Powering up systems...');
    await say('[SYSTEM] Performing system diagnostics...');

    world.state.commands.powered = true;
    await pause();
}

async function commandCenterPowerOff(world)
{
    await say.newline();
    await say('[SYSTEM] Powering down systems...');

    world.state.commands.powered = false;
    await pause();
}
