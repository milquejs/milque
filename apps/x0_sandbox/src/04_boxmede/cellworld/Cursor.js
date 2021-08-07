export const CURSOR_STATUS = {
    NONE: 0,
    ACTIVATING: 1,
    DEACTIVATING: 2,
};

export class Cursor
{
    constructor()
    {
        this.screenX = 0;
        this.screenY = 0;
        this.cellX = 0;
        this.cellY = 0;
        this.dragCellX = 0;
        this.dragCellY = 0;
        this.status = CURSOR_STATUS.NONE;
    }
}
