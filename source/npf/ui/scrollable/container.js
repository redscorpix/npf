goog.provide('npf.ui.scrollable.Container');
goog.provide('npf.ui.scrollable.Container.EventType');
goog.provide('npf.ui.scrollable.ContainerEvent');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.events.MouseWheelHandler.EventType');
goog.require('goog.fx.Animation.EventType');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.math');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.ui.Component.State');
goog.require('npf.events.ResizeHandler');
goog.require('npf.events.ResizeHandler.EventType');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.scrollable.Animation');
goog.require('npf.ui.scrollable.ContainerRenderer');
goog.require('npf.ui.scrollable.ScrollBar.EventType');
goog.require('npf.ui.scrollable.scrollBar.Horizontal');
goog.require('npf.ui.scrollable.scrollBar.Vertical');


/**
 * @param {npf.ui.scrollable.ContainerRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 * @deprecated Use npf.ui.ScrollContainer
 */
npf.ui.scrollable.Container = function(opt_renderer, opt_domHelper) {
  npf.ui.scrollable.Container.base(this, 'constructor', opt_renderer ||
    npf.ui.scrollable.ContainerRenderer.getInstance(), opt_domHelper);

  /**
   * @private {goog.fx.Animation}
   */
  this.animation_ = null;

  /**
   * @private {boolean}
   */
  this.autoContentSize_ = true;

  /**
   * @private {boolean}
   */
  this.autoSize_ = true;

  /**
   * @private {number}
   */
  this.contentHeight_ = 0;

  /**
   * @private {number}
   */
  this.contentWidth_ = 0;

  /**
   * @private {number}
   */
  this.height_ = 0;

  /**
   * @private {npf.ui.scrollable.scrollBar.Horizontal}
   */
  this.horizScrollBar_ = null;

  /**
   * @private {number}
   */
  this.scrollLeft_ = 0;

  /**
   * @private {number}
   */
  this.scrollTop_ = 0;

  /**
   * @private {goog.async.Delay}
   */
  this.updateDelay_ = new goog.async.Delay(this.update, 0, this);
  this.registerDisposable(this.updateDelay_);

  /**
   * @private {npf.ui.scrollable.scrollBar.Vertical}
   */
  this.vertScrollBar_ = null;

  /**
   * @private {number}
   */
  this.width_ = 0;

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


/** @inheritDoc */
npf.ui.scrollable.Container.prototype.createDom = function() {
  npf.ui.scrollable.Container.base(this, 'createDom');

  this.initializeDom();
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.decorateInternal = function(element) {
  npf.ui.scrollable.Container.base(this, 'decorateInternal', element);

  this.initializeDom();
};

/**
 * @protected
 */
npf.ui.scrollable.Container.prototype.initializeDom = function() {
  if (!this.autoSize_) {
    this.applySize(this.width_, this.height_);
  }

  if (!this.autoContentSize_) {
    this.applyContentSize(this.contentWidth_, this.contentHeight_);
  }
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.enterDocument = function() {
  npf.ui.scrollable.Container.base(this, 'enterDocument');

  this.update();

  /** @type {Element} */
  var scrollElement = this.getScrollElement();

  var sizeHandler = new npf.events.ResizeHandler();
  this.disposeOnExitDocument(sizeHandler);

  var mouseWheelHandler = new goog.events.MouseWheelHandler(scrollElement);
  this.disposeOnExitDocument(mouseWheelHandler);

  this.getHandler().
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

  npf.ui.scrollable.Container.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.scrollable.Container.prototype.disposeInternal = function() {
  this.setHorizontalScrollBar(null);
  this.setVerticalScrollBar(null);

  npf.ui.scrollable.Container.base(this, 'disposeInternal');

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
 * @return {boolean}
 */
npf.ui.scrollable.Container.prototype.isAutoContentSize = function() {
  return this.autoContentSize_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.scrollable.Container.prototype.setAutoContentSize = function(autoSize) {
  if (this.autoContentSize_ != autoSize) {
    this.setAutoContentSizeInternal(autoSize);

    if (!this.autoContentSize_) {
      this.applyContentSize(this.contentWidth_, this.contentHeight_);
    }

    this.update();
  }
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.scrollable.Container.prototype.setAutoContentSizeInternal = function(
    autoSize) {
  this.autoContentSize_ = autoSize;
};

/**
 * @return {boolean}
 */
npf.ui.scrollable.Container.prototype.isAutoSize = function() {
  return this.autoSize_;
};

/**
 * @param {boolean} autoSize
 */
npf.ui.scrollable.Container.prototype.setAutoSize = function(autoSize) {
  if (this.autoSize_ != autoSize) {
    this.setAutoSizeInternal(autoSize);

    if (!this.autoSize_) {
      this.applySize(this.width_, this.height_);
    }

    this.update();
  }
};

/**
 * @param {boolean} autoSize
 * @protected
 */
npf.ui.scrollable.Container.prototype.setAutoSizeInternal = function(autoSize) {
  this.autoSize_ = autoSize;
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
  if (!this.autoContentSize_) {
    var w = /** @type {number} */ (
      goog.isNumber(width) ? width : width.width);
    var h = /** @type {number} */ (
      goog.isNumber(width) ? opt_height : width.height);

    if (this.contentWidth_ != w || this.contentHeight_ != h) {
      this.setContentSizeInternal(w, h);
      this.applyContentSize(this.contentWidth_, this.contentHeight_);
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
  var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
    this.getRenderer());
  renderer.setSize(this.getContentElement(), width, height);
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
    if (listen) {
      this.getHandler().listen(scrollBar,
        npf.ui.scrollable.ScrollBar.EventType.SCROLL, this.onHorizScroll_);
    } else {
      this.getHandler().unlisten(scrollBar,
        npf.ui.scrollable.ScrollBar.EventType.SCROLL, this.onHorizScroll_);
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
  var left = Math.max(0, this.contentWidth_ - this.width_);
  /** @type {number} */
  var top = Math.max(0, this.contentHeight_ - this.height_);

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
  var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
    this.getRenderer());

  return renderer.getScrollElement(this.getElement());
};

/**
 * @return {number}
 */
npf.ui.scrollable.Container.prototype.getScrollLeft = function() {
  return this.scrollLeft_;
};

/**
 * @param {number} left
 * @param {boolean=} opt_force
 * @param {boolean=} opt_animate
 */
npf.ui.scrollable.Container.prototype.setScrollLeft = function(left, opt_force,
    opt_animate) {
  this.setScrollPosition(left, this.scrollTop_, opt_force, opt_animate);
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
 * @param {boolean=} opt_animate
 */
npf.ui.scrollable.Container.prototype.setScrollPosition = function(left,
    opt_top, opt_force, opt_animate) {
  if (!this.isEnabled()) {
    return;
  }

  goog.dispose(this.animation_);
  this.animation_ = null;

  var x = /** @type {number} */ (goog.isNumber(left) ? left : left.x);
  var y = /** @type {number} */ (goog.isNumber(left) ? opt_top : left.y);

  if (opt_animate && this.isInDocument()) {
    /** @type {goog.math.Coordinate} */
    var maxScroll = this.getMaxScrollPosition();
    x = goog.math.clamp(x, 0, maxScroll.x);
    y = goog.math.clamp(y, 0, maxScroll.y);

    if (this.scrollLeft_ != x || this.scrollTop_ != y) {
      this.animation_ = this.createAnimation(
        this.scrollLeft_, this.scrollTop_, x, y);

      if (this.animation_) {
        this.animation_.listen(
          goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
        this.animation_.listen(
          goog.fx.Transition.EventType.END, this.onAnimationEnd_, false, this);
        this.animation_.play();

        return;
      }
    }
  }

  this.setScrollCoords(x, y, opt_force);
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
  this.setScrollCoords(x, y);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.scrollable.Container.prototype.onAnimationEnd_ = function(evt) {
  /** @type {number} */
  var x = Math.round(evt.x);
  /** @type {number} */
  var y = Math.round(evt.y);
  this.setScrollCoords(x, y);

  goog.dispose(this.animation_);
  this.animation_ = null;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {boolean=} opt_force
 */
npf.ui.scrollable.Container.prototype.setScrollCoords = function(x, y,
    opt_force) {
  /** @type {goog.math.Coordinate} */
  var maxScroll = this.getMaxScrollPosition();
  x = goog.math.clamp(x, 0, maxScroll.x);
  y = goog.math.clamp(y, 0, maxScroll.y);

  if (opt_force || this.scrollLeft_ != x || this.scrollTop_ != y) {
    this.setScrollPositionInternal(x, y);
    this.applyScrollPosition(this.scrollLeft_, this.scrollTop_);
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
  var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
    this.getRenderer());
  renderer.setScrollPosition(this.getScrollElement(), x, y);
};

/**
 * @return {number}
 */
npf.ui.scrollable.Container.prototype.getScrollTop = function() {
  return this.scrollTop_;
};

/**
 * @param {number} top
 * @param {boolean=} opt_force
 * @param {boolean=} opt_animate
 */
npf.ui.scrollable.Container.prototype.setScrollTop = function(top, opt_force,
    opt_animate) {
  this.setScrollPosition(this.scrollLeft_, top, opt_force, opt_animate);
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
  if (!this.autoSize_) {
    var w = /** @type {number} */ (
      goog.isNumber(width) ? width : width.width);
    var h = /** @type {number} */ (
      goog.isNumber(width) ? opt_height : width.height);

    if (this.width_ != w || this.height_ != h) {
      this.setSizeInternal(w, h);

      this.applySize(this.width_, this.height_);

      if (!this.autoContentSize_) {
        var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
          this.getRenderer());
        /** @type {!goog.math.Size} */
        var contentSize = renderer.getSize(this.getContentElement());
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
  var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
    this.getRenderer());
  renderer.setSize(this.getElement(), width, height);
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
    if (listen) {
      this.getHandler().listen(scrollBar,
        npf.ui.scrollable.ScrollBar.EventType.SCROLL, this.onVertScroll_);
    } else {
      this.getHandler().unlisten(scrollBar,
        npf.ui.scrollable.ScrollBar.EventType.SCROLL, this.onVertScroll_);
    }
  }
};

npf.ui.scrollable.Container.prototype.update = function() {
  if (this.isInDocument()) {
    this.checkSize_();
    this.setScrollCoords(this.scrollLeft_, this.scrollTop_, true);
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
  var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
    this.getRenderer());

  if (this.autoSize_) {
    /** @type {!goog.math.Size} */
    var domSize = renderer.getSize(this.getElement());

    if (this.width_ != domSize.width || this.height_ != domSize.height) {
      this.setSizeInternal(domSize.width, domSize.height);
      sizeChanged = true;
    }
  }

  if (this.autoContentSize_) {
    /** @type {!goog.math.Size} */
    var domContentSize = renderer.getSize(this.getContentElement());

    if (
      this.contentWidth_ != domContentSize.width ||
      this.contentHeight_ != domContentSize.height
    ) {
      this.setContentSizeInternal(domContentSize.width, domContentSize.height);
      contentSizeChanged = true;
    }
  }

  if (sizeChanged || contentSizeChanged) {
    this.onResize();
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

  var renderer = /** @type {npf.ui.scrollable.ContainerRenderer} */ (
    this.getRenderer());
  /** @type {!goog.math.Coordinate} */
  var domScroll = renderer.getScrollPosition(this.getScrollElement());
  this.setScrollCoords(domScroll.x, domScroll.y);
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
 * @struct
 * @extends {goog.events.Event}
 */
npf.ui.scrollable.ContainerEvent = function(type, size, contentSize, scroll) {
  npf.ui.scrollable.ContainerEvent.base(this, 'constructor', type);

  /**
   * @type {number}
   */
  this.contentHeight = contentSize.height;

  /**
   * @type {number}
   */
  this.contentWidth = contentSize.width;

  /**
   * @type {number}
   */
  this.height = size.height;

  /**
   * @type {number}
   */
  this.scrollLeft = scroll.x;

  /**
   * @type {number}
   */
  this.scrollTop = scroll.y;

  /**
   * @type {number}
   */
  this.width = size.width;
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
