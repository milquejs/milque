export function initialize(eventTarget)
{
    let inputContext = new InputContext(eventTarget);
    return {
        down: inputContext.button('keyboard', 'ArrowDown'),
    };
}
