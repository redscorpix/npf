goog.provide('npf.ui.scrollBar.Scroller');
goog.provide('npf.ui.scrollBar.Scroller.EventType');

goog.require('goog.events');
goog.require('goog.fx.Dragger');
goog.require('goog.math');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.scrollBar.ScrollerRenderer');


/**
 * @param {npf.ui.scrollBar.ScrollerRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.scrollBar.Scroller = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollBar.ScrollerRenderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.scrollBar.Scroller, npf.ui.RenderComponent);


/**
 * @typedef {{
 *  size: goog.math.Size,
 *  contentSize: goog.math.Size
 * }}
 */
npf.ui.scrollBar.Scroller.ScrollBarSizes;

/**
 * @enum {string}
 */
npf.ui.scrollBar.Scroller.EventType = {

  /**
   * position (number)
   */
  SCROLL: goog.events.getUniqueId('scroll')
};

/**
 * @type {number}
 * @const
 */
npf.ui.scrollBar.Scroller.MIN_SIZE = 20;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.minSize_ =
  npf.ui.scrollBar.Scroller.MIN_SIZE;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.draggable_ = true;

/**
 * @type {goog.fx.Dragger}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.dragger_ = null;

/**
 * @type {number}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.position_ = 0;

/**
 * @type {npf.ui.scrollBar.Scroller.ScrollBarSizes?}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.scrollBarSizes_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.visible_ = true;


/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.updateSize();
  this.setDraggableInternal(this.draggable_);
};

/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.dragger_) {
    this.getHandler()
      .listen(this.dragger_, goog.fx.Dragger.EventType.START, this.onDragStart_)
      .listen(this.dragger_, goog.fx.Dragger.EventType.DRAG, this.onDrag_)
      .listen(this.dragger_, goog.fx.Dragger.EventType.END, this.onDragEnd_);
  }
};

/** @inheritDoc */
npf.ui.scrollBar.Scroller.prototype.disposeInternal = function() {
  goog.dispose(this.dragger_);

  goog.base(this, 'disposeInternal');

  this.dragger_ = null;
  this.scrollBarSizes_ = null;
};

/**
 * @return {npf.ui.scrollBar.Scroller.ScrollBarSizes?}
 */
npf.ui.scrollBar.Scroller.prototype.getScrollBarSizes = function() {
  return this.scrollBarSizes_;
};

/**
 * @param {npf.ui.scrollBar.Scroller.ScrollBarSizes} sizes
 */
npf.ui.scrollBar.Scroller.prototype.setScrollBarSizes = function(sizes) {
  if (!(
    this.scrollBarSizes_ &&
    goog.math.Size.equals(this.scrollBarSizes_.size, sizes.size) &&
    goog.math.Size.equals(this.scrollBarSizes_.contentSize, sizes.contentSize)
  )) {
    this.scrollBarSizes_ = sizes;

    this.updateSize();
    this.setPositionInternal(this.position_);

    if (this.dragger_) {
      this.dragger_.setLimits(this.getLimits());
    }
  }
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getPosition = function() {
  return this.position_;
};

/**
 * @param {number} position
 */
npf.ui.scrollBar.Scroller.prototype.setPosition = function(position) {
  /** @type {number} */
  var scrollBarSize = this.getScrollBarSize();
  /** @type {number} */
  var scrollBarContentSize = this.getScrollBarContentSize();
  /** @type {number} */
  var maxScroll = Math.max(0, scrollBarContentSize - scrollBarSize);

  position = goog.math.clamp(position, 0, maxScroll);

  if (this.position_ != position) {
    this.position_ = position;
    this.setPositionInternal(this.position_);
  }
};

/**
 * @param {number} position
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setPositionInternal = function(position) {
  /** @type {number} */
  var runnerPosition = this.getRunnerPositionInternal(position);
  this.getRenderer().setPosition(this.getRunnerElement(), runnerPosition);
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getSize = function() {
  return this.getScrollBarSize();
};

/**
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.updateSize = function() {
  this.getRenderer().setSize(this.getElement(), this.getSize());
  this.getRenderer().setSize(this.getRunnerElement(), this.getRunnerSize());
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getMinSize = function() {
  return this.minSize_;
};

/**
 * @param {number} size
 */
npf.ui.scrollBar.Scroller.prototype.setMinSize = function(size) {
  this.minSize_ = Math.max(0, size);
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getRunnerPosition = function() {
  return this.getRunnerPositionInternal(this.position_);
};

/**
 * @return {number}
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.getRunnerPositionInternal = function(
    position) {
  /** @type {number} */
  var scrollBarSize = this.getScrollBarSize();
  /** @type {number} */
  var scrollBarContentSize = this.getScrollBarContentSize();
  /** @type {number} */
  var maxScroll = Math.max(0, scrollBarContentSize - scrollBarSize);
  /** @type {number} */
  var maxRunnerScroll = this.getMaxRunnerPosition();

  return maxRunnerScroll ?
    Math.round(position / maxScroll * maxRunnerScroll) : 0;
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getMaxRunnerPosition = function() {
  /** @type {number} */
  var size = this.getSize();
  /** @type {number} */
  var runnerSize = this.getRunnerSize();

  return Math.max(0, size - runnerSize);
};

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getRunnerSize = function() {
  /** @type {number} */
  var size = this.getSize();
  /** @type {number} */
  var scrollBarSize = this.getScrollBarSize();
  /** @type {number} */
  var scrollBarContentSize = this.getScrollBarContentSize();
  /** @type {number} */
  var runnerSize = Math.round(scrollBarSize / scrollBarContentSize * size);

  return Math.max(this.minSize_, runnerSize);
};

/**
 * @return {boolean}
 */
npf.ui.scrollBar.Scroller.prototype.isVisible = function() {
  return this.visible_;
};

/**
 * @param {boolean} visible
 */
npf.ui.scrollBar.Scroller.prototype.setVisible = function(visible) {
  if (this.visible_ != visible) {
    this.visible_ = visible;
    this.setVisibleInternal(this.visible_);
  }
};

/**
 * @param {boolean} visible
 */
npf.ui.scrollBar.Scroller.prototype.setVisibleInternal = function(visible) {
  this.getRenderer().setVisible(this.getElement(), visible);
};

/**
 * @param {boolean} drag
 */
npf.ui.scrollBar.Scroller.prototype.setDraggable = function(drag) {
  if (this.draggable_ != drag) {
    this.draggable_ = drag;
    this.setDraggableInternal(this.draggable_);
  }
};

/**
 * @param {boolean} drag
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.setDraggableInternal = function(drag) {
  if (this.getElement()) {
    var EventType = goog.fx.Dragger.EventType;

    if (drag) {
      this.dragger_ = new goog.fx.Dragger(this.getRunnerElement(),
        this.getElement(), this.getLimits());

      if (this.isInDocument()) {
        this.getHandler()
          .listen(this.dragger_, EventType.START, this.onDragStart_)
          .listen(this.dragger_, EventType.DRAG, this.onDrag_)
          .listen(this.dragger_, EventType.END, this.onDragEnd_);
      }
    } else if (this.dragger_) {
      if (this.isInDocument()) {
        this.getHandler()
          .unlisten(this.dragger_, EventType.START, this.onDragStart_)
          .unlisten(this.dragger_, EventType.DRAG, this.onDrag_)
          .unlisten(this.dragger_, EventType.END, this.onDragEnd_);
      }

      this.dragger_.dispose();
      this.dragger_ = null;
    }
  }
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.onDragStart_ = function(evt) {
  var mouseMove2dPosition = new goog.math.Coordinate(evt.left, evt.top);
  /** @type {number} */
  var position = this.getDimensionCoordinate(mouseMove2dPosition);

  if (this.position_ != position) {
    this.position_ = position;
    this.dispatchEvent({
      type: npf.ui.scrollBar.Scroller.EventType.SCROLL,
      position: this.position_
    });
  }

  goog.style.setUnselectable(document.body, true, true);
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.onDrag_ = function(evt) {
  var mouseMove2dPosition = new goog.math.Coordinate(evt.left, evt.top);
  this.position_ = this.getDimensionCoordinate(mouseMove2dPosition);

  this.dispatchEvent({
    type: npf.ui.scrollBar.Scroller.EventType.SCROLL,
    position: this.position_
  });
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.scrollBar.Scroller.prototype.onDragEnd_ = function(evt) {
  goog.style.setUnselectable(document.body, false, true);
};

/**
 * @return {Element}
 */
npf.ui.scrollBar.Scroller.prototype.getRunnerElement = function() {
  return this.getRenderer().getRunnerElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.scrollBar.Scroller.prototype.getBackgroundElement = function() {
  return this.getRenderer().getBackgroundElement(this.getElement());
};

/**
 * @param {goog.math.Coordinate} coordinate
 * @return {number}
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.getDimensionCoordinate =
  goog.abstractMethod;

/**
 * @return {goog.math.Rect}
 * @protected
 */
npf.ui.scrollBar.Scroller.prototype.getLimits = goog.abstractMethod;

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getScrollBarSize = goog.abstractMethod;

/**
 * @return {number}
 */
npf.ui.scrollBar.Scroller.prototype.getScrollBarContentSize =
  goog.abstractMethod;
