const { ModuleSystem } = require('./ModuleSystem.js');
const { SimpleCommand } = require('./SimpleCommand.js');

const {
  NavigationChangeDestinationCommand,
} = require('./NavigationChangeDestinationCommand.js');

const { say, pause, style } = require('../output/index.js');

class NavigationSystem extends ModuleSystem {
  /** @override */
  onAttach(commandCenter) {
    commandCenter.registerCommand(
      'nav-destination',
      new NavigationChangeDestinationCommand()
    );
    commandCenter.registerCommand(
      'nav-continue',
      new SimpleCommand(
        '[NAVIGATION] Continue to destination.',
        async (world) => gotoDestination(world),
        (world) => Boolean(world.player.destination.system)
      ).setAlwaysVisible(false)
    );
  }

  /** @override */
  onDetach(commandCenter) {
    commandCenter.unregisterCommand('nav-continue');
    commandCenter.unregisterCommand('nav-destination');
  }

  /** @override */
  async onBanner(world) {
    console.log(`Current System: ${style.system(world.player.system)}`);
    console.log(`Current Location: ${style.location(world.player.location)}`);
    console.log(`Destination: ${style.destination(world.player.destination)}`);
    console.log(
      `Fuel: ${style.fuel(
        world.player.fuel,
        world.player.maxFuel,
        -world.player.destination.cost
      )}`
    );
  }
}

module.exports = { NavigationSystem };

async function gotoDestination(world) {
  let player = world.player;

  await say(
    '...moving to target destination: ' +
      style.destination(player.destination) +
      '...'
  );

  // Set location to destination
  let dx = player.destination.system.x;
  let dy = player.destination.system.y;
  let dl = player.destination.location;
  let dc = player.destination.cost;
  player.x = dx;
  player.y = dy;
  player.location = dl;
  player.fuel -= dc;
  world.day += dc;

  // Reset destination
  player.destination.system = null;
  player.destination.location = null;
  player.destination.cost = 0;

  await say();
  await pause();
}
