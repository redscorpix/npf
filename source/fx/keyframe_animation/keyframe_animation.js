goog.provide('npf.fx.KeyframeAnimation');
goog.provide('npf.fx.KeyframeAnimation.CssProperty');
goog.provide('npf.fx.KeyframeAnimation.Direction');
goog.provide('npf.fx.KeyframeAnimation.PlayState');
goog.provide('npf.fx.KeyframeAnimation.PreferredTimingFunction');

goog.require('npf.fx.CssAnimation');
goog.require('npf.fx.cssAnimation.Keyframes');
goog.require('npf.style.animation.Direction');
goog.require('npf.style.animation.PlayState');
goog.require('npf.userAgent.support');


/**
 * @param {Element} element
 * @param {number} duration in ms
 * @param {Array.<number>=} opt_acc defaults to npf.fx.css3.easing.LINEAR
 * @constructor
 * @extends {npf.fx.CssAnimation}
 */
npf.fx.KeyframeAnimation = function(element, duration, opt_acc) {
  var keyframes = new npf.fx.cssAnimation.Keyframes();

  goog.base(this, keyframes, element, duration, opt_acc);
};
goog.inherits(npf.fx.KeyframeAnimation, npf.fx.CssAnimation);


/**
 * @enum {string}
 * @deprecated Use npf.style.animation.Direction
 */
npf.fx.KeyframeAnimation.Direction = {
  NORMAL: npf.style.animation.Direction.NORMAL,
  ALTERNATE: npf.style.animation.Direction.ALTERNATE
};

/**
 * @enum {string}
 * @deprecated Use npf.style.animation.PlayState
 */
npf.fx.KeyframeAnimation.PlayState = {
  RUNNING: npf.style.animation.PlayState.RUNNING,
  PAUSED: npf.style.animation.PlayState.PAUSED
};

/**
 * @enum {string}
 * @deprecated
 */
npf.fx.KeyframeAnimation.CssProperty = {
  ANIMATION: npf.userAgent.support.getCssPropertyName(
    'animation'),
  ANIMATION_DELAY: npf.userAgent.support.getCssPropertyName(
    'animation-delay'),
  ANIMATION_DIRECTION: npf.userAgent.support.getCssPropertyName(
    'animation-direction'),
  ANIMATION_DURATION: npf.userAgent.support.getCssPropertyName(
    'animation-duration'),
  ANIMATION_ITERATION_COUNT: npf.userAgent.support.getCssPropertyName(
    'animation-iteration-count'),
  ANIMATION_NAME: npf.userAgent.support.getCssPropertyName(
    'animation-name'),
  ANIMATION_PLAY_STATE: npf.userAgent.support.getCssPropertyName(
    'animation-play-state'),
  ANIMATION_TIMING_FUNCTION: npf.userAgent.support.getCssPropertyName(
    'animation-timing-function')
};

/**
 * @enum {Array.<number>}
 * @deprecated Use npf.fx.CssAnimation.PreferredTimingFunction.
 */
npf.fx.KeyframeAnimation.PreferredTimingFunction = {
  EASE: [0.25, 0.1, 0.25, 1],
  LINEAR: [0, 0, 1, 1],
  EASE_IN: [0.42, 0, 1, 1],
  EASE_OUT: [0, 0, 0.58, 1],
  EASE_IN_OUT: [0.42, 0, 0.58, 1]
};

/**
 * @return {boolean}
 * @deprecated Use npf.fx.CssAnimation.isSupported.
 */
npf.fx.KeyframeAnimation.isSupported = npf.fx.CssAnimation.isSupported;


/** @inheritDoc */
npf.fx.KeyframeAnimation.prototype.disposeInternal = function() {
  this.getKeyframes().dispose();

  goog.base(this, 'disposeInternal');
};

/**
 * @param {number|string} fromOpacity
 * @param {number|string} toOpacity
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToOpacity.
 */
npf.fx.KeyframeAnimation.prototype.fromToOpacityRule =
  npf.fx.KeyframeAnimation.prototype.fromToOpacity;

/**
 * @param {number|string} fromOpacity
 * @param {number|string} toOpacity
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToOpacity = function(fromOpacity,
                                                            toOpacity,
                                                            opt_fromAcc,
                                                            opt_toAcc) {
  this.setOpacity(fromOpacity, 0, opt_fromAcc);

  return this.setOpacity(toOpacity, 100, opt_toAcc);
};

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromOpacity.
 */
npf.fx.KeyframeAnimation.prototype.fromOpacityRule =
  npf.fx.KeyframeAnimation.prototype.fromOpacity;

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromOpacity = function(opacity, opt_acc) {
  return this.setOpacity(opacity, 0, opt_acc);
};

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toOpacity.
 */
npf.fx.KeyframeAnimation.prototype.toOpacityRule =
  npf.fx.KeyframeAnimation.prototype.toOpacity;

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toOpacity = function(opacity, opt_acc) {
  return this.setOpacity(opacity, 100, opt_acc);
};

/**
 * @param {number|string} opacity
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setOpacity.
 */
npf.fx.KeyframeAnimation.prototype.setOpacityRule =
  npf.fx.KeyframeAnimation.prototype.setOpacity;

/**
 * @param {number|string} opacity
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setOpacity = function(opacity, position,
                                                         opt_acc) {
  this.getKeyframes().setOpacity(opacity, position, opt_acc);

  return this;
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} fromCoords
 * @param {Array.<number|string>|goog.math.Coordinate} toCoords
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToPosition.
 */
npf.fx.KeyframeAnimation.prototype.fromToPositionRule =
  npf.fx.KeyframeAnimation.prototype.fromToPosition;

/**
 * @param {Array.<number|string>|goog.math.Coordinate} fromCoords
 * @param {Array.<number|string>|goog.math.Coordinate} toCoords
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToPosition = function(fromCoords,
                                                             toCoords,
                                                             opt_fromAcc,
                                                             opt_toAcc) {
  this.setPosition(fromCoords, 0, opt_fromAcc);

  return this.setPosition(toCoords, 100, opt_toAcc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromPosition.
 */
npf.fx.KeyframeAnimation.prototype.fromPositionRule =
  npf.fx.KeyframeAnimation.prototype.fromPosition;

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromPosition = function(coords, opt_acc) {
  return this.setPosition(coords, 0, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toPosition.
 */
npf.fx.KeyframeAnimation.prototype.toPositionRule =
  npf.fx.KeyframeAnimation.prototype.toPosition;

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toPosition = function(coords, opt_acc) {
  return this.setPosition(coords, 100, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setPosition.
 */
npf.fx.KeyframeAnimation.prototype.setPositionRule =
  npf.fx.KeyframeAnimation.prototype.setPosition;

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setPosition = function(coords, position,
                                                          opt_acc) {
  this.getKeyframes().setPosition(coords, position, opt_acc);

  return this;
};

/**
 * @param {number|string} fromLeft
 * @param {number|string} toLeft
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToLeft.
 */
npf.fx.KeyframeAnimation.prototype.fromToLeftRule =
  npf.fx.KeyframeAnimation.prototype.fromToLeft;

/**
 * @param {number|string} fromLeft
 * @param {number|string} toLeft
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToLeft = function(fromLeft, toLeft,
                                                         opt_fromAcc,
                                                         opt_toAcc) {
  this.setLeft(fromLeft, 0, opt_fromAcc);

  return this.setLeft(toLeft, 100, opt_toAcc);
};

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromLeft.
 */
npf.fx.KeyframeAnimation.prototype.fromLeftRule =
  npf.fx.KeyframeAnimation.prototype.fromLeft;

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromLeft = function(left, opt_acc) {
  return this.setLeft(left, 0, opt_acc);
};

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toLeft.
 */
npf.fx.KeyframeAnimation.prototype.toLeftRule =
  npf.fx.KeyframeAnimation.prototype.toLeft;

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toLeft = function(left, opt_acc) {
  return this.setLeft(left, 100, opt_acc);
};

/**
 * @param {number|string} left
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setLeft.
 */
npf.fx.KeyframeAnimation.prototype.setLeftRule =
  npf.fx.KeyframeAnimation.prototype.setLeft;

/**
 * @param {number|string} left
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setLeft = function(left, position, opt_acc) {
  this.getKeyframes().setLeft(left, position, opt_acc);

  return this;
};

/**
 * @param {number|string} fromTop
 * @param {number|string} toTop
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToTop.
 */
npf.fx.KeyframeAnimation.prototype.fromToTopRule =
  npf.fx.KeyframeAnimation.prototype.fromToTop;

/**
 * @param {number|string} fromTop
 * @param {number|string} toTop
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToTop = function(fromTop, toTop,
                                                        opt_fromAcc,
                                                        opt_toAcc) {
  this.setTop(fromTop, 0, opt_fromAcc);

  return this.setTop(toTop, 100, opt_toAcc);
};

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromTop.
 */
npf.fx.KeyframeAnimation.prototype.fromTopRule =
  npf.fx.KeyframeAnimation.prototype.fromTop;

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromTop = function(top, opt_acc) {
  return this.setTop(top, 0, opt_acc);
};

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toTop.
 */
npf.fx.KeyframeAnimation.prototype.toTopRule =
  npf.fx.KeyframeAnimation.prototype.toTop;

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toTop = function(top, opt_acc) {
  return this.setTop(top, 100, opt_acc);
};

/**
 * @param {number|string} top
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setTop.
 */
npf.fx.KeyframeAnimation.prototype.setTopRule =
  npf.fx.KeyframeAnimation.prototype.setTop;

/**
 * @param {number|string} top
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setTop = function(top, position, opt_acc) {
  this.getKeyframes().setTop(top, position, opt_acc);

  return this;
};

/**
 * @param {number|string} fromRight
 * @param {number|string} toRight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToRight.
 */
npf.fx.KeyframeAnimation.prototype.fromToRightRule =
  npf.fx.KeyframeAnimation.prototype.fromToRight;

/**
 * @param {number|string} fromRight
 * @param {number|string} toRight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToRight = function(fromRight, toRight,
                                                          opt_fromAcc,
                                                          opt_toAcc) {
  this.setRight(fromRight, 0, opt_fromAcc);

  return this.setRight(toRight, 100, opt_toAcc);
};

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromRight.
 */
npf.fx.KeyframeAnimation.prototype.fromRightRule =
  npf.fx.KeyframeAnimation.prototype.fromRight;

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromRight = function(right, opt_acc) {
  return this.setRight(right, 0, opt_acc);
};

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toRight.
 */
npf.fx.KeyframeAnimation.prototype.toRightRule =
  npf.fx.KeyframeAnimation.prototype.toRight;

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toRight = function(right, opt_acc) {
  return this.setRight(right, 100, opt_acc);
};

/**
 * @param {number|string} right
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setRight.
 */
npf.fx.KeyframeAnimation.prototype.setRightRule =
  npf.fx.KeyframeAnimation.prototype.setRight;

/**
 * @param {number|string} right
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setRight = function(right, position,
                                                       opt_acc) {
  this.getKeyframes().setRight(right, position, opt_acc);

  return this;
};

/**
 * @param {number|string} fromBottom
 * @param {number|string} toBottom
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToBottom.
 */
npf.fx.KeyframeAnimation.prototype.fromToBottomRule =
  npf.fx.KeyframeAnimation.prototype.fromToBottom;

/**
 * @param {number|string} fromBottom
 * @param {number|string} toBottom
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToBottom = function(fromBottom,
                                                           toBottom,
                                                           opt_fromAcc,
                                                           opt_toAcc) {
  this.setBottom(fromBottom, 0, opt_fromAcc);

  return this.setBottom(toBottom, 100, opt_toAcc);
};

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromBottom.
 */
npf.fx.KeyframeAnimation.prototype.fromBottomRule =
  npf.fx.KeyframeAnimation.prototype.fromBottom;

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromBottom = function(bottom, opt_acc) {
  return this.setBottom(bottom, 0, opt_acc);
};

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toBottom.
 */
npf.fx.KeyframeAnimation.prototype.toBottomRule =
  npf.fx.KeyframeAnimation.prototype.toBottom;

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toBottom = function(bottom, opt_acc) {
  return this.setBottom(bottom, 100, opt_acc);
};

/**
 * @param {number|string} bottom
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setBottom.
 */
npf.fx.KeyframeAnimation.prototype.setBottomRule =
  npf.fx.KeyframeAnimation.prototype.setBottom;

/**
 * @param {number|string} bottom
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setBottom = function(bottom, position,
                                                        opt_acc) {
  this.getKeyframes().setBottom(bottom, position, opt_acc);

  return this;
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} fromSize
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} toSize
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToSize.
 */
npf.fx.KeyframeAnimation.prototype.fromToSizeRule =
  npf.fx.KeyframeAnimation.prototype.fromToSize;

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} fromSize
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} toSize
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToSize = function(fromSize, toSize,
                                                         opt_fromAcc,
                                                         opt_toAcc) {
  this.setSize(fromSize, 0, opt_fromAcc);

  return this.setSize(toSize, 100, opt_toAcc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromSize.
 */
npf.fx.KeyframeAnimation.prototype.fromSizeRule =
  npf.fx.KeyframeAnimation.prototype.fromSize;

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromSize = function(size, opt_acc) {
  return this.setSize(size, 0, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toSize.
 */
npf.fx.KeyframeAnimation.prototype.toSizeRule =
  npf.fx.KeyframeAnimation.prototype.toSize;

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toSize = function(size, opt_acc) {
  return this.setSize(size, 100, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setSize.
 */
npf.fx.KeyframeAnimation.prototype.setSizeRule =
  npf.fx.KeyframeAnimation.prototype.setSize;

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setSize = function(size, position, opt_acc) {
  this.getKeyframes().setSize(size, position, opt_acc);

  return this;
};

/**
 * @param {number|string} fromWidth
 * @param {number|string} toWidth
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToWidth.
 */
npf.fx.KeyframeAnimation.prototype.fromToWidthRule =
  npf.fx.KeyframeAnimation.prototype.fromToWidth;

/**
 * @param {number|string} fromWidth
 * @param {number|string} toWidth
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToWidth = function(fromWidth, toWidth,
                                                          opt_fromAcc,
                                                          opt_toAcc) {
  this.setWidth(fromWidth, 0, opt_fromAcc);

  return this.setWidth(toWidth, 100, opt_toAcc);
};

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromWidth.
 */
npf.fx.KeyframeAnimation.prototype.fromWidthRule =
  npf.fx.KeyframeAnimation.prototype.fromWidth;

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromWidth = function(width, opt_acc) {
  return this.setWidth(width, 0, opt_acc);
};

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toWidth.
 */
npf.fx.KeyframeAnimation.prototype.toWidthRule =
  npf.fx.KeyframeAnimation.prototype.toWidth;

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toWidth = function(width, opt_acc) {
  return this.setWidth(width, 100, opt_acc);
};

/**
 * @param {number|string} width
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setWidth.
 */
npf.fx.KeyframeAnimation.prototype.setWidthRule =
  npf.fx.KeyframeAnimation.prototype.setWidth;

/**
 * @param {number|string} width
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setWidth = function(width, position,
                                                       opt_acc) {
  this.getKeyframes().setWidth(width, position, opt_acc);

  return this;
};

/**
 * @param {number|string} fromHeight
 * @param {number|string} toHeight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToHeight.
 */
npf.fx.KeyframeAnimation.prototype.fromToHeightRule =
  npf.fx.KeyframeAnimation.prototype.fromToHeight;

/**
 * @param {number|string} fromHeight
 * @param {number|string} toHeight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToHeight = function(fromHeight, toHeight,
                                                           opt_fromAcc,
                                                           opt_toAcc) {
  this.setHeight(fromHeight, 0, opt_fromAcc);

  return this.setHeight(toHeight, 100, opt_toAcc);
};

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromHeight.
 */
npf.fx.KeyframeAnimation.prototype.fromHeightRule =
  npf.fx.KeyframeAnimation.prototype.fromHeight;

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromHeight = function(height, opt_acc) {
  return this.setHeight(height, 0, opt_acc);
};

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toHeight.
 */
npf.fx.KeyframeAnimation.prototype.toHeightRule =
  npf.fx.KeyframeAnimation.prototype.toHeight;

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toHeight = function(height, opt_acc) {
  return this.setHeight(height, 100, opt_acc);
};

/**
 * @param {number|string} height
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setHeight.
 */
npf.fx.KeyframeAnimation.prototype.setHeightRule =
  npf.fx.KeyframeAnimation.prototype.setHeight;

/**
 * @param {number|string} height
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setHeight = function(height, position,
                                                        opt_acc) {
  this.getKeyframes().setHeight(height, position, opt_acc);

  return this;
};

/**
 * @param {string|Array.<number>} fromColor
 * @param {string|Array.<number>} toColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToColor.
 */
npf.fx.KeyframeAnimation.prototype.fromToColorRule =
  npf.fx.KeyframeAnimation.prototype.fromToColor;

/**
 * @param {string|Array.<number>} fromColor
 * @param {string|Array.<number>} toColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToColor = function(fromColor, toColor,
                                                          opt_fromAcc,
                                                          opt_toAcc) {
  this.setColor(fromColor, 0, opt_fromAcc);

  return this.setColor(toColor, 100, opt_toAcc);
};

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromColor.
 */
npf.fx.KeyframeAnimation.prototype.fromColorRule =
  npf.fx.KeyframeAnimation.prototype.fromColor;

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromColor = function(color, opt_acc) {
  return this.setColor(color, 0, opt_acc);
};

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toColor.
 */
npf.fx.KeyframeAnimation.prototype.toColorRule =
  npf.fx.KeyframeAnimation.prototype.toColor;

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toColor = function(color, opt_acc) {
  return this.setColor(color, 100, opt_acc);
};

/**
 * @param {string|Array.<number>} color
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setColor.
 */
npf.fx.KeyframeAnimation.prototype.setColorRule =
  npf.fx.KeyframeAnimation.prototype.setColor;

/**
 * @param {string|Array.<number>} color
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setColor = function(color, position,
                                                       opt_acc) {
  this.getKeyframes().setColor(color, position, opt_acc);

  return this;
};

/**
 * @param {string|Array.<number>} fromBgColor
 * @param {string|Array.<number>} toBgColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToBgColor.
 */
npf.fx.KeyframeAnimation.prototype.fromToBgColorRule =
  npf.fx.KeyframeAnimation.prototype.fromToBgColor;

/**
 * @param {string|Array.<number>} fromBgColor
 * @param {string|Array.<number>} toBgColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToBgColor = function(fromBgColor,
                                                            toBgColor,
                                                            opt_fromAcc,
                                                            opt_toAcc) {
  this.setBgColor(fromBgColor, 0, opt_fromAcc);

  return this.setBgColor(toBgColor, 100, opt_toAcc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromBgColor.
 */
npf.fx.KeyframeAnimation.prototype.fromBgColorRule =
  npf.fx.KeyframeAnimation.prototype.fromBgColor;

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromBgColor = function(bgColor, opt_acc) {
  return this.setBgColor(bgColor, 0, opt_acc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toBgColor.
 */
npf.fx.KeyframeAnimation.prototype.toBgColorRule =
  npf.fx.KeyframeAnimation.prototype.toBgColor;

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toBgColor = function(bgColor, opt_acc) {
  return this.setBgColor(bgColor, 100, opt_acc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setBgColor.
 */
npf.fx.KeyframeAnimation.prototype.setBgColorRule =
  npf.fx.KeyframeAnimation.prototype.setBgColor;

/**
 * @param {string|Array.<number>} bgColor
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setBgColor = function(bgColor, position,
                                                         opt_acc) {
  this.getKeyframes().setBgColor(bgColor, position, opt_acc);

  return this;
};

/**
 * @param {string} fromTransform
 * @param {string} toTransform
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromToTransform.
 */
npf.fx.KeyframeAnimation.prototype.fromToTransformRule =
  npf.fx.KeyframeAnimation.prototype.fromToTransform;

/**
 * @param {string} fromTransform
 * @param {string} toTransform
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromToTransform = function(fromTransform,
                                                              toTransform,
                                                              opt_fromAcc,
                                                              opt_toAcc) {
  this.setTransform(fromTransform, 0, opt_fromAcc);

  return this.setTransform(toTransform, 100, opt_toAcc);
};

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.fromTransform.
 */
npf.fx.KeyframeAnimation.prototype.fromTransformRule =
  npf.fx.KeyframeAnimation.prototype.fromTransform;

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromTransform = function(transform,
                                                            opt_acc) {
  return this.setTransform(transform, 0, opt_acc);
};

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.toTransform.
 */
npf.fx.KeyframeAnimation.prototype.toTransformRule =
  npf.fx.KeyframeAnimation.prototype.toTransform;

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.toTransform = function(transform, opt_acc) {
  return this.setTransform(transform, 100, opt_acc);
};

/**
 * @param {string} transform
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 * @deprecated Use npf.fx.KeyframeAnimation.prototype.setTransform.
 */
npf.fx.KeyframeAnimation.prototype.setTransformRule =
  npf.fx.KeyframeAnimation.prototype.setTransform;

/**
 * @param {string} transform
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.setTransform = function(transform, position,
                                                           opt_acc) {
  this.getKeyframes().setTransform(transform, position, opt_acc);

  return this;
};

/**
 * @param {Object.<string,string|number>} fromRules
 * @param {Object.<string,string|number>} toRules
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.fromTo = function(fromRules, toRules,
                                                     opt_fromAcc, opt_toAcc) {
  this.from(fromRules, opt_fromAcc);

  return this.to(toRules, opt_toAcc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.from = function(rules, opt_acc) {
  return this.insertKeyframe(rules, 0, opt_acc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.to = function(rules, opt_acc) {
  return this.insertKeyframe(rules, 100, opt_acc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {number} position from 0 to 100
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.KeyframeAnimation}
 */
npf.fx.KeyframeAnimation.prototype.insertKeyframe = function(rules, position,
                                                             opt_acc) {
  this.getKeyframes().insertKeyframe(rules, position, opt_acc);

  return this;
};
