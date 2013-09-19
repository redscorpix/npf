goog.provide('npf.fx.DomAnimation');

goog.require('goog.fx.AnimationParallelQueue');
goog.require('npf.fx.Animation');
goog.require('npf.fx.Animation.Timing');
goog.require('npf.fx.dom.BgColorTransform');
goog.require('npf.fx.dom.ColorTransform');
goog.require('npf.fx.dom.Fade');
goog.require('npf.fx.dom.FadeIn');
goog.require('npf.fx.dom.FadeInAndShow');
goog.require('npf.fx.dom.FadeOut');
goog.require('npf.fx.dom.FadeOutAndHide');
goog.require('npf.fx.dom.Resize');
goog.require('npf.fx.dom.ResizeHeight');
goog.require('npf.fx.dom.ResizeWidth');
goog.require('npf.fx.dom.Scroll');
goog.require('npf.fx.dom.Slide');
goog.require('npf.fx.dom.SlideLeft');
goog.require('npf.fx.dom.SlideRight');
goog.require('npf.fx.dom.SlideTop');
goog.require('npf.fx.dom.SlideFrom');
goog.require('npf.fx.dom.SlideLeftFrom');
goog.require('npf.fx.dom.SlideTopFrom');
goog.require('npf.fx.dom.Swipe');
goog.require('npf.fx.dom.Transform');


/**
 * @param {Element} element
 * @param {number} time
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=} opt_acc Acceleration
 *          function, returns 0-1 for inputs 0-1.
 * @constructor
 * @extends {goog.fx.AnimationParallelQueue}
 */
npf.fx.DomAnimation = function(element, time, opt_acc) {
  goog.base(this);

  this.element = element;
  this.time = time;
  this.accel = opt_acc || null;
};
goog.inherits(npf.fx.DomAnimation, goog.fx.AnimationParallelQueue);


/**
 * @type {Element}
 */
npf.fx.DomAnimation.prototype.element;

/**
 * @type {number}
 */
npf.fx.DomAnimation.prototype.time;

/**
 * @type {Array.<number>|npf.fx.Animation.Timing|function(number):number|null}
 */
npf.fx.DomAnimation.prototype.accel;


/** @inheritDoc */
npf.fx.DomAnimation.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.element = null;
  this.accel = null;
};

/**
 * @param {Array.<number>} start 3D Array for RGB of start color.
 * @param {Array.<number>} end 3D Array for RGB of end color.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.BgColorTransform}
 */
npf.fx.DomAnimation.prototype.addBgColorTransform = function(start, end,
    opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.BgColorTransform(
    this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>} start 3D Array representing R,G,B.
 * @param {Array.<number>} end 3D Array representing R,G,B.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.ColorTransform}
 */
npf.fx.DomAnimation.prototype.addColorTransform = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.ColorTransform(this.element, start, end, time,
    accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>|number} start 1D Array or Number with start opacity.
 * @param {Array.<number>|number} end 1D Array or Number for end opacity.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.Fade}
 */
npf.fx.DomAnimation.prototype.addFade = function(start, end, opt_time,
                                                 opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.Fade(this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.FadeIn}
 */
npf.fx.DomAnimation.prototype.addFadeIn = function(opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.FadeIn(this.element, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.FadeInAndShow}
 */
npf.fx.DomAnimation.prototype.addFadeInAndShow = function(opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.FadeInAndShow(this.element, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.FadeOut}
 */
npf.fx.DomAnimation.prototype.addFadeOut = function(opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.FadeOut(this.element, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.FadeOutAndHide}
 */
npf.fx.DomAnimation.prototype.addFadeOutAndHide = function(opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.FadeOutAndHide(this.element, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>} start 2D array for start width and height.
 * @param {Array.<number>} end 2D array for end width and height.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.Resize}
 */
npf.fx.DomAnimation.prototype.addResize = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.Resize(this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} start Start width.
 * @param {number} end End width.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.ResizeWidth}
 */
npf.fx.DomAnimation.prototype.addResizeWidth = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.ResizeWidth(this.element, start, end, time,
    accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} start Start height.
 * @param {number} end End height.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.ResizeHeight}
 */
npf.fx.DomAnimation.prototype.addResizeHeight = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.ResizeHeight(this.element, start, end, time,
    accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>} start 2D array for start scroll left and top.
 * @param {Array.<number>} end 2D array for end scroll left and top.
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.Scroll}
 */
npf.fx.DomAnimation.prototype.addScroll = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.Scroll(this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>} start 2D array for start coordinates (X, Y).
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.Slide}
 */
npf.fx.DomAnimation.prototype.addSlide = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.Slide(this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} start
 * @param {number} end
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.SlideLeft}
 */
npf.fx.DomAnimation.prototype.addSlideLeft = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.SlideLeft(this.element, start, end, time,
    accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} start
 * @param {number} end
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.SlideRight}
 */
npf.fx.DomAnimation.prototype.addSlideRight = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.SlideRight(this.element, start, end, time,
    accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} start
 * @param {number} end
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.SlideTop}
 */
npf.fx.DomAnimation.prototype.addSlideTop = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.SlideTop(this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.SlideFrom}
 */
npf.fx.DomAnimation.prototype.addSlideFrom = function(end, opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.SlideFrom(this.element, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} end
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.SlideLeftFrom}
 */
npf.fx.DomAnimation.prototype.addSlideLeftFrom = function(end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.SlideLeftFrom(this.element, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number} end
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.SlideTopFrom}
 */
npf.fx.DomAnimation.prototype.addSlideTopFrom = function(end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.SlideTopFrom(this.element, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {Array.<number>} start 2D array for start size (W, H).
 * @param {Array.<number>} end 2D array for end size (W, H).
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.Swipe}
 */
npf.fx.DomAnimation.prototype.addSwipe = function(start, end, opt_time,
    opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.Swipe(this.element, start, end, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.dom.Transform}
 */
npf.fx.DomAnimation.prototype.addTransform = function(opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.dom.Transform(this.element, time, accel);
  this.add(animation);

  return animation;
};

/**
 * @param {number=} opt_time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @return {!npf.fx.Animation}
 */
npf.fx.DomAnimation.prototype.addCustom = function(opt_time, opt_acc) {
  var time = goog.isDef(opt_time) ? opt_time : this.time;
  var accel = opt_acc ? opt_acc : this.accel;
  var animation = new npf.fx.Animation([0], [1], time, accel);
  this.add(animation);

  return animation;
};
