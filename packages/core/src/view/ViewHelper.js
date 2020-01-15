export function setViewTransform(view, camera = undefined)
{
    if (camera)
    {
        view.context.setTransform(...camera.getProjectionMatrix());
        view.context.transform(...camera.getViewMatrix());
    }
    else
    {
        view.context.setTransform(1, 0, 0, 1, 0, 0);
    }
}
