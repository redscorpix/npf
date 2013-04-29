goog.provide('npf.ui.richScrollBar.ButtonAnimation');

goog.require('goog.async.Delay');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.fx.anim');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.ui.richScrollBar.ButtonAnimation = function() {
  goog.base(this);

  this.delay_ = new goog.async.Delay(this.animate_, goog.fx.anim.TIMEOUT, this);
  this.registerDisposable(this.delay_);
};
goog.inherits(npf.ui.richScrollBar.ButtonAnimation, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.ui.richScrollBar.ButtonAnimation.EventType = {
  /**
   * direction (npf.ui.richScrollBar.ButtonAnimation.Direction)
   */
  START: goog.events.getUniqueId('start'),

  /**
   * direction (npf.ui.richScrollBar.ButtonAnimation.Direction)
   */
  FINISH: goog.events.getUniqueId('finish'),

  /**
   * direction (npf.ui.richScrollBar.ButtonAnimation.Direction)
   * move (number)
   */
  ANIMATE: goog.events.getUniqueId('animate')
};

/**
 * @enum {number}
 */
npf.ui.richScrollBar.ButtonAnimation.Direction = {
  DOWN: 1,
  UP: 2
};

/**
 * @type {number}
 * @const
 */
npf.ui.richScrollBar.ButtonAnimation.STEP = 20;

/**
 * @type {goog.async.Delay}
 * @private
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.delay_;

/**
 * @type {npf.ui.richScrollBar.ButtonAnimation.Direction}
 * @private
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.direction_ =
  npf.ui.richScrollBar.ButtonAnimation.Direction.DOWN;

/**
 * @type {boolean}
 * @private
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.animated_ = false;


/** @inheritDoc */
npf.ui.richScrollBar.ButtonAnimation.prototype.disposeInternal = function() {
  this.stop();

  goog.base(this, 'disposeInternal');

  this.delay_ = null;
};

/**
 * @return {boolean}
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.isAnimated = function() {
  return this.animated_;
};

/**
 * @return {npf.ui.richScrollBar.ButtonAnimation.Direction}
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.getDirection = function() {
  return this.direction_;
};

/**
 * @param {npf.ui.richScrollBar.ButtonAnimation.Direction} direction
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.start = function(direction) {
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
    type: npf.ui.richScrollBar.ButtonAnimation.EventType.START,
    direction: this.direction_
  });
};

npf.ui.richScrollBar.ButtonAnimation.prototype.stop = function() {
  if (!this.animated_) {
    return;
  }

  this.animated_ = false;
  this.delay_.stop();
  this.dispatchEvent({
    type: npf.ui.richScrollBar.ButtonAnimation.EventType.FINISH,
    direction: this.direction_
  });
};

/**
 * @private
 */
npf.ui.richScrollBar.ButtonAnimation.prototype.animate_ = function() {
  this.delay_.start();

  /** @type {number} */
  var move = npf.ui.richScrollBar.ButtonAnimation.STEP;

  if (npf.ui.richScrollBar.ButtonAnimation.Direction.UP == this.direction_) {
    move = -move;
  }

  this.dispatchEvent({
    type: npf.ui.richScrollBar.ButtonAnimation.EventType.ANIMATE,
    direction: this.direction_,
    move: move
  });
};
