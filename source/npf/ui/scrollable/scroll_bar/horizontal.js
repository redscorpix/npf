goog.provide('npf.ui.scrollable.scrollBar.Horizontal');

goog.require('goog.math.Rect');
goog.require('npf.ui.scrollable.ScrollBar');
goog.require('npf.ui.scrollable.scrollBar.HorizontalRenderer');


/**
 * @param {npf.ui.scrollable.scrollBar.HorizontalRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.scrollable.ScrollBar}
 */
npf.ui.scrollable.scrollBar.Horizontal = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollable.scrollBar.HorizontalRenderer.getInstance(), opt_domHelper);

  this.addClassName(npf.ui.scrollable.scrollBar.Horizontal.CSS_CLASS);
};
goog.inherits(
  npf.ui.scrollable.scrollBar.Horizontal, npf.ui.scrollable.ScrollBar);


/**
 * @type {string}
 */
npf.ui.scrollable.scrollBar.Horizontal.CSS_CLASS =
  goog.getCssName('npf-scrollable-scrollBar-horizontal');


/** @inheritDoc */
npf.ui.scrollable.scrollBar.Horizontal.prototype.setContainer = function(
    container) {
  /** @type {npf.ui.scrollable.Container} */
  var oldContainer = this.getContainer();

  if (oldContainer !== container) {
    this.setContainerInternal(null);

    if (oldContainer) {
      this.setListenedContainer(oldContainer, false);
      oldContainer.setHorizontalScrollBar(null);
    }

    if (container) {
      this.setContainerInternal(container);
      this.setListenedContainer(container, true);
      container.setHorizontalScrollBar(this);
    }

    this.update();
  }
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.Horizontal.prototype.getValueFromCoordinate =
    function(coordinate) {
  return coordinate ? coordinate.x : 0;
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.Horizontal.prototype.getValueFromSize = function(
    size) {
  return size ? size.width : 0;
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.Horizontal.prototype.getLimits = function() {
  return new goog.math.Rect(0, 0, this.getMaxRunnerPosition(), 0);
};
