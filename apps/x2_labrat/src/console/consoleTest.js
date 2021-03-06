import './ConsoleElement.js';

window.addEventListener('DOMContentLoaded', main);

function createGameState()
{
    return {
        inventory: []
    };
}

function createRoomState()
{
    return {
        description: 'An empty room.',
        slots: {
            north: 'There is a door to the north.',
            south: null,
            east: null,
            west: null,
            center: null,
        }
    };
}

async function main()
{
    out('You wake up in a dungeon.');
    out('There is a door to the north.');
    out('There is nothing else.');
    out();
    out('What do you do?');
    out('- north');
    out('- west');
    out('- south');
    out('- east');
    out();
    out('- use');
    out('- drop');

    on('clear', () => clear());
    on('north', () => out('hello'));
    on('west', () => out('hello'));
    on('south', () => out('hello'));
    on('east', () => out('hello'));
    on('help', () => out('hello'));
}

function on(commandName, callback)
{
    const c = document.querySelector('console-view');
    c.addEventListener('command', e => {
        const value = e.detail.value;
        if (value)
        {
            const command = value.trim().split(' ');
            if (command.length > 0)
            {
                if (commandName === command[0])
                {
                    callback(command.slice(1));
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        }
    });
}

function out(message)
{
    const c = document.querySelector('console-view');
    c.newline(message);
}

function clear()
{
    const c = document.querySelector('console-view');
    c.clear();
}
