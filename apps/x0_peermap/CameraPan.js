const DRAG_MOMENTUM_FACTOR = 6;
const DRAG_MOMENTUM_DAMPING_FACTOR = 0.5;
const DRAG_MOMENTUM_FRICTION = 0.08;
const DRAG_MOMENTUM_INV_FRICTION = 1 - DRAG_MOMENTUM_FRICTION;

export class CameraPan
{
    constructor()
    {
        this.dragging = false;

        this.prevScreenX = 0;
        this.prevScreenY = 0;

        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragStartScreenX = 0;
        this.dragStartScreenY = 0;

        this.dragMomentumX = 0;
        this.dragMomentumY = 0;
    }

    update(dt, camera, screenX, screenY, dragging)
    {
        if (dragging !== this.dragging)
        {
            if (dragging)
            {
                this.prevScreenX = screenX;
                this.prevScreenY = screenY;

                this.dragStartX = camera.x;
                this.dragStartY = camera.y;
                this.dragStartScreenX = screenX;
                this.dragStartScreenY = screenY;
            }

            this.dragging = dragging;
        }
        
        if (dragging)
        {
            // Update drag momentum
            let dx = screenX - this.prevScreenX;
            let dy = screenY - this.prevScreenY;
            this.prevScreenX = screenX;
            this.prevScreenY = screenY;
            this.dragMomentumX *= DRAG_MOMENTUM_DAMPING_FACTOR;
            this.dragMomentumY *= DRAG_MOMENTUM_DAMPING_FACTOR;
            this.dragMomentumX += dx * dt * DRAG_MOMENTUM_FACTOR;
            this.dragMomentumY += dy * dt * DRAG_MOMENTUM_FACTOR;
            
            // Update camera movement
            let offsetX = screenX - this.dragStartScreenX;
            let offsetY = screenY - this.dragStartScreenY;
            camera.moveTo(this.dragStartX - offsetX, this.dragStartY - offsetY);
        }
        else if (Math.abs(this.dragMomentumY) > 0 || Math.abs(this.dragMomentumY) > 0)
        {
            this.dragMomentumX *= DRAG_MOMENTUM_INV_FRICTION;
            this.dragMomentumY *= DRAG_MOMENTUM_INV_FRICTION;
            camera.moveTo(camera.x - this.dragMomentumX, camera.y - this.dragMomentumY, 0, dt);
        }
    }
}
