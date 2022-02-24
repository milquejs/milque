export function enablePointerLockBehavior(displayElement)
{
    displayElement.addEventListener('focus', () => {
        if (document.pointerLockElement !== displayElement)
        {
            displayElement.requestPointerLock();
        }
    });
    document.addEventListener('pointerlockchange', () => {
        if (document.pointerLockElement !== displayElement)
        {
            displayElement.blur();
        }
    });
}
