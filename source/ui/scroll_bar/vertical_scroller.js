goog.provide('npf.ui.scrollBar.VerticalScroller');

goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('npf.ui.scrollBar.Scroller');


/**
 * @param {npf.ui.scrollBar.ScrollerRenderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.scrollBar.Scroller}
 */
npf.ui.scrollBar.VerticalScroller = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer, opt_domHelper);

  this.addClassName(npf.ui.scrollBar.VerticalScroller.CSS_CLASS);
};
goog.inherits(npf.ui.scrollBar.VerticalScroller, npf.ui.scrollBar.Scroller);


/**
 * @type {string}
 */
npf.ui.scrollBar.VerticalScroller.CSS_CLASS =
  goog.getCssName('scrollBar-verticalScroller');


/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.getDimenstionCoordinate = function(coordinate) {
  return coordinate.y;
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.setRunnerElementPosition = function(position) {
  goog.style.setStyle(this.getRunnerElement(), 'top', position + 'px');
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.setRunnerElementSize = function(size) {
  goog.style.setStyle(this.getRunnerElement(), 'height', size + 'px');
};

/** @inheritDoc */
npf.ui.scrollBar.VerticalScroller.prototype.getLimits = function(maxPosition) {
  return new goog.math.Rect(0, 0, 0, maxPosition);
};
