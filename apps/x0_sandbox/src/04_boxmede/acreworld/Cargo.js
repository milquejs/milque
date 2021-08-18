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

export function getCargoMainColor(cargo)
{
    return CARGO[cargo].color;
}

export function getCargoShadowColor(cargo)
{
    return CARGO[cargo].shadow;
}

export function isCargoAcceptable(sourceCargo, targetCargo)
{
    return sourceCargo === targetCargo;
}

function createCargo(color, shadow)
{
    return {
        color,
        shadow,
    };
}
