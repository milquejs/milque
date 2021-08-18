const CARGO = {
    lime: createCargo('lime', 'green'),
    tomato: createCargo('tomato', 'maroon'),
    banana: createCargo('yellow', 'gold'),
};
const CARGO_KEYS = Object.keys(CARGO);

export function randomCargo()
{
    return CARGO_KEYS[Math.floor(Math.random() * CARGO_KEYS.length)];
}

export function getCargoMainColor(Cargo)
{
    return CARGO[Cargo].color;
}

export function getCargoShadowColor(Cargo)
{
    return CARGO[Cargo].shadow;
}

function createCargo(color, shadow)
{
    return {
        color,
        shadow,
    };
}
