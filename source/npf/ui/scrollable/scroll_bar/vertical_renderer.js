goog.provide('npf.ui.scrollable.scrollBar.VerticalRenderer');

goog.require('goog.style');
goog.require('npf.ui.scrollable.scrollBar.Renderer');


/**
 * @constructor
 * @extends {npf.ui.scrollable.scrollBar.Renderer}
 */
npf.ui.scrollable.scrollBar.VerticalRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollable.scrollBar.VerticalRenderer,
  npf.ui.scrollable.scrollBar.Renderer);
goog.addSingletonGetter(npf.ui.scrollable.scrollBar.VerticalRenderer);


/** @inheritDoc */
npf.ui.scrollable.scrollBar.VerticalRenderer.prototype.setPosition = function(
    element, position) {
  if (element) {
    goog.style.setStyle(element, 'top', position + 'px');
  }
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.VerticalRenderer.prototype.setSize = function(
    element, size) {
  if (element) {
    goog.style.setStyle(element, 'height', size + 'px');
  }
};
