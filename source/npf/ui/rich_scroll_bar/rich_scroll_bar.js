goog.provide('npf.ui.RichScrollBar');

goog.require('goog.Timer');
goog.require('goog.ui.Control');
goog.require('npf.ui.ScrollBar');
goog.require('npf.ui.richScrollBar.ButtonAnimation');
goog.require('npf.ui.richScrollBar.Renderer');
goog.require('npf.ui.richScrollBar.SizeMonitor');


/**
 * @param {npf.ui.richScrollBar.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.ScrollBar}
 */
npf.ui.RichScrollBar = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.richScrollBar.Renderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.RichScrollBar, npf.ui.ScrollBar);


/**
 * @type {number}
 * @const
 */
npf.ui.RichScrollBar.BUTTON_CLICK_DELAY = 100;

/**
 * @type {boolean}
 * @private
 */
npf.ui.RichScrollBar.prototype.autoUpdate_ = false;

/**
 * @type {npf.ui.richScrollBar.SizeMonitor}
 * @private
 */
npf.ui.RichScrollBar.prototype.contentSizeMonitor_ = null;

/**
 * @type {npf.ui.richScrollBar.ButtonAnimation}
 * @private
 */
npf.ui.RichScrollBar.prototype.xAnimation_ = null;

/**
 * @type {npf.ui.richScrollBar.ButtonAnimation}
 * @private
 */
npf.ui.RichScrollBar.prototype.yAnimation_ = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.RichScrollBar.prototype.downButton_ = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.RichScrollBar.prototype.upButton_ = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.RichScrollBar.prototype.leftButton_ = null;

/**
 * @type {goog.ui.Control}
 * @private
 */
npf.ui.RichScrollBar.prototype.rightButton_ = null;

/**
 * @type {number}
 * @private
 */
npf.ui.RichScrollBar.prototype.buttonCheckTimeoutId_ = 0;


/** @inheritDoc */
npf.ui.RichScrollBar.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  this.setAutoUpdateInternal(this.autoUpdate_);
  this.updateButtons_();

  var ButAnimEvtType = npf.ui.richScrollBar.ButtonAnimation.EventType;
  /** @type {string} */
  var checkEventType = goog.ui.Component.EventType.CHECK;
  /** @type {string} */
  var uncheckEventType = goog.ui.Component.EventType.UNCHECK;

  this.xAnimation_ = new npf.ui.richScrollBar.ButtonAnimation();
  this.yAnimation_ = new npf.ui.richScrollBar.ButtonAnimation();

  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  handler
    .listen(this.xAnimation_, ButAnimEvtType.ANIMATE, this.onAnimateByXButton_)
    .listen(this.yAnimation_, ButAnimEvtType.ANIMATE, this.onAnimateByYButton_);

  if (this.downButton_) {
    handler.listen(this.downButton_, checkEventType, this.onDownButtonCheck_);
  }

  if (this.upButton_) {
    handler.listen(this.upButton_, checkEventType, this.onUpButtonCheck_);
  }

  if (this.leftButton_) {
    handler.listen(this.leftButton_, checkEventType, this.onLeftButtonCheck_);
  }

  if (this.rightButton_) {
    handler.listen(this.rightButton_, checkEventType, this.onRightButtonCheck_);
  }
};

/** @inheritDoc */
npf.ui.RichScrollBar.prototype.exitDocument = function() {
  goog.Timer.clear(this.buttonCheckTimeoutId_);
  this.buttonCheckTimeoutId_ = 0;

  this.setAutoUpdateInternal(false);

  this.xAnimation_.dispose();
  this.xAnimation_ = null;

  this.yAnimation_.dispose();
  this.yAnimation_ = null;

  goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.RichScrollBar.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.contentSizeMonitor_ = null;
  this.downButton_ = null;
  this.upButton_ = null;
  this.leftButton_ = null;
  this.rightButton_ = null;
};

/**
 * @return {Element}
 */
npf.ui.RichScrollBar.prototype.getContentWrapperElement = function() {
  return this.getRenderer().getContentWrapperElement(this.getElement());
};

/**
 * @return {boolean}
 */
npf.ui.RichScrollBar.prototype.isAutoUpdate = function() {
  return this.autoUpdate_;
};

/**
 * @param {boolean} update
 */
npf.ui.RichScrollBar.prototype.setAutoUpdate = function(update) {
  if (this.autoUpdate_ == update) {
    return;
  }

  this.autoUpdate_ = update;
  this.setAutoUpdateInternal(this.autoUpdate_);

  if (this.autoUpdate_) {
    this.update();
  }
};

/**
 * @param {boolean} update
 * @protected
 */
npf.ui.RichScrollBar.prototype.setAutoUpdateInternal = function(update) {
  if (this.isInDocument()) {
    if (update) {
      /** @type {Element} */
      var element = this.getContentWrapperElement();
      var EventType = npf.ui.richScrollBar.SizeMonitor.EventType;

      this.contentSizeMonitor_ = new npf.ui.richScrollBar.SizeMonitor(element);
      this.getHandler()
        .listen(this.contentSizeMonitor_, EventType.CHANGE, this.onUpdate_);
    } else {
      goog.dispose(this.contentSizeMonitor_);
      this.contentSizeMonitor_ = null;
    }
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onUpdate_ = function(evt) {
  this.update();
};

/** @inheritDoc */
npf.ui.RichScrollBar.prototype.onScroll = function() {
  goog.base(this, 'onScroll');

  this.updateButtons_();
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.RichScrollBar.prototype.getDownButton = function() {
  return this.downButton_;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.RichScrollBar.prototype.setDownButton = function(button) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = goog.ui.Component.EventType;

  if (this.downButton_ && this.isInDocument()) {
    handler
      .unlisten(this.downButton_, EventType.CHECK, this.onDownButtonCheck_);
  }

  this.downButton_ = button;

  if (this.isInDocument()) {
    this.updateButtons_();
    handler.listen(this.downButton_, EventType.CHECK, this.onDownButtonCheck_);
  }
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.RichScrollBar.prototype.getUpButton = function() {
  return this.upButton_;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.RichScrollBar.prototype.setUpButton = function(button) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = goog.ui.Component.EventType;

  if (this.upButton_ && this.isInDocument()) {
    handler
      .unlisten(this.upButton_, EventType.CHECK, this.onUpButtonCheck_);
  }

  this.upButton_ = button;

  if (this.isInDocument()) {
    this.updateButtons_();
    handler.listen(this.upButton_, EventType.CHECK, this.onUpButtonCheck_);
  }
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.RichScrollBar.prototype.getLeftButton = function() {
  return this.leftButton_;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.RichScrollBar.prototype.setLeftButton = function(button) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = goog.ui.Component.EventType;

  if (this.leftButton_ && this.isInDocument()) {
    handler
      .unlisten(this.leftButton_, EventType.CHECK, this.onLeftButtonCheck_);
  }

  this.leftButton_ = button;

  if (this.isInDocument()) {
    this.updateButtons_();
    handler.listen(this.leftButton_, EventType.CHECK, this.onLeftButtonCheck_);
  }
};

/**
 * @return {goog.ui.Control}
 */
npf.ui.RichScrollBar.prototype.getRightButton = function() {
  return this.rightButton_;
};

/**
 * @param {goog.ui.Control} button
 */
npf.ui.RichScrollBar.prototype.setRightButton = function(button) {
  /** @type {goog.events.EventHandler} */
  var handler = this.getHandler();
  var EventType = goog.ui.Component.EventType;

  if (this.rightButton_ && this.isInDocument()) {
    handler
      .unlisten(this.rightButton_, EventType.CHECK, this.onRightButtonCheck_);
  }

  this.rightButton_ = button;

  if (this.isInDocument()) {
    this.updateButtons_();
    handler
      .listen(this.rightButton_, EventType.CHECK, this.onRightButtonCheck_);
  }
};

/**
 * @private
 */
npf.ui.RichScrollBar.prototype.updateButtons_ = function() {
  /** @type {goog.math.Coordinate} */
  var scrollPosition = this.getScrollPosition();
  /** @type {goog.math.Coordinate} */
  var maxScrollPosition = this.getMaxScrollPosition();
  /** @type {boolean} */
  var enabled;
  var Direction = npf.ui.richScrollBar.ButtonAnimation.Direction;

  if (this.upButton_) {
    enabled = 0 < scrollPosition.y;

    this.upButton_.setEnabled(enabled);

    if (
      !enabled &&
      this.yAnimation_ &&
      Direction.UP == this.yAnimation_.getDirection()
    ) {
      this.yAnimation_.stop();
    }
  }

  if (this.downButton_) {
    enabled = 0 < maxScrollPosition.y - scrollPosition.y;
    this.downButton_.setEnabled(enabled);

    if (
      !enabled &&
      this.yAnimation_ &&
      Direction.DOWN == this.yAnimation_.getDirection()
    ) {
      this.yAnimation_.stop();
    }
  }

  if (this.leftButton_) {
    enabled = 0 < scrollPosition.x;

    this.leftButton_.setEnabled(enabled);

    if (
      !enabled &&
      this.xAnimation_ &&
      Direction.UP == this.xAnimation_.getDirection()
    ) {
      this.xAnimation_.stop();
    }
  }

  if (this.rightButton_) {
    enabled = 0 < maxScrollPosition.x - scrollPosition.x;
    this.rightButton_.setEnabled(enabled);

    if (
      !enabled &&
      this.yAnimation_ &&
      Direction.DOWN == this.xAnimation_.getDirection()
    ) {
      this.xAnimation_.stop();
    }
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onUpButtonCheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().listen(doc, EventType.MOUSEUP, this.onUpButtonUncheck_);

  goog.Timer.clear(this.buttonCheckTimeoutId_);
  this.buttonCheckTimeoutId_ = goog.Timer.callOnce(function() {
    this.buttonCheckTimeoutId_ = 0;
    this.yAnimation_.start(npf.ui.richScrollBar.ButtonAnimation.Direction.UP);
  }, npf.ui.RichScrollBar.BUTTON_CLICK_DELAY, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onUpButtonUncheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().unlisten(doc, EventType.MOUSEUP, this.onUpButtonUncheck_);

  if (this.buttonCheckTimeoutId_) {
    goog.Timer.clear(this.buttonCheckTimeoutId_);
    this.buttonCheckTimeoutId_ = 0;

    this.animateToTop(this.getScrollTop() - this.getSize().height * 0.75);
  } else {
    this.yAnimation_.stop();
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onDownButtonCheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().listen(doc, EventType.MOUSEUP, this.onDownButtonUncheck_);

  goog.Timer.clear(this.buttonCheckTimeoutId_);
  this.buttonCheckTimeoutId_ = goog.Timer.callOnce(function() {
    this.buttonCheckTimeoutId_ = 0;
    this.yAnimation_.start(npf.ui.richScrollBar.ButtonAnimation.Direction.DOWN);
  }, npf.ui.RichScrollBar.BUTTON_CLICK_DELAY, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onDownButtonUncheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().unlisten(doc, EventType.MOUSEUP, this.onDownButtonUncheck_);

  if (this.buttonCheckTimeoutId_) {
    goog.Timer.clear(this.buttonCheckTimeoutId_);
    this.buttonCheckTimeoutId_ = 0;
    this.animateToTop(this.getScrollTop() + this.getSize().height * 0.75);
  } else {
    this.yAnimation_.stop();
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onLeftButtonCheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().listen(doc, EventType.MOUSEUP, this.onLeftButtonUncheck_);

  goog.Timer.clear(this.buttonCheckTimeoutId_);
  this.buttonCheckTimeoutId_ = goog.Timer.callOnce(function() {
    this.buttonCheckTimeoutId_ = 0;
    this.xAnimation_.start(npf.ui.richScrollBar.ButtonAnimation.Direction.UP);
  }, npf.ui.RichScrollBar.BUTTON_CLICK_DELAY, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onLeftButtonUncheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().unlisten(doc, EventType.MOUSEUP, this.onLeftButtonUncheck_);

  if (this.buttonCheckTimeoutId_) {
    goog.Timer.clear(this.buttonCheckTimeoutId_);
    this.buttonCheckTimeoutId_ = 0;

    this.animateToLeft(this.getScrollLeft() - this.getSize().width * 0.75);
  } else {
    this.xAnimation_.stop();
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onRightButtonCheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().listen(doc, EventType.MOUSEUP, this.onRightButtonUncheck_);

  goog.Timer.clear(this.buttonCheckTimeoutId_);
  this.buttonCheckTimeoutId_ = goog.Timer.callOnce(function() {
    this.buttonCheckTimeoutId_ = 0;
    this.xAnimation_.start(npf.ui.richScrollBar.ButtonAnimation.Direction.DOWN);
  }, npf.ui.RichScrollBar.BUTTON_CLICK_DELAY, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onRightButtonUncheck_ = function(evt) {
  /** @type {!Document} */
  var doc = this.getDomHelper().getDocument();
  var EventType = goog.events.EventType;
  this.getHandler().unlisten(doc, EventType.MOUSEUP, this.onRightButtonUncheck_);

  if (this.buttonCheckTimeoutId_) {
    goog.Timer.clear(this.buttonCheckTimeoutId_);
    this.buttonCheckTimeoutId_ = 0;

    this.animateToLeft(this.getScrollLeft() + this.getSize().width * 0.75);
  } else {
    this.xAnimation_.stop();
  }
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onAnimateByYButton_ = function(evt) {
  var move = /** @type {number} */ (evt.move);
  this.setScrollTop(this.getScrollTop() + move);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.RichScrollBar.prototype.onAnimateByXButton_ = function(evt) {
  var move = /** @type {number} */ (evt.move);
  this.setScrollLeft(this.getScrollLeft() + move);
};
