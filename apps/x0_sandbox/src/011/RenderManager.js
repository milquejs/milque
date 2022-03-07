class RenderManager {
  constructor(outputDisplay) {
    this.outputDisplay = outputDisplay;
    this._renderTargets = new Map();
  }

  addRenderTarget(
    view,
    renderer = null,
    viewPort = null,
    context = null,
    handle = view
  ) {
    this._renderTargets.set(handle, { view, renderer, viewPort, context });
    return this;
  }

  removeRenderTarget(handle) {
    this._renderTargets.delete(handle);
    return this;
  }

  clearRenderTargets() {
    this._renderTargets.clear();
    return this;
  }

  render() {
    let first = true;
    for (let renderTarget of this._renderTargets.values()) {
      let view = renderTarget.view;
      let renderer =
        renderTarget.renderer || (this.scene ? this.scene.onRender : null);
      let viewPort = renderTarget.viewPort;
      let renderContext =
        renderTarget.context || this._transition || this.world;
      this._renderStep(view, renderer, viewPort, renderContext, first);
      first = false;
    }
  }

  _renderStep(
    view,
    renderer = null,
    viewPort = null,
    renderContext = null,
    first = true
  ) {
    // Reset any transformations...
    view.context.setTransform(1, 0, 0, 1, 0, 0);

    // TODO: Something more elegant please? I don't think we need the flag.
    if (first) {
      Utils.clearScreen(view.context, view.width, view.height);
    } else {
      view.context.clearRect(0, 0, view.width, view.height);
    }

    if (renderer) renderer.call(renderContext, view.context, view, this.world);

    // NOTE: The renderer can define a custom viewport to draw to
    if (viewPort) {
      View.drawBufferToCanvas(
        viewPort.getContext(),
        view.canvas,
        viewPort.getX(),
        viewPort.getY(),
        viewPort.getWidth(),
        viewPort.getHeight()
      );
    }
    // TODO: Is there a way to get rid of this?
    else if (Display.getDrawContext()) {
      View.drawBufferToCanvas(Display.getDrawContext(), view.canvas);
    }
  }
}
