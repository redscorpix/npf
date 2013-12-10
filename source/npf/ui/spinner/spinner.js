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

  /**
   * @private {Array.<npf.fx.KeyframeAnimation>}
   */
  this.animations_ = null;

  /**
   * Frames per second when using setTimeout()
   * @private {number}
   */
  this.fps_ = 20;

  /**
   * Opacity of the lines
   * @private {number}
   */
  this.opacity_ = 1 / 4;

  /**
   * @private {boolean}
   */
  this.playing_ = true;

  /**
   * The radius of the inner circle
   * @private {number}
   */
  this.radius_ = 10;

  /**
   * Rotation offset
   * @private {number}
   */
  this.rotation_ = 0;

  /**
   * The number of lines to draw
   * @private {number}
   */
  this.segmentCount_ = 12;

  /**
   * Rounds per second
   * @private {number}
   */
  this.speed_ = 1;

  /**
   * @private {number}
   */
  this.timeoutId_ = 0;

  /**
   * Afterglow percentage
   * @private {number}
   */
  this.trail_ = 100;
};
goog.inherits(npf.ui.Spinner, npf.ui.RenderedComponent);


/** @inheritDoc */
npf.ui.Spinner.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

  if (this.isPlaying()) {
    this.applyPlaying(true);
  }
};

/** @inheritDoc */
npf.ui.Spinner.prototype.exitDocument = function() {
  if (this.isPlaying()) {
    this.applyPlaying(false);
  }

  goog.base(this, 'exitDocument');
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
 * @return {boolean}
 */
npf.ui.Spinner.prototype.isPlaying = function() {
  return this.playing_;
};

/**
 * @param {boolean} play
 */
npf.ui.Spinner.prototype.setPlaying = function(play) {
  if (this.isPlaying() != play) {
    this.setPlayingInternal(play);
    this.applyPlaying(this.isPlaying());
  }
};

/**
 * @param {boolean} play
 * @protected
 */
npf.ui.Spinner.prototype.setPlayingInternal = function(play) {
  this.playing_ = play;
};

/**
 * @param {boolean} play
 * @protected
 */
npf.ui.Spinner.prototype.applyPlaying = function(play) {
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
    /** @type {number} */
    var opacity = this.getOpacity();

    this.animations_ = goog.array.map(segmentElements, function(element, i) {
      /** @type {number} */
      var start = 0.01 + i / this.getSegmentCount() * 100;
      /** @type {number} */
      var z = Math.max(
        1 - (1 - opacity) / this.getTrail() * (100 - start), opacity);
      var animation = new npf.fx.KeyframeAnimation(
        element, 1 / this.getSpeed() * 1000);
      animation.setIterationCount(0);
      animation.fromToOpacity(z, z);
      animation.setOpacity(opacity, start);
      animation.setOpacity(1,       start + 1);
      animation.setOpacity(opacity, start + this.getTrail() * 100);
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
    /** @type {number} */
    var opacity = this.getOpacity();
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var fps = this.getFps();
    /** @type {number} */
    var f = fps / this.getSpeed();
    /** @type {number} */
    var ostep = (1 - opacity) / (f * this.getTrail() / 100);
    /** @type {number} */
    var segmentCount = this.getSegmentCount();
    /** @type {number} */
    var astep = f / segmentCount;
    var segmentElements = this.getRenderer().getSegmentElements(
      this.getElement());

    var animate = goog.bind(function() {
      i++;

      for (var s= segmentCount; s; s--) {
        /** @type {number} */
        var alpha = Math.max(1 - (i + s * astep) % f * ostep, opacity);

        if (segmentCount - s < segmentElements.length) {
          this.getRenderer().setOpacity(
            segmentElements[segmentCount - s], alpha);
        }
      }

      this.timeoutId_ = goog.Timer.callOnce(animate, 1000 / fps);
    }, this);
    animate();
  } else {
    goog.Timer.clear(this.timeoutId_);
  }
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
