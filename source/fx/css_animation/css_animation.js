goog.provide('npf.fx.CssAnimation');
goog.provide('npf.fx.CssAnimation.PreferredTimingFunction');

goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.fx.Transition');
goog.require('goog.fx.TransitionBase');
goog.require('goog.style');
goog.require('npf.fx.Animation');
goog.require('npf.fx.css3.easing');
goog.require('npf.fx.cssAnimation.Keyframes');
goog.require('npf.fx.cssAnimation.Event');
goog.require('npf.fx.cssAnimation.EventType');
goog.require('npf.style.animation');
goog.require('npf.userAgent.Support');
goog.require('npf.userAgent.support');


/**
* @param {npf.fx.cssAnimation.Keyframes} keyframes
 * @param {Element} element
 * @param {number} duration in ms
 * @param {Array.<number>=} opt_acc defaults to npf.fx.css3.easing.LINEAR
 * @constructor
 * @implements {goog.fx.Transition}
 * @extends {goog.fx.TransitionBase}
 */
npf.fx.CssAnimation = function(keyframes, element, duration, opt_acc) {
  goog.base(this);

  this.keyframes_ = keyframes;
  this.element = element;
  this.duration = duration;
  this.accel_ = opt_acc || npf.fx.css3.easing.LINEAR;

  this.handler_ = new goog.events.EventHandler();
  this.registerDisposable(this.handler_);
};
goog.inherits(npf.fx.CssAnimation, goog.fx.TransitionBase);


/**
 * @enum {Array.<number>}
 */
npf.fx.CssAnimation.PreferredTimingFunction = {
  EASE: [0.25, 0.1, 0.25, 1],
  LINEAR: [0, 0, 1, 1],
  EASE_IN: [0.42, 0, 1, 1],
  EASE_OUT: [0, 0, 0.58, 1],
  EASE_IN_OUT: [0.42, 0, 0.58, 1]
};

/**
 * @return {boolean}
 */
npf.fx.CssAnimation.isSupported = function() {
  /** @type {boolean} */
  var supported = npf.userAgent.support.isCssAnimationSupported();

  return supported && npf.fx.Animation.enabled;
};


/**
 * @type {npf.fx.cssAnimation.Keyframes}
 * @private
 */
npf.fx.CssAnimation.prototype.keyframes_;

/**
 * @type {Element}
 * @protected
 */
npf.fx.CssAnimation.prototype.element;

/**
 * @type {number}
 * @protected
 */
npf.fx.CssAnimation.prototype.duration;

/**
 * @type {Array.<number>}
 * @private
 */
npf.fx.CssAnimation.prototype.accel_;

/**
 * @type {number}
 * @private
 */
npf.fx.CssAnimation.prototype.delay_ = 0;

/**
 * 0 — infinite.
 * @type {number}
 * @private
 */
npf.fx.CssAnimation.prototype.iterationCount_ = 1;

/**
 * @type {npf.style.animation.Direction}
 * @private
 */
npf.fx.CssAnimation.prototype.direction_ =
  npf.style.animation.Direction.NORMAL;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.fx.CssAnimation.prototype.handler_;

/**
 * @type {boolean}
 * @private
 */
npf.fx.CssAnimation.prototype.domSet_ = false;

/**
 * @type {boolean}
 * @private
 */
npf.fx.CssAnimation.prototype.cleared_ = true;

/**
 * @type {npf.style.animation.PlayState}
 * @private
 */
npf.fx.CssAnimation.prototype.playState_ =
  npf.style.animation.PlayState.PAUSED;

/**
 * @type {boolean}
 * @private
 */
npf.fx.CssAnimation.prototype.finished_ = false;

/**
 * @type {boolean}
 * @private
 */
npf.fx.CssAnimation.prototype.endStylesUsed_ = false;


/** @inheritDoc */
npf.fx.CssAnimation.prototype.disposeInternal = function() {
  if (!this.isStopped()) {
    this.stop(false);
  }

  goog.base(this, 'disposeInternal');

  delete this.keyframes_;
  delete this.element;
  delete this.duration;
  delete this.accel_;
  delete this.delay_;
  delete this.iterationCount_;
  delete this.direction_;
  delete this.handler_;
  delete this.domSet_;
  delete this.cleared_;
  delete this.playState_;
  delete this.finished_;
  delete this.endStylesUsed_;
};

/**
 * @return {npf.fx.cssAnimation.Keyframes}
 */
npf.fx.CssAnimation.prototype.getKeyframes = function() {
  return this.keyframes_;
};

/**
 * @return {Element}
 */
npf.fx.CssAnimation.prototype.getElement = function() {
  return this.element;
};

/**
 * @return {npf.style.animation.PlayState}
 */
npf.fx.CssAnimation.prototype.getState = function() {
  return this.playState_;
};

/**
 * @return {number} 0 — infinite
 */
npf.fx.CssAnimation.prototype.getIterationCount = function() {
  return this.iterationCount_;
};

/**
 * @param {number} count 0 — infinite
 */
npf.fx.CssAnimation.prototype.setIterationCount = function(count) {
  this.iterationCount_ = count;
};

/**
 * @return {number} in ms
 */
npf.fx.CssAnimation.prototype.getDuration = function() {
  return this.duration;
};

/**
 * @param {number} duration in ms
 */
npf.fx.CssAnimation.prototype.setDuration = function(duration) {
  this.duration = duration;
};

/**
 * @return {number} in ms
 */
npf.fx.CssAnimation.prototype.getDelay = function() {
  return this.delay_;
};

/**
 * @param {number} delay in ms
 */
npf.fx.CssAnimation.prototype.setDelay = function(delay) {
  this.delay_ = delay;
};

/**
 * @return {npf.style.animation.Direction}
 */
npf.fx.CssAnimation.prototype.getDirection = function() {
  return this.direction_;
};

/**
 * @param {npf.style.animation.Direction} direction
 */
npf.fx.CssAnimation.prototype.setDirection = function(direction) {
  this.direction_ = direction;
};

/**
 * @return {Array.<number>}
 */
npf.fx.CssAnimation.prototype.getAccel = function() {
  return this.accel_;
};

/**
 * @param {boolean=} opt_restart
 * @return {boolean}
 */
npf.fx.CssAnimation.prototype.play = function(opt_restart) {
  if (opt_restart || this.isStopped()) {
    this.cleared_ = true;

    if (this.domSet_) {
      this.clearDom();
    }
  } else if (this.isPlaying()) {
    return false;
  }

  this.finished_ = false;

  if (this.cleared_) {
    this.onBegin();
  }

  this.onPlay();

  if (this.isPaused()) {
    this.onResume();
  }

  if (this.cleared_) {
    this.cleared_ = false;
    this.setDom();
  } else {
    this.playState_ = npf.style.animation.PlayState.RUNNING;
    this.setAnimationPlayState_(this.playState_);
  }

  this.setStatePlaying();

  return true;
};

/**
 * @protected
 */
npf.fx.CssAnimation.prototype.setDom = function() {
  this.domSet_ = true;
  this.getKeyframes().init();

  /** @type {string?} */
  var vendorPrefix = npf.userAgent.Support.vendorPrefix;
  /** @type {!Array.<string>} */
  var startEventTypes = ['animationstart'];
  /** @type {!Array.<string>} */
  var endEventTypes = ['animationend'];
  /** @type {!Array.<string>} */
  var iterationEventTypes = ['animationiteration'];

  if (vendorPrefix) {
    startEventTypes.push(vendorPrefix + 'AnimationStart');
    endEventTypes.push(vendorPrefix + 'AnimationEnd');
    iterationEventTypes.push(vendorPrefix + 'AnimationIteration');
  }

  this.handler_
    //.listen(this.element, startEventTypes, this.onAnimationStart_, false, this)
    .listen(this.element, endEventTypes, this.onAnimationEnd_, false, this)
    .listen(this.element, iterationEventTypes, this.onAnimationIteration_,
      false, this);

  this.playState_ = npf.style.animation.PlayState.RUNNING;

  this.setAnimationProperties_(this.duration, this.delay_, this.accel_,
    this.iterationCount_, this.direction_, this.playState_);

  if (this.endStylesUsed_) {
    /** @type {Object.<string,string>} */
    var endStyles = this.getKeyframes().getEndStyles();

    if (endStyles) {
      goog.style.setStyle(this.element, endStyles);
    }
  }
};

/**
 * Stops the animation.
 * @param {boolean=} opt_gotoEnd If true the animation will move to the end coords.
 */
npf.fx.CssAnimation.prototype.stop = function(opt_gotoEnd) {
  this.setStateStopped();
  this.playState_ = npf.style.animation.PlayState.PAUSED;

  if (opt_gotoEnd) {
    this.clearDom();
  } else {
    this.setAnimationPlayState_(this.playState_);
  }

  this.cleared_ = true;

  this.onStop();
  this.onEnd();
};

npf.fx.CssAnimation.prototype.pause = function() {
  if (this.isPlaying()) {
    this.playState_ = npf.style.animation.PlayState.PAUSED;
    this.setAnimationPlayState_(this.playState_);
    this.setStatePaused();
    this.onPause();
  }
};

/**
 * @return {boolean}
 */
npf.fx.CssAnimation.prototype.isFinished = function() {
  return this.finished_;
};

/**
 * @return {boolean}
 */
npf.fx.CssAnimation.prototype.areEndStylesUsed = function() {
  return this.endStylesUsed_;
};

/**
 * @param {boolean} use
 */
npf.fx.CssAnimation.prototype.setEndStylesUsed = function(use) {
  this.endStylesUsed_ = use;
};

/**
 * @protected
 */
npf.fx.CssAnimation.prototype.clearDom = function() {
  this.handler_.removeAll();

  /** @type {!Array.<string>} */
  var names = npf.style.animation.getNames(this.element);
  /** @type {number} */
  var animationIndex = goog.array.indexOf(names, this.getKeyframes().getName());

  if (-1 < animationIndex) {
    npf.style.animation.removeDelayAt(this.element, animationIndex);
    npf.style.animation.removeDirectionAt(this.element, animationIndex);
    npf.style.animation.removeDurationAt(this.element, animationIndex);
    npf.style.animation.removeIterationCountAt(this.element, animationIndex);
    npf.style.animation.removeNameAt(this.element, animationIndex);
    npf.style.animation.removePlayStateAt(this.element, animationIndex);
    npf.style.animation.removeTimingFunctionAt(this.element, animationIndex);
  }

  this.domSet_ = false;
};

///**
// * @param {goog.events.BrowserEvent} evt
// * @private
// */
//npf.fx.CssAnimation.prototype.onAnimationStart_ = function(evt) {
//  var element = /** @type {Element} */ (evt.target);
//  var name = /** @type {string} */ (evt.getBrowserEvent()['animationName']);

//  if (this.element === element && this.keyframes_.getName() == name) {

//  }
//};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.CssAnimation.prototype.onAnimationEnd_ = function(evt) {
  var element = /** @type {Element} */ (evt.target);
  var name = /** @type {string} */ (evt.getBrowserEvent()['animationName']);

  if (this.element === element && this.keyframes_.getName() == name) {
    this.playState_ = npf.style.animation.PlayState.PAUSED;
    this.clearDom();
    this.cleared_ = true;
    this.finished_ = true;
    this.setStateStopped();
    this.onFinish();
    this.onEnd();
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.fx.CssAnimation.prototype.onAnimationIteration_ = function(evt) {
  var element = /** @type {Element} */ (evt.target);
  var name = /** @type {string} */ (evt.getBrowserEvent()['animationName']);

  if (this.element === element && this.keyframes_.getName() == name) {
    this.onIteration();
  }
};

/**
 * @protected
 */
npf.fx.CssAnimation.prototype.onIteration = function() {
  this.dispatchAnimationEvent(npf.fx.cssAnimation.EventType.ITERATION);
};

/** @override */
npf.fx.CssAnimation.prototype.dispatchAnimationEvent = function(type) {
  var event = new npf.fx.cssAnimation.Event(
    /** @type {npf.fx.cssAnimation.EventType} */ (type), this);
  this.dispatchEvent(event);
};

/**
 * @param {number} duration
 * @param {number} delay
 * @param {Array.<string>} accel
 * @param {number} iterationCount
 * @param {npf.style.animation.Direction} direction
 * @param {npf.style.animation.PlayState} playState
 * @private
 */
npf.fx.CssAnimation.prototype.setAnimationProperties_ = function(duration,
                                                                 delay,
                                                                 accel,
                                                                 iterationCount,
                                                                 direction,
                                                                 playState) {
  /** @type {string} */
  var name = this.getKeyframes().getName();
  /** @type {!Array.<string>} */
  var names = npf.style.animation.getNames(this.element);
  /** @type {number} */
  var index = goog.array.indexOf(names, name);

  if (0 > index && names.length) {
    npf.style.animation.insertDuration(this.element, duration);
    npf.style.animation.insertDelay(this.element, delay);
    npf.style.animation.insertTimingFunction(this.element, accel);
    npf.style.animation.insertIterationCount(this.element, iterationCount);
    npf.style.animation.insertDirection(this.element, direction);
    npf.style.animation.insertPlayState(this.element, playState);
    npf.style.animation.insertName(this.element, name);
  } else {
    if (!names.length) {
      index = 0;
    }

    npf.style.animation.setDuration(this.element, duration, index);
    npf.style.animation.setDelay(this.element, delay, index);
    npf.style.animation.setTimingFunction(this.element, accel, index);
    npf.style.animation.setIterationCount(this.element, iterationCount, index);
    npf.style.animation.setDirection(this.element, direction, index);
    npf.style.animation.setPlayState(this.element, playState, index);

    if (!names.length) {
      npf.style.animation.setName(this.element, name, index);
    }
  }
};

/**
 * @param {npf.style.animation.PlayState} playState
 * @private
 */
npf.fx.CssAnimation.prototype.setAnimationPlayState_ = function(playState) {
  /** @type {string} */
  var name = this.getKeyframes().getName();
  /** @type {!Array.<string>} */
  var names = npf.style.animation.getNames(this.element);
  /** @type {number} */
  var index = goog.array.indexOf(names, name);

  if (0 > index && names.length) {
    npf.style.animation.insertPlayState(this.element, playState);
    npf.style.animation.insertName(this.element, name);
  } else {
    if (!names.length) {
      index = 0;
    }

    npf.style.animation.setPlayState(this.element, playState, index);

    if (!names.length) {
      npf.style.animation.setName(this.element, name, index);
    }
  }
};

/**
 * @param {string|Array.<number|string>} origin
 * @return {!npf.fx.CssAnimation}
 */
npf.fx.CssAnimation.prototype.setTransformOrigin = function(origin) {
  var value;

  if (goog.isArray(origin)) {
    if (2 != origin.length && 3 != origin.length) {
      throw Error('Transform Origin must be 2D or 3D');
    }

    value = origin.join(' ');
  } else {
    value = origin;
  }

  /** @type {string} */
  var key = npf.userAgent.support.getCssPropertyName('transform-origin');
  goog.style.setStyle(this.element, key, /** @type {string} */ (value));

  return this;
};
