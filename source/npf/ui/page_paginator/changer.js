goog.provide('npf.ui.pagePaginator.Changer');
goog.provide('npf.ui.pagePaginator.Changer.Event');
goog.provide('npf.ui.pagePaginator.Changer.EventType');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.math');
goog.require('goog.math.Rect');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('npf.fx.CssAnimation');
goog.require('npf.fx.cssAnimation.EventType');
goog.require('npf.fx.KeyframeAnimation');
goog.require('npf.fx.css3.easing');
goog.require('npf.ui.pagePaginator.Dragger');


/**
 * @param {Element} element
 * @param {Element} contentElement
 * @param {number} page
 * @param {number} pageCount
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.pagePaginator.Changer = function(element, contentElement, page,
    pageCount) {
  goog.base(this);

  this.contentElement_ = contentElement;
  this.domHelper_ = goog.dom.getDomHelper(element);
  this.element_ = element;
  this.pageCount_ = pageCount;
  this.pageIndex_ = page;

  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
};
goog.inherits(npf.ui.pagePaginator.Changer, goog.events.EventTarget);


/**
 * @const {number}
 */
npf.ui.pagePaginator.Changer.DURATION = 500;

/**
 * @enum {string}
 */
npf.ui.pagePaginator.Changer.EventType = {

  /**
   * npf.ui.pagePaginator.Changer.Event
   */
  PAGE_CHANGE: goog.events.getUniqueId('pageChange')
};

/**
 * @typedef {{
 *   time: number,
 *   x: number
 * }}
 */
npf.ui.pagePaginator.Changer.Stamp;


/**
 * @private {npf.fx.KeyframeAnimation}
 */
npf.ui.pagePaginator.Changer.prototype.animation_ = null;

/**
 * @private {Element}
 */
npf.ui.pagePaginator.Changer.prototype.contentElement_;

/**
 * @private {goog.dom.DomHelper}
 */
npf.ui.pagePaginator.Changer.prototype.domHelper_ = null;

/**
 * @private {Array.<npf.ui.pagePaginator.Changer.Stamp>}
 */
npf.ui.pagePaginator.Changer.prototype.dragStamps_ = null;

/**
 * @private {boolean}
 */
npf.ui.pagePaginator.Changer.prototype.draggable_ = true;

/**
 * @private {npf.ui.pagePaginator.Dragger}
 */
npf.ui.pagePaginator.Changer.prototype.dragger_ = null;

/**
 * @private {Element}
 */
npf.ui.pagePaginator.Changer.prototype.element_;

/**
 * @private {Element}
 */
npf.ui.pagePaginator.Changer.prototype.emptyElement_ = null;

/**
 * @private {goog.events.EventHandler}
 */
npf.ui.pagePaginator.Changer.prototype.handler_;

/**
 * @private {boolean}
 */
npf.ui.pagePaginator.Changer.prototype.loopback_ = false;

/**
 * @private {number}
 */
npf.ui.pagePaginator.Changer.prototype.pageCount_;

/**
 * @private {number}
 */
npf.ui.pagePaginator.Changer.prototype.pageIndex_;

/**
 * @private {?boolean}
 */
npf.ui.pagePaginator.Changer.prototype.queueNext_ = null;

/**
 * @private {number}
 */
npf.ui.pagePaginator.Changer.prototype.width_;


/** @inheritDoc */
npf.ui.pagePaginator.Changer.prototype.disposeInternal = function() {
  goog.dispose(this.dragger_);
  goog.dispose(this.animation_);

  goog.base(this, 'disposeInternal');

  this.animation_ = null;
  this.contentElement_ = null;
  this.domHelper_ = null;
  this.dragStamps_ = null;
  this.dragger_ = null;
  this.element_ = null;
  this.emptyElement_ = null;
  this.handler_ = null;
};

npf.ui.pagePaginator.Changer.prototype.init = function() {
  this.handler_.listen(
    this.domHelper_.getWindow(), goog.events.EventType.RESIZE, this.onResize_);
  this.update_();
};

/**
 * @return {Element}
 */
npf.ui.pagePaginator.Changer.prototype.getContentElement = function() {
  return this.contentElement_;
};

/**
 * @return {boolean}
 */
npf.ui.pagePaginator.Changer.prototype.isDraggable = function() {
  return this.draggable_;
};

/**
 * @param {boolean} drag
 */
npf.ui.pagePaginator.Changer.prototype.setDraggable = function(drag) {
  this.draggable_ = drag;

  if (!this.draggable_) {
    goog.dispose(this.dragger_);
    this.dragger_ = null;
  }
};

/**
 * @return {Element}
 */
npf.ui.pagePaginator.Changer.prototype.getElement = function() {
  return this.element_;
};

/**
 * @return {boolean}
 */
npf.ui.pagePaginator.Changer.prototype.isLoopback = function() {
  return this.loopback_;
};

/**
 * @param {boolean} enable
 */
npf.ui.pagePaginator.Changer.prototype.setLoopback = function(enable) {
  this.loopback_ = enable;
};

/**
 * @return {number}
 */
npf.ui.pagePaginator.Changer.prototype.getPageCount = function() {
  return this.pageCount_;
};

/**
 * @return {number}
 */
npf.ui.pagePaginator.Changer.prototype.getPageIndex = function() {
  return this.pageIndex_;
};

/**
 * @param {number} index
 * @protected
 */
npf.ui.pagePaginator.Changer.prototype.setPageIndexInternal = function(index) {
  this.pageIndex_ = index;
};

/**
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.reinitDragger_ = function() {
  goog.dispose(this.dragger_);

  /** @type {!goog.math.Rect} */
  var draggerLimits = new goog.math.Rect(-this.width_, 0, 2 * this.width_, 0);

  this.dragger_ = new npf.ui.pagePaginator.Dragger(
    this.getContentElement(), this.getElement(), draggerLimits);
  this.dragger_.listen(
    goog.fx.Dragger.EventType.START, this.onDragStart_, false, this);
  this.dragger_.listen(
    goog.fx.Dragger.EventType.DRAG, this.onDrag_, false, this);
  this.dragger_.listen(
    goog.fx.Dragger.EventType.END, this.onDragEnd_, false, this);

  /** @type {boolean} */
  var loopback = this.isLoopback();
  /** @type {number} */
  var pageCount = this.getPageCount();
  /** @type {number} */
  var pageIndex = this.getPageIndex();

  this.dragger_.setLeftLimit(!loopback && !pageIndex);
  this.dragger_.setRightLimit(!loopback && pageCount - 1 == pageIndex);
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onDragStart_ = function(evt) {
  /** @type {number} */
  var left = evt.left;

  this.dragStamps_ = [{
    time: goog.now(),
    x: left
  }];
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onDrag_ = function(evt) {
  /** @type {number} */
  var left = evt.left;

  if (1 < this.dragStamps_.length) {
    /** @type {number} */
    var x1 = this.dragStamps_[this.dragStamps_.length - 2].x;
    /** @type {number} */
    var x2 = this.dragStamps_[this.dragStamps_.length - 1].x;

    if (goog.math.sign(x2 - x1) != goog.math.sign(left - x2)) {
      this.dragStamps_ = [this.dragStamps_[this.dragStamps_.length - 1]];
    }
  }

  this.dragStamps_.push({
    time: goog.now(),
    x: left
  });

  if (!this.emptyElement_ && 10 < Math.abs(this.dragStamps_[0].x - left)) {
    this.emptyElement_ = this.domHelper_.createElement(goog.dom.TagName.DIV);
    goog.style.setStyle(this.emptyElement_, {
      'height': '100%',
      'left': '0px',
      'position': 'absolute',
      'top': '0px',
      'width': '100%'
    });
    goog.dom.appendChild(this.getElement(), this.emptyElement_);
  }
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onDragEnd_ = function(evt) {
  /** @type {number} */
  var firstLeft = this.dragStamps_[0] ? this.dragStamps_[0].x : 0;
  /** @type {number} */
  var firstTime = this.dragStamps_[0] ? this.dragStamps_[0].time : goog.now();
  /** @type {number} */
  var now = goog.now();
  /** @type {number} */
  var threshold = this.width_ / 2;
  /** @type {number} */
  var offset = parseInt(
    goog.style.getStyle(this.getContentElement(), 'left') || 0, 10);
  /** @type {number} */
  var animationDirection = 0;
  /** @type {number} */
  var flickDistance = offset - firstLeft;
  /** @type {number} */
  var flickDuration = now - firstTime;
  /** @type {number} */
  var pageCount = this.getPageCount();
  /** @type {number} */
  var pageIndex = this.getPageIndex();

  if (flickDuration > 0 && Math.abs(flickDistance) >= 10) {
    var velocity = flickDistance / flickDuration;

    if (Math.abs(velocity) >= 1) {
      if (velocity < 0 && (pageIndex < pageCount - 1 || this.isLoopback())) {
        animationDirection = -1;
      } else if (velocity > 0 && (pageIndex > 0 || this.isLoopback())) {
        animationDirection = 1;
      }
    }
  }

  if (!animationDirection) {
    if (
      (this.isLoopback() || pageIndex < pageCount - 1) &&
      offset < -threshold
    ) {
      animationDirection = -1;
    } else if (
      (this.isLoopback() || pageIndex > 0) &&
      offset > threshold
    ) {
      animationDirection = 1;
    }
  }

  this.dragStamps_ = null;

  if (animationDirection) {
    this.setPageIndexInternal(
      (pageCount + pageIndex - animationDirection) % pageCount);
    this.onPageChange(0 > animationDirection);

    if (this.draggable_) {
      this.reinitDragger_();
    }
  }

  goog.dispose(this.animation_);
  this.animation_ = null;

  goog.style.setStyle(this.getContentElement(), 'left', '');
  goog.dom.removeNode(this.emptyElement_);
  this.emptyElement_ = null;

  this.animateReturn_(offset - this.width_ * animationDirection);
};

/**
 * @param {number} fromX
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.animateReturn_ = function(fromX) {
  if (npf.fx.CssAnimation.isSupported()) {
    /** @type {!Object} */
    var fromProperties;
    /** @type {!Object} */
    var toProperties;

    if (goog.userAgent.MOBILE) {
      fromProperties = {
        'transform': 'translate(' + fromX + 'px,0px)'
      };
      toProperties = {
        'transform': 'translate(0px,0px)'
      };
    } else {
      fromProperties = {
        'left': fromX + 'px'
      };
      toProperties = {
        'left': '0px'
      };
    }

    this.animation_ = new npf.fx.KeyframeAnimation(this.getContentElement(),
      npf.ui.pagePaginator.Changer.DURATION, npf.fx.css3.easing.EASE_OUT);
    this.animation_.listen(npf.fx.cssAnimation.EventType.FINISH,
      this.onReturnAnimationFinish_, false, this);
    this.animation_.from(fromProperties);
    this.animation_.to(toProperties);
    this.animation_.play();
  } else {
    goog.style.setStyle(this.getContentElement(), 'left', 0);
  }
};

/**
 * @param {boolean} next
 */
npf.ui.pagePaginator.Changer.prototype.animatePage = function(next) {
  if (this.animation_) {
    this.queueNext_ = next;

    return;
  }

  /** @type {number} */
  var pageCount = this.getPageCount();
  /** @type {number} */
  var pageIndex = this.getPageIndex();

  if (
    (next && pageCount - 1 == pageIndex && !this.isLoopback()) ||
    (!next && !pageIndex && !this.isLoopback())
  ) {
    return;
  }

  if (next) {
    pageIndex++;
  } else {
    pageIndex--;
  }

  this.setPageIndexInternal((pageCount + pageIndex) % pageCount);

  if (npf.fx.CssAnimation.isSupported()) {
    /** @type {number} */
    var from = next ? this.width_ : -this.width_;
    /** @type {!Object} */
    var fromProperties;
    /** @type {!Object} */
    var toProperties;

    if (goog.userAgent.MOBILE) {
      fromProperties = {
        'transform': 'translate(' + from + 'px,0px)'
      };
      toProperties = {
        'transform': 'translate(0px,0px)'
      };
    } else {
      fromProperties = {
        'left': from + 'px'
      };
      toProperties = {
        'left': '0px'
      };
    }

    this.animation_ = new npf.fx.KeyframeAnimation(this.getContentElement(),
      npf.ui.pagePaginator.Changer.DURATION, [0.25, 0.1, 0.25, 1]);
    this.animation_.listen(npf.fx.cssAnimation.EventType.FINISH,
      this.onAnimationFinish_, false, this);
    this.animation_.from(fromProperties);
    this.animation_.to(toProperties);
    this.animation_.play();
  } else {
    goog.style.setStyle(this.getContentElement(), 'left', 0);
    this.release_();
  }

  this.onPageChange(next);
};

/**
 * @param {npf.fx.cssAnimation.Event} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onAnimationFinish_ = function(evt) {
  goog.dispose(this.animation_);
  this.animation_ = null;

  this.release_();

  goog.Timer.callOnce(function() {
    if (!this.isDisposed() && goog.isBoolean(this.queueNext_)) {
      /** @type {boolean} */
      var direction = this.queueNext_;
      this.queueNext_ = null;
      this.animatePage(direction);
    }
  }, 0, this);
};

/**
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.release_ = function() {
  if (this.draggable_) {
    this.reinitDragger_();
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onResize_ = function(evt) {
  this.update_();
};

/**
 * @param {npf.fx.cssAnimation.Event} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onReturnAnimationFinish_ = function(
    evt) {
  goog.dispose(this.animation_);
  this.animation_ = null;

  goog.Timer.callOnce(function() {
    if (!this.isDisposed() && goog.isBoolean(this.queueNext_)) {
      /** @type {boolean} */
      var direction = this.queueNext_;
      this.queueNext_ = null;
      this.animatePage(direction);
    }
  }, 0, this);
};

npf.ui.pagePaginator.Changer.prototype.update_ = function() {
  this.width_ = goog.style.getBorderBoxSize(this.getElement()).width;

  if (this.draggable_) {
    this.reinitDragger_();
  }
};

/**
 * @param {boolean} next
 * @protected
 */
npf.ui.pagePaginator.Changer.prototype.onPageChange = function(next) {
  var event = new npf.ui.pagePaginator.Changer.Event(
    npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE, this.getPageIndex(),
    next);
  this.dispatchEvent(event);
};


/**
 * @param {npf.ui.pagePaginator.Changer.EventType} type
 * @param {number} page
 * @param {boolean} next
 * @constructor
 * @extends {goog.events.Event}
 */
npf.ui.pagePaginator.Changer.Event = function(type, page, next) {
  goog.base(this, type);

  /**
   * @type {number}
   */
  this.page = page;

  /**
   * @type {boolean}
   */
  this.next = next;
};
goog.inherits(npf.ui.pagePaginator.Changer.Event, goog.events.Event);
