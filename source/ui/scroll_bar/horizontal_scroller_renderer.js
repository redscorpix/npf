goog.provide('npf.ui.scrollBar.HorizontalScrollerRenderer');

goog.require('goog.style');
goog.require('npf.ui.scrollBar.ScrollerRenderer');


/**
 * @constructor
 * @extends {npf.ui.scrollBar.ScrollerRenderer}
 */
npf.ui.scrollBar.HorizontalScrollerRenderer = function() {
  goog.base(this);
};
goog.inherits(npf.ui.scrollBar.HorizontalScrollerRenderer,
  npf.ui.scrollBar.ScrollerRenderer);
goog.addSingletonGetter(npf.ui.scrollBar.HorizontalScrollerRenderer);


/** @inheritDoc */
npf.ui.scrollBar.HorizontalScrollerRenderer.prototype.setPosition = function(
    element, position) {
  if (element) {
    goog.style.setStyle(element, 'left', position + 'px');
  }
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScrollerRenderer.prototype.setSize = function(
    element, size) {
  if (element) {
    goog.style.setStyle(element, 'width', size + 'px');
  }
};
