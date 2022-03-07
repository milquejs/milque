Ascii 207 = Generic currency sign

Welcome back, captain.

Your orders?

- Scan the region...
- Open comms...
- Beam me down...
- Set course for...
- Change course to...
- Check inventory...
- Continue on.

Space is made of landmarks, separated by distance.

System

- Central Star
- Plantary Orbits
- Astroid Belts

Location

- System -> Planet/Landmark -> Container (ship/surface/etc)

[Solar][sol][Orbit]
[Solar][earth][Ship]
[Solar][pluto][Surface]
[Endar][ende][Orbit]

# Infrastructure

- can require location attributes
- location should have limited infrastructure support

## Factory (converts materials)

    - Material Factory
    - Arsenal Factory
    - Ship Factory
    - Minerals Foundary
    - Plastics Foundary
    - Simple Manufacture
    - Complex Manufacture

## Farming (produces materials)

    - Mineral Farming (Mining)
    - Nutrient Farming
    - Hydro Farming
    - Fuel/Energy Farming

## Service (consumes materials)

    - Planetary Global Defense System
    - Residency / Population
        - Level 0 - Unsustainable
        - Level 1 - Sustainable
            - Nutrient
            - Water
            - Sparse Population
        - Level 1.5 - Colony
            - Small Population
            - Energy
        - Level 2 - Stable
            - Decent Population
            - Material
            - Technology
        - Level 3 - Prosperous
            - Agency
            - Trade Routes
            - Communication
        - Level 4 - Advanced
            - Space Station
            - Military Presence
            - Accepted in the Union

The Infrastructure determines the loot table.

That means all lower level planets will NEED Nutrients
But all upper level planets won't.

Should there be a persistent trade route?

What is fun?
Traders: Trading low / high.
Builders: Supporting a civilization.

Unique items per system.

Cultures Needs (determines the values of the trade items and the crew requirements)

= Level 1 10-135
Green
Yellow
= Level 2 110 - 1150
Orange
Red
= Level 3 1050 - 3750
Magenta
Blue
= Level 4 5000 - 10000
Black

Trade differences should lead to the player DOING more fun things.

- So keep random, but deterministic differences should be because of danger or something fun.

Maybe:

- The universe has stablized all trade routes, so every system, if not producing something, has
  a (or a few) trade routes to other systems for the other goods. Events can disrupt those trade
  routes and cause prices to plummet / sky-rocket within the system. Therefore, the player can
  prepare a bunch of items to travel a dangerous and long journey out to another system.

\u03b1 => alpha
\u03C9 => omega

10 - 90
10 - 135
50 - 200
150 - 625
325 - 1000
1150 - 2800
2050 - 5650
3000 - 7750
4500 - 8000
5000 - 9000

Sun
Planet
Asteroid

NEEDS:

- If out of fuel, will spend a lot of time (and therefore resources) and end up at one
  of the nearby planets. There's a low chance to land on a deserted planet, which then you lose
  everything but is able to escape the planet after a long time on a derelict (or broken) ship.
- If out of food, all ability / stat chances are 0. Morale decreases. Fuel is consumed (at a higher rate) instead after a few days.
  - Allow rationing?

Ship Parts:

- Engine Room
- Medbay
- Kitchen
- Command Room

Medical Package
Nutrient Dispenser
Thruster
Power Generator

ItemClass

- Name
- Id
- MaxStackSize
- Description
- Size
- Attributes

ItemStack

- ItemId
- StackSize
- Metadata

- EXPLORE through experimentation
- Fabricator

You are on a derelict ship. Sitting in the cockpit, you see an empty control panel before you. You notice a switch nearby. Perhaps it still works?

Command Center

- Prints Stats
- Shows command target / queue / destination
- Lists commands to execute

=-=-=-=-=-= POSSIBLE FEATURE =-=-=-=
Command discovery System

- Every command is ??? until used.
- Or you find the manual for it.
  =-=-=-=-==-=-===-=-=-=-=-=-=-=-=-=-=
