goog.provide('npf.ui.scrollable.scrollBar.HorizontalRenderer');

goog.require('npf.ui.scrollable.scrollBar.Renderer');


/**
 * @constructor
 * @extends {npf.ui.scrollable.scrollBar.Renderer}
 */
npf.ui.scrollable.scrollBar.HorizontalRenderer = function() {
  npf.ui.scrollable.scrollBar.HorizontalRenderer.base(this, 'constructor');
};
goog.inherits(npf.ui.scrollable.scrollBar.HorizontalRenderer,
  npf.ui.scrollable.scrollBar.Renderer);
goog.addSingletonGetter(npf.ui.scrollable.scrollBar.HorizontalRenderer);


/** @inheritDoc */
npf.ui.scrollable.scrollBar.HorizontalRenderer.prototype.setPosition = function(
    element, position) {
  if (element) {
    element.style.left = position + 'px';
  }
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.HorizontalRenderer.prototype.setSize = function(
    element, size) {
  if (element) {
    element.style.width = size + 'px';
  }
};
