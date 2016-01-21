goog.provide('npf.ui.scrollContainer.NativeScroller');

goog.require('goog.events.EventType');
goog.require('npf.ui.scrollContainer.Scroller');
goog.require('npf.ui.scrollContainer.Scroller.Event');
goog.require('npf.ui.scrollContainer.Scroller.Type');


/**
 * @param {!npf.ui.ScrollContainer} container
 * @constructor
 * @extends {npf.ui.scrollContainer.Scroller}
 */
npf.ui.scrollContainer.NativeScroller = function(container) {
  npf.ui.scrollContainer.NativeScroller.base(this, 'constructor',
    npf.ui.scrollContainer.Scroller.Type.NATIVE, container);

  /**
   * @private {Element}
   */
  this.scrollElement_ = container.getScrollElement();

  /**
   * @private {number}
   */
  this.scrollLeft_ = this.scrollElement_.scrollLeft;

  /**
   * @private {number}
   */
  this.scrollTop_ = this.scrollElement_.scrollTop;

  this.handler.
    listen(this.scrollElement_, goog.events.EventType.SCROLL, this.onScroll_);
};
goog.inherits(
  npf.ui.scrollContainer.NativeScroller, npf.ui.scrollContainer.Scroller);


/** @inheritDoc */
npf.ui.scrollContainer.NativeScroller.prototype.disposeInternal = function() {
  npf.ui.scrollContainer.NativeScroller.base(this, 'disposeInternal');

  this.scrollElement_ = null;
};

/** @inheritDoc */
npf.ui.scrollContainer.NativeScroller.prototype.setScrollPosition = function(
    position) {
  /** @type {Element} */
  var scrollElement = this.container.getScrollElement();

  if (scrollElement) {
    /** @type {!goog.math.Size} */
    var scrollSize = this.container.getScrollSize();
    /** @type {number} */
    var left = this.container.isLeftStartCorner() ?
      position.x : scrollSize.width - position.x;
    /** @type {number} */
    var top = this.container.isTopStartCorner() ?
      position.y : scrollSize.height - position.y;

    if (this.scrollLeft_ != left || this.scrollTop_ != top) {
      scrollElement.scrollLeft = left;
      scrollElement.scrollTop = top;
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollContainer.NativeScroller.prototype.onScroll_ = function(evt) {
  this.scrollLeft_ = this.scrollElement_.scrollLeft;
  this.scrollTop_ = this.scrollElement_.scrollTop;

  /** @type {!goog.math.Size} */
  var scrollSize = this.container.getScrollSize();
  /** @type {number} */
  var left = this.container.isLeftStartCorner() ?
    this.scrollLeft_ : scrollSize.width - this.scrollLeft_;
  var top = this.container.isTopStartCorner() ?
    this.scrollTop_ : scrollSize.height - this.scrollTop_;
  var event = new npf.ui.scrollContainer.Scroller.Event(left, top);
  this.dispatchEvent(event);
};
