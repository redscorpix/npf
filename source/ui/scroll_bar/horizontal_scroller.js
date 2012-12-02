goog.provide('npf.ui.scrollBar.HorizontalScroller');

goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('npf.ui.scrollBar.Scroller');
goog.require('npf.ui.scrollBar.HorizontalScrollerRenderer');


/**
 * @param {npf.ui.scrollBar.HorizontalScrollerRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.scrollBar.Scroller}
 */
npf.ui.scrollBar.HorizontalScroller = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollBar.HorizontalScrollerRenderer.getInstance(), opt_domHelper);

  this.addClassName(npf.ui.scrollBar.HorizontalScroller.CSS_CLASS);
};
goog.inherits(npf.ui.scrollBar.HorizontalScroller, npf.ui.scrollBar.Scroller);


/**
 * @type {string}
 */
npf.ui.scrollBar.HorizontalScroller.CSS_CLASS =
  goog.getCssName('scrollBar-horizontalScroller');


/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.getDimensionCoordinate = function(
    coordinate) {
  return coordinate.x;
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.getLimits = function() {
  return new goog.math.Rect(0, 0, this.getMaxRunnerPosition(), 0);
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.getScrollBarSize = function() {
  /** @type {npf.ui.scrollBar.Scroller.ScrollBarSizes?} */
  var scrollBarSizes = this.getScrollBarSizes();

  return scrollBarSizes ? scrollBarSizes.size.width : 0;
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.getScrollBarContentSize = function() {
  /** @type {npf.ui.scrollBar.Scroller.ScrollBarSizes?} */
  var scrollBarSizes = this.getScrollBarSizes();

  return scrollBarSizes ? scrollBarSizes.contentSize.width : 0;
};
