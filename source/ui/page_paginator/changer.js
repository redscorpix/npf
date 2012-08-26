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
goog.require('npf.userAgent.support');
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

  this.handler_ = new goog.events.EventHandler();
  this.registerDisposable(this.handler_);

  this.handler_.listen(window, goog.events.EventType.RESIZE,
    this.onResize_, false, this);

  this.update_();
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
 * @type {!goog.events.EventHandler}
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


/** @inheritDoc */
npf.ui.pagePaginator.Changer.prototype.disposeInternal = function() {
  goog.dispose(this.dragger_);
  goog.dispose(this.animation_);

  goog.base(this, 'disposeInternal');

  delete this.element_;
  delete this.contentElement_;
  delete this.pageIndex_;
  delete this.pageCount_;
  delete this.dragger_;
  delete this.queueNext_;
  delete this.animation_;
  delete this.dragStamps_;
  delete this.width_;
  delete this.emptyElement_;
  delete this.draggable_;
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

  if (!this.pageIndex_) {
    this.dragger_.setLeftLimit(true);
  }

  if (this.pageCount_ - 1 == this.pageIndex_) {
    this.dragger_.setRightLimit(true);
  }
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
    this.emptyElement_ = goog.dom.createElement(goog.dom.TagName.DIV);
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
  /** @type {number} */
  var direction = 0;
  /** @type {number} */
  var pointCount = this.dragStamps_.length;
  /** @type {Array.<number>} */
  var timing = null;

  if (2 < pointCount) {
    // По двум последним точкам с помощью уравнения прямой узнаем, остановил ли пользователь анимацию.

    /** @type {number} */
    var x1 = this.dragStamps_[pointCount - 2].time -
      this.dragStamps_[pointCount - 3].time;
    /** @type {number} */
    var y1 = Math.abs(this.dragStamps_[pointCount - 2].x -
      this.dragStamps_[pointCount - 3].x);
    /** @type {number} */
    var x2 = this.dragStamps_[pointCount - 1].time -
      this.dragStamps_[pointCount - 2].time;
    /** @type {number} */
    var y2 = Math.abs(this.dragStamps_[pointCount - 1].x -
      this.dragStamps_[pointCount - 2].x);
    /**
     * timestamp при y3 = 0
     * @type {number}
     */
    var x3 = y1 - y2 ? (x2 * y1 - x1 * y2) / (y1 - y2) : 0;

    if (10 < x3) {
      direction = 0 < this.dragStamps_[pointCount - 1].x -
        this.dragStamps_[pointCount - 2].x ? 1 : -1;
      timing = [0, 0, 0, 1];
    }
  }

  this.dragStamps_ = null;

  /** @type {number} */
  var left = parseInt(goog.style.getStyle(this.contentElement_, 'left'), 10);
  /** @type {number} */
  var pageIndex = this.pageIndex_;

  if (
    this.pageCount_ - 1 > this.pageIndex_ &&
    (
      (left < -this.width_ / 2 && 0 >= direction) ||
      (left < this.width_ / 2 && 0 > direction)
    )
  ) {
    pageIndex++;
    left += this.width_;
  } else if (
    this.pageIndex_ &&
    (
      (left > this.width_ / 2 && 0 <= direction) ||
      (left > -this.width_ / 2 && 0 < direction)
    )
  ) {
    pageIndex--;
    left -= this.width_;
  }

  if (this.pageIndex_ != pageIndex) {
    this.pageIndex_ = pageIndex;

    this.dispatchEvent({
      type: npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE,
      page: this.pageIndex_
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

  this.animateReturn_(left, direction ? timing : null);
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
    (next && this.pageCount_ - 1 == this.pageIndex_) ||
    (!next && !this.pageIndex_)
  ) {
    return;
  }

  if (next) {
    this.pageIndex_++;
  } else {
    this.pageIndex_--;
  }

  /** @type {number} */
  var from = next ? this.width_ : -this.width_;
  /** @type {!Object} */
  var fromProperties;
  /** @type {!Object} */
  var toProperties;

  if (goog.userAgent.MOBILE) {
    /** @type {string} */
    var transformCss = npf.userAgent.support.getCssPropertyName('transform');

    fromProperties = goog.object.create(
      transformCss, 'translate(' + from + 'px,0px)'
    );
    toProperties = goog.object.create(
      transformCss, 'translate(0px,0px)'
    );
  } else {
    fromProperties = goog.object.create(
      'left', from + 'px'
    );
    toProperties = goog.object.create(
      'left', '0px'
    );
  }

  this.dispatchEvent({
    type: npf.ui.pagePaginator.Changer.EventType.PAGE_CHANGE,
    page: this.pageIndex_
  });

  this.animation_ = new npf.fx.KeyframeAnimation(this.contentElement_,
    npf.ui.pagePaginator.Changer.DURATION, [0.25, 0.1, 0.25, 1]);
  this.animation_.addEventListener(npf.fx.keyframeAnimation.EventType.FINISH,
    this.onAnimationFinish_, false, this);
  this.animation_.from(fromProperties);
  this.animation_.to(toProperties);
  this.animation_.play();
};

/**
 * @param {npf.fx.keyframeAnimation.Event} evt
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
 * @param {Array.<number>=} opt_timing
 * @private
 */
npf.ui.pagePaginator.Changer.prototype.animateReturn_ = function(fromX,
                                                                 opt_timing) {
  /** @type {!Array.<number>} */
  var timing = opt_timing || [0.25, 0.1, 0.25, 1];
  /** @type {!Object} */
  var fromProperties;
  /** @type {!Object} */
  var toProperties;

  if (goog.userAgent.MOBILE) {
    /** @type {string} */
    var transformCss = npf.userAgent.support.getCssPropertyName('transform');

    fromProperties = goog.object.create(
      transformCss, 'translate(' + fromX + 'px,0px)'
    );
    toProperties = goog.object.create(
      transformCss, 'translate(0px,0px)'
    );
  } else {
    fromProperties = goog.object.create(
      'left', fromX + 'px'
    );
    toProperties = goog.object.create(
      'left', '0px'
    );
  }

  this.animation_ = new npf.fx.KeyframeAnimation(this.contentElement_,
    npf.ui.pagePaginator.Changer.DURATION, timing);
  this.animation_.addEventListener(npf.fx.keyframeAnimation.EventType.FINISH,
    this.onReturnAnimationFinish_, false, this);
  this.animation_.from(fromProperties);
  this.animation_.to(toProperties);
  this.animation_.play();
};

/**
 * @param {npf.fx.keyframeAnimation.Event} evt
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
