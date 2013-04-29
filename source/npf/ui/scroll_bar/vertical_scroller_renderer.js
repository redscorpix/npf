goog.provide('npf.ui.scrollBar.VerticalScrollerRenderer');

goog.require('goog.style');
goog.require('npf.ui.scrollBar.ScrollerRenderer');


/**
 * @constructor
 * @extends {npf.ui.scrollBar.ScrollerRenderer}
 */
npf.ui.scrollBar.VerticalScrollerRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollBar.VerticalScrollerRenderer,
  npf.ui.scrollBar.ScrollerRenderer);
goog.addSingletonGetter(npf.ui.scrollBar.VerticalScrollerRenderer);


/** @inheritDoc */
npf.ui.scrollBar.VerticalScrollerRenderer.prototype.setPosition = function(
    element, position) {
  if (element) {
    goog.style.setStyle(element, 'top', position + 'px');
  }
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScrollerRenderer.prototype.setSize = function(
    element, size) {
  if (element) {
    goog.style.setStyle(element, 'height', size + 'px');
  }
};
