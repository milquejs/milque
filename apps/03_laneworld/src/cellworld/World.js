export class World
{
    constructor(mapWidth = 8, mapHeight = 6)
    {
        const mapLength = mapWidth * mapHeight;
        this.width = mapWidth;
        this.height = mapHeight;
        this.length = mapLength;

        this.offsetX = 0;
        this.offsetY = 0;

        this.cells = new Uint8Array(mapLength);
        this.metas = new Array(mapLength);

        this.lanes = {};
        this.cellLanes = new Array(mapLength);
        
        this.carts = {};
        this.factories = {};
        this.ports = {};
    }

    isWithinBounds(cellX, cellY)
    {
        return cellX >= 0 && cellY >= 0 && cellX < this.width && cellY < this.height;
    }

    setCell(cellX, cellY, cellId, cellMetadata = {})
    {
        let i = cellX + cellY * this.width;
        this.cells[i] = cellId;
        this.metas[i] = cellMetadata;
    }

    getCellId(cellX, cellY)
    {
        let i = cellX + cellY * this.width;
        return this.cells[i];
    }

    getCellMetadata(cellX, cellY)
    {
        let i = cellX + cellY * this.width;
        return this.metas[i];
    }
}
