goog.provide('npf.ui.scrollable.scrollBar.HorizontalRenderer');

goog.require('goog.style');
goog.require('npf.ui.scrollable.scrollBar.Renderer');


/**
 * @constructor
 * @extends {npf.ui.scrollable.scrollBar.Renderer}
 */
npf.ui.scrollable.scrollBar.HorizontalRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollable.scrollBar.HorizontalRenderer,
  npf.ui.scrollable.scrollBar.Renderer);
goog.addSingletonGetter(npf.ui.scrollable.scrollBar.HorizontalRenderer);


/** @inheritDoc */
npf.ui.scrollable.scrollBar.HorizontalRenderer.prototype.setPosition = function(
    element, position) {
  if (element) {
    goog.style.setStyle(element, 'left', position + 'px');
  }
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.HorizontalRenderer.prototype.setSize = function(
    element, size) {
  if (element) {
    goog.style.setStyle(element, 'width', size + 'px');
  }
};
