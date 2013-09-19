goog.provide('npf.fx.TransitionHelper');

goog.require('goog.Disposable');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.fx.TransitionBase');
goog.require('goog.object');


/**
 * @constructor
 * @extends {goog.Disposable}
 */
npf.fx.TransitionHelper = function() {
  goog.base(this);
};
goog.inherits(npf.fx.TransitionHelper, goog.Disposable);


/**
 * @type {Object.<goog.fx.TransitionBase>}
 * @private
 */
npf.fx.TransitionHelper.prototype.transitionsMap_ = null;


/** @inheritDoc */
npf.fx.TransitionHelper.prototype.disposeInternal = function() {
  this.removeAll();

  goog.base(this, 'disposeInternal');

  this.transitionsMap_ = null;
};

/**
 * @param {goog.fx.TransitionBase} transition
 * @param {Function=} opt_onEnd
 * @return {number}
 */
npf.fx.TransitionHelper.prototype.play = function(transition, opt_onEnd) {
  /** @type {number} */
  var id = goog.getUid(transition);

  if (!this.transitionsMap_) {
    this.transitionsMap_ = {};
  }

  this.transitionsMap_[id] = transition;

  transition.listen(goog.fx.Transition.EventType.END, function(evt) {
    if (opt_onEnd) {
      opt_onEnd();
    }

    this.remove(id);
  }, false, this);
  transition.play(true);

  return id;
};

/**
 * @param {number|goog.fx.TransitionBase} transitionId
 */
npf.fx.TransitionHelper.prototype.pause = function(transitionId) {
  /** @type {goog.fx.TransitionBase} */
  var transition = this.getTransition(transitionId);

  if (transition) {
    transition.pause();
  }
};

/**
 * @param {number|goog.fx.TransitionBase} transitionId
 */
npf.fx.TransitionHelper.prototype.resume = function(transitionId) {
  /** @type {goog.fx.TransitionBase} */
  var transition = this.getTransition(transitionId);

  if (transition) {
    transition.play();
  }
};

/**
 * @param {number|goog.fx.TransitionBase} transitionId
 */
npf.fx.TransitionHelper.prototype.remove = function(transitionId) {
  if (this.transitionsMap_) {
    /** @type {number} */
    var id = goog.isNumber(transitionId) ?
      transitionId : goog.getUid(transitionId);
    /** @type {goog.fx.TransitionBase} */
    var transition = this.transitionsMap_[id] || null;

    if (transition) {
      delete this.transitionsMap_[id];
      transition.dispose();
    }
  }
};

npf.fx.TransitionHelper.prototype.removeAll = function() {
  if (this.transitionsMap_) {
    goog.object.forEach(this.transitionsMap_, function(transition) {
      transition.dispose();
    }, this);
    this.transitionsMap_ = null;
  }
};

/**
 * @param {number|goog.fx.TransitionBase} transition
 * @return {goog.fx.TransitionBase?}
 */
npf.fx.TransitionHelper.prototype.getTransition = function(transition) {
  if (this.transitionsMap_) {
    /** @type {number} */
    var id = goog.isNumber(transition) ? transition : goog.getUid(transition);

    return this.transitionsMap_[id] || null;
  }

  return null;
};
