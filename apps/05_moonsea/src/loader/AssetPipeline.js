import { AssetPack } from '@milque/asset';

export class AssetPipeline {
  /** @param {AssetPack} assetPack */
  constructor(assetPack) {
    /** @private */
    this._assetPack = assetPack;
    /**
     * @private
     * @type {Record<string, PipelineStage>}
     */
    this._pipeline = {};

    /** @private */
    this.onAssetCache = this.onAssetCache.bind(this);

    assetPack.addEventListener('cache', this.onAssetCache);
  }

  /**
   * @param {string|RegExp} filter
   * @param {(assetData, uri) => Promise<any>} handler
   */
  async pipe(filter, handler) {
    let matcher = AssetPack.createFileMatcher(filter);
    let filterKey = matcher.key;

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
    for (let uri of this._assetPack.getAssetURIs()) {
      let value = this._assetPack.getAsset(uri);
      if (stage.matches(uri)) {
        await handler(value, uri);
      }
    }
  }

  /** @private */
  async onAssetCache(e) {
    let uri = e.detail.uri;
    let asset = e.detail.value;
    // Process the asset...
    await Promise.all(
      Object.values(this._pipeline).map((stage) => {
        if (stage.matches(uri)) {
          return stage.process(uri, asset);
        } else {
          return null;
        }
      })
    );
  }
}

class PipelineStage {
  constructor(filter) {
    this.filter = filter;
    this.handlers = [];
  }

  matches(string) {
    return this.filter(string);
  }

  async process(uri, asset) {
    return Promise.all(this.handlers.map((value) => value(uri, asset)));
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }
}
