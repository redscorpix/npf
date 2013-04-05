goog.provide('npf.ui.ScrollBar');
goog.provide('npf.ui.ScrollBar.EventType');
goog.provide('npf.ui.ScrollBarEvent');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('npf.events.ResizeHandler');
goog.require('npf.fx.Animation');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.scrollBar.Animation');
goog.require('npf.ui.scrollBar.HorizontalScroller');
goog.require('npf.ui.scrollBar.Renderer');
goog.require('npf.ui.scrollBar.VerticalScroller');


/**
 * @param {npf.ui.scrollBar.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.ScrollBar = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollBar.Renderer.getInstance(), opt_domHelper);

  this.updateDelay_ = new goog.async.Delay(this.update, 0, this);
  this.registerDisposable(this.updateDelay_);
};
goog.inherits(npf.ui.ScrollBar, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.ScrollBar.EventType = {
  RESIZE: goog.events.getUniqueId('resize'),
  SCROLL: goog.events.getUniqueId('scroll')
};

/**
 * @type {number}
 * @private
 */
npf.ui.ScrollBar.prototype.scrollLeft_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.ScrollBar.prototype.scrollTop_ = 0;

/**
 * @type {goog.async.Delay}
 * @private
 */
npf.ui.ScrollBar.prototype.updateDelay_;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ScrollBar.prototype.autoSize_ = true;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ScrollBar.prototype.contentAutoSize_ = true;

/**
 * @type {number}
 * @private
 */
npf.ui.ScrollBar.prototype.width_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.ScrollBar.prototype.height_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.ScrollBar.prototype.contentWidth_ = 0;

/**
 * @type {number}
 * @private
 */
npf.ui.ScrollBar.prototype.contentHeight_ = 0;

/**
 * @type {npf.ui.scrollBar.VerticalScroller}
 * @private
 */
npf.ui.ScrollBar.prototype.vertScroller_ = null;

/**
 * @type {npf.ui.scrollBar.HorizontalScroller}
 * @private
 */
npf.ui.ScrollBar.prototype.horizScroller_ = null;

/**
 * @type {npf.ui.scrollBar.Animation}
 * @private
 */
npf.ui.ScrollBar.prototype.animation_ = null;


/** @inheritDoc */
npf.ui.ScrollBar.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.setAutoSizeInternal(this.autoSize_);
  this.setContentAutoSizeInternal(this.contentAutoSize_);
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.autoSize_) {
    /** @type {goog.math.Size} */
    var size = this.getSizeInternal();
    this.width_ = size.width;
    this.height_ = size.height;
  }

  if (this.contentAutoSize_) {
    /** @type {goog.math.Size} */
    var contentSize = this.getContentSizeInternal();
    this.contentWidth_ = contentSize.width;
    this.contentHeight_ = contentSize.height;
  }

  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();
  this.setScrollPositionInternal(scrollPosition.x, scrollPosition.y);

  this.updateScrollers_();
  this.updateScrollerPositions_();

  var sizeHandler = new npf.events.ResizeHandler();
  this.disposeOnExitDocument(sizeHandler);

  var ResizeEventType = npf.events.ResizeHandler.EventType;
  /** @type {string} */
  var scrollEventType = npf.ui.scrollBar.Scroller.EventType.SCROLL;
  /** @type {Element} */
  var scrollElement = this.getScrollElement();

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  handler
    .listen(scrollElement, goog.events.EventType.SCROLL, this.onScroll_)
    .listen(sizeHandler, ResizeEventType.RESIZE, this.onUpdateDelay_);

  if (this.vertScroller_) {
    handler.listen(this.vertScroller_, scrollEventType, this.onVertScroll_);
  }

  if (this.horizScroller_) {
    handler.listen(this.horizScroller_, scrollEventType, this.onHorizScroll_);
  }
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.exitDocument = function() {
  if (this.animation_) {
    this.animation_.stop(false);
  }

  this.updateDelay_.stop();

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.updateDelay_ = null;
  this.vertScroller_ = null;
  this.horizScroller_ = null;
  this.animation_ = null;
};

npf.ui.ScrollBar.prototype.update = function() {
  if (this.isInDocument()) {
    this.checkSize_();
    this.checkScroll_();
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.checkSize_ = function() {
  /** @type {boolean} */
  var sizeChanged = false;
  /** @type {boolean} */
  var contentSizeChanged = false;

  if (this.autoSize_) {
    /** @type {goog.math.Size} */
    var size = this.getSizeInternal();

    if (!(this.width_ == size.width && this.height_ == size.height)) {
      this.width_ = size.width;
      this.height_ = size.height;
      sizeChanged = true;
    }
  }

  if (this.contentAutoSize_) {
    /** @type {goog.math.Size} */
    var contentSize = this.getContentSizeInternal();

    if (!(
      this.contentWidth_ == contentSize.width &&
      this.contentHeight_ == contentSize.height
    )) {
      this.contentWidth_ = contentSize.width;
      this.contentHeight_ = contentSize.height;
      contentSizeChanged = true;
    }
  }

  if (sizeChanged || contentSizeChanged) {
    this.onResize();
    this.dispatchEvent_(npf.ui.ScrollBar.EventType.RESIZE);
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.checkScroll_ = function() {
  /** @type {!goog.math.Coordinate} */
  var scroll = this.getScrollPositionInternal();

  if (!(scroll.x == this.scrollLeft_ && scroll.y == this.scrollTop_)) {
    this.scrollLeft_ = scroll.x;
    this.scrollTop_ = scroll.y;
    this.onScroll();
    this.dispatchEvent_(npf.ui.ScrollBar.EventType.SCROLL);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onScroll_ = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  this.checkScroll_();
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onUpdateDelay_ = function(evt) {
  this.updateDelay_.start();
};

/**
 * @return {Element}
 */
npf.ui.ScrollBar.prototype.getScrollElement = function() {
  return this.getRenderer().getScrollElement(this.getElement());
};

/**
 * @protected
 */
npf.ui.ScrollBar.prototype.onScroll = function() {
  this.updateScrollerPositions_();
};

/**
 * @protected
 */
npf.ui.ScrollBar.prototype.onResize = function() {
  this.updateScrollers_();
  this.updateScrollerPositions_();
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isAutoSize = function() {
  return this.autoSize_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.ScrollBar.prototype.setAutoSize = function(autoSize) {
  if (this.autoSize_ != autoSize) {
    this.autoSize_ = autoSize;
    this.setAutoSizeInternal(this.autoSize_);
    this.update();
  }
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.ScrollBar.prototype.setAutoSizeInternal = function(autoSize) {
  if (autoSize) {
    this.getRenderer().resetSize(this.getElement());
  } else {
    this.setSizeInternal(this.width_, this.height_);
  }
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getSize = function() {
  return new goog.math.Size(this.width_, this.height_);
};

/**
 * @return {goog.math.Size}
 * @protected
 */
npf.ui.ScrollBar.prototype.getSizeInternal = function() {
  return this.getRenderer().getSize(this.getElement());
};

/**
 * @param {goog.math.Size|number} width
 * @param {number=} opt_height
 */
npf.ui.ScrollBar.prototype.setSize = function(width, opt_height) {
  if (!this.autoSize_) {
    var w =
      /** @type {number} */ (goog.isNumber(width) ? width : width.width);
    var h =
      /** @type {number} */ (goog.isNumber(width) ? opt_height : width.height);

    if (this.width_ != w || this.height_ != h) {
      this.width_ = w;
      this.height_ = h;
      this.setSizeInternal(this.width_, this.height_);

      if (!this.contentAutoSize_) {
        /** @type {goog.math.Size} */
        var contentSize = this.getContentSizeInternal();
        this.contentWidth_ = contentSize.width;
        this.contentHeight_ = contentSize.height;
      }

      this.onResize();
      this.dispatchEvent_(npf.ui.ScrollBar.EventType.RESIZE);
    }
  }
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.ScrollBar.prototype.setSizeInternal = function(width, height) {
  this.getRenderer().setSize(this.getElement(), width, height);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isContentAutoSize = function() {
  return this.contentAutoSize_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.ScrollBar.prototype.setContentAutoSize = function(autoSize) {
  if (this.contentAutoSize_ != autoSize) {
    this.contentAutoSize_ = autoSize;
    this.setContentAutoSizeInternal(this.contentAutoSize_);
    this.update();
  }
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.ScrollBar.prototype.setContentAutoSizeInternal = function(autoSize) {
  if (autoSize) {
    this.getRenderer().resetSize(this.getContentElement());
  } else {
    this.setContentSizeInternal(this.width_, this.height_);
  }
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getContentSize = function() {
  return new goog.math.Size(this.contentWidth_, this.contentHeight_);
};

/**
 * @return {goog.math.Size}
 * @protected
 */
npf.ui.ScrollBar.prototype.getContentSizeInternal = function() {
  return this.getRenderer().getSize(this.getContentElement());
};

/**
 * @param {goog.math.Size|number} width
 * @param {number=} opt_height
 */
npf.ui.ScrollBar.prototype.setContentSize = function(width, opt_height) {
  if (!this.contentAutoSize_) {
    var w =
      /** @type {number} */ (goog.isNumber(width) ? width : width.width);
    var h =
      /** @type {number} */ (goog.isNumber(width) ? opt_height : width.height);

    if (this.contentWidth_ != w || this.contentHeight_ != h) {
      this.contentWidth_ = w;
      this.contentHeight_ = h;
      this.setContentSizeInternal(this.contentWidth_, this.contentHeight_);

      this.onResize();
      this.dispatchEvent_(npf.ui.ScrollBar.EventType.RESIZE);
    }
  }
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.ScrollBar.prototype.setContentSizeInternal = function(width, height) {
  this.getRenderer().setSize(this.getContentElement(), width, height);
};

/**
 * @return {number}
 */
npf.ui.ScrollBar.prototype.getScrollLeft = function() {
  return this.getScrollPosition().x;
};

/**
 * @return {number}
 */
npf.ui.ScrollBar.prototype.getScrollTop = function() {
  return this.getScrollPosition().y;
};

/**
 * @return {goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getScrollPosition = function() {
  return new goog.math.Coordinate(this.scrollLeft_, this.scrollTop_);
};

/**
 * @return {!goog.math.Coordinate}
 * @protected
 */
npf.ui.ScrollBar.prototype.getScrollPositionInternal = function() {
  /** @type {Element} */
  var scrollElement = this.getScrollElement();

  return new goog.math.Coordinate(
    scrollElement.scrollLeft, scrollElement.scrollTop);
};

/**
 * @param {number} left
 */
npf.ui.ScrollBar.prototype.setScrollLeft = function(left) {
  this.setScrollPosition(left, this.getScrollTop());
};

/**
 * @param {number} top
 */
npf.ui.ScrollBar.prototype.setScrollTop = function(top) {
  this.setScrollPosition(this.getScrollLeft(), top);
};

/**
 * @param {number|goog.math.Coordinate} left
 * @param {number=} opt_top
 * @param {boolean=} opt_force
 */
npf.ui.ScrollBar.prototype.setScrollPosition = function(
    left, opt_top, opt_force) {
  /** @type {number} */
  var x = goog.isNumber(left) ? left : /** @type {number} */ (left.x);
  /** @type {number} */
  var y = /** @type {number} */ (goog.isNumber(left) ? opt_top : left.y);

  if (opt_force || !(this.scrollLeft_ == x && this.scrollTop_ == y)) {
    if (this.animation_) {
      this.animation_.stop(false);
    }

    this.scrollLeft_ = x;
    this.scrollTop_ = y;
    this.setScrollPositionInternal(this.scrollLeft_, this.scrollTop_);

    this.onScroll();
    this.dispatchEvent_(npf.ui.ScrollBar.EventType.SCROLL);
  }
};

/**
 * @param {npf.ui.ScrollBar.EventType} type
 * @private
 */
npf.ui.ScrollBar.prototype.dispatchEvent_ = function(type) {
  var event = new npf.ui.ScrollBarEvent(
    type, this.getSize(), this.getContentSize(), this.getScrollPosition());
  this.dispatchEvent(event);
};

/**
 * @param {number} x
 * @param {number} y
 */
npf.ui.ScrollBar.prototype.setScrollPositionInternal = function(x, y) {
  /** @type {Element} */
  var scrollElement = this.getScrollElement();

  if (scrollElement) {
    scrollElement.scrollLeft = x;
    scrollElement.scrollTop = y;
  }
};

/**
 * @return {goog.math.Coordinate}
 */
npf.ui.ScrollBar.prototype.getMaxScrollPosition = function() {
  /** @type {number} */
  var left = 0;
  /** @type {number} */
  var top = 0;
  /** @type {goog.math.Size} */
  var size = this.getSize();
  /** @type {goog.math.Size} */
  var contentSize = this.getContentSize();

  if (contentSize && size) {
    left = Math.max(0, contentSize.width - size.width);
    top = Math.max(0, contentSize.height - size.height);
  }

  return new goog.math.Coordinate(left, top);
};

/**
 * @return {npf.ui.scrollBar.VerticalScroller}
 */
npf.ui.ScrollBar.prototype.getVerticalScroller = function() {
  return this.vertScroller_;
};

/**
 * @param {npf.ui.scrollBar.VerticalScroller} scroller
 */
npf.ui.ScrollBar.prototype.setVerticalScroller = function(scroller) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = npf.ui.scrollBar.Scroller.EventType;

  if (this.vertScroller_ && this.isInDocument()) {
    handler.unlisten(this.vertScroller_, EventType.SCROLL, this.onVertScroll_);
  }

  this.vertScroller_ = scroller;

  if (this.isInDocument()) {
    this.updateScrollers_();
    this.updateScrollerPositions_();
    handler.listen(this.vertScroller_, EventType.SCROLL, this.onVertScroll_);
  }
};

/**
 * @return {npf.ui.scrollBar.HorizontalScroller}
 */
npf.ui.ScrollBar.prototype.getHorizontalScroller = function() {
  return this.horizScroller_;
};

/**
 * @param {npf.ui.scrollBar.HorizontalScroller} scroller
 */
npf.ui.ScrollBar.prototype.setHorizontalScroller = function(scroller) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = npf.ui.scrollBar.Scroller.EventType;

  if (this.horizScroller_ && this.isInDocument()) {
    handler.unlisten(
      this.horizScroller_, EventType.SCROLL, this.onHorizScroll_);
  }

  this.horizScroller_ = scroller;

  if (this.isInDocument()) {
    this.updateScrollers_();
    this.updateScrollerPositions_();
    handler.listen(this.horizScroller_, EventType.SCROLL, this.onHorizScroll_);
  }
};

/**
 * @param {npf.ui.scrollBar.ScrollerEvent} evt
 */
npf.ui.ScrollBar.prototype.onVertScroll_ = function(evt) {
  /** @type {number} */
  var position = evt.position;
  this.setScrollTop(position);
};

/**
 * @param {npf.ui.scrollBar.ScrollerEvent} evt
 */
npf.ui.ScrollBar.prototype.onHorizScroll_ = function(evt) {
  /** @type {number} */
  var position = evt.position;
  this.setScrollLeft(position);
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.updateScrollerPositions_ = function() {
  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();

  if (this.horizScroller_) {
    this.horizScroller_.setPosition(scrollPosition.x);
  }

  if (this.vertScroller_) {
    this.vertScroller_.setPosition(scrollPosition.y);
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.updateScrollers_ = function() {
  /** @type {goog.math.Size} */
  var size = this.getSize();
  /** @type {goog.math.Size} */
  var contentSize = this.getContentSize();

  if (this.vertScroller_) {
    this.vertScroller_.setScrollBarSizes({
      size: size,
      contentSize: contentSize
    });
    this.vertScroller_.setVisible(0 < contentSize.height - size.height);
  }

  if (this.horizScroller_) {
    this.horizScroller_.setScrollBarSizes({
      size: size,
      contentSize: contentSize
    });
    this.horizScroller_.setVisible(0 < contentSize.width - size.width);
  }
};

/**
 * @return {npf.ui.scrollBar.Animation}
 */
npf.ui.ScrollBar.prototype.getAnimation = function() {
  return this.animation_;
};

/**
 * @param {npf.ui.scrollBar.Animation} animation
 */
npf.ui.ScrollBar.prototype.setAnimation = function(animation) {
  if (this.animation_) {
    goog.events.unlisten(this.animation_, goog.fx.Animation.EventType.ANIMATE,
      this.onAnimate_, false, this);
    goog.events.unlisten(this.animation_, goog.fx.Transition.EventType.FINISH,
      this.onAnimate_, false, this);
  }

  this.animation_ = animation;
  this.animation_.stop(true);
  goog.events.listen(this.animation_, goog.fx.Animation.EventType.ANIMATE,
    this.onAnimate_, false, this);
  goog.events.listen(this.animation_, goog.fx.Transition.EventType.FINISH,
    this.onAnimate_, false, this);
};

/**
 * @param {number} x
 */
npf.ui.ScrollBar.prototype.animateToLeft = function(x) {
  this.animate(x, this.getScrollTop());
};

/**
 * @param {number} y
 */
npf.ui.ScrollBar.prototype.animateToTop = function(y) {
  this.animate(this.getScrollLeft(), y);
};

/**
 * @param {number|goog.math.Coordinate} x
 * @param {number=} opt_y
 */
npf.ui.ScrollBar.prototype.animate = function(x, opt_y) {
  /** @type {number} */
  var left = goog.isNumber(x) ? x : /** @type {number} */ (x.x);
  var top = /** @type {number} */ (goog.isNumber(x) ? opt_y : x.y);

  if (!this.animation_) {
    this.setScrollPositionInternal(left, top);

    return;
  }

  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();
  /** @type {goog.math.Coordinate} */
  var maxScroll = this.getMaxScrollPosition();
  left = goog.math.clamp(left, 0, maxScroll.x);
  top = goog.math.clamp(top, 0, maxScroll.y);

  this.animation_.stop(true);
  this.animation_.startPoint = [scrollPosition.x, scrollPosition.y];
  this.animation_.endPoint = [left, top];
  this.animation_.play();
};

/**
 * @param {goog.fx.AnimationEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onAnimate_ = function(evt) {
  /** @type {number} */
  var x = Math.round(evt.x);
  /** @type {number} */
  var y = Math.round(evt.y);
  this.setScrollPositionInternal(x, y);
};


/**
 * @param {npf.ui.ScrollBar.EventType} type
 * @param {goog.math.Size} size
 * @param {goog.math.Size} contentSize
 * @param {goog.math.Coordinate} scroll
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.ScrollBarEvent = function(type, size, contentSize, scroll) {
  goog.base(this, type);

  /**
   * @type {number}
   */
  this.width = size.width;

  /**
   * @type {number}
   */
  this.height = size.height;

  /**
   * @type {number}
   */
  this.contentWidth = contentSize.width;

  /**
   * @type {number}
   */
  this.contentHeight = contentSize.height;

  /**
   * @type {number}
   */
  this.scrollLeft = scroll.x;

  /**
   * @type {number}
   */
  this.scrollTop = scroll.y;
};
goog.inherits(npf.ui.ScrollBarEvent, goog.events.Event);


/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollBarEvent.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollBarEvent.prototype.getContentSize = function() {
  return new goog.math.Size(this.contentWidth, this.contentHeight);
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.ScrollBarEvent.prototype.getScroll = function() {
  return new goog.math.Coordinate(this.scrollLeft, this.scrollTop);
};
