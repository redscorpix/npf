goog.provide('npf.ui.pagePaginator.Changer');
goog.provide('npf.ui.pagePaginator.Changer.EventType');

goog.require('goog.Timer');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.math');
goog.require('goog.math.Rect');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.userAgent');
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

  this.element_ = element;
  this.contentElement_ = contentElement;
  this.pageIndex_ = page;
  this.pageCount_ = pageCount;

  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
};
goog.inherits(npf.ui.pagePaginator.Changer, goog.events.EventTarget);


/**
 * @typedef {{
 *   time: number,
 *   x: number
 * }}
 */
npf.ui.pagePaginator.Changer.Stamp;

/**
 * @enum {string}
 */
npf.ui.pagePaginator.Changer.EventType = {
  /**
   * page (number)
   * next (boolean)
   */
  PAGE_CHANGE: goog.events.getUniqueId('pageChange')
};

/**
 * @type {number}
 * @const
 */
npf.ui.pagePaginator.Changer.DURATION = 500;

/**
 * @type {Element}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.element_;

/**
 * @type {Element}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.contentElement_;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.pageIndex_;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.pageCount_;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.handler_;

/**
 * @type {npf.ui.pagePaginator.Dragger}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.dragger_ = null;

/**
 * @type {?boolean}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.queueNext_ = null;

/**
 * @type {npf.fx.KeyframeAnimation}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.animation_ = null;

/**
 * @type {Array.<npf.ui.pagePaginator.Changer.Stamp>}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.dragStamps_ = null;

/**
 * @type {number}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.width_;

/**
 * @type {Element}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.emptyElement_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.draggable_ = true;

/**
 * @type {boolean}
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.ring_ = false;


/** @inheritDoc */
npf.ui.pagePaginator.Changer.prototype.disposeInternal = function() {
  goog.dispose(this.dragger_);
  goog.dispose(this.animation_);

  goog.base(this, 'disposeInternal');

  this.element_ = null;
  this.contentElement_ = null;
  this.handler_ = null;
  this.dragger_ = null;
  this.animation_ = null;
  this.dragStamps_ = null;
  this.emptyElement_ = null;
};

npf.ui.pagePaginator.Changer.prototype.init = function() {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = goog.dom.getDomHelper(this.element_);
  this.handler_
    .listen(domHelper.getWindow(), goog.events.EventType.RESIZE, this.onResize_);
  this.update_();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onResize_ = function(evt) {
  this.update_();
};

npf.ui.pagePaginator.Changer.prototype.update_ = function() {
  this.width_ = goog.style.getBorderBoxSize(this.element_).width;

  if (this.draggable_) {
    this.reinitDragger_();
  }
};

/**
 * @return {Element}
 */
npf.ui.pagePaginator.Changer.prototype.getElement = function() {
  return this.element_;
};

/**
 * @return {Element}
 */
npf.ui.pagePaginator.Changer.prototype.getContentElement = function() {
  return this.contentElement_;
};

/**
 * @return {number}
 */
npf.ui.pagePaginator.Changer.prototype.getPageIndex = function() {
  return this.pageIndex_;
};

/**
 * @return {number}
 */
npf.ui.pagePaginator.Changer.prototype.getPageCount = function() {
  return this.pageCount_;
};

/**
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.reinitDragger_ = function() {
  goog.dispose(this.dragger_);

  /** @type {!goog.math.Rect} */
  var draggerLimits = new goog.math.Rect(-this.width_, 0, 2 * this.width_, 0);

  this.dragger_ = new npf.ui.pagePaginator.Dragger(this.contentElement_,
    this.element_, draggerLimits);
  this.dragger_.addEventListener(goog.fx.Dragger.EventType.START,
    this.onDragStart_, false, this);
  this.dragger_.addEventListener(goog.fx.Dragger.EventType.DRAG,
    this.onDrag_, false, this);
  this.dragger_.addEventListener(goog.fx.Dragger.EventType.END,
    this.onDragEnd_, false, this);

  this.dragger_.setLeftLimit(!this.ring_ && !this.pageIndex_);
  this.dragger_.setRightLimit(
    !this.ring_ && this.pageCount_ - 1 == this.pageIndex_);
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
    this.emptyElement_ = goog.dom.getDomHelper(this.element_).createElement(
      goog.dom.TagName.DIV);
    goog.style.setStyle(this.emptyElement_, {
      'height': '100%',
      'left': '0px',
      'position': 'absolute',
      'top': '0px',
      'width': '100%'
    });
    goog.dom.appendChild(this.element_, this.emptyElement_);
  }
};

/**
 * @param {goog.fx.DragEvent} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onDragEnd_ = function(evt) {
  var firstLeft = this.dragStamps_[0] ? this.dragStamps_[0].x : 0;
  var firstTime = this.dragStamps_[0] ? this.dragStamps_[0].time : goog.now();
  var now = goog.now();
  var threshold = this.width_ / 2;
  var offset = parseInt(goog.style.getStyle(this.contentElement_, 'left') || 0, 10);
  var animationDirection = 0;
  var flickDistance = offset - firstLeft;
  var flickDuration = now - firstTime;

  if (flickDuration > 0 && Math.abs(flickDistance) >= 10) {
    var velocity = flickDistance / flickDuration;

    if (Math.abs(velocity) >= 1) {
      if (velocity < 0 && (this.pageIndex_ < this.pageCount_ - 1 || this.ring_)) {
        animationDirection = -1;
      } else if (velocity > 0 && (this.pageIndex_ > 0 || this.ring_)) {
        animationDirection = 1;
      }
    }
  }

  if (!animationDirection) {
    if (
      (this.ring_ || this.pageIndex_ < this.pageCount_ - 1) &&
      offset < -threshold
    ) {
      animationDirection = -1;
    } else if (
      (this.ring_ || this.pageIndex_ > 0) &&
      offset > threshold
    ) {
      animationDirection = 1;
    }
  }

  this.dragStamps_ = null;

  if (animationDirection) {
    this.pageIndex_ = (
      this.pageCount_ + this.pageIndex_ - animationDirection) % this.pageCount_;

    this.dispatchEvent({
      type: npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE,
      page: this.pageIndex_,
      next: 0 > animationDirection
    });

    if (this.draggable_) {
      this.reinitDragger_();
    }
  }

  goog.dispose(this.animation_);
  this.animation_ = null;

  goog.style.setStyle(this.contentElement_, 'left', '');
  goog.dom.removeNode(this.emptyElement_);
  this.emptyElement_ = null;

  this.animateReturn_(offset - this.width_ * animationDirection);
};

/**
 * @param {boolean} next
 */
npf.ui.pagePaginator.Changer.prototype.animatePage = function(next) {
  if (this.animation_) {
    this.queueNext_ = next;

    return;
  }

  if (
    (next && this.pageCount_ - 1 == this.pageIndex_ && !this.ring_) ||
    (!next && !this.pageIndex_ && !this.ring_)
  ) {
    return;
  }

  if (next) {
    this.pageIndex_++;
  } else {
    this.pageIndex_--;
  }

  this.pageIndex_ = (this.pageCount_ + this.pageIndex_) % this.pageCount_;

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

  this.dispatchEvent({
    type: npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE,
    page: this.pageIndex_,
    next: next
  });

  this.animation_ = new npf.fx.KeyframeAnimation(this.contentElement_,
    npf.ui.pagePaginator.Changer.DURATION, [0.25, 0.1, 0.25, 1]);
  this.animation_.addEventListener(npf.fx.cssAnimation.EventType.FINISH,
    this.onAnimationFinish_, false, this);
  this.animation_.from(fromProperties);
  this.animation_.to(toProperties);
  this.animation_.play();
};

/**
 * @param {npf.fx.cssAnimation.Event} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onAnimationFinish_ = function(evt) {
  goog.dispose(this.animation_);
  this.animation_ = null;

  if (this.draggable_) {
    this.reinitDragger_();
  }

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
 * @param {number} fromX
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.animateReturn_ = function(fromX) {
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

  this.animation_ = new npf.fx.KeyframeAnimation(this.contentElement_,
    npf.ui.pagePaginator.Changer.DURATION, npf.fx.css3.easing.EASE_OUT);
  this.animation_.addEventListener(npf.fx.cssAnimation.EventType.FINISH,
    this.onReturnAnimationFinish_, false, this);
  this.animation_.from(fromProperties);
  this.animation_.to(toProperties);
  this.animation_.play();
};

/**
 * @param {npf.fx.cssAnimation.Event} evt
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.onReturnAnimationFinish_ = function(evt) {
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
 * @return {boolean}
 */
npf.ui.pagePaginator.Changer.prototype.isRing = function() {
  return this.ring_;
};

/**
 * @param {boolean} enable
 */
npf.ui.pagePaginator.Changer.prototype.setRing = function(enable) {
  this.ring_ = enable;
};
