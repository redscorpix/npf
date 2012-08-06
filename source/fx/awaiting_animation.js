goog.provide('npf.fx.AwaitingAnimation');
goog.provide('npf.fx.AwaitingAnimation.EventType');

goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.fx.TransitionBase');
goog.require('goog.fx.Transition.EventType');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.fx.AwaitingAnimation = function() {
  goog.base(this);
};
goog.inherits(npf.fx.AwaitingAnimation, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.fx.AwaitingAnimation.EventType = {
  ADD: goog.events.getUniqueId('add'),
  REMOVE: goog.events.getUniqueId('remove'),
  PLAY: goog.events.getUniqueId('play')
};

/**
 * @type {goog.fx.TransitionBase}
 * @private
 */
npf.fx.AwaitingAnimation.prototype.animation_ = null;

/**
 * @type {goog.fx.TransitionBase}
 * @private
 */
npf.fx.AwaitingAnimation.prototype.awaitingAnimation_ = null;


/** @inheritDoc */
npf.fx.AwaitingAnimation.prototype.disposeInternal = function() {
  if (this.awaitingAnimation_) {
    this.dispatchRemoveEvent(this.awaitingAnimation_);
    this.awaitingAnimation_.dispose();
  }

  if (this.animation_) {
    this.dispatchRemoveEvent(this.animation_);
    this.animation_.dispose();
  }

  goog.base(this, 'disposeInternal');

  delete this.animation_;
  delete this.awaitingAnimation_;
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @return {boolean}
 */
npf.fx.AwaitingAnimation.prototype.play = function(animation) {
  this.dispatchAddEvent(animation);

  if (this.animation_) {
    if (this.awaitingAnimation_) {
      this.dispatchRemoveEvent(this.awaitingAnimation_);
      this.awaitingAnimation_.dispose();
    }

    this.awaitingAnimation_ = animation;

    return false;
  }

  this.animation_ = animation;
  this.animation_.addEventListener(goog.fx.Transition.EventType.FINISH, this.onFinish_, false, this);
  this.dispatchPlayEvent(this.animation_);
  this.animation_.play();

  return true;
};

/**
 * @param {goog.events.Event} evt
 */
npf.fx.AwaitingAnimation.prototype.onFinish_ = function(evt) {
  this.dispatchRemoveEvent(this.animation_);
  this.animation_.dispose();
  this.animation_ = null;

  if (this.awaitingAnimation_) {
    /** @type {!goog.fx.TransitionBase} */
    var animation = this.awaitingAnimation_;
    this.awaitingAnimation_ = null;
    this.play(animation);
  }
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @protected
 */
npf.fx.AwaitingAnimation.prototype.dispatchAddEvent = function(animation) {
  this.dispatchEvent({
    type: npf.fx.AwaitingAnimation.EventType.ADD,
    animation: animation
  });
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @protected
 */
npf.fx.AwaitingAnimation.prototype.dispatchRemoveEvent = function(animation) {
  this.dispatchEvent({
    type: npf.fx.AwaitingAnimation.EventType.REMOVE,
    animation: animation
  });
};

/**
 * @param {goog.fx.TransitionBase} animation
 * @protected
 */
npf.fx.AwaitingAnimation.prototype.dispatchPlayEvent = function(animation) {
  this.dispatchEvent({
    type: npf.fx.AwaitingAnimation.EventType.PLAY,
    animation: animation
  });
};
