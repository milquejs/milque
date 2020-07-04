export class CameraPan
{
    constructor()
    {
        this.dragging = false;

        this.dragStartX = 0;
        this.dragStartY = 0;

        this.dragViewX = 0;
        this.dragViewY = 0;
    }

    update(view, camera, dragging)
    {
        if (dragging !== this.dragging)
        {
            if (dragging)
            {
                this.dragStartX = camera.x;
                this.dragSTartY = camera.y;
            }
            else
            {

            }
        }
        else if (dragging)
        {

        }
    }
}
