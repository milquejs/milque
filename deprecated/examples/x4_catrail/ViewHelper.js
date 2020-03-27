export function applyViewTransform(view, camera)
{
    if (camera)
    {
        view.context.setTransform(...camera.getProjectionMatrix());
        view.context.transform(...camera.getViewMatrix());
    }
}

export function resetViewTransform(view, camera)
{
    view.context.setTransform(1, 0, 0, 1, 0, 0);
}
