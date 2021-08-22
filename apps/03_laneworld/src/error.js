window.addEventListener('error', error, true);
window.addEventListener('unhandledrejection', error, true);

export function error(e)
{
    if (typeof e === 'object')
    {
        if (e instanceof PromiseRejectionEvent)
        {
            error(e.reason);
        }
        else if (e instanceof ErrorEvent)
        {
            error(e.error);
        }
        else if (e instanceof Error)
        {
            window.alert(e.stack);
        }
        else
        {
            window.alert(JSON.stringify(e));
        }
    }
    else
    {
        window.alert(e);
    }
}
