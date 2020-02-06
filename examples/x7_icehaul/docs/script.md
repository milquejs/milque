# welcome-back
Welcome back, Captain ${player.name}. How was your reset?

{ pause; goto #await-orders; }

# await-orders
Awaiting orders
- ?{player.location}
    - [Visit the planet below](#planet-visit)
        + You decide to visit the planet below.
        + ?{player.sick} {goto #await-orders}
        + !{player.sick} {goto #await-orders}
- ?{hasCaptain}[Talk to the captain](#await-orders)
    - {goto captain}
- {hasInventory}:
    Look at inventory
    - {goto look-inventory}
- {second} : Next day
    - {goto awaiting-orders; set first 0}
    - {set second true}

# planet-visit
You enter the planet's docking station.

What do you want to do?
- [Marketplace](#planet-market)
- Local Inn
- Shipyard
- Bank

# planet-market
This is the market.

# Captain talking

`captain`:
What is it that you need?

`player`:
nothing really
