export function fromTemplate(name, template, multiple = false)
{
    return {
        name,
        multiple,
        create() { return Object.assign({}, template); },
    };
}
