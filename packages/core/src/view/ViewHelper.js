export function setViewTransform(view, camera)
{
    if (camera)
    {
        view.context.setTransform(...camera.getProjectionMatrix());
        view.context.transform(...camera.getViewMatrix());
    }
}
