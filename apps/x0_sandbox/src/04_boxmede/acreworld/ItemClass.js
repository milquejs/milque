const ITEM_CLASSES = {
    lime: createItemClass('lime', 'green'),
    tomato: createItemClass('tomato', 'maroon'),
    banana: createItemClass('yellow', 'gold'),
};
const ITEM_CLASS_KEYS = Object.keys(ITEM_CLASSES);

export function randomItemClass()
{
    return ITEM_CLASS_KEYS[Math.floor(Math.random() * ITEM_CLASS_KEYS.length)];
}

export function getItemClassMainColor(itemClass)
{
    return ITEM_CLASSES[itemClass].color;
}

export function getItemClassShadowColor(itemClass)
{
    return ITEM_CLASSES[itemClass].shadow;
}

function createItemClass(color, shadow)
{
    return {
        color,
        shadow,
    };
}
