/**
 * @typedef {(ctx: CanvasRenderingContext2D) => void} DrawCallback
 */

export class DrawLayerManager {

    constructor() {
        /** @type {Array<{ index: number, callback: DrawCallback }>} */
        this.drawList = [];
    }

    /**
     * @param {number} layerIndex 
     * @param {DrawCallback} callback 
     */
    addLayer(layerIndex, callback) {
        this.drawList.push({
            index: layerIndex,
            callback: callback,
        });
        this.drawList.sort((a, b) => {
            return a.index - b.index;
        });
    }

    /**
     * @param {number} layerIndex 
     * @param {DrawCallback} callback
     */
    removeLayer(layerIndex, callback) {
        let i = this.drawList.findIndex(v => v.index === layerIndex && v.callback === callback);
        if (i < 0) {
            return;
        }
        this.drawList.splice(i, 1);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawLayers(ctx) {
        for(let { callback } of this.drawList) {
            callback(ctx);
        }
    }
}

/**
 * @param {SystemContext} m 
 * @param {number} layerIndex 
 * @param {DrawCallback} drawCallback 
 */
export function useOnDraw(m, layerIndex, drawCallback) {
    const drawLayerManager = m.draws;
    m.use(() => {
        drawLayerManager.addLayer(layerIndex, drawCallback);
        return () => {
            drawLayerManager.removeLayer(layerIndex, drawCallback);
        };
    });
}
