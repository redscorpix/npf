goog.provide('npf.labs.events.resizeHandler.Emulator');

goog.require('goog.Disposable');
goog.require('goog.async.AnimationDelay');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('npf.fx.cssAnimation.Keyframes');
goog.require('npf.fx.css3.easing');
goog.require('npf.style.animation');
goog.require('npf.style.animation.Direction');
goog.require('npf.style.animation.PlayState');
goog.require('npf.userAgent.utils');


/**
 * @param {!Element} handlerElement
 * @param {function(this:SCOPE)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @constructor
 * @struct
 * @extends {goog.Disposable}
 */
npf.labs.events.resizeHandler.Emulator = function(handlerElement, callback,
    opt_scope) {
  npf.labs.events.resizeHandler.Emulator.base(this, 'constructor');

  /** @type {!Window} */
  var win = goog.dom.getDomHelper(handlerElement).getWindow();

  /**
   * @private {goog.async.AnimationDelay}
   */
  this.animationDelay_ = new goog.async.AnimationDelay(
    this.onAnimationDelay_, win, this);

  /**
   * @private {function()}
   */
  this.callback_ = callback;

  /**
   * @private {boolean}
   */
  this.enabled_ = false;

  /**
   * @private {goog.events.EventHandler<!npf.labs.events.resizeHandler.Emulator>}
   */
  this.eventHandler_ = new goog.events.EventHandler(this);

  /**
   * @private {Element}
   */
  this.handlerElement_ = handlerElement;
  this.handlerElement_.innerHTML =
    '<div class="' + npf.labs.events.resizeHandler.Emulator.CssClass.EXPAND +
      '"><div></div></div>' +
    '<div class="' +
      npf.labs.events.resizeHandler.Emulator.CssClass.CONTRACT_TRIGGER +
      '"></div>';

  /**
   * @private {number}
   */
  this.height_ = 0;

  /**
   * @private {Object}
   */
  this.scope_ = opt_scope || null;

  /**
   * @private {number}
   */
  this.width_ = 0;

  npf.style.animation.setAnimation(this.handlerElement_, {
    name: npf.labs.events.resizeHandler.Emulator.addAnimation_(),
    delay: 0,
    direction: npf.style.animation.Direction.NORMAL,
    duration: 1,
    iterationCount: 1,
    playState: npf.style.animation.PlayState.RUNNING,
    timingFunction: npf.fx.css3.easing.LINEAR
  });
};
goog.inherits(npf.labs.events.resizeHandler.Emulator, goog.Disposable);


/**
 * @type {string}
 */
npf.labs.events.resizeHandler.Emulator.CSS_CLASS =
  goog.getCssName('npfLabs-resizeHandler');

/**
 * @enum {string}
 */
npf.labs.events.resizeHandler.Emulator.CssClass = {
  CONTRACT_TRIGGER: goog.getCssName('npfLabs-resizeHandler-contractTrigger'),
  EXPAND: goog.getCssName('npfLabs-resizeHandler-expand')
};

/**
 * @private {number}
 */
npf.labs.events.resizeHandler.Emulator.animationsCount_ = 0;

/**
 * @private {npf.fx.cssAnimation.Keyframes}
 */
npf.labs.events.resizeHandler.Emulator.animationKeyframes_ = null;

/**
 * @return {string}
 * @private
 */
npf.labs.events.resizeHandler.Emulator.addAnimation_ = function() {
  if (!npf.labs.events.resizeHandler.Emulator.animationsCount_) {
    npf.labs.events.resizeHandler.Emulator.animationKeyframes_ =
      new npf.fx.cssAnimation.Keyframes({
        'opacity': 0
      }, {
        'opacity': 0
      });
    npf.labs.events.resizeHandler.Emulator.animationKeyframes_.init();
  }

  npf.labs.events.resizeHandler.Emulator.animationsCount_++;

  return npf.labs.events.resizeHandler.Emulator.animationKeyframes_.getName();
};

/**
 * @private
 */
npf.labs.events.resizeHandler.Emulator.removeAnimation_ = function() {
  if (npf.labs.events.resizeHandler.Emulator.animationsCount_) {
    npf.labs.events.resizeHandler.Emulator.animationsCount_--;

    if (!npf.labs.events.resizeHandler.Emulator.animationsCount_) {
      npf.labs.events.resizeHandler.Emulator.animationKeyframes_.dispose();
      npf.labs.events.resizeHandler.Emulator.animationKeyframes_ = null;
    }
  }
};


/** @inheritDoc */
npf.labs.events.resizeHandler.Emulator.prototype.disposeInternal = function() {
  this.setEnabled(false);
  this.animationDelay_.dispose();
  this.eventHandler_.dispose();

  npf.labs.events.resizeHandler.Emulator.removeAnimation_();
  npf.labs.events.resizeHandler.Emulator.base(this, 'disposeInternal');

  this.animationDelay_ = null;
  this.eventHandler_ = null;
  this.handlerElement_ = null;
  this.scope_ = null;
};

/**
 * @return {boolean}
 */
npf.labs.events.resizeHandler.Emulator.prototype.isEnabled = function() {
  return this.enabled_;
};

/**
 * @param {boolean} enable
 */
npf.labs.events.resizeHandler.Emulator.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable) {
    this.enabled_ = enable;

    if (enable) {
      this.resetTriggers_();

      /** @type {string} */
      var vendorPrefix = npf.userAgent.utils.VENDOR_PREFIX;
      /** @type {!Array.<string>} */
      var startEventTypes = ['animationstart'];

      if (vendorPrefix) {
        startEventTypes.push(vendorPrefix + 'AnimationStart');
      }

      this.eventHandler_.
        listen(this.handlerElement_, goog.events.EventType.SCROLL,
          this.onScroll_, true).
        // Listen for a css animation to detect element display/re-attach
        listen(this.handlerElement_, startEventTypes, this.onAnimationStart_);
    } else {
      this.eventHandler_.removeAll();
      this.animationDelay_.stop();
    }
  }
};

/**
 * @private
 */
npf.labs.events.resizeHandler.Emulator.prototype.resetTriggers_ = function() {
  var expand = this.handlerElement_.firstElementChild;
  var contract = this.handlerElement_.lastElementChild;
  var expandChild = expand.firstElementChild;
  contract.scrollLeft = contract.scrollWidth;
  contract.scrollTop = contract.scrollHeight;
  expandChild.style.cssText = 'width:' + (expand.offsetWidth + 1) +
    'px;height:' + (expand.offsetHeight + 1) + 'px';
  expand.scrollLeft = expand.scrollWidth;
  expand.scrollTop = expand.scrollHeight;
};

/**
 * @param {number} timestamp
 * @private
 */
npf.labs.events.resizeHandler.Emulator.prototype.onAnimationDelay_ = function(
    timestamp) {
  /** @type {number} */
  var width = this.handlerElement_.offsetWidth;
  /** @type {number} */
  var height = this.handlerElement_.offsetHeight;

  if (width != this.width_ || height != this.height_) {
    this.width_ = width;
    this.height_ = height;
    this.callback_.call(this.scope_);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.labs.events.resizeHandler.Emulator.prototype.onAnimationStart_ = function(
    evt) {
  this.resetTriggers_();
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.labs.events.resizeHandler.Emulator.prototype.onScroll_ = function(evt) {
  this.resetTriggers_();
  this.animationDelay_.start();
};
