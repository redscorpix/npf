goog.provide('npf.ui.scrollable.scrollBar.Vertical');

goog.require('goog.math.Rect');
goog.require('npf.ui.scrollable.ScrollBar');
goog.require('npf.ui.scrollable.scrollBar.VerticalRenderer');


/**
 * @param {npf.ui.scrollable.scrollBar.VerticalRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.scrollable.ScrollBar}
 */
npf.ui.scrollable.scrollBar.Vertical = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollable.scrollBar.VerticalRenderer.getInstance(), opt_domHelper);

  this.addClassName(npf.ui.scrollable.scrollBar.Vertical.CSS_CLASS);
};
goog.inherits(
  npf.ui.scrollable.scrollBar.Vertical, npf.ui.scrollable.ScrollBar);


/**
 * @type {string}
 */
npf.ui.scrollable.scrollBar.Vertical.CSS_CLASS =
  goog.getCssName('npf-scrollable-scrollBar-vertical');


/** @inheritDoc */
npf.ui.scrollable.scrollBar.Vertical.prototype.setContainer = function(
    container) {
  /** @type {npf.ui.scrollable.Container} */
  var oldContainer = this.getContainer();

  if (oldContainer !== container) {
    this.setContainerInternal(null);

    if (oldContainer) {
      this.setListenedContainer(oldContainer, false);
      oldContainer.setVerticalScrollBar(null);
    }

    if (container) {
      this.setContainerInternal(container);
      this.setListenedContainer(container, true);
      container.setVerticalScrollBar(this);
    }

    this.update();
  }
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.Vertical.prototype.getValueFromCoordinate =
    function(coordinate) {
  return coordinate ? coordinate.y : 0;
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.Vertical.prototype.getValueFromSize = function(
    size) {
  return size ? size.height : 0;
};

/** @inheritDoc */
npf.ui.scrollable.scrollBar.Vertical.prototype.getLimits = function() {
  return new goog.math.Rect(0, 0, 0, this.getMaxRunnerPosition());
};
