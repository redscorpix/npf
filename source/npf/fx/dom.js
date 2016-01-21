goog.provide('npf.fx.dom');
goog.provide('npf.fx.dom.BgColorTransform');
goog.provide('npf.fx.dom.ColorTransform');
goog.provide('npf.fx.dom.Fade');
goog.provide('npf.fx.dom.FadeIn');
goog.provide('npf.fx.dom.FadeInAndShow');
goog.provide('npf.fx.dom.FadeOut');
goog.provide('npf.fx.dom.FadeOutAndHide');
goog.provide('npf.fx.dom.PredefinedEffect');
goog.provide('npf.fx.dom.Resize');
goog.provide('npf.fx.dom.ResizeHeight');
goog.provide('npf.fx.dom.ResizeWidth');
goog.provide('npf.fx.dom.Scroll');
goog.provide('npf.fx.dom.Slide');
goog.provide('npf.fx.dom.SlideLeft');
goog.provide('npf.fx.dom.SlideRight');
goog.provide('npf.fx.dom.SlideTop');
goog.provide('npf.fx.dom.SlideFrom');
goog.provide('npf.fx.dom.SlideLeftFrom');
goog.provide('npf.fx.dom.SlideTopFrom');
goog.provide('npf.fx.dom.Swipe');
goog.provide('npf.fx.dom.Transform');

goog.require('goog.array');
goog.require('goog.color');
goog.require('goog.fx.Transition.EventType');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.fx.Animation');


/**
 * Abstract class that provides reusable functionality for predefined animations
 * that manipulate a single DOM element
 *
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start Array for start coordinates.
 * @param {Array.<number>} end Array for end coordinates.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @struct
 * @extends {npf.fx.Animation}
 */
npf.fx.dom.PredefinedEffect = function(element, start, end, time, opt_acc) {
  npf.fx.dom.PredefinedEffect.base(
    this, 'constructor', start, end, time, opt_acc);

  /**
   * DOM Node that will be used in the animation
   * @type {Element}
   */
  this.element = element;
};
goog.inherits(npf.fx.dom.PredefinedEffect, npf.fx.Animation);


/**
 * Called to update the style of the element.
 * @protected
 */
npf.fx.dom.PredefinedEffect.prototype.updateStyle = goog.nullFunction;

/** @override */
npf.fx.dom.PredefinedEffect.prototype.onAnimate = function() {
  this.updateStyle();

  npf.fx.dom.PredefinedEffect.base(this, 'onAnimate');
};

/** @override */
npf.fx.dom.PredefinedEffect.prototype.onEnd = function() {
  this.updateStyle();

  npf.fx.dom.PredefinedEffect.base(this, 'onEnd');
};

/** @override */
npf.fx.dom.PredefinedEffect.prototype.onBegin = function() {
  this.updateStyle();

  npf.fx.dom.PredefinedEffect.base(this, 'onBegin');
};

/**
 * Creates an animation object that will slide an element from A to B.
 * (This in effect automatically
 * sets up the onanimate event for an Animation object)
 * Start and End should be 2 dimensional arrays
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start coordinates (X, Y).
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.Slide = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }

  npf.fx.dom.Slide.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.Slide, npf.fx.dom.PredefinedEffect);


/** @override */
npf.fx.dom.Slide.prototype.updateStyle = function() {
  this.element.style.left = Math.round(this.coords[0]) + 'px';
  this.element.style.top = Math.round(this.coords[1]) + 'px';
};


/**
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} start
 * @param {number} end
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.SlideLeft = function(element, start, end, time, opt_acc) {
  npf.fx.dom.SlideLeft.base(
    this, 'constructor', element, [start], [end], time, opt_acc);
};
goog.inherits(npf.fx.dom.SlideLeft, npf.fx.dom.PredefinedEffect);

/** @override */
npf.fx.dom.SlideLeft.prototype.updateStyle = function() {
  this.element.style.left = Math.round(this.coords[0]) + 'px';
};

/**
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} start
 * @param {number} end
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.SlideRight = function(element, start, end, time, opt_acc) {
  npf.fx.dom.SlideRight.base(
    this, 'constructor', element, [start], [end], time, opt_acc);
};
goog.inherits(npf.fx.dom.SlideRight, npf.fx.dom.PredefinedEffect);

/** @override */
npf.fx.dom.SlideRight.prototype.updateStyle = function() {
  this.element.style.right = Math.round(this.coords[0]) + 'px';
};

/**
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} start
 * @param {number} end
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.SlideTop = function(element, start, end, time, opt_acc) {
  npf.fx.dom.SlideTop.base(
    this, 'constructor', element, [start], [end], time, opt_acc);
};
goog.inherits(npf.fx.dom.SlideTop, npf.fx.dom.PredefinedEffect);

/** @override */
npf.fx.dom.SlideTop.prototype.updateStyle = function() {
  this.element.style.top = Math.round(this.coords[0]) + 'px';
};

/**
 * Slides an element from its current position.
 *
 * @param {Element} element DOM node to be used in the animation.
 * @param {Array.<number>} end 2D array for end coordinates (X, Y).
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.Slide}
 * @constructor
 * @struct
 */
npf.fx.dom.SlideFrom = function(element, end, time, opt_acc) {
  var start = [element.offsetLeft, element.offsetTop];
  npf.fx.dom.SlideFrom.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.SlideFrom, npf.fx.dom.Slide);

/** @override */
npf.fx.dom.SlideFrom.prototype.onBegin = function() {
  this.startPoint = [this.element.offsetLeft, this.element.offsetTop];

  npf.fx.dom.SlideFrom.base(this, 'onBegin');
};

/**
 * Slides an element from its current position.
 * @param {Element} element DOM node to be used in the animation.
 * @param {number} end
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.SlideLeft}
 * @constructor
 * @struct
 */
npf.fx.dom.SlideLeftFrom = function(element, end, time, opt_acc) {
  var start = element.offsetLeft;
  npf.fx.dom.SlideLeftFrom.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.SlideLeftFrom, npf.fx.dom.SlideLeft);

/** @override */
npf.fx.dom.SlideLeftFrom.prototype.onBegin = function() {
  this.startPoint = [this.element.offsetLeft];

  npf.fx.dom.SlideLeftFrom.base(this, 'onBegin');
};

/**
 * Slides an element from its current position.
 * @param {Element} element DOM node to be used in the animation.
 * @param {number} end
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.SlideTop}
 * @constructor
 * @struct
 */
npf.fx.dom.SlideTopFrom = function(element, end, time, opt_acc) {
  var start = element.offsetTop;
  npf.fx.dom.SlideTopFrom.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.SlideTopFrom, npf.fx.dom.SlideTop);

/** @override */
npf.fx.dom.SlideTopFrom.prototype.onBegin = function() {
  this.startPoint = [this.element.offsetTop];

  npf.fx.dom.SlideTopFrom.base(this, 'onBegin');
};

/**
 * Creates an animation object that will slide an element into its final size.
 * Requires that the element is absolutely positioned.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start size (W, H).
 * @param {Array.<number>} end 2D array for end size (W, H).
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.Swipe = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }

  npf.fx.dom.Swipe.base(
    this, 'constructor', element, start, end, time, opt_acc);

  /**
   * Maximum width for element.
   * @type {number} @private
   */
  this.maxWidth_ = Math.max(this.endPoint[0], this.startPoint[0]);

  /**
   * Maximum height for element.
   * @type {number} @private
   */
  this.maxHeight_ = Math.max(this.endPoint[1], this.startPoint[1]);
};
goog.inherits(npf.fx.dom.Swipe, npf.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will resize an element by setting its width,
 * height and clipping.
 * @protected
 * @override
 */
npf.fx.dom.Swipe.prototype.updateStyle = function() {
  var x = this.coords[0];
  var y = this.coords[1];
  this.clip_(Math.round(x), Math.round(y), this.maxWidth_, this.maxHeight_);
  this.element.style.width = Math.round(x) + 'px';
  this.element.style.marginLeft = Math.round(x) - this.maxWidth_ + 'px';
  this.element.style.marginTop = Math.round(y) - this.maxHeight_ + 'px';
};

/**
 * Helper function for setting element clipping.
 * @param {number} x Current element width.
 * @param {number} y Current element height.
 * @param {number} w Maximum element width.
 * @param {number} h Maximum element height.
 * @private
 */
npf.fx.dom.Swipe.prototype.clip_ = function(x, y, w, h) {
  this.element.style.clip = 'rect(' + (h - y) + 'px ' + w + 'px ' + h + 'px ' +
    (w - x) + 'px)';
};

/**
 * Creates an animation object that will scroll an element from A to B.
 * Start and End should be 2 dimensional arrays
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start scroll left and top.
 * @param {Array.<number>} end 2D array for end scroll left and top.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.Scroll = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }

  npf.fx.dom.Scroll.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.Scroll, npf.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will set the scroll posiiton of an element
 * @protected
 * @override
 */
npf.fx.dom.Scroll.prototype.updateStyle = function() {
  this.element.scrollLeft = Math.round(this.coords[0]);
  this.element.scrollTop = Math.round(this.coords[1]);
};

/**
 * Creates an animation object that will resize an element between two widths
 * and heights. Start and End should be 2 dimensional arrays
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start width and height.
 * @param {Array.<number>} end 2D array for end width and height.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.Resize = function(element, start, end, time, opt_acc) {
  if (start.length != 2 || end.length != 2) {
    throw Error('Start and end points must be 2D');
  }

  npf.fx.dom.Resize.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.Resize, npf.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will resize an element by setting its width
 * and height.
 * @protected
 * @override
 */
npf.fx.dom.Resize.prototype.updateStyle = function() {
  this.element.style.width = Math.round(this.coords[0]) + 'px';
  this.element.style.height = Math.round(this.coords[1]) + 'px';
};

/**
 * Creates an animation object that will resize an element between two widths
 * Start and End should be numbers
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} start Start width.
 * @param {number} end End width.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.ResizeWidth = function(element, start, end, time, opt_acc) {
  npf.fx.dom.ResizeWidth.base(
    this, 'constructor', element, [start], [end], time, opt_acc);
};
goog.inherits(npf.fx.dom.ResizeWidth, npf.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will resize an element by setting its width.
 * @protected
 * @override
 */
npf.fx.dom.ResizeWidth.prototype.updateStyle = function() {
  this.element.style.width = Math.round(this.coords[0]) + 'px';
};

/**
 * Creates an animation object that will resize an element between two heights
 * Start and End should be numbers
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} start Start height.
 * @param {number} end End height.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.ResizeHeight = function(element, start, end, time, opt_acc) {
  npf.fx.dom.ResizeHeight.base(
    this, 'constructor', element, [start], [end], time, opt_acc);
};
goog.inherits(npf.fx.dom.ResizeHeight, npf.fx.dom.PredefinedEffect);

/**
 * Animation event handler that will resize an element by setting its height.
 * @protected
 * @override
 */
npf.fx.dom.ResizeHeight.prototype.updateStyle = function() {
  this.element.style.height = Math.round(this.coords[0]) + 'px';
};

/**
 * Creates an animation object that fades the opacity of an element between
 * two limits. Start and End should be floats between 0 and 1
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>|number} start 1D Array or Number with start opacity.
 * @param {Array.<number>|number} end 1D Array or Number for end opacity.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.Fade = function(element, start, end, time, opt_acc) {
  if (goog.isNumber(start)) {
    start = [start];
  }

  if (goog.isNumber(end)) {
    end = [end];
  }

  npf.fx.dom.Fade.base(this, 'constructor', element, start, end, time, opt_acc);

  if (start.length != 1 || end.length != 1) {
    throw Error('Start and end points must be 1D');
  }
};
goog.inherits(npf.fx.dom.Fade, npf.fx.dom.PredefinedEffect);


/**
 * Animation event handler that will set the opacity of an element.
 * @protected
 * @override
 */
npf.fx.dom.Fade.prototype.updateStyle = function() {
  this.element.style.opacity = this.coords[0];
};

/**
 * Animation event handler that will show the element.
 */
npf.fx.dom.Fade.prototype.show = function() {
  goog.style.setElementShown(this.element, true);
};

/**
 * Animation event handler that will hide the element
 */
npf.fx.dom.Fade.prototype.hide = function() {
  goog.style.setElementShown(this.element, false);
};


/**
 * Fades an element out from full opacity to completely transparent.
 *
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.Fade}
 * @constructor
 * @struct
 */
npf.fx.dom.FadeOut = function(element, time, opt_acc) {
  npf.fx.dom.FadeOut.base(this, 'constructor', element, 1, 0, time, opt_acc);
};
goog.inherits(npf.fx.dom.FadeOut, npf.fx.dom.Fade);


/**
 * Fades an element in from completely transparent to fully opacity.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.Fade}
 * @constructor
 * @struct
 */
npf.fx.dom.FadeIn = function(element, time, opt_acc) {
  npf.fx.dom.FadeIn.base(this, 'constructor', element, 0, 1, time, opt_acc);
};
goog.inherits(npf.fx.dom.FadeIn, npf.fx.dom.Fade);

/**
 * Fades an element out from full opacity to completely transparent and then
 * sets the display to 'none'.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.Fade}
 * @constructor
 * @struct
 */
npf.fx.dom.FadeOutAndHide = function(element, time, opt_acc) {
  npf.fx.dom.FadeOutAndHide.base(
    this, 'constructor', element, 1, 0, time, opt_acc);
};
goog.inherits(npf.fx.dom.FadeOutAndHide, npf.fx.dom.Fade);

/** @override */
npf.fx.dom.FadeOutAndHide.prototype.onBegin = function() {
  this.show();

  npf.fx.dom.FadeOutAndHide.base(this, 'onBegin');
};

/** @override */
npf.fx.dom.FadeOutAndHide.prototype.onEnd = function() {
  this.hide();

  npf.fx.dom.FadeOutAndHide.base(this, 'onEnd');
};


/**
 * Sets an element's display to be visible and then fades an element in from
 * completely transparent to fully opacity.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.Fade}
 * @constructor
 * @struct
 */
npf.fx.dom.FadeInAndShow = function(element, time, opt_acc) {
  npf.fx.dom.FadeInAndShow.base(
    this, 'constructor', element, 0, 1, time, opt_acc);
};
goog.inherits(npf.fx.dom.FadeInAndShow, npf.fx.dom.Fade);


/** @override */
npf.fx.dom.FadeInAndShow.prototype.onBegin = function() {
  this.show();

  npf.fx.dom.FadeInAndShow.base(this, 'onBegin');
};


/**
 * Provides a transformation of an elements background-color.
 * Start and End should be 3D arrays representing R,G,B
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 3D Array for RGB of start color.
 * @param {Array.<number>} end 3D Array for RGB of end color.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @extends {npf.fx.dom.PredefinedEffect}
 * @constructor
 * @struct
 */
npf.fx.dom.BgColorTransform = function(element, start, end, time, opt_acc) {
  if (start.length != 3 || end.length != 3) {
    throw Error('Start and end points must be 3D');
  }

  npf.fx.dom.BgColorTransform.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.BgColorTransform, npf.fx.dom.PredefinedEffect);


/**
 * Animation event handler that will set the background-color of an element
 */
npf.fx.dom.BgColorTransform.prototype.setColor = function() {
  var coordsAsInts = [];

  for (var i = 0; i < this.coords.length; i++) {
    coordsAsInts[i] = Math.round(this.coords[i]);
  }

  var color = 'rgb(' + coordsAsInts.join(',') + ')';
  this.element.style.backgroundColor = color;
};

/** @override */
npf.fx.dom.BgColorTransform.prototype.updateStyle = function() {
  this.setColor();
};


/**
 * Fade elements background color from start color to the element's current
 * background color. Start should be a 3D array representing R,G,B.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 3D Array for RGB of start color.
 * @param {number} time Length of animation in milliseconds.
 * @param {goog.events.EventHandler=} opt_eventHandler Optional event handler
 *                                             to use when listening for events.
 */
npf.fx.dom.bgColorFadeIn = function(element, start, time, opt_eventHandler) {
  var initialBgColor = element.style.backgroundColor || '';
  var computedBgColor = goog.style.getBackgroundColor(element);
  var end;

  if (
    computedBgColor &&
    computedBgColor != 'transparent' &&
    computedBgColor != 'rgba(0, 0, 0, 0)'
   ) {
    end = goog.color.hexToRgb(goog.color.parse(computedBgColor).hex);
  } else {
    end = [255, 255, 255];
  }

  var anim = new npf.fx.dom.BgColorTransform(element, start, end, time);

  function setBgColor() {
    element.style.backgroundColor = initialBgColor;
  }

  if (opt_eventHandler) {
    opt_eventHandler.listen(anim, goog.fx.Transition.EventType.END, setBgColor);
  } else {
    anim.listen(goog.fx.Transition.EventType.END, setBgColor);
  }

  anim.play();
};


/**
 * Provides a transformation of an elements color.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 3D Array representing R,G,B.
 * @param {Array.<number>} end 3D Array representing R,G,B.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @struct
 * @extends {npf.fx.dom.PredefinedEffect}
 */
npf.fx.dom.ColorTransform = function(element, start, end, time, opt_acc) {
  if (start.length != 3 || end.length != 3) {
    throw Error('Start and end points must be 3D');
  }

  npf.fx.dom.ColorTransform.base(
    this, 'constructor', element, start, end, time, opt_acc);
};
goog.inherits(npf.fx.dom.ColorTransform, npf.fx.dom.PredefinedEffect);


/**
 * Animation event handler that will set the color of an element.
 * @protected
 * @override
 */
npf.fx.dom.ColorTransform.prototype.updateStyle = function() {
  var coordsAsInts = [];

  for (var i = 0; i < this.coords.length; i++) {
    coordsAsInts[i] = Math.round(this.coords[i]);
  }

  var color = 'rgb(' + coordsAsInts.join(',') + ')';
  this.element.style.color = color;
};


/**
 * Provides a CSS3 transformation.
 * @param {Element} element Dom Node to be used in the animation.
 * @param {number} time Length of animation in milliseconds.
 * @param {Array.<number>|npf.fx.Animation.Timing|function(number):number|null=}
 *                    opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 * @constructor
 * @struct
 * @extends {npf.fx.dom.PredefinedEffect}
 */
npf.fx.dom.Transform = function(element, time, opt_acc) {
  npf.fx.dom.Transform.base(
    this, 'constructor', element, [0], [1], time, opt_acc);

  this.startParameters_ = {};
  this.endParameters_ = {};
};
goog.inherits(npf.fx.dom.Transform, npf.fx.dom.PredefinedEffect);


/**
 * @type {Object.<Array.<number>>}
 * @private
 */
npf.fx.dom.Transform.prototype.startParameters_;

/**
 * @type {Object.<Array.<number>>}
 * @private
 */
npf.fx.dom.Transform.prototype.endParameters_;


/** @inheritDoc */
npf.fx.dom.Transform.prototype.disposeInternal = function() {
  npf.fx.dom.Transform.base(this, 'disposeInternal');

  this.startParameters_ = null;
  this.endParameters_ = null;
};

/**
 * @param {Array.<number>} start 6D Array
 * @param {Array.<number>} end 6D Array
 */
npf.fx.dom.Transform.prototype.setMatrix = function(start, end) {
  if (6 != start.length) {
    throw Error('Start matrix parameters must be 2D');
  }

  if (6 != end.length) {
    throw Error('End matrix parameters must be 2D');
  }

  this.setProperties_('matrix', start, end);
};

/**
 * @param {Array.<number>} start 16D Array
 * @param {Array.<number>} end 16D Array
 */
npf.fx.dom.Transform.prototype.setMatrix3d = function(start, end) {
  if (16 != start.length) {
    throw Error('Start matrix3d parameters must be 2D');
  }

  if (16 != end.length) {
    throw Error('End matrix3d parameters must be 2D');
  }

  this.setProperties_('matrix3d', start, end);
};

/**
 * @param {number|Array.<number>} start 1D or 2D Array or Number
 * @param {number|Array.<number>} end 1D or 2D Array or Number
 */
npf.fx.dom.Transform.prototype.setTranslate = function(start, end) {
  /** @type {Array.<number>} */
  var from = goog.isArray(start) ? start : [start];
  /** @type {Array.<number>} */
  var to = goog.isArray(end) ? end : [end];

  if (1 > from.length || 2 < from.length) {
    throw Error('Start translate parameters must be 1D or 2D');
  }

  if (1 > to.length || 2 < to.length) {
    throw Error('End translate parameters must be 1D or 2D');
  }

  this.setProperties_('translate', from, to);
};

/**
 * @param {Array.<number>} start 3D Array
 * @param {Array.<number>} end 3D Array
 */
npf.fx.dom.Transform.prototype.setTranslate3d = function(start, end) {
  if (3 != start.length) {
    throw Error('Start translate3d parameters must be 3D');
  }

  if (3 != end.length) {
    throw Error('End translate3d parameters must be 3D');
  }

  this.setProperties_('translate3d', start, end);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setTranslateX = function(start, end) {
  this.setProperties_('translateX', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setTranslateY = function(start, end) {
  this.setProperties_('translateY', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setTranslateZ = function(start, end) {
  this.setProperties_('translateZ', [start], [end]);
};

/**
 * @param {number|Array.<number>} start 1D or 2D Array or Number
 * @param {number|Array.<number>} end 1D or 2D Array or Number
 */
npf.fx.dom.Transform.prototype.setScale = function(start, end) {
  /** @type {Array.<number>} */
  var from = goog.isArray(start) ? start : [start];
  /** @type {Array.<number>} */
  var to = goog.isArray(end) ? end : [end];

  if (1 > from.length || 2 < from.length) {
    throw Error('Start scale parameters must be 1D or 2D');
  }

  if (1 > to.length || 2 < to.length) {
    throw Error('End scale parameters must be 1D or 2D');
  }

  this.setProperties_('scale', from, to);
};

/**
 * @param {Array.<number>} start 3D Array
 * @param {Array.<number>} end 3D Array
 */
npf.fx.dom.Transform.prototype.setScale3d = function(start, end) {
  if (3 != start.length) {
    throw Error('Start scale3d parameters must be 3D');
  }

  if (3 != end.length) {
    throw Error('End scale3d parameters must be 3D');
  }

  this.setProperties_('scale3d', start, end);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setScaleX = function(start, end) {
  this.setProperties_('scaleX', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setScaleY = function(start, end) {
  this.setProperties_('scaleY', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setScaleZ = function(start, end) {
  this.setProperties_('scaleZ', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setRotate = function(start, end) {
  this.setProperties_('rotate', [start], [end]);
};

/**
 * @param {Array.<number>} start 4D Array
 * @param {Array.<number>} end 4D Array
 */
npf.fx.dom.Transform.prototype.setRotate3d = function(start, end) {
  if (4 != start.length) {
    throw Error('Start rotate3d parameters must be 4D');
  }

  if (4 != end.length) {
    throw Error('End rotate3d parameters must be 4D');
  }

  this.setProperties_('rotate3d', start, end);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setRotateX = function(start, end) {
  this.setProperties_('rotateX', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setRotateY = function(start, end) {
  this.setProperties_('rotateY', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setRotateZ = function(start, end) {
  this.setProperties_('rotateZ', [start], [end]);
};

/**
 * @param {number|Array.<number>} start 1D or 2D Array or Number
 * @param {number|Array.<number>} end 1D or 2D Array or Number
 */
npf.fx.dom.Transform.prototype.setSkew = function(start, end) {
  /** @type {Array.<number>} */
  var from = goog.isArray(start) ? start : [start];
  /** @type {Array.<number>} */
  var to = goog.isArray(end) ? end : [end];

  if (1 > from.length || 2 < from.length) {
    throw Error('Start skew parameters must be 1D or 2D');
  }

  if (1 > to.length || 2 < to.length) {
    throw Error('End skew parameters must be 1D or 2D');
  }

  this.setProperties_('skew', from, to);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setSkewX = function(start, end) {
  this.setProperties_('skewX', [start], [end]);
};

/**
 * @param {number} start
 * @param {number} end
 */
npf.fx.dom.Transform.prototype.setSkewY = function(start, end) {
  this.setProperties_('skewY', [start], [end]);
};

/**
 * @param {string} key
 * @param {Array.<number>} start
 * @param {Array.<number>} end
 * @private
 */
npf.fx.dom.Transform.prototype.setProperties_ = function(key, start, end) {
  this.startParameters_[key] = start;
  this.endParameters_[key] = end;
};

/**
 * @param {string|Array.<number|string>} origin
 */
npf.fx.dom.Transform.prototype.setTransformOrigin = function(origin) {
  var value;

  if (goog.isArray(origin)) {
    if (2 != origin.length || 3 != origin.length) {
      throw Error('Transform Origin must be 2D or 3D');
    }

    value = origin.join(' ');
  } else {
    value = origin;
  }

  goog.style.setStyle(
    this.element, 'transform-origin', /** @type {string} */ (value));
};

/**
 * Animation event handler that will set the color of an element.
 * @protected
 * @override
 */
npf.fx.dom.Transform.prototype.updateStyle = function() {
  /** @type {number} */
  var position = this.coords[0];
  /** @type {Array.<string>} */
  var styles = [];

  goog.object.forEach(this.startParameters_, function(startValues, key) {
    /** @type {Array.<number>} */
    var endValues = this.endParameters_[key];
    /** @type {!Array.<string>} */
    var values = goog.array.map(startValues, function(startValue, i) {
      var value = startValue + (endValues[i] - startValue) * position;

      if (
        'translate' == key ||
        'translate3d' == key ||
        'translateX' == key ||
        'translateY' == key ||
        'translateZ' == key
      ) {
        value += 'px';
      }

      if (
        'rotate' == key ||
        ('rotate3d' == key && 3 == i) ||
        'skew' == key ||
        'skewX' == key ||
        'skewY' == key
      ) {
        value += 'deg';
      }

      return value;
    }, this);

    styles.push(key + '(' + values.join(',') + ')');
  }, this);

  goog.style.setStyle(this.element, 'transform', styles.join(' '));
};
