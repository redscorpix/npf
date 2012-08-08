goog.provide('npf.ui.scrollBar.HorizontalScroller');

goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('npf.ui.scrollBar.Scroller');


/**
 * @param {npf.ui.scrollBar.ScrollerRenderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.scrollBar.Scroller}
 */
npf.ui.scrollBar.HorizontalScroller = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer, opt_domHelper);

  this.addClassName(npf.ui.scrollBar.HorizontalScroller.CSS_CLASS);
};
goog.inherits(npf.ui.scrollBar.HorizontalScroller, npf.ui.scrollBar.Scroller);


/**
 * @type {string}
 */
npf.ui.scrollBar.HorizontalScroller.CSS_CLASS =
  goog.getCssName('scrollBar-horizontalScroller');


/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.getDimenstionCoordinate = function(coordinate) {
  return coordinate.x;
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.setRunnerElementPosition = function(position) {
  goog.style.setStyle(this.getRunnerElement(), 'left', position + 'px');
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.setRunnerElementSize = function(size) {
  goog.style.setStyle(this.getRunnerElement(), 'width', size + 'px');
};

/** @inheritDoc */
npf.ui.scrollBar.HorizontalScroller.prototype.getLimits = function(maxPosition) {
  return new goog.math.Rect(0, 0, maxPosition, 0);
};
