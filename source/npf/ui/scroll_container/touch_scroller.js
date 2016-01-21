goog.provide('npf.ui.scrollContainer.TouchScroller');

goog.require('goog.math.Coordinate');
goog.require('npf.ui.scrollContainer.TouchHandler');
goog.require('npf.ui.scrollContainer.TouchHandler.EventType');
goog.require('npf.ui.scrollContainer.Scroller');
goog.require('npf.ui.scrollContainer.Scroller.Event');
goog.require('npf.ui.scrollContainer.Scroller.Type');


/**
 * @param {!npf.ui.ScrollContainer} container
 * @constructor
 * @extends {npf.ui.scrollContainer.Scroller}
 */
npf.ui.scrollContainer.TouchScroller = function(container) {
  npf.ui.scrollContainer.TouchScroller.base(this, 'constructor',
    npf.ui.scrollContainer.Scroller.Type.TOUCH, container);

  /**
   * @private {npf.ui.scrollContainer.TouchHandler}
   */
  this._scrollHandler = new npf.ui.scrollContainer.TouchHandler(
    /** @type {!Element} */ (container.getElement()),
    /** @type {!Element} */ (container.getContentElement()));
  this._scrollHandler.scrollX = true;
  this._scrollHandler.setEnabled(true);

  this.handler.
    listen(this._scrollHandler,
      npf.ui.scrollContainer.TouchHandler.EventType.SCROLL, this._onScroll);
};
goog.inherits(
  npf.ui.scrollContainer.TouchScroller, npf.ui.scrollContainer.Scroller);


/** @inheritDoc */
npf.ui.scrollContainer.TouchScroller.prototype.update = function() {
  /** @type {!goog.math.Size} */
  var size = this.container.getSize();
  /** @type {!goog.math.Size} */
  var contentSize = this.container.getContentSize();
  this._scrollHandler.setSizes(size, contentSize);

  /** @type {!goog.math.Coordinate} */
  var position = this.container.getScrollPosition();
  /** @type {!goog.math.Coordinate} */
  var touchPosition = this._getTouchScrollPosition(position);
  this._scrollHandler.forceScrollTo(touchPosition.x, touchPosition.y);

  npf.ui.scrollContainer.TouchScroller.base(this, 'update');
};

/** @inheritDoc */
npf.ui.scrollContainer.TouchScroller.prototype.setScrollPosition = function(
    position) {
  /** @type {!goog.math.Coordinate} */
  var touchPosition = this._getTouchScrollPosition(position);
  this._scrollHandler.scrollTo(touchPosition.x, touchPosition.y);
};

/**
 * @param {!goog.math.Coordinate} position
 * @return {!goog.math.Coordinate}
 * @private
 */
npf.ui.scrollContainer.TouchScroller.prototype._getTouchScrollPosition = function(
    position) {
  /** @type {!goog.math.Size} */
  var scrollSize = this.container.getScrollSize();
  /** @type {number} */
  var left = this.container.isLeftStartCorner() ?
    position.x : scrollSize.width - position.x;
  /** @type {number} */
  var top = this.container.isTopStartCorner() ?
    position.y : scrollSize.height - position.y;

  return new goog.math.Coordinate(-left, -top);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.scrollContainer.TouchScroller.prototype._onScroll = function(evt) {
  /** @type {!goog.math.Coordinate} */
  var position = this._scrollHandler.getPosition();
  /** @type {!goog.math.Size} */
  var scrollSize = this.container.getScrollSize();
  /** @type {number} */
  var left = this.container.isLeftStartCorner() ?
    -position.x : scrollSize.width + position.x;
  var top = this.container.isTopStartCorner() ?
    -position.y : scrollSize.height + position.y;
  var event = new npf.ui.scrollContainer.Scroller.Event(left, top);
  this.dispatchEvent(event);
};
