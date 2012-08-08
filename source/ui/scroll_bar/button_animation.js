goog.provide('npf.ui.scrollBar.ButtonAnimation');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.fx.anim');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.scrollBar.ButtonAnimation = function() {
  goog.base(this);

  this.delay_ = new goog.async.Delay(this.animate_, goog.fx.anim.TIMEOUT, this);
  this.registerDisposable(this.delay_);
};
goog.inherits(npf.ui.scrollBar.ButtonAnimation, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.ui.scrollBar.ButtonAnimation.EventType = {
  /**
   * direction (npf.ui.scrollBar.ButtonAnimation.Direction)
   */
  START: goog.events.getUniqueId('start'),
  /**
   * direction (npf.ui.scrollBar.ButtonAnimation.Direction)
   */
  FINISH: goog.events.getUniqueId('finish'),
  /**
   * direction (npf.ui.scrollBar.ButtonAnimation.Direction)
   * move (number)
   */
  ANIMATE: goog.events.getUniqueId('animate')
};

/**
 * @enum {number}
 */
npf.ui.scrollBar.ButtonAnimation.Direction = {
  DOWN: 1,
  UP: 2
};

/**
 * @type {number}
 * @const
 */
npf.ui.scrollBar.ButtonAnimation.STEP = 20;

/**
 * @type {goog.async.Delay}
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype.delay_;

/**
 * @type {npf.ui.scrollBar.ButtonAnimation.Direction}
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype.direction_ =
  npf.ui.scrollBar.ButtonAnimation.Direction.DOWN;

/**
 * @type {boolean}
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype.animated_ = false;


/** @inheritDoc */
npf.ui.scrollBar.ButtonAnimation.prototype.disposeInternal = function() {
  this.stop();

  goog.base(this, 'disposeInternal');

  delete this.delay_;
  delete this.animated_;
};

/**
 * @return {boolean}
 */
npf.ui.scrollBar.ButtonAnimation.prototype.isAnimated = function() {
  return this.animated_;
};

/**
 * @return {npf.ui.scrollBar.ButtonAnimation.Direction}
 */
npf.ui.scrollBar.ButtonAnimation.prototype.getDirection = function() {
  return this.direction_;
};

/**
 * @param {npf.ui.scrollBar.ButtonAnimation.Direction} direction
 */
npf.ui.scrollBar.ButtonAnimation.prototype.start = function(direction) {
  if (this.animated_ && this.direction_ == direction) {
    return;
  }

  if (this.animated_) {
    this.stop();
  }

  this.animated_ = true;
  this.direction_ = direction;
  this.delay_.start();

  this.dispatchEvent({
    type: npf.ui.scrollBar.ButtonAnimation.EventType.START,
    direction: this.direction_
  });
};

npf.ui.scrollBar.ButtonAnimation.prototype.stop = function() {
  if (!this.animated_) {
    return;
  }

  this.animated_ = false;
  this.delay_.stop();
  this.dispatchEvent({
    type: npf.ui.scrollBar.ButtonAnimation.EventType.FINISH,
    direction: this.direction_
  });
};

/**
 * @private
 */
npf.ui.scrollBar.ButtonAnimation.prototype.animate_ = function() {
  this.delay_.start();

  /** @type {number} */
  var move = npf.ui.scrollBar.ButtonAnimation.STEP;

  if (npf.ui.scrollBar.ButtonAnimation.Direction.UP == this.direction_) {
    move = -move;
  }

  this.dispatchEvent({
    type: npf.ui.scrollBar.ButtonAnimation.EventType.ANIMATE,
    direction: this.direction_,
    move: move
  });
};
