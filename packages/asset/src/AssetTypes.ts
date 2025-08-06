import { AssetStoreLike } from './local/LocalAssetStore';

export type AssetLoader<T, Options extends object> = (uri: string, opts: Options, assets: AssetStoreLike) => Promise<T>;
export type AssetLike<T, Options extends object> = {
  uri: string,
  loader: AssetLoader<T, Options>,
  opts?: Options,
};
