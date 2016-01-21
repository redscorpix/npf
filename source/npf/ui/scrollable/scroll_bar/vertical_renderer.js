goog.provide('npf.ui.scrollable.scrollBar.VerticalRenderer');

goog.require('npf.ui.scrollable.scrollBar.Renderer');


/**
 * @constructor
 * @extends {npf.ui.scrollable.scrollBar.Renderer}
 */
npf.ui.scrollable.scrollBar.VerticalRenderer = function() {
  npf.ui.scrollable.scrollBar.VerticalRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.scrollable.scrollBar.VerticalRenderer,
  npf.ui.scrollable.scrollBar.Renderer);
goog.addSingletonGetter(npf.ui.scrollable.scrollBar.VerticalRenderer);


/** @inheritDoc */
npf.ui.scrollable.scrollBar.VerticalRenderer.prototype.setPosition = function(
    element, position) {
  if (element) {
    element.style.top = position + 'px';
  }
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.VerticalRenderer.prototype.setSize = function(
    element, size) {
  if (element) {
    element.style.height = size + 'px';
  }
};
