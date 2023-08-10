export type SceneNode = number;

export type SceneGraph = {
  roots: Array<SceneNode>;
  parents: Record<string, SceneNode>;
  children: Record<string, Array<SceneNode>>;
};

declare function WalkCallback(
  node: SceneNode,
  graph: SceneGraph,
): WalkBackCallback | boolean | void;
declare function WalkBackCallback(node: SceneNode, graph: SceneGraph): void;
declare function WalkChildrenCallback(
  children: Array<SceneNode>,
  parent: SceneNode,
  graph: SceneGraph,
): Array<SceneNode>;

export module SceneGraph {
  export function create(): SceneGraph;
  export function clone(a: SceneGraph): SceneGraph;
  export function add(out: SceneGraph, node: SceneNode, parentNode?: SceneNode);
  export function has(graph: SceneGraph, node: SceneNode);
  export function parent(
    out: SceneGraph,
    childNode: SceneNode,
    parentNode: SceneNode,
  );
  export function prune(out: SceneGraph, targetNode: SceneNode);
  export function replace(
    out: SceneGraph,
    targetNode: SceneNode,
    replacementNode: SceneNode,
  );
  export function walk(
    graph: SceneGraph,
    callback: WalkCallback,
    opts?: {
      from?: SceneNode | Array<SceneNode>;
      childFilter?: WalkChildrenCallback;
    },
  );
  export function getRoots(graph: SceneGraph): Array<SceneNode>;
  export function getParent(graph: SceneGraph, node: SceneNode): SceneNode;
  export function getChildren(
    graph: SceneGraph,
    node: SceneNode,
  ): Array<SceneNode>;
}
