goog.provide('npf.ui.ScrollContainer');
goog.provide('npf.ui.ScrollContainer.Corner');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('goog.events.EventType');
goog.require('goog.fx.Animation.EventType');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.ui.Component.State');
goog.require('goog.userAgent');
goog.require('npf.labs.events.ResizeHandler');
goog.require('npf.ui.ScrollBar');
goog.require('npf.ui.ScrollBar.EventType');
goog.require('npf.ui.StatedComponent');
goog.require('npf.ui.scrollContainer.Animation');
goog.require('npf.ui.scrollContainer.NativeScroller');
goog.require('npf.ui.scrollContainer.Renderer');
goog.require('npf.ui.scrollContainer.Scroller.Type');
goog.require('npf.ui.scrollContainer.TouchScroller');
goog.require('npf.userAgent.events');


/**
 * @param {npf.ui.ScrollContainer.Corner|null=} opt_startCorner
 * @param {npf.ui.scrollContainer.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.StatedComponent}
 */
npf.ui.ScrollContainer = function(opt_startCorner, opt_renderer,
    opt_domHelper) {
  npf.ui.ScrollContainer.base(this, 'constructor', opt_renderer ||
    npf.ui.scrollContainer.Renderer.getInstance(), opt_domHelper);

  /**
   * @private {goog.fx.Animation}
   */
  this.animation_ = null;

  /**
   * @private {npf.labs.events.ResizeHandler}
   */
  this.contentResizeHandler_ = null;

  /**
   * @private {!goog.math.Size}
   */
  this.contentSize_ = new goog.math.Size(0, 0);

  /**
   * @private {npf.labs.events.ResizeHandler}
   */
  this.resizeHandler_ = null;

  /**
   * @private {Array<!npf.ui.ScrollBar>}
   */
  this.scrollBars_ = null;

  /**
   * @private {!goog.math.Coordinate}
   */
  this.scrollPosition_ = new goog.math.Coordinate(0, 0);

  /**
   * @private {npf.ui.scrollContainer.Scroller}
   */
  this.scroller_ = null;

  /**
   * @private {!goog.math.Size}
   */
  this.size_ = new goog.math.Size(0, 0);

  /**
   * @private {npf.ui.ScrollContainer.Corner}
   */
  this.startCorner_ = opt_startCorner || npf.ui.ScrollContainer.Corner.LEFT_TOP;

  /**
   * @private {boolean}
   */
  this.touch_ = goog.userAgent.MOBILE &&
    npf.userAgent.events.isTouchEventSupported();

  this.setSupportedState(goog.ui.Component.State.DISABLED, true);
};
goog.inherits(npf.ui.ScrollContainer, npf.ui.StatedComponent);


/**
 * @enum {number}
 */
npf.ui.ScrollContainer.Corner = {
  LEFT_TOP: 1,
  RIGHT_TOP: 2,
  LEFT_BOTTOM: 3,
  RIGHT_BOTTOM: 4
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @return {boolean}
 */
npf.ui.ScrollContainer.isBottomCorner = function(corner) {
  return npf.ui.ScrollContainer.Corner.LEFT_BOTTOM == corner ||
    npf.ui.ScrollContainer.Corner.RIGHT_BOTTOM == corner;
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @return {boolean}
 */
npf.ui.ScrollContainer.isLeftCorner = function(corner) {
  return npf.ui.ScrollContainer.Corner.LEFT_TOP == corner ||
    npf.ui.ScrollContainer.Corner.LEFT_BOTTOM == corner;
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @return {boolean}
 */
npf.ui.ScrollContainer.isRightCorner = function(corner) {
  return npf.ui.ScrollContainer.Corner.RIGHT_TOP == corner ||
    npf.ui.ScrollContainer.Corner.RIGHT_BOTTOM == corner;
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @return {boolean}
 */
npf.ui.ScrollContainer.isTopCorner = function(corner) {
  return npf.ui.ScrollContainer.Corner.LEFT_TOP == corner ||
    npf.ui.ScrollContainer.Corner.RIGHT_TOP == corner;
};


/** @inheritDoc */
npf.ui.ScrollContainer.prototype.createDom = function() {
  npf.ui.ScrollContainer.base(this, 'createDom');

  this.initializeDom();
};

/** @inheritDoc */
npf.ui.ScrollContainer.prototype.decorateInternal = function(element) {
  npf.ui.ScrollContainer.base(this, 'decorateInternal', element);

  this.initializeDom();
};

npf.ui.ScrollContainer.prototype.initializeDom = function() {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());
  renderer.checkNativeScrollBar(this);

  this.applyStartCorner(this.startCorner_);
  this.applyTouch(this.touch_);

  /** @type {Element} */
  var contentResizeHandlerElement = this.getContentResizeHandlerElement();
  /** @type {Element} */
  var resizeHandlerElement = this.getResizeHandlerElement();

  if (resizeHandlerElement) {
    this.resizeHandler_ = new npf.labs.events.ResizeHandler(
      resizeHandlerElement);
    this.registerDisposable(this.resizeHandler_);
  }

  if (contentResizeHandlerElement) {
    this.contentResizeHandler_ = new npf.labs.events.ResizeHandler(
      contentResizeHandlerElement);
    this.registerDisposable(this.contentResizeHandler_);
  }
};

/** @inheritDoc */
npf.ui.ScrollContainer.prototype.enterDocument = function() {
  npf.ui.ScrollContainer.base(this, 'enterDocument');

  this.updateTouch_();

  this.resize();

  this.getHandler().
    listen(this.getElement(), goog.events.EventType.SCROLL, this.onScroll_);

  if (this.resizeHandler_) {
    this.resizeHandler_.setEnabled(true);

    this.getHandler().
      listen(this.resizeHandler_, goog.events.EventType.RESIZE, this.onResize_);
  }

  if (this.contentResizeHandler_) {
    this.contentResizeHandler_.setEnabled(true);

    this.getHandler().
      listen(this.contentResizeHandler_, goog.events.EventType.RESIZE,
        this.onContentResize_);
  }

  if (this.scrollBars_) {
    goog.array.forEach(this.scrollBars_, function(scrollBar) {
      this.setListenedScrollBar(scrollBar, true);
    }, this);
  }
};

/** @inheritDoc */
npf.ui.ScrollContainer.prototype.exitDocument = function() {
  goog.dispose(this.animation_);
  this.animation_ = null;

  if (this.resizeHandler_) {
    this.resizeHandler_.setEnabled(false);
  }

  if (this.contentResizeHandler_) {
    this.contentResizeHandler_.setEnabled(false);
  }

  npf.ui.ScrollContainer.base(this, 'exitDocument');

  this.updateTouch_();
};

/** @inheritDoc */
npf.ui.ScrollContainer.prototype.disposeInternal = function() {
  if (this.scrollBars_) {
    goog.array.forEach(this.scrollBars_, function(scrollBar) {
      this.removeScrollBar(scrollBar);
    }, this);
  }

  npf.ui.ScrollContainer.base(this, 'disposeInternal');

  this.contentResizeHandler_ = null;
  this.resizeHandler_ = null;
  this.scrollBars_ = null;
};

npf.ui.ScrollContainer.prototype.resize = function() {
  if (this.isInDocument()) {
    var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
      this.getRenderer());
    /** @type {goog.math.Size} */
    var size = renderer.getSize(this.getElement());
    /** @type {goog.math.Size} */
    var contentSize = renderer.getSize(this.getContentElement());

    if (size) {
      this.setSize(size, true);
    }

    if (contentSize) {
      this.setContentSize(contentSize);
    }

    if (this.scroller_) {
      this.scroller_.update();
    }
  }
};

/**
 * @return {boolean}
 */
npf.ui.ScrollContainer.prototype.isAnimating = function() {
  return !!this.animation_;
};

/**
 * @param {!goog.math.Coordinate} from
 * @param {!goog.math.Coordinate} to
 * @return {goog.fx.Animation}
 * @protected
 */
npf.ui.ScrollContainer.prototype.createAnimation = function(from, to) {
  return new npf.ui.scrollContainer.Animation(from.x, from.y, to.x, to.y);
};

/**
 * @return {Element}
 */
npf.ui.ScrollContainer.prototype.getContentResizeHandlerElement = function() {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());

  return renderer.getContentResizeHandlerElement(this.getElement());
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollContainer.prototype.getContentSize = function() {
  return this.contentSize_;
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollContainer.prototype.setContentSize = function(size) {
  if (!goog.math.Size.equals(this.contentSize_, size)) {
    this.setContentSizeInternal(size);
    this.applyContentSize(size);
    this.onResize();
  }
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollContainer.prototype.setContentSizeInternal = function(size) {
  this.contentSize_ = size;
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollContainer.prototype.applyContentSize = function(size) {
  if (this.scroller_) {
    this.scroller_.update();
  }

  if (this.scrollBars_) {
    goog.array.forEach(this.scrollBars_, function(scrollBar) {
      scrollBar.update();
    });
  }
};

/**
 * @return {Element}
 */
npf.ui.ScrollContainer.prototype.getResizeHandlerElement = function() {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());

  return renderer.getResizeHandlerElement(this.getElement());
};

/**
 * @param {!npf.ui.ScrollBar} scrollBar
 */
npf.ui.ScrollContainer.prototype.addScrollBar = function(scrollBar) {
  if (!this.scrollBars_) {
    this.scrollBars_ = [];
  }

  if (!goog.array.contains(this.scrollBars_, scrollBar)) {
    this.scrollBars_.push(scrollBar);
    scrollBar.setContainer(this);
    this.setListenedScrollBar(scrollBar, true);
  }
};

/**
 * @param {!npf.ui.ScrollBar} scrollBar
 */
npf.ui.ScrollContainer.prototype.removeScrollBar = function(scrollBar) {
  if (this.scrollBars_ && goog.array.remove(this.scrollBars_, scrollBar)) {
    this.setListenedScrollBar(scrollBar, false);
    scrollBar.setContainer(null);
  }
};

/**
 * @param {npf.ui.ScrollBar} scrollBar
 * @param {boolean} listen
 * @protected
 */
npf.ui.ScrollContainer.prototype.setListenedScrollBar = function(scrollBar,
    listen) {
  if (this.isInDocument()) {
    if (listen) {
      this.getHandler().listen(scrollBar,
        npf.ui.ScrollBar.EventType.MOVE, this.onScrollBarMove_);
    } else {
      this.getHandler().unlisten(scrollBar,
        npf.ui.ScrollBar.EventType.MOVE, this.onScrollBarMove_);
    }
  }
};

/**
 * @return {Array<npf.ui.ScrollBar>}
 */
npf.ui.ScrollContainer.prototype.getScrollBars = function() {
  return this.scrollBars_;
};

/**
 * @return {number}
 */
npf.ui.ScrollContainer.prototype.getScrollHeight = function() {
  return this.getScrollSize().height;
};

/**
 * @return {number}
 */
npf.ui.ScrollContainer.prototype.getScrollLeft = function() {
  return this.scrollPosition_.x;
};

/**
 * @param {number} left
 * @param {boolean=} opt_animate
 */
npf.ui.ScrollContainer.prototype.setScrollLeft = function(left, opt_animate) {
  var position = new goog.math.Coordinate(left, this.scrollPosition_.y);
  this.setScrollPosition(position, opt_animate);
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.ScrollContainer.prototype.getScrollPosition = function() {
  return this.scrollPosition_;
};

/**
 * @param {!goog.math.Coordinate} position
 * @param {boolean=} opt_animate
 * @param {boolean=} opt_force
 */
npf.ui.ScrollContainer.prototype.setScrollPosition = function(position,
    opt_animate, opt_force) {
  /** @type {boolean} */
  var equals = goog.math.Coordinate.equals(this.scrollPosition_, position);

  if (!equals) {
    goog.dispose(this.animation_);
    this.animation_ = null;
  }

  if (opt_force || !equals) {
    if (opt_animate && this.isInDocument()) {
      this.animation_ = this.createAnimation(this.scrollPosition_, position);

      if (this.animation_) {
        this.animation_.listen(
          goog.fx.Animation.EventType.ANIMATE, this.onAnimate_, false, this);
        this.animation_.listen(
          goog.fx.Transition.EventType.END, this.onAnimationEnd_, false, this);
        this.animation_.play();

        return;
      }
    }

    this.setScrollPositionInternal(position);
    this.applyScrollPosition(position);
    this.onScroll();
  }
};

/**
 * @param {!goog.math.Coordinate} position
 * @protected
 */
npf.ui.ScrollContainer.prototype.setScrollPositionInternal = function(
    position) {
  this.scrollPosition_ = position;
};

/**
 * @param {!goog.math.Coordinate} position
 * @protected
 */
npf.ui.ScrollContainer.prototype.applyScrollPosition = function(position) {
  if (this.scroller_) {
    this.scroller_.setScrollPosition(position);
  }

  if (this.scrollBars_) {
    goog.array.forEach(this.scrollBars_, function(scrollBar) {
      scrollBar.update();
    });
  }
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollContainer.prototype.getScrollSize = function() {
  /** @type {number} */
  var width = Math.max(0, this.contentSize_.width - this.size_.width);
  /** @type {number} */
  var height = Math.max(0, this.contentSize_.height - this.size_.height);

  return new goog.math.Size(width, height);
};

/**
 * @return {number}
 */
npf.ui.ScrollContainer.prototype.getScrollTop = function() {
  return this.scrollPosition_.y;
};

/**
 * @param {number} top
 * @param {boolean=} opt_animate
 */
npf.ui.ScrollContainer.prototype.setScrollTop = function(top, opt_animate) {
  var position = new goog.math.Coordinate(this.scrollPosition_.x, top);
  this.setScrollPosition(position, opt_animate);
};

/**
 * @return {number}
 */
npf.ui.ScrollContainer.prototype.getScrollWidth = function() {
  return this.getScrollSize().width;
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.ScrollContainer.prototype.getSize = function() {
  return this.size_;
};

/**
 * @param {!goog.math.Size} size
 * @param {boolean=} opt_noRender
 */
npf.ui.ScrollContainer.prototype.setSize = function(size, opt_noRender) {
  if (!goog.math.Size.equals(this.size_, size)) {
    this.setSizeInternal(size);
    this.applySize(size, opt_noRender);

    if (this.scroller_) {
      this.scroller_.update();
    }

    this.onResize();
  }
};

/**
 * @param {!goog.math.Size} size
 * @protected
 */
npf.ui.ScrollContainer.prototype.setSizeInternal = function(size) {
  this.size_ = size;
};

/**
 * @param {!goog.math.Size} size
 * @param {boolean=} opt_noRender
 * @protected
 */
npf.ui.ScrollContainer.prototype.applySize = function(size, opt_noRender) {
  if (!opt_noRender) {
    var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
      this.getRenderer());
    renderer.setSize(this.getElement(), size);
  }

  if (this.scrollBars_) {
    goog.array.forEach(this.scrollBars_, function(scrollBar) {
      scrollBar.update();
    });
  }
};

/**
 * @return {npf.ui.ScrollContainer.Corner}
 */
npf.ui.ScrollContainer.prototype.getStartCorner = function() {
  return this.startCorner_;
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 */
npf.ui.ScrollContainer.prototype.setStartCorner = function(corner) {
  if (this.startCorner_ != corner) {
    var oldCorner = this.startCorner_;
    this.setStartCornerInternal(corner);
    this.applyStartCorner(corner, oldCorner);
  }
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @protected
 */
npf.ui.ScrollContainer.prototype.setStartCornerInternal = function(corner) {
  this.startCorner_ = corner;
};

/**
 * @param {npf.ui.ScrollContainer.Corner} corner
 * @param {npf.ui.ScrollContainer.Corner=} opt_oldCorner
 * @protected
 */
npf.ui.ScrollContainer.prototype.applyStartCorner = function(corner,
    opt_oldCorner) {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());
  renderer.setStartCorner(this, corner, opt_oldCorner);
  this.applyScrollPosition(this.scrollPosition_);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollContainer.prototype.isBottomStartCorner = function() {
  return npf.ui.ScrollContainer.isBottomCorner(this.startCorner_);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollContainer.prototype.isLeftStartCorner = function() {
  return npf.ui.ScrollContainer.isLeftCorner(this.startCorner_);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollContainer.prototype.isRightStartCorner = function() {
  return npf.ui.ScrollContainer.isRightCorner(this.startCorner_);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollContainer.prototype.isTopStartCorner = function() {
  return npf.ui.ScrollContainer.isTopCorner(this.startCorner_);
};

/**
 * @return {boolean}
 */
npf.ui.ScrollContainer.prototype.isTouch = function() {
  return this.touch_;
};

/**
 * @param {boolean} enable
 */
npf.ui.ScrollContainer.prototype.setTouch = function(enable) {
  if (this.touch_ != enable) {
    this.setTouchInternal(enable);
    this.applyTouch(enable);
  }
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.ScrollContainer.prototype.setTouchInternal = function(enable) {
  this.touch_ = enable;
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.ScrollContainer.prototype.applyTouch = function(enable) {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());
  renderer.setTouch(this, enable);
  this.updateTouch_();
};

/**
 * @private
 */
npf.ui.ScrollContainer.prototype.updateTouch_ = function() {
  if (this.isEnabled() && this.isInDocument()) {
    if (this.touch_) {
      if (
        this.scroller_ &&
        npf.ui.scrollContainer.Scroller.Type.TOUCH != this.scroller_.getType()
      ) {
        this.scroller_.dispose();
      }

      if (!this.scroller_) {
        this.scroller_ = new npf.ui.scrollContainer.TouchScroller(this);
        this.scroller_.listen(
          goog.events.EventType.SCROLL, this.onScrollerScroll_, false, this);
        this.scroller_.setScrollPosition(this.scrollPosition_);
      }
    } else {
      if (
        this.scroller_ &&
        npf.ui.scrollContainer.Scroller.Type.NATIVE != this.scroller_.getType()
      ) {
        this.scroller_.dispose();
      }

      if (!this.scroller_) {
        this.scroller_ = new npf.ui.scrollContainer.NativeScroller(this);
        this.scroller_.listen(
          goog.events.EventType.SCROLL, this.onScrollerScroll_, false, this);
        this.scroller_.setScrollPosition(this.scrollPosition_);
      }
    }
  } else if (this.scroller_) {
    this.scroller_.dispose();
    this.scroller_ = null;
  }
};

/**
 * @return {Element}
 */
npf.ui.ScrollContainer.prototype.getMovingElement = function() {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());

  return renderer.getMovingElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.ScrollContainer.prototype.getScrollElement = function() {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());

  return renderer.getScrollElement(this.getElement());
};

/**
 * @param {goog.fx.AnimationEvent} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onAnimate_ = function(evt) {
  /** @type {number} */
  var x = Math.round(evt.x);
  /** @type {number} */
  var y = Math.round(evt.y);
  var position = new goog.math.Coordinate(x, y)
  this.setScrollPositionInternal(position);
  this.applyScrollPosition(position);
  this.onScroll();
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onAnimationEnd_ = function(evt) {
  /** @type {number} */
  var x = Math.round(evt.x);
  /** @type {number} */
  var y = Math.round(evt.y);
  var position = new goog.math.Coordinate(x, y)
  this.setScrollPositionInternal(position);
  this.applyScrollPosition(position);
  this.onScroll();

  goog.dispose(this.animation_);
  this.animation_ = null;
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onContentResize_ = function(evt) {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());
  /** @type {goog.math.Size} */
  var size = renderer.getSize(this.getContentElement());

  if (size) {
    this.setContentSize(size);
  }
};

/**
 * @protected
 */
npf.ui.ScrollContainer.prototype.onResize = function() {
  this.dispatchEvent(goog.events.EventType.RESIZE);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onResize_ = function(evt) {
  var renderer = /** @type {npf.ui.scrollContainer.Renderer} */ (
    this.getRenderer());
  /** @type {goog.math.Size} */
  var size = renderer.getSize(this.getElement());

  if (size) {
    this.setSize(size, true);
  }
};

/**
 * @protected
 */
npf.ui.ScrollContainer.prototype.onScroll = function() {
  this.dispatchEvent(goog.events.EventType.SCROLL);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onScroll_ = function(evt) {
  /** @type {Element} */
  var element = this.getElement();
  /** @type {!goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition().clone();
  scrollPosition.x += this.isLeftStartCorner() ?
    element.scrollLeft : -element.scrollLeft;
  scrollPosition.y += this.isTopStartCorner() ?
    element.scrollTop : -element.scrollTop;
  element.scrollLeft = 0;
  element.scrollTop = 0;
  this.setScrollPosition(scrollPosition);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onScrollBarMove_ = function(evt) {
  var scrollBar = /** @type {npf.ui.ScrollBar} */ (evt.target);
  /** @type {!goog.math.Coordinate} */
  var position = scrollBar.getScrollPosition();
  this.setScrollPosition(position);
};

/**
 * @param {npf.ui.scrollContainer.Scroller.Event} evt
 * @private
 */
npf.ui.ScrollContainer.prototype.onScrollerScroll_ = function(evt) {
  /** @type {number} */
  var left = evt.scrollLeft;
  /** @type {number} */
  var top = evt.scrollTop;
  this.setScrollPosition(new goog.math.Coordinate(left, top), false, true);
};
