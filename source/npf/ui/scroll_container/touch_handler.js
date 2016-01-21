goog.provide('npf.ui.scrollContainer.TouchHandler');
goog.provide('npf.ui.scrollContainer.TouchHandler.EventType');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.math.Coordinate');
goog.require('goog.style.transform');
goog.require('npf.userAgent.css');


/**
 * @param {!Element} element
 * @param {!Element} contentElement
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.scrollContainer.TouchHandler = function(element, contentElement) {
  npf.ui.scrollContainer.TouchHandler.base(this, 'constructor');

  /**
   * @private {boolean}
   */
  this._animating = false;

  /**
   * @type {boolean}
   */
  this.bindToWrapper = false;

  /**
   * @type {boolean}
   */
  this.bounce = true;

  /**
   * @type {function(number):number}
   */
  this.bounceEasing = npf.ui.scrollContainer.TouchHandler.easing.circular;

  /**
   * @type {number}
   */
  this.bounceTime = npf.ui.scrollContainer.TouchHandler.BOUNCE_TIME;

  /**
   * @private {Element}
   */
  this._contentElement = contentElement;

  /**
   * @private {number}
   */
  this._contentHeight = 0;

  /**
   * @private {number}
   */
  this._contentWidth = 0;

  /**
   * @type {number}
   */
  this.deceleration = npf.ui.scrollContainer.TouchHandler.DECELERATION;

  /**
   * @type {number}
   */
  this.directionLockThreshold =
    npf.ui.scrollContainer.TouchHandler.DIRECTION_LOCK_THRESHOLD;

  /**
   * @private {npf.ui.scrollContainer.TouchHandler.DirectionLocked?}
   */
  this._directionLocked = null;

  /**
   * @private {number}
   */
  this._distX = 0;

  /**
   * @private {number}
   */
  this._distY = 0;

  /**
   * @private {Element}
   */
  this._element = element;

  /**
   * @private {boolean}
   */
  this._enabled = false;

  /**
   * @private {number}
   */
  this._endTime = 0;

  /**
   * @type {npf.ui.scrollContainer.TouchHandler.EventPassthrough?}
   */
  this.eventPassthrough = null;

  /**
   * @private {boolean}
   */
  this.freeScroll = false;

  /**
   * @private {goog.events.EventHandler<!npf.ui.scrollContainer.TouchHandler>}
   */
  this._handler = new goog.events.EventHandler(this);

  /**
   * @private {boolean}
   */
  this._hasHorizontalScroll = false;

  /**
   * @private {boolean}
   */
  this._hasVerticalScroll = false;

  /**
   * @private {number}
   */
  this._height = 0;

  /**
   * @private {number}
   */
  this._left = 0;

  /**
   * @private {number}
   */
  this._maxScrollX = 0;

  /**
   * @private {number}
   */
  this._maxScrollY = 0;

  /**
   * @type {boolean}
   */
  this.momentum = true;

  /**
   * @private {boolean}
   */
  this._moved = false;

  /**
   * @private {number}
   */
  this._pointX = 0;

  /**
   * @private {number}
   */
  this._pointY = 0;

  /**
   * @type {boolean}
   */
  this.preventDefault = false;

  /**
   * @type {boolean}
   */
  this.scrollX = false;

  /**
   * @type {boolean}
   */
  this.scrollY = true;

  /**
   * @private {number}
   */
  this._startTime = 0;

  /**
   * @private {number}
   */
  this._startX = 0;

  /**
   * @private {number}
   */
  this._startY = 0;

  /**
   * @private {number}
   */
  this._top = 0;

  /**
   * @private {boolean}
   */
  this._touch = false;

  /**
   * @private {number}
   */
  this._width = 0;
};
goog.inherits(npf.ui.scrollContainer.TouchHandler, goog.events.EventTarget);


/**
 * @const {number}
 */
npf.ui.scrollContainer.TouchHandler.BOUNCE_TIME = 600;

/**
 * @const {number}
 */
npf.ui.scrollContainer.TouchHandler.DECELERATION = 0.0006;

/**
 * @const {number}
 */
npf.ui.scrollContainer.TouchHandler.DIRECTION_LOCK_THRESHOLD = 600;

/**
 * @enum {number}
 */
npf.ui.scrollContainer.TouchHandler.DirectionLocked = {
  NONE: 1,
  HORIZONTAL: 2,
  VERTICAL: 3
};

/**
 * @enum {string}
 */
npf.ui.scrollContainer.TouchHandler.EventPassthrough = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};

/**
 * @enum {string}
 */
npf.ui.scrollContainer.TouchHandler.EventType = {
  BEFORE_SCROLL_START: goog.events.getUniqueId('beforeScrollStart'),
  SCROLL: goog.events.getUniqueId('scroll'),
  SCROLL_CANCEL: goog.events.getUniqueId('scrollCancel'),
  SCROLL_END: goog.events.getUniqueId('scrollEnd'),
  SCROLL_START: goog.events.getUniqueId('scrollStart')
};

/**
 * @private {function(function())}
 */
npf.ui.scrollContainer.TouchHandler._raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

/**
 * @type {!Object<function(number):number>}
 */
npf.ui.scrollContainer.TouchHandler.easing = {
  back: function(k) {
    var b = 4;

    return (k = k - 1) * k * ((b + 1) * k + b) + 1;
  },
  bounce: function(k) {
    if ((k /= 1) < (1 / 2.75)) {
      return 7.5625 * k * k;
    } else if (k < (2 / 2.75)) {
      return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
    } else if (k < (2.5 / 2.75)) {
      return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
    } else {
      return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
    }
  },
  circular: function(k) {
    return Math.sqrt(1 - (--k * k));
  },
  elastic: function(k) {
    if (0 === k || 1 === k) {
      return k;
    }

    var f = 0.22;
    var e = 0.4;

    return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) *
      (2 * Math.PI) / f) + 1;
  },
  quadratic: function(k) {
    return k * (2 - k);
  }
};

/**
 * This should find all Android browsers lower than build 535.19
 * (both stock browser and webview)
 * @private {boolean}
 */
npf.ui.scrollContainer.TouchHandler._isBadAndroid =
  /Android /.test(window.navigator.appVersion) &&
  !(/Chrome\/\d/.test(window.navigator.appVersion));

/**
 * @param {Node} el
 * @return {boolean}
 * @private
 */
npf.ui.scrollContainer.TouchHandler._preventDefaultException = function(el) {
  return /^(INPUT|TEXTAREA|BUTTON|SELECT)$/.test(el.tagName);
};

/**
 * @param {number} current
 * @param {number} start
 * @param {number} time
 * @param {number} lowerMargin
 * @param {number} wrapperSize
 * @param {number} deceleration
 * @return {{destination:number,duration:number}}
 * @private
 */
npf.ui.scrollContainer.TouchHandler._momentum = function(current, start, time,
    lowerMargin, wrapperSize, deceleration) {
  /** @type {number} */
  var distance = current - start;
  /** @type {number} */
  var speed = Math.abs(distance) / time;
  /** @type {number} */
  var destination = current +
    (speed * speed) / (2 * deceleration) * (0 > distance ? -1 : 1);
  /** @type {number} */
  var duration = speed / deceleration;

  if (destination < lowerMargin) {
    destination = wrapperSize ?
      lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
    distance = Math.abs(destination - current);
    duration = distance / speed;
  } else if (0 < destination) {
    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
    distance = Math.abs(current) + destination;
    duration = distance / speed;
  }

  return {
    destination: Math.round(destination),
    duration: duration
  };
};


/** @inheritDoc */
npf.ui.scrollContainer.TouchHandler.prototype.disposeInternal = function() {
  this._handler.dispose();

  npf.ui.scrollContainer.TouchHandler.base(this, 'disposeInternal');

  this._contentElement = null;
  this._element = null;
  this._handler = null;
};

/**
 * @param {number} destX
 * @param {number} destY
 * @param {number=} opt_duration
 * @param {(function(number):number)=} opt_easingFn
 * @private
 */
npf.ui.scrollContainer.TouchHandler.prototype._animate = function(destX, destY,
    opt_duration, opt_easingFn) {
  if (opt_duration && opt_easingFn) {
    var that = this;
    /** @type {number} */
    var startX = this._left;
    /** @type {number} */
    var startY = this._top;
    /** @type {number} */
    var startTime = goog.now();
    /** @type {number} */
    var destTime = startTime + opt_duration;

    var step = function() {
      /** @type {number} */
      var now = goog.now();

      if (now < destTime) {
        /** @type {number} */
        var easing = opt_easingFn((now - startTime) / opt_duration);
        /** @type {number} */
        var newX = (destX - startX) * easing + startX;
        /** @type {number} */
        var newY = (destY - startY) * easing + startY;
        that._translate(newX, newY);

        if (that._animating) {
          npf.ui.scrollContainer.TouchHandler._raf.call(goog.global, step);
        }
      } else {
        that._animating = false;
        that._translate(destX, destY);

        if (!that.resetPosition(that.bounceTime)) {
          that.dispatchEvent(
            npf.ui.scrollContainer.TouchHandler.EventType.SCROLL_END);
        }
      }
    };

    this._animating = true;
    step();
  } else {
    this._translate(destX, destY);
  }
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number=} opt_time
 * @param {(function(number):number)=} opt_easing
 */
npf.ui.scrollContainer.TouchHandler.prototype.scrollBy = function(x, y,
    opt_time, opt_easing) {
  this.scrollTo(this._left + x, this._top + y, opt_time, opt_easing);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number=} opt_time
 * @param {(function(number):number)=} opt_easing
 * @return {boolean}
 */
npf.ui.scrollContainer.TouchHandler.prototype.scrollTo = function(x, y,
    opt_time, opt_easing) {
  x = Math.round(x);
  y = Math.round(y);

  if (this._left != x || this._top != y) {
    /** @type {function(number):number} */
    var easing = opt_easing ||
      npf.ui.scrollContainer.TouchHandler.easing.circular;
    /** @type {number} */
    var time = opt_time || 0;
    this._animate(x, y, time, easing);

    return true;
  }

  return false;
};

/**
 * @param {number} x
 * @param {number} y
 */
npf.ui.scrollContainer.TouchHandler.prototype.forceScrollTo = function(x, y) {
  this._animate(x, y);
};

/**
 * @param {number} x
 * @param {number} y
 * @private
 */
npf.ui.scrollContainer.TouchHandler.prototype._translate = function(x, y) {
  if (npf.userAgent.css.isTransformSupported()) {
    goog.style.transform.setTranslation(this._contentElement, x, y);
  } else {
    x = Math.round(x);
    y = Math.round(y);
    this._contentElement.style.left = x + 'px';
    this._contentElement.style.top = y + 'px';
  }

  this._setPosition(x, y);
};

/**
 * @return {boolean}
 */
npf.ui.scrollContainer.TouchHandler.prototype.isEnabled = function() {
  return this._enabled;
};

/**
 * @param {boolean} enable
 */
npf.ui.scrollContainer.TouchHandler.prototype.setEnabled = function(enable) {
  if (this._enabled != enable) {
    this._enabled = enable;

    if (enable) {
      /** @type {!Window} */
      var win = goog.dom.getWindow(goog.dom.getOwnerDocument(this._element));
      var target = this.bindToWrapper ? this._element : win;

      this._handler.
        listen(this._element, goog.events.EventType.TOUCHSTART, this).
        listen(target, goog.events.EventType.TOUCHMOVE, this).
        listen(target, goog.events.EventType.TOUCHCANCEL, this).
        listen(target, goog.events.EventType.TOUCHEND, this);
    } else {
      this._handler.removeAll();
    }
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 */
npf.ui.scrollContainer.TouchHandler.prototype.handleEvent = function(evt) {
  switch (evt.type) {
    case goog.events.EventType.TOUCHSTART:
      this._onStart(evt);
      break;
    case goog.events.EventType.TOUCHMOVE:
      this._onMove(evt);
      break;
    case goog.events.EventType.TOUCHCANCEL:
    case goog.events.EventType.TOUCHEND:
      this._onEnd(evt);
      break;
  }
};

/**
 * @return {!goog.math.Coordinate}
 */
npf.ui.scrollContainer.TouchHandler.prototype.getPosition = function() {
  return new goog.math.Coordinate(
    Math.round(this._left), Math.round(this._top));
};

/**
 * @param {number} left
 * @param {number} top
 * @private
 */
npf.ui.scrollContainer.TouchHandler.prototype._setPosition = function(left,
    top) {
  left = Math.round(left);
  top = Math.round(top);

  if (this._left != left || this._top != top) {
    this._left = left;
    this._top = top;
    this.dispatchEvent(npf.ui.scrollContainer.TouchHandler.EventType.SCROLL);
  }
};

/**
 * @param {number=} opt_time
 * @return {boolean}
 */
npf.ui.scrollContainer.TouchHandler.prototype.resetPosition = function(
    opt_time) {
  /** @type {number} */
  var x = this._hasHorizontalScroll && 0 >= this._left ?
    Math.max(this._maxScrollX, this._left) : 0;
  /** @type {number} */
  var y = this._hasVerticalScroll && 0 >= this._top ?
    Math.max(this._maxScrollY, this._top) : 0;

  return this.scrollTo(x, y, opt_time, this.bounceEasing);
};

/**
 * @param {!goog.math.Size} size
 * @param {!goog.math.Size} scrollElementSize
 */
npf.ui.scrollContainer.TouchHandler.prototype.setSizes = function(size,
    scrollElementSize) {
  if (
    size.width == this._width &&
    size.height == this._height &&
    scrollElementSize.width == this._contentWidth &&
    scrollElementSize.height == this._contentHeight
  ) {
    return;
  }

  this._width  = size.width;
  this._height = size.height;

  this._contentWidth  = scrollElementSize.width;
  this._contentHeight = scrollElementSize.height;

  this._maxScrollX = this._width - this._contentWidth;
  this._maxScrollY = this._height - this._contentHeight;

  var EventPassthrough = npf.ui.scrollContainer.TouchHandler.EventPassthrough;

  this._hasHorizontalScroll =
    EventPassthrough.HORIZONTAL !== this.eventPassthrough &&
    this.scrollX && 0 > this._maxScrollX;
  this._hasVerticalScroll =
    EventPassthrough.VERTICAL !== this.eventPassthrough &&
    this.scrollY && 0 > this._maxScrollY;

  if (!this._hasHorizontalScroll) {
    this._maxScrollX = 0;
    this._contentWidth = this._width;
  }

  if (!this._hasVerticalScroll) {
    this._maxScrollY = 0;
    this._contentHeight = this._height;
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollContainer.TouchHandler.prototype._onEnd = function(evt) {
  if (!this._touch) {
    return;
  }

  this._touch = false;
  this._endTime = goog.now();

  if (
    this.preventDefault &&
    !this.eventPassthrough &&
    !npf.ui.scrollContainer.TouchHandler._preventDefaultException(evt.target)
  ) {
    evt.preventDefault();
  }

  // reset if we are outside of the boundaries
  if (this.resetPosition(this.bounceTime)) {
    return;
  }

  /** @type {number} */
  var duration = goog.now() - this._startTime;
  /** @type {number} */
  var newX = Math.round(this._left);
  /** @type {number} */
  var newY = Math.round(this._top);
  /** @type {number} */
  var distanceX = Math.abs(newX - this._startX);
  /** @type {number} */
  var distanceY = Math.abs(newY - this._startY);
  /** @type {number} */
  var time = 0;
  /** @type {(function(number):number)?} */
  var easing = null;

  this.scrollTo(newX, newY);  // ensures that the last position is rounded

  // we scrolled less than 10 pixels
  if (!this._moved) {
    this.dispatchEvent(
      npf.ui.scrollContainer.TouchHandler.EventType.SCROLL_CANCEL);
    return;
  }

  // start momentum animation if needed
  if (this.momentum && 300 > duration) {
    /** @type {number} */
    var durationX = 0;
    /** @type {number} */
    var durationY = 0;

    if (this._hasHorizontalScroll) {
      /** @type {number} */
      var wrapperWidth = this.bounce ? this._width : 0;
      var momentumX = npf.ui.scrollContainer.TouchHandler._momentum(
        this._left, this._startX, duration, this._maxScrollX, wrapperWidth,
        this.deceleration);
      newX = momentumX.destination;
      durationX = momentumX.duration;
    }

    if (this._hasVerticalScroll) {
      /** @type {number} */
      var wrapperHeight = this.bounce ? this._height : 0;
      var momentumY = npf.ui.scrollContainer.TouchHandler._momentum(
        this._top, this._startY, duration, this._maxScrollY, wrapperHeight,
        this.deceleration);
      newY = momentumY.destination;
      durationY = momentumY.duration;
    }

    time = Math.max(durationX, durationY);
  }

  if (newX == this._left && newY == this._top) {
    this.dispatchEvent(
      npf.ui.scrollContainer.TouchHandler.EventType.SCROLL_END);
  } else {
    // change easing function when scroller goes out of the boundaries
    if (
      0 < newX || newX < this._maxScrollX || 0 < newY || newY < this._maxScrollY
    ) {
      easing = npf.ui.scrollContainer.TouchHandler.easing.quadratic;
    }

    this.scrollTo(newX, newY, time, easing);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollContainer.TouchHandler.prototype._onMove = function(evt) {
  if (!this._touch) {
    return;
  }

  if (this.preventDefault || !this.eventPassthrough) {
    // increases performance on Android? TODO: check!
    evt.preventDefault();
  }

  /** @type {Event} */
  var nativeEvent = evt.getBrowserEvent();
  var point = nativeEvent['touches'] ? nativeEvent['touches'][0] : nativeEvent;
  var pageX = /** @type {number} */ (point['pageX']);
  var pageY = /** @type {number} */ (point['pageY']);
  /** @type {number} */
  var deltaX = pageX - this._pointX;
  /** @type {number} */
  var deltaY = pageY - this._pointY;
  /** @type {number} */
  var timestamp = goog.now();

  this._pointX = pageX;
  this._pointY = pageY;
  this._distX += deltaX;
  this._distY += deltaY;

  /** @type {number} */
  var absDistX = Math.abs(this._distX);
  /** @type {number} */
  var absDistY = Math.abs(this._distY);

  // We need to move at least 10 pixels for the scrolling to initiate
  if (timestamp - 300 < this._endTime && (10 > absDistX && 10 > absDistY)) {
    return;
  }

  // If you are scrolling in one direction lock the other
  if (!this._directionLocked && (!this.freeScroll || this.eventPassthrough)) {
    /** @type {number} */
    var directionLockThreshold = this.eventPassthrough ?
      0 : this.directionLockThreshold;
    var EventPassthrough = npf.ui.scrollContainer.TouchHandler.EventPassthrough;
    var DirectionLocked = npf.ui.scrollContainer.TouchHandler.DirectionLocked;

    if (absDistX > absDistY + directionLockThreshold) {
      this._directionLocked = DirectionLocked.HORIZONTAL;

      if (EventPassthrough.VERTICAL == this.eventPassthrough) {
        evt.preventDefault();
      } else if (EventPassthrough.HORIZONTAL == this.eventPassthrough) {
        this._touch = false;
        return;
      }

      deltaY = 0;
    } else if (absDistY >= absDistX + directionLockThreshold) {
      this._directionLocked = DirectionLocked.VERTICAL;

      if (EventPassthrough.HORIZONTAL == this.eventPassthrough) {
        evt.preventDefault();
      } else if (EventPassthrough.VERTICAL == this.eventPassthrough) {
        this._touch = false;
        return;
      }

      deltaX = 0;
    } else {
      this._directionLocked = DirectionLocked.NONE;
    }
  }

  deltaX = this._hasHorizontalScroll ? deltaX : 0;
  deltaY = this._hasVerticalScroll ? deltaY : 0;

  /** @type {number} */
  var newX = this._left + deltaX;
  /** @type {number} */
  var newY = this._top + deltaY;

  // Slow down if outside of the boundaries
  if (0 < newX || newX < this._maxScrollX) {
    newX = this.bounce ?
      this._left + deltaX / 3 : 0 < newX ? 0 : this._maxScrollX;
  }

  if (0 < newY || newY < this._maxScrollY) {
    newY = this.bounce ?
      this._top + deltaY / 3 : 0 < newY ? 0 : this._maxScrollY;
  }

  if (!this._moved) {
    this.dispatchEvent(
      npf.ui.scrollContainer.TouchHandler.EventType.SCROLL_START);

    this._moved = true;
  }

  this._translate(newX, newY);

  if (300 < timestamp - this._startTime) {
    this._startTime = timestamp;
    this._startX = this._left;
    this._startY = this._top;
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.scrollContainer.TouchHandler.prototype._onStart = function(evt) {
  if (
    this.preventDefault &&
    !this.eventPassthrough &&
    !npf.ui.scrollContainer.TouchHandler._isBadAndroid &&
    !npf.ui.scrollContainer.TouchHandler._preventDefaultException(evt.target)
  ) {
    evt.preventDefault();
  }

  /** @type {Event} */
  var nativeEvent = evt.getBrowserEvent();
  var point = nativeEvent['touches'] ? nativeEvent['touches'][0] : nativeEvent;

  this._touch = true;
  this._moved = false;
  this._distX = 0;
  this._distY = 0;
  this._directionLocked = null;

  this._startTime = goog.now();

  if (this._animating ) {
    this._animating = false;
    this.dispatchEvent(
      npf.ui.scrollContainer.TouchHandler.EventType.SCROLL_END);
  }

  this._startX = this._left;
  this._startY = this._top;
  this._pointX = /** @type {number} */ (point['pageX']);
  this._pointY = /** @type {number} */ (point['pageY']);

  this.dispatchEvent(
    npf.ui.scrollContainer.TouchHandler.EventType.BEFORE_SCROLL_START);
};
