goog.provide('npf.ui.ScrollBar');
goog.provide('npf.ui.ScrollBar.EventType');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.Control');
goog.require('npf.events.ResizeHandler');
goog.require('npf.fx.Animation');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.scrollBar.Animation');
goog.require('npf.ui.scrollBar.ButtonAnimation');
goog.require('npf.ui.scrollBar.HorizontalScroller');
goog.require('npf.ui.scrollBar.Renderer');
goog.require('npf.ui.scrollBar.SizeMonitor');
goog.require('npf.ui.scrollBar.VerticalScroller');


/**
 * @param {npf.ui.scrollBar.Renderer=} opt_renderer Renderer used to render or decorate the component.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.ScrollBar = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.scrollBar.Renderer.getInstance(), opt_domHelper);

  this.scrollPosition_ = new goog.math.Coordinate(0, 0);

  this.updateDelay_ = new goog.async.Delay(this.update, 0, this);
  this.registerDisposable(this.updateDelay_);

  this.buttonAnimation_ = new npf.ui.scrollBar.ButtonAnimation();
  this.buttonAnimation_.addEventListener(
    npf.ui.scrollBar.ButtonAnimation.EventType.ANIMATE, this.onAnimateByButton_,
    false, this);
  this.registerDisposable(this.buttonAnimation_);
};
goog.inherits(npf.ui.ScrollBar, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.ScrollBar.EventType = {
  RESIZE: goog.events.getUniqueId('resize'),
  /**
   * scrollLeft (number)
   * scrollTop (number)
   */
  SCROLL: goog.events.getUniqueId('scroll')
};

/**
 * @type {!goog.math.Coordinate}
 * @private
 */
npf.ui.ScrollBar.prototype.scrollPosition_;

/**
 * @type {goog.async.Delay}
 * @private
 */
npf.ui.ScrollBar.prototype.updateDelay_;

/**
 * @type {!npf.ui.scrollBar.ButtonAnimation}
 * @private
 */
npf.ui.ScrollBar.prototype.buttonAnimation_;

/**
 * @type {goog.math.Size}
 * @private
 */
npf.ui.ScrollBar.prototype.size_ = null;

/**
 * @type {goog.math.Size}
 * @private
 */
npf.ui.ScrollBar.prototype.contentSize_ = null;

/**
 * @type {npf.ui.scrollBar.SizeMonitor}
 * @private
 */
npf.ui.ScrollBar.prototype.contentSizeMonitor_ = null;

/**
 * @type {npf.events.ResizeHandler}
 * @private
 */
npf.ui.ScrollBar.prototype.sizeHandler_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ScrollBar.prototype.autoUpdate_ = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.ScrollBar.prototype.enabled_ = true;

/**
 * @type {npf.ui.scrollBar.VerticalScroller}
 * @private
 */
npf.ui.ScrollBar.prototype.verticalScroller_ = null;

/**
 * @type {npf.ui.scrollBar.HorizontalScroller}
 * @private
 */
npf.ui.ScrollBar.prototype.horizontalScroller_ = null;

/**
 * @type {npf.ui.scrollBar.Animation}
 * @private
 */
npf.ui.ScrollBar.prototype.animation_ = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.ScrollBar.prototype.downButton_ = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.ScrollBar.prototype.upButton_ = null;


/** @inheritDoc */
npf.ui.ScrollBar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();
  this.setScrollPosition(scrollPosition.x, scrollPosition.y);
  this.size_ = this.getSizeInternal();
  this.contentSize_ = this.getContentSizeInternal();

  this.updateScrollerPositions_();
  this.updateScrollers_();
  this.updateButtons_();

  if (this.autoUpdate_) {
    this.setAutoUpdateInternal(true);
  }

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  handler.listen(this.getScrollElement(), goog.events.EventType.SCROLL,
    this.onScroll_, false, this);

  this.sizeHandler_ = new npf.events.ResizeHandler();
  this.sizeHandler_.addEventListener(npf.events.ResizeHandler.EventType.RESIZE,
    this.onUpdateDelay_, false, this);

  if (this.verticalScroller_) {
    handler.listen(this.verticalScroller_,
      npf.ui.scrollBar.Scroller.EventType.SCROLL, this.onVerticalScroll_,
      false, this);
  }

  if (this.horizontalScroller_) {
    handler.listen(this.horizontalScroller_,
      npf.ui.scrollBar.Scroller.EventType.SCROLL, this.onHorizontalScroll_,
      false, this);
  }

  if (this.downButton_) {
    handler.listen(this.downButton_, goog.ui.Component.EventType.CHECK,
      this.onDownButtonCheck_, false, this);
    handler.listen(this.downButton_, goog.ui.Component.EventType.UNCHECK,
      this.onDownButtonUncheck_, false, this);
  }

  if (this.upButton_) {
    handler.listen(this.upButton_, goog.ui.Component.EventType.CHECK,
      this.onUpButtonCheck_, false, this);
    handler.listen(this.upButton_, goog.ui.Component.EventType.UNCHECK,
      this.onUpButtonUncheck_, false, this);
  }
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.exitDocument = function() {
  if (this.animation_) {
    this.animation_.stop(false);
  }

  this.buttonAnimation_.stop();
  this.updateDelay_.stop();

  this.sizeHandler_.dispose();
  this.sizeHandler_ = null;

  this.setAutoUpdateInternal(false);

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.scrollPosition_;
  delete this.updateDelay_;
  delete this.buttonAnimation_;
  delete this.size_;
  delete this.contentSize_;
  delete this.contentSizeMonitor_;
  delete this.sizeHandler_;
  delete this.autoUpdate_;
  delete this.enabled_;
  delete this.verticalScroller_;
  delete this.horizontalScroller_;
  delete this.animation_;
  delete this.downButton_;
  delete this.upButton_;
};

/**
 * @return {npf.ui.scrollBar.Renderer}
 * @override
 */
npf.ui.ScrollBar.prototype.getRenderer = function() {
  return /** @type {npf.ui.scrollBar.Renderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.scrollBar.Renderer} renderer
 */
npf.ui.ScrollBar.prototype.setRenderer = function(renderer) {
  goog.base(this, 'setRenderer', renderer);
};

/** @inheritDoc */
npf.ui.ScrollBar.prototype.getContentElement = function() {
  /** @type {Element} */
  var element = this.getElement();

  return element ? this.getRenderer().getContentElement(element) : null;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onScroll_ = function(evt) {
  evt.preventDefault();
  evt.stopPropagation();

  if (this.enabled_) {
    this.checkScrollPosition_();
  }
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isAutoUpdate = function() {
  return this.autoUpdate_;
};

/**
 * @param {boolean} update
 */
npf.ui.ScrollBar.prototype.setAutoUpdate = function(update) {
  if (this.autoUpdate_ == update) {
    return;
  }

  this.autoUpdate_ = update;

  if (this.isInDocument()) {
    this.setAutoUpdateInternal(this.autoUpdate_);

    if (this.autoUpdate_) {
      this.update();
    }
  }
};

/**
 * @param {boolean} update
 * @protected
 */
npf.ui.ScrollBar.prototype.setAutoUpdateInternal = function(update) {
  if (update) {
    /** @type {Element} */
    var contentWrapperElement = this.getContentWrapperElement();

    if (contentWrapperElement) {
      this.contentSizeMonitor_ = new npf.ui.scrollBar.SizeMonitor(contentWrapperElement);
      this.contentSizeMonitor_.addEventListener(
        npf.ui.scrollBar.SizeMonitor.EventType.CHANGE, this.onUpdate_, false,
        this);
    }
  } else {
    goog.dispose(this.contentSizeMonitor_);
    this.contentSizeMonitor_ = null;
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onUpdateDelay_ = function(evt) {
  if (this.enabled_) {
    this.updateDelay_.start();
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onUpdate_ = function(evt) {
  if (this.enabled_) {
    this.update();
  }
};

/**
 * @return {Element}
 */
npf.ui.ScrollBar.prototype.getScrollElement = function() {
  /** @type {Element} */
  var element = this.getElement();

  return element ? this.getRenderer().getScrollElement(element) : null;
};

/**
 * @return {Element}
 */
npf.ui.ScrollBar.prototype.getContentWrapperElement = function() {
  /** @type {Element} */
  var element = this.getElement();

  return element ? this.getRenderer().getContentWrapperElement(element) : null;
};

npf.ui.ScrollBar.prototype.update = function() {
  if (this.isInDocument() && this.enabled_) {
    this.checkSize_();
    this.checkScrollPosition_();
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.checkSize_ = function() {
  /** @type {goog.math.Size} */
  var size = this.getSizeInternal();
  /** @type {goog.math.Size} */
  var contentSize = this.getContentSizeInternal();

  if (!(goog.math.Size.equals(this.size_, size) &&
    goog.math.Size.equals(this.contentSize_, contentSize))) {
    this.size_ = size;
    this.contentSize_ = contentSize;

    this.updateScrollers_();
    this.dispatchEvent(npf.ui.ScrollBar.EventType.RESIZE);
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.checkScrollPosition_ = function() {
  /** @type {!goog.math.Coordinate} */
  var scrollPosition = this.getScrollPositionInternal();

  if (!goog.math.Coordinate.equals(this.scrollPosition_, scrollPosition)) {
    this.scrollPosition_ = scrollPosition;
    this.onScroll();
    this.dispatchEvent({
      type: npf.ui.ScrollBar.EventType.SCROLL,
      scrollLeft: this.scrollPosition_.x,
      scrollTop: this.scrollPosition_.y
    });
  }
};

/**
 * @protected
 */
npf.ui.ScrollBar.prototype.onScroll = function() {
  this.updateScrollerPositions_();
  this.updateButtons_();
};

/**
 * @return {boolean}
 */
npf.ui.ScrollBar.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * @param {boolean} enable
 */
npf.ui.ScrollBar.prototype.setEnabled = function(enable) {
  if (this.enabled_ == enable) {
    return;
  }

  this.enabled_ = enable;

  if (this.enabled_) {
    this.updateScrollers_();
    this.updateScrollerPositions_();
    this.updateButtons_();
  } else {
    if (this.animation_) {
      this.animation_.stop(false);
    }

    this.buttonAnimation_.stop();
  }
};

/**
 * @return {goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getSize = function() {
  return this.size_;
};

/**
 * @return {goog.math.Size}
 * @protected
 */
npf.ui.ScrollBar.prototype.getSizeInternal = function() {
  /** @type {Element} */
  var element = this.getElement();

  return goog.style.getBorderBoxSize(element);
};

/**
 * @return {goog.math.Size}
 */
npf.ui.ScrollBar.prototype.getContentSize = function() {
  return this.contentSize_;
};

/**
 * @return {goog.math.Size}
 * @protected
 */
npf.ui.ScrollBar.prototype.getContentSizeInternal = function() {
  /** @type {Element} */
  var contentElement = this.getContentElement();

  return goog.style.getBorderBoxSize(contentElement);
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
  return this.scrollPosition_;
};

/**
 * @return {!goog.math.Coordinate}
 * @protected
 */
npf.ui.ScrollBar.prototype.getScrollPositionInternal = function() {
  /** @type {Element} */
  var scrollElement = this.getScrollElement();

  return new goog.math.Coordinate(scrollElement.scrollLeft, scrollElement.scrollTop);
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
 */
npf.ui.ScrollBar.prototype.setScrollPosition = function(left, opt_top) {
  if (this.animation_) {
    this.animation_.stop(false);
  }

  /** @type {number} */
  var x = goog.isNumber(left) ? left : /** @type {number} */ (left.x);
  /** @type {number} */
  var y = /** @type {number} */ (goog.isNumber(left) ? opt_top : left.y);

  this.setScrollPositionInternal(x, y);
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
 * @return {goog.ui.Control}
 */
npf.ui.ScrollBar.prototype.getDownButton = function() {
  return this.downButton_;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.ScrollBar.prototype.setDownButton = function(button) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();

  if (this.downButton_ && this.isInDocument()) {
    handler
      .unlisten(this.downButton_, goog.ui.Component.EventType.CHECK,
        this.onDownButtonCheck_, false, this)
      .unlisten(this.downButton_, goog.ui.Component.EventType.UNCHECK,
        this.onDownButtonUncheck_, false, this);
  }

  this.downButton_ = button;

  if (this.isInDocument()) {
    this.updateButtons_();
    handler
      .listen(this.downButton_, goog.ui.Component.EventType.CHECK,
        this.onDownButtonCheck_, false, this)
      .listen(this.downButton_, goog.ui.Component.EventType.UNCHECK,
        this.onDownButtonUncheck_, false, this);
  }
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.ScrollBar.prototype.getUpButton = function() {
  return this.upButton_;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.ScrollBar.prototype.setUpButton = function(button) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();

  if (this.upButton_ && this.isInDocument()) {
    handler
      .unlisten(this.upButton_, goog.ui.Component.EventType.CHECK,
        this.onUpButtonCheck_, false, this)
      .unlisten(this.upButton_, goog.ui.Component.EventType.UNCHECK,
        this.onUpButtonUncheck_, false, this);
  }

  this.upButton_ = button;

  if (this.isInDocument()) {
    this.updateButtons_();
    handler
      .listen(this.upButton_, goog.ui.Component.EventType.CHECK,
        this.onUpButtonCheck_, false, this)
      .listen(this.upButton_, goog.ui.Component.EventType.UNCHECK,
        this.onUpButtonUncheck_, false, this);
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.updateButtons_ = function() {
  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();
  /** @type {goog.math.Coordinate} */
  var maxScrollPosition = this.getMaxScrollPosition();
  /** @type {boolean} */
  var enabled;

  if (this.upButton_) {
    enabled = !!scrollPosition.y;

    this.upButton_.setEnabled(enabled);

    if (!enabled && npf.ui.scrollBar.ButtonAnimation.Direction.UP ==
      this.buttonAnimation_.getDirection()) {
      this.buttonAnimation_.stop();
    }
  }

  if (this.downButton_) {
    enabled = !!(maxScrollPosition.y - scrollPosition.y);
    this.downButton_.setEnabled(enabled);

    if (!enabled && npf.ui.scrollBar.ButtonAnimation.Direction.DOWN ==
      this.buttonAnimation_.getDirection()) {
      this.buttonAnimation_.stop();
    }
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onUpButtonCheck_ = function(evt) {
  this.buttonAnimation_.start(npf.ui.scrollBar.ButtonAnimation.Direction.UP);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onUpButtonUncheck_ = function(evt) {
  this.buttonAnimation_.stop();
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onDownButtonCheck_ = function(evt) {
  this.buttonAnimation_.start(npf.ui.scrollBar.ButtonAnimation.Direction.DOWN);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onDownButtonUncheck_ = function(evt) {
  this.buttonAnimation_.stop();
};

/**
 * @return {npf.ui.scrollBar.VerticalScroller}
 */
npf.ui.ScrollBar.prototype.getVerticalScroller = function() {
  return this.verticalScroller_;
};

/**
 * @param {npf.ui.scrollBar.VerticalScroller} scrollBar
 */
npf.ui.ScrollBar.prototype.setVerticalScroller = function(scrollBar) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = npf.ui.scrollBar.Scroller.EventType;

  if (this.verticalScroller_ && this.isInDocument()) {
    handler.unlisten(this.verticalScroller_,
      EventType.SCROLL, this.onVerticalScroll_, false, this);
  }

  this.verticalScroller_ = scrollBar;

  if (this.isInDocument()) {
    this.updateScrollerPositions_();
    this.updateScrollers_();
    handler.listen(this.verticalScroller_,
      EventType.SCROLL, this.onVerticalScroll_, false, this);
  }
};

/**
 * @return {npf.ui.scrollBar.HorizontalScroller}
 */
npf.ui.ScrollBar.prototype.getHorizontalScroller = function() {
  return this.horizontalScroller_;
};

/**
 * @param {npf.ui.scrollBar.HorizontalScroller} scrollBar
 */
npf.ui.ScrollBar.prototype.setHorizontalScroller = function(scrollBar) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = npf.ui.scrollBar.Scroller.EventType;

  if (this.horizontalScroller_ && this.isInDocument()) {
    handler.unlisten(this.horizontalScroller_, EventType.SCROLL,
      this.onHorizontalScroll_, false, this);
  }

  this.horizontalScroller_ = scrollBar;

  if (this.isInDocument()) {
    this.updateScrollerPositions_();
    this.updateScrollers_();
    handler.listen(this.horizontalScroller_, EventType.SCROLL,
      this.onHorizontalScroll_, false, this);
  }
};

/**
 * @param {goog.events.Event} evt
 */
npf.ui.ScrollBar.prototype.onVerticalScroll_ = function(evt) {
  if (this.enabled_) {
    var position = /** @type {number} */ (evt.position);
    this.setScrollTop(position);
  }
};

/**
 * @param {goog.events.Event} evt
 */
npf.ui.ScrollBar.prototype.onHorizontalScroll_ = function(evt) {
  if (this.enabled_) {
    var position = /** @type {number} */ (evt.position);
    this.setScrollLeft(position);
  }
};

/**
 * @private
 */
npf.ui.ScrollBar.prototype.updateScrollerPositions_ = function() {
  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();

  if (this.horizontalScroller_) {
    this.horizontalScroller_.setPosition(scrollPosition.x);
  }

  if (this.verticalScroller_) {
    this.verticalScroller_.setPosition(scrollPosition.y);
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
  /** @type {goog.math.Coordinate} */
  var maxScrollPosition = this.getMaxScrollPosition();

  this.updateScrollerSizes();

  if (this.verticalScroller_) {
    this.verticalScroller_.setSizes(size.height, contentSize.height,
      maxScrollPosition.y);
  }

  if (this.horizontalScroller_) {
    this.horizontalScroller_.setSizes(size.width, contentSize.width,
      maxScrollPosition.x);
  }
};

/**
 * @protected
 */
npf.ui.ScrollBar.prototype.updateScrollerSizes = function() {
  /** @type {Element} */
  var backgroundElement;

  if (this.verticalScroller_) {
    backgroundElement = this.verticalScroller_.getBackgroundElement();

    if (backgroundElement) {
      /** @type {number} */
      var height = goog.style.getBorderBoxSize(backgroundElement).height;
      this.verticalScroller_.setSize(height);
    }
  }

  if (this.horizontalScroller_) {
    backgroundElement = this.horizontalScroller_.getBackgroundElement();

    if (backgroundElement) {
      /** @type {number} */
      var width = goog.style.getBorderBoxSize(backgroundElement).width;
      this.horizontalScroller_.setSize(height);
    }
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
    this.animation_.removeEventListener(goog.fx.Animation.EventType.ANIMATE,
      this.onAnimate_, false, this);
    this.animation_.removeEventListener(goog.fx.Transition.EventType.FINISH,
      this.onAnimate_, false, this);
  }

  this.animation_ = animation;
  this.animation_.stop(true);
  this.animation_.addEventListener(goog.fx.Animation.EventType.ANIMATE,
    this.onAnimate_, false, this);
  this.animation_.addEventListener(goog.fx.Transition.EventType.FINISH,
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
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.ScrollBar.prototype.onAnimateByButton_ = function(evt) {
  var move = /** @type {number} */ (evt.move);
  this.setScrollTop(this.getScrollTop() + move);
};
