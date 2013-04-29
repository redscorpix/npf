goog.provide('npf.ui.Spinner');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('npf.fx.CssAnimation');
goog.require('npf.fx.KeyframeAnimation');
goog.require('npf.ui.RenderedComponent');
goog.require('npf.ui.spinner.Renderer');


/**
 * fgnass.github.com/spin.js#v1.2.7
 * @param {npf.ui.spinner.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderedComponent}
 */
npf.ui.Spinner = function(opt_renderer, opt_domHelper) {
  goog.base(this, opt_renderer ||
    npf.ui.spinner.Renderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.Spinner, npf.ui.RenderedComponent);


/**
 * The number of lines to draw
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.segmentCount_ = 12;

/**
 * Rotation offset
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.rotation_ = 0;

/**
 * The radius of the inner circle
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.radius_ = 10;

/**
 * Opacity of the lines
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.opacity_ = 1 / 4;

/**
 * Rounds per second
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.speed_ = 1;

/**
 * Afterglow percentage
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.trail_ = 100;

/**
 * Frames per second when using setTimeout()
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.fps_ = 20;

/**
 * @type {boolean}
 * @private
 */
npf.ui.Spinner.prototype.playing_ = true;

/**
 * @type {number}
 * @private
 */
npf.ui.Spinner.prototype.timeoutId_;

/**
 * @type {Array.<npf.fx.KeyframeAnimation>}
 * @private
 */
npf.ui.Spinner.prototype.animations_ = null;


/** @inheritDoc */
npf.ui.Spinner.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.playing_) {
    this.setPlayingInternal(this.playing_);
  }
};

/** @inheritDoc */
npf.ui.Spinner.prototype.exitDocument = function() {
  if (this.playing_) {
    this.setPlayingInternal(false);
  }

  goog.base(this, 'exitDocument');
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getSegmentCount = function() {
  return this.segmentCount_;
};

/**
 * @param {number} count
 */
npf.ui.Spinner.prototype.setSegmentCount = function(count) {
  this.segmentCount_ = count;
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getRotation = function() {
  return this.rotation_;
};

/**
 * @param {number} rotate
 */
npf.ui.Spinner.prototype.setRotation = function(rotate) {
  this.rotation_ = rotate;
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getRadius = function() {
  return this.radius_;
};

/**
 * @param {number} radius
 */
npf.ui.Spinner.prototype.setRadius = function(radius) {
  this.radius_ = radius;
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getOpacity = function() {
  return this.opacity_;
};

/**
 * @param {number} opacity
 */
npf.ui.Spinner.prototype.setOpacity = function(opacity) {
  this.opacity_ = opacity;
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getSpeed = function() {
  return this.speed_;
};

/**
 * @param {number} speed
 */
npf.ui.Spinner.prototype.setSpeed = function(speed) {
  this.speed_ = speed;
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getTrail = function() {
  return this.trail_;
};

/**
 * @param {number} trail
 */
npf.ui.Spinner.prototype.setTrail = function(trail) {
  this.trail_ = trail;
};

/**
 * @return {number}
 */
npf.ui.Spinner.prototype.getFps = function() {
  return this.fps_;
};

/**
 * @param {number} fps
 */
npf.ui.Spinner.prototype.setFps = function(fps) {
  this.fps_ = fps;
};

/**
 * @return {boolean}
 */
npf.ui.Spinner.prototype.isPlaying = function() {
  return this.playing_;
};

/**
 * @param {boolean} play
 */
npf.ui.Spinner.prototype.setPlaying = function(play) {
  if (this.playing_ != play) {
    this.playing_ = play;
    this.setPlayingInternal(this.playing_);
  }
};

/**
 * @param {boolean} play
 * @protected
 */
npf.ui.Spinner.prototype.setPlayingInternal = function(play) {
  if (this.isInDocument()) {
    if (npf.fx.CssAnimation.isSupported()) {
      this.setCssPlaying_(play);
    } else {
      this.setJsPlaying_(play);
    }
  }
};

/**
 * @param {boolean} play
 * @private
 */
npf.ui.Spinner.prototype.setCssPlaying_ = function(play) {
  if (play) {
    var segmentElements = this.getRenderer().getSegmentElements(
      this.getElement());

    this.animations_ = goog.array.map(segmentElements, function(element, i) {
      /** @type {number} */
      var start = 0.01 + i / this.segmentCount_ * 100;
      /** @type {number} */
      var z = Math.max(
        1 - (1 - this.opacity_) / this.trail_ * (100 - start), this.opacity_);
      var animation = new npf.fx.KeyframeAnimation(
        element, 1 / this.speed_ * 1000);
      animation.setIterationCount(0);
      animation.fromToOpacity(z, z);
      animation.setOpacity(this.opacity_, start);
      animation.setOpacity(1,             start + 1);
      animation.setOpacity(this.opacity_, start + this.trail_ * 100);
      animation.play();

      return animation;
    }, this);
  } else {
    goog.array.forEach(this.animations_, function(animation) {
      animation.dispose();
    }, this);

    this.animations_ = null;
  }
};

/**
 * @param {boolean} play
 * @private
 */
npf.ui.Spinner.prototype.setJsPlaying_ = function(play) {
  if (play) {
    var i = 0;
    var fps = this.fps_;
    var f = fps / this.speed_;
    var ostep = (1 - this.opacity_) / (f * this.trail_ / 100);
    var astep = f / this.segmentCount_;
    var segmentElements = this.getRenderer().getSegmentElements(
      this.getElement());

    var animate = goog.bind(function() {
      i++;

      for (var s= this.segmentCount_; s; s--) {
        var alpha = Math.max(1 - (i + s * astep) % f * ostep, this.opacity_);

        if (this.segmentCount_ - s < segmentElements.length) {
          this.getRenderer().setOpacity(
            segmentElements[this.segmentCount_ - s], alpha);
        }
      }

      this.timeoutId_ = goog.Timer.callOnce(animate, 1000 / fps);
    }, this);
    animate();
  } else {
    goog.Timer.clear(this.timeoutId_);
  }
};
