goog.provide('npf.ui.scrollBar.VerticalScroller');

goog.require('goog.math.Rect');
goog.require('npf.ui.scrollBar.Scroller');
goog.require('npf.ui.scrollBar.VerticalScrollerRenderer');


/**
 * @param {npf.ui.scrollBar.VerticalScrollerRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.scrollBar.Scroller}
 */
npf.ui.scrollBar.VerticalScroller = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollBar.VerticalScrollerRenderer.getInstance(), opt_domHelper);

  this.addClassName(npf.ui.scrollBar.VerticalScroller.CSS_CLASS);
};
goog.inherits(npf.ui.scrollBar.VerticalScroller, npf.ui.scrollBar.Scroller);


/**
 * @type {string}
 */
npf.ui.scrollBar.VerticalScroller.CSS_CLASS =
  goog.getCssName('scrollBar-verticalScroller');


/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.getDimensionCoordinate = function(
    coordinate) {
  return coordinate.y;
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.getLimits = function() {
  return new goog.math.Rect(0, 0, 0, this.getMaxRunnerPosition());
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.getScrollBarSize = function() {
  /** @type {npf.ui.scrollBar.Scroller.ScrollBarSizes?} */
  var scrollBarSizes = this.getScrollBarSizes();

  return scrollBarSizes ? scrollBarSizes.size.height : 0;
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.getScrollBarContentSize = function() {
  /** @type {npf.ui.scrollBar.Scroller.ScrollBarSizes?} */
  var scrollBarSizes = this.getScrollBarSizes();

  return scrollBarSizes ? scrollBarSizes.contentSize.height : 0;
};
