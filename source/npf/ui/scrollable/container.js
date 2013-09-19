goog.provide('npf.ui.scrollable.Container');
goog.provide('npf.ui.scrollable.Container.EventType');
goog.provide('npf.ui.scrollable.ContainerEvent');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.ui.Component.State');
goog.require('npf.events.ResizeHandler');
goog.require('npf.fx.Animation');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.scrollable.Animation');
goog.require('npf.ui.scrollable.ContainerRenderer');
goog.require('npf.ui.scrollable.scrollBar.Horizontal');
goog.require('npf.ui.scrollable.scrollBar.Vertical');


/**
 * @param {npf.ui.scrollable.ContainerRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.scrollable.Container = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollable.ContainerRenderer.getInstance(), opt_domHelper);

  this.updateDelay_ = new goog.async.Delay(this.update, 0, this);
  this.registerDisposable(this.updateDelay_);

  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
};
goog.inherits(npf.ui.scrollable.Container, npf.ui.StatedComponent);


/**
 * @enum {string}
 */
npf.ui.scrollable.Container.EventType = {
  /**
   * npf.ui.scrollable.ContainerEvent
   */
  RESIZE: goog.events.getUniqueId('resize'),

  /**
   * npf.ui.scrollable.ContainerEvent
   */
  SCROLL: goog.events.getUniqueId('scroll')
};


/**
 * @private {goog.fx.Animation}
 */
npf.ui.scrollable.Container.prototype.animation_ = null;

/**
 * @private {number}
 */
npf.ui.scrollable.Container.prototype.contentHeight_ = 0;

/**
 * @private {boolean}
 */
npf.ui.scrollable.Container.prototype.contentSizeFromElement_ = true;

/**
 * @private {number}
 */
npf.ui.scrollable.Container.prototype.contentWidth_ = 0;

/**
 * @private {number}
 */
npf.ui.scrollable.Container.prototype.height_ = 0;

/**
 * @private {npf.ui.scrollable.scrollBar.Horizontal}
 */
npf.ui.scrollable.Container.prototype.horizScrollBar_ = null;

/**
 * @private {number}
 */
npf.ui.scrollable.Container.prototype.scrollLeft_ = 0;

/**
 * @private {number}
 */
npf.ui.scrollable.Container.prototype.scrollTop_ = 0;

/**
 * @private {boolean}
 */
npf.ui.scrollable.Container.prototype.sizeFromElement_ = true;

/**
 * @private {goog.async.Delay}
 */
npf.ui.scrollable.Container.prototype.updateDelay_;

/**
 * @private {npf.ui.scrollable.scrollBar.Vertical}
 */
npf.ui.scrollable.Container.prototype.vertScrollBar_ = null;

/**
 * @private {number}
 */
npf.ui.scrollable.Container.prototype.width_ = 0;


/** @inheritDoc */
npf.ui.scrollable.Container.prototype.createDom = function() {
  goog.base(this, 'createDom');

  this.initializeDom();
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  this.initializeDom();
};

/**
 * @protected
 */
npf.ui.scrollable.Container.prototype.initializeDom = function() {
  this.applySizeFromElement(this.isSizeFromElement());
  this.applyContentSizeFromElement(this.isContentSizeFromElement());
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.update();

  /** @type {Element} */
  var scrollElement = this.getScrollElement();

  var sizeHandler = new npf.events.ResizeHandler();
  this.disposeOnExitDocument(sizeHandler);

  var mouseWheelHandler = new goog.events.MouseWheelHandler(scrollElement);
  this.disposeOnExitDocument(mouseWheelHandler);

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  handler.
    listen(scrollElement, goog.events.EventType.SCROLL, this.onScroll_).
    listen(mouseWheelHandler,
      goog.events.MouseWheelHandler.EventType.MOUSEWHEEL, this.onMouseWheel_).
    listen(sizeHandler, npf.events.ResizeHandler.EventType.RESIZE,
      this.onUpdateDelay_);

  if (this.vertScrollBar_) {
    this.setListenedVerticalScrollBar(this.vertScrollBar_, true);
  }

  if (this.horizScrollBar_) {
    this.setListenedHorizontalScrollBar(this.horizScrollBar_, true);
  }
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.exitDocument = function() {
  goog.dispose(this.animation_);
  this.animation_ = null;

  this.updateDelay_.stop();

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.disposeInternal = function() {
  this.setHorizontalScrollBar(null);
  this.setVerticalScrollBar(null);

  goog.base(this, 'disposeInternal');

  this.horizScrollBar_ = null;
  this.updateDelay_ = null;
  this.vertScrollBar_ = null;
};

/**
 * @return {boolean}
 */
npf.ui.scrollable.Container.prototype.isAnimating = function() {
  return !!this.animation_;
};

/**
 * @param {number} x
 */
npf.ui.scrollable.Container.prototype.animateToLeft = function(x) {
  this.animate(x, this.getScrollTop());
};

/**
 * @param {number} y
 */
npf.ui.scrollable.Container.prototype.animateToTop = function(y) {
  this.animate(this.getScrollLeft(), y);
};

/**
 * @param {number|goog.math.Coordinate} x
 * @param {number=} opt_y
 */
npf.ui.scrollable.Container.prototype.animate = function(x, opt_y) {
  if (this.isEnabled()) {
    /** @type {number} */
    var left = goog.isNumber(x) ? x : /** @type {number} */ (x.x);
    var top = /** @type {number} */ (goog.isNumber(x) ? opt_y : x.y);
    /** @type {goog.math.Coordinate} */
    var scrollPosition = this.getScrollPosition();
    /** @type {goog.math.Coordinate} */
    var maxScroll = this.getMaxScrollPosition();
    left = goog.math.clamp(left, 0, maxScroll.x);
    top = goog.math.clamp(top, 0, maxScroll.y);

    goog.dispose(this.animation_);
    this.animation_ = null;

    this.animation_ = this.createAnimation(
      scrollPosition.x, scrollPosition.y, left, top);

    if (this.animation_) {
      this.animation_.listen(
        goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
      this.animation_.listen(
        goog.fx.Transition.EventType.FINISH, this.onAnimate_, false, this);
      this.animation_.listen(
        goog.fx.Transition.EventType.END, this.onAnimationEnd_, false, this);
      this.animation_.play();
    } else {
      this.applyScrollPosition(left, top);
    }
  }
};

/**
 * @param {goog.fx.AnimationEvent} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onAnimate_ = function(evt) {
  /** @type {number} */
  var x = Math.round(evt.x);
  /** @type {number} */
  var y = Math.round(evt.y);
  this.applyScrollPosition(x, y);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onAnimationEnd_ = function(evt) {
  goog.dispose(this.animation_);
  this.animation_ = null;
};

/**
 * @param {number} fromX
 * @param {number} fromY
 * @param {number} toX
 * @param {number} toY
 * @return {goog.fx.Animation}
 * @protected
 */
npf.ui.scrollable.Container.prototype.createAnimation = function(fromX, fromY,
    toX, toY) {
  return new npf.ui.scrollable.Animation(fromX, fromY, toX, toY);
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.scrollable.Container.prototype.getContentSize = function() {
  return new goog.math.Size(this.contentWidth_, this.contentHeight_);
};

/**
 * @param {goog.math.Size|number} width
 * @param {number=} opt_height
 */
npf.ui.scrollable.Container.prototype.setContentSize = function(width,
    opt_height) {
  if (!this.isContentSizeFromElement()) {
    var w = /** @type {number} */ (
      goog.isNumber(width) ? width : width.width);
    var h = /** @type {number} */ (
      goog.isNumber(width) ? opt_height : width.height);
    /** @type {goog.math.Size} */
    var contentSize = this.getContentSize();

    if (contentSize.width != w || contentSize.height != h) {
      this.setContentSizeInternal(w, h);

      contentSize = this.getContentSize();
      this.applyContentSize(contentSize.width, contentSize.height);

      this.onResize();
    }
  }
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.scrollable.Container.prototype.setContentSizeInternal = function(width,
    height) {
  this.contentWidth_ = width;
  this.contentHeight_ = height;
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.scrollable.Container.prototype.applyContentSize = function(width,
    height) {
  this.getRenderer().setSize(this.getContentElement(), width, height);
};

/**
 * @return {boolean}
 */
npf.ui.scrollable.Container.prototype.isContentSizeFromElement = function() {
  return this.contentSizeFromElement_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.scrollable.Container.prototype.setContentSizeFromElement = function(
    autoSize) {
  if (this.isContentSizeFromElement() != autoSize) {
    this.setContentSizeFromElementInternal(autoSize);
    this.applyContentSizeFromElement(this.isContentSizeFromElement());
    this.update();
  }
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.scrollable.Container.prototype.setContentSizeFromElementInternal =
    function(autoSize) {
  this.contentSizeFromElement_ = autoSize;
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.scrollable.Container.prototype.applyContentSizeFromElement = function(
    autoSize) {
  if (autoSize) {
    this.getRenderer().resetSize(this.getContentElement());
  } else {
    /** @type {goog.math.Size} */
    var size = this.getContentSize();
    this.applyContentSize(size.width, size.height);
  }
};

/**
 * @return {npf.ui.scrollable.scrollBar.Horizontal}
 */
npf.ui.scrollable.Container.prototype.getHorizontalScrollBar = function() {
  return this.horizScrollBar_;
};

/**
 * @param {npf.ui.scrollable.scrollBar.Horizontal} scrollBar
 */
npf.ui.scrollable.Container.prototype.setHorizontalScrollBar = function(
    scrollBar) {
  if (this.horizScrollBar_ !== scrollBar) {
    /** @type {npf.ui.scrollable.scrollBar.Horizontal} */
    var oldScrollBar = this.horizScrollBar_;
    this.horizScrollBar_ = null;

    if (oldScrollBar) {
      oldScrollBar.setContainer(null);
      this.setListenedHorizontalScrollBar(oldScrollBar, false);
    }

    if (scrollBar) {
      this.horizScrollBar_ = scrollBar;
      this.horizScrollBar_.setContainer(this);
      this.setListenedHorizontalScrollBar(this.horizScrollBar_, true);
    }
  }
};

/**
 * @param {npf.ui.scrollable.scrollBar.Horizontal} scrollBar
 * @param {boolean} listen
 * @protected
 */
npf.ui.scrollable.Container.prototype.setListenedHorizontalScrollBar = function(
    scrollBar, listen) {
  if (this.isInDocument()) {
    /** @type {goog.events.EventHandler} */
    var handler = this.getHandler();
    var eventType = npf.ui.scrollable.ScrollBar.EventType.SCROLL;

    if (listen) {
      handler.listen(scrollBar, eventType, this.onHorizScroll_);
    } else {
      handler.unlisten(scrollBar, eventType, this.onHorizScroll_);
    }
  }
};

/**
 * @return {number}
 */
npf.ui.scrollable.Container.prototype.getMaxScrollLeft = function() {
  return this.getMaxScrollPosition().x;
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.scrollable.Container.prototype.getMaxScrollPosition = function() {
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
 * @return {number}
 */
npf.ui.scrollable.Container.prototype.getMaxScrollTop = function() {
  return this.getMaxScrollPosition().y;
};

/**
 * @param {npf.ui.scrollable.ScrollBar} scrollBar
 */
npf.ui.scrollable.Container.prototype.setScrollBar = function(scrollBar) {
  if (scrollBar instanceof npf.ui.scrollable.scrollBar.Vertical) {
    this.setVerticalScrollBar(scrollBar);
  } else if (scrollBar instanceof npf.ui.scrollable.scrollBar.Horizontal) {
    this.setHorizontalScrollBar(scrollBar);
  }
};

/**
 * @return {Element}
 */
npf.ui.scrollable.Container.prototype.getScrollElement = function() {
  return this.getRenderer().getScrollElement(this.getElement());
};

/**
 * @return {number}
 */
npf.ui.scrollable.Container.prototype.getScrollLeft = function() {
  return this.getScrollPosition().x;
};

/**
 * @param {number} left
 */
npf.ui.scrollable.Container.prototype.setScrollLeft = function(left) {
  this.setScrollPosition(left, this.getScrollTop());
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.scrollable.Container.prototype.getScrollPosition = function() {
  return new goog.math.Coordinate(this.scrollLeft_, this.scrollTop_);
};

/**
 * @param {number|goog.math.Coordinate} left
 * @param {number=} opt_top
 * @param {boolean=} opt_force
 */
npf.ui.scrollable.Container.prototype.setScrollPosition = function(left,
    opt_top, opt_force) {
  var x = /** @type {number} */ (goog.isNumber(left) ? left : left.x);
  var y = /** @type {number} */ (goog.isNumber(left) ? opt_top : left.y);
  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();

  if (
    this.isEnabled() &&
    (opt_force || scrollPosition.x != x || scrollPosition.y != y)
  ) {
    goog.dispose(this.animation_);
    this.animation_ = null;

    this.setScrollPositionInternal(x, y);

    scrollPosition = this.getScrollPosition();
    this.applyScrollPosition(scrollPosition.x, scrollPosition.y);

    this.onScroll();
  }
};

/**
 * @param {number} x
 * @param {number} y
 * @protected
 */
npf.ui.scrollable.Container.prototype.setScrollPositionInternal = function(x,
    y) {
  this.scrollLeft_ = x;
  this.scrollTop_ = y;
};

/**
 * @param {number} x
 * @param {number} y
 * @protected
 */
npf.ui.scrollable.Container.prototype.applyScrollPosition = function(x, y) {
  this.getRenderer().setScrollPosition(this.getScrollElement(), x, y);
};

/**
 * @return {number}
 */
npf.ui.scrollable.Container.prototype.getScrollTop = function() {
  return this.getScrollPosition().y;
};

/**
 * @param {number} top
 */
npf.ui.scrollable.Container.prototype.setScrollTop = function(top) {
  this.setScrollPosition(this.getScrollLeft(), top);
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.scrollable.Container.prototype.getSize = function() {
  return new goog.math.Size(this.width_, this.height_);
};

/**
 * @param {goog.math.Size|number} width
 * @param {number=} opt_height
 */
npf.ui.scrollable.Container.prototype.setSize = function(width, opt_height) {
  if (!this.isSizeFromElement()) {
    var w = /** @type {number} */ (
      goog.isNumber(width) ? width : width.width);
    var h = /** @type {number} */ (
      goog.isNumber(width) ? opt_height : width.height);
    /** @type {goog.math.Size} */
    var size = this.getSize();

    if (size.width != w || size.height != h) {
      this.setSizeInternal(w, h);

      size = this.getSize();
      this.applySize(size.width, size.height);

      if (!this.isContentSizeFromElement()) {
        /** @type {!goog.math.Size} */
        var contentSize = this.getRenderer().getSize(this.getContentElement());
        this.setContentSizeInternal(contentSize.width, contentSize.height);
      }

      this.onResize();
    }
  }
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.scrollable.Container.prototype.setSizeInternal = function(width,
    height) {
  this.width_ = width;
  this.height_ = height;
};

/**
 * @param {number} width
 * @param {number} height
 * @protected
 */
npf.ui.scrollable.Container.prototype.applySize = function(width, height) {
  this.getRenderer().setSize(this.getElement(), width, height);
};

/**
 * @return {boolean}
 */
npf.ui.scrollable.Container.prototype.isSizeFromElement = function() {
  return this.sizeFromElement_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.scrollable.Container.prototype.setSizeFromElement = function(autoSize) {
  if (this.isSizeFromElement() != autoSize) {
    this.setSizeFromElementInternal(autoSize);
    this.applySizeFromElement(this.isSizeFromElement());
    this.update();
  }
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.scrollable.Container.prototype.setSizeFromElementInternal = function(
    autoSize) {
  this.sizeFromElement_ = autoSize;
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.scrollable.Container.prototype.applySizeFromElement = function(
    autoSize) {
  if (autoSize) {
    this.getRenderer().resetSize(this.getElement());
  } else {
    /** @type {goog.math.Size} */
    var size = this.getSize();
    this.applySize(size.width, size.height);
  }
};

/**
 * @return {npf.ui.scrollable.scrollBar.Vertical}
 */
npf.ui.scrollable.Container.prototype.getVerticalScrollBar = function() {
  return this.vertScrollBar_;
};

/**
 * @param {npf.ui.scrollable.scrollBar.Vertical} scrollBar
 */
npf.ui.scrollable.Container.prototype.setVerticalScrollBar = function(
    scrollBar) {
  if (this.vertScrollBar_ !== scrollBar) {
    /** @type {npf.ui.scrollable.scrollBar.Vertical} */
    var oldScrollBar = this.vertScrollBar_;
    this.vertScrollBar_ = null;

    if (oldScrollBar) {
      oldScrollBar.setContainer(null);
      this.setListenedVerticalScrollBar(oldScrollBar, false);
    }

    if (scrollBar) {
      this.vertScrollBar_ = scrollBar;
      this.vertScrollBar_.setContainer(this);
      this.setListenedVerticalScrollBar(this.vertScrollBar_, true);
    }
  }
};

/**
 * @param {npf.ui.scrollable.scrollBar.Vertical} scrollBar
 * @param {boolean} listen
 * @protected
 */
npf.ui.scrollable.Container.prototype.setListenedVerticalScrollBar = function(
    scrollBar, listen) {
  if (this.isInDocument()) {
    /** @type {goog.events.EventHandler} */
    var handler = this.getHandler();
    var eventType = npf.ui.scrollable.ScrollBar.EventType.SCROLL;

    if (listen) {
      handler.listen(scrollBar, eventType, this.onVertScroll_);
    } else {
      handler.unlisten(scrollBar, eventType, this.onVertScroll_);
    }
  }
};

npf.ui.scrollable.Container.prototype.update = function() {
  if (this.isInDocument()) {
    this.checkSize_();
    this.checkScroll_();
  }
};

/**
 * @private
 */
npf.ui.scrollable.Container.prototype.checkSize_ = function() {
  /** @type {boolean} */
  var sizeChanged = false;
  /** @type {boolean} */
  var contentSizeChanged = false;

  if (this.isSizeFromElement()) {
    /** @type {!goog.math.Size} */
    var domSize = this.getRenderer().getSize(this.getElement());
    /** @type {goog.math.Size} */
    var size = this.getSize();

    if (!goog.math.Size.equals(size, domSize)) {
      this.setSizeInternal(domSize.width, domSize.height);
      sizeChanged = true;
    }
  }

  if (this.isContentSizeFromElement()) {
    /** @type {goog.math.Size} */
    var contentSize = this.getContentSize();
    /** @type {!goog.math.Size} */
    var domContentSize = this.getRenderer().getSize(this.getContentElement());

    if (!goog.math.Size.equals(contentSize, domContentSize)) {
      this.setContentSizeInternal(domContentSize.width, domContentSize.height);
      contentSizeChanged = true;
    }
  }

  if (sizeChanged || contentSizeChanged) {
    this.onResize();
  }
};

/**
 * @private
 */
npf.ui.scrollable.Container.prototype.checkScroll_ = function() {
  /** @type {!goog.math.Coordinate} */
  var domScroll = this.getRenderer().getScrollPosition(this.getScrollElement());
  /** @type {goog.math.Coordinate} */
  var scroll = this.getScrollPosition();

  if (!goog.math.Coordinate.equals(domScroll, scroll) && this.isEnabled()) {
    this.setScrollPositionInternal(domScroll.x, domScroll.y);
    this.onScroll();
  }
};

/**
 * @protected
 */
npf.ui.scrollable.Container.prototype.onResize = function() {
  this.dispatchEvent_(npf.ui.scrollable.Container.EventType.RESIZE);
};

/**
 * @protected
 */
npf.ui.scrollable.Container.prototype.onScroll = function() {
  this.dispatchEvent_(npf.ui.scrollable.Container.EventType.SCROLL);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onScroll_ = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  this.checkScroll_();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onMouseWheel_ = function(evt) {
  if (!this.isEnabled()) {
    evt.preventDefault();
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onUpdateDelay_ = function(evt) {
  this.updateDelay_.start();
};

/**
 * @param {npf.ui.scrollable.ScrollBarEvent} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onVertScroll_ = function(evt) {
  /** @type {number} */
  var position = evt.position;
  this.setScrollTop(position);
};

/**
 * @param {npf.ui.scrollable.ScrollBarEvent} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onHorizScroll_ = function(evt) {
  /** @type {number} */
  var position = evt.position;
  this.setScrollLeft(position);
};

/**
 * @param {npf.ui.scrollable.Container.EventType} type
 * @private
 */
npf.ui.scrollable.Container.prototype.dispatchEvent_ = function(type) {
  var event = new npf.ui.scrollable.ContainerEvent(
    type, this.getSize(), this.getContentSize(), this.getScrollPosition());
  this.dispatchEvent(event);
};


/**
 * @param {npf.ui.scrollable.Container.EventType} type
 * @param {goog.math.Size} size
 * @param {goog.math.Size} contentSize
 * @param {goog.math.Coordinate} scroll
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.scrollable.ContainerEvent = function(type, size, contentSize, scroll) {
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
goog.inherits(npf.ui.scrollable.ContainerEvent, goog.events.Event);


/**
 * @return {!goog.math.Size}
 */
npf.ui.scrollable.ContainerEvent.prototype.getSize = function() {
  return new goog.math.Size(this.width, this.height);
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.scrollable.ContainerEvent.prototype.getContentSize = function() {
  return new goog.math.Size(this.contentWidth, this.contentHeight);
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.scrollable.ContainerEvent.prototype.getScroll = function() {
  return new goog.math.Coordinate(this.scrollLeft, this.scrollTop);
};
