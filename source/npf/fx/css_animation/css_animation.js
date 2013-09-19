goog.provide('npf.fx.CssAnimation');
goog.provide('npf.fx.CssAnimation.PreferredTimingFunction');

goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.fx.Transition');
goog.require('goog.fx.TransitionBase');
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

  this.accel_ = opt_acc || npf.fx.css3.easing.LINEAR;
  this.duration = duration;
  this.element = element;
  this.keyframes_ = keyframes;

  this.handler_ = new goog.events.EventHandler(this);
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
  var supported = npf.userAgent.support.getCssAnimations();

  return supported && npf.fx.Animation.enabled;
};


/**
 * @private {Array.<number>}
 */
npf.fx.CssAnimation.prototype.accel_;

/**
 * @private {boolean}
 */
npf.fx.CssAnimation.prototype.cleared_ = true;

/**
 * @private {number}
 */
npf.fx.CssAnimation.prototype.delay_ = 0;

/**
 * @private {npf.style.animation.Direction}
 */
npf.fx.CssAnimation.prototype.direction_ =
  npf.style.animation.Direction.NORMAL;

/**
 * @private {boolean}
 */
npf.fx.CssAnimation.prototype.domSet_ = false;

/**
 * @protected {number}
 */
npf.fx.CssAnimation.prototype.duration;

/**
 * @protected {Element}
 */
npf.fx.CssAnimation.prototype.element;

/**
 * @private {boolean}
 */
npf.fx.CssAnimation.prototype.endStylesUsed_ = false;

/**
 * @private {boolean}
 */
npf.fx.CssAnimation.prototype.finished_ = false;

/**
 * @private {goog.events.EventHandler}
 */
npf.fx.CssAnimation.prototype.handler_;

/**
 * 0 — infinite.
 * @private {number}
 */
npf.fx.CssAnimation.prototype.iterationCount_ = 1;

/**
 * @private {npf.fx.cssAnimation.Keyframes}
 */
npf.fx.CssAnimation.prototype.keyframes_;

/**
 * @private {npf.style.animation.PlayState}
 */
npf.fx.CssAnimation.prototype.playState_ = npf.style.animation.PlayState.PAUSED;


/** @inheritDoc */
npf.fx.CssAnimation.prototype.disposeInternal = function() {
  if (!this.isStopped()) {
    this.stop(false);
  }

  if (this.domSet_) {
    this.clearDom();
  }

  goog.base(this, 'disposeInternal');

  this.accel_ = null;
  this.element = null;
  this.handler_ = null;
  this.keyframes_ = null;
};

/**
 * @return {Array.<number>}
 */
npf.fx.CssAnimation.prototype.getAccel = function() {
  return this.accel_;
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
 * @return {Element}
 */
npf.fx.CssAnimation.prototype.getElement = function() {
  return this.element;
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
 * @return {boolean}
 */
npf.fx.CssAnimation.prototype.isFinished = function() {
  return this.finished_;
};

/**
 * @return {npf.fx.cssAnimation.Keyframes}
 */
npf.fx.CssAnimation.prototype.getKeyframes = function() {
  return this.keyframes_;
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
 * @return {npf.style.animation.PlayState}
 */
npf.fx.CssAnimation.prototype.getState = function() {
  return this.playState_;
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
    .listen(this.element, endEventTypes, this.onAnimationEnd_)
    .listen(this.element, iterationEventTypes, this.onAnimationIteration_);

  this.playState_ = npf.style.animation.PlayState.RUNNING;

  npf.style.animation.setAnimation(this.element, {
    delay: this.delay_,
    direction: this.direction_,
    duration: this.duration,
    iterationCount: this.iterationCount_,
    name: this.getKeyframes().getName(),
    playState: this.playState_,
    timingFunction: this.accel_
  });

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
 * @param {boolean=} opt_gotoEnd If true the animation will move
 *                               to the end coords.
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
 * @protected
 */
npf.fx.CssAnimation.prototype.clearDom = function() {
  this.handler_.removeAll();
  npf.style.animation.removeAnimation(this.element,
    this.getKeyframes().getName());
  this.domSet_ = false;
};

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
 * @param {npf.style.animation.PlayState} playState
 * @private
 */
npf.fx.CssAnimation.prototype.setAnimationPlayState_ = function(playState) {
  npf.style.animation.setPlayState(this.element, this.getKeyframes().getName(),
    playState);
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

  goog.style.setStyle(
    this.element, 'transform-origin', /** @type {string} */ (value));

  return this;
};
