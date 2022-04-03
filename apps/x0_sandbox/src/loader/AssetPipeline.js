import { AssetManager, GlobExp } from '@milque/asset';

export class AssetPipeline {
  constructor() {
    /**
     * @private
     * @type {Record<string, PipelineStage>}
     */
    this._pipeline = {};
  }

  /**
   * @param {string|GlobExp} filter
   * @param {(assetData, uri) => Promise<any>} handler
   */
  async pipe(filter, handler) {
    let matcher = new GlobExp(filter);
    let filterKey = matcher.source;

    /** @type {PipelineStage} */
    let stage;
    if (filterKey in this._pipeline) {
      stage = this._pipeline[filterKey];
    } else {
      stage = new PipelineStage(matcher);
      this._pipeline[filterKey] = stage;
    }
    stage.addHandler(handler);

    // Process old assets with new handler...
    for (let uri of AssetManager.keys()) {
      if (stage.matches(uri)) {
        await handler(AssetManager.getCurrent(uri), uri);
      }
    }
  }
}

class PipelineStage {
  /**
   * @param {GlobExp} filter
   */
  constructor(filter) {
    this.filter = filter;
    this.handlers = [];
  }

  matches(string) {
    return this.filter.test(string);
  }

  async process(uri, asset) {
    return Promise.all(this.handlers.map((value) => value(uri, asset)));
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }
}
