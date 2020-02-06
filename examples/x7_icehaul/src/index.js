const stars = require('./stars.js');
const items = require('./items.js');
const player = require('./player.js');
const menus = require('./menus.js');

async function main()
{
    let world = {
        day: 0,
        state: {}
    };

    stars.init(world);
    items.init(world);
    player.init(world);
    menus.init(world);

    menus.start(world);
}

main();
