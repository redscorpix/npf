goog.provide('npf.fx.cssAnimation.Keyframes');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Rect');
goog.require('goog.math.Size');
goog.require('goog.object');
goog.require('goog.style');
goog.require('npf.userAgent.Support');
goog.require('npf.userAgent.support');


/**
 * @param {Object.<string,string|number>=} opt_from
 * @param {Object.<string,string|number>=} opt_to
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.Disposable}
 */
npf.fx.cssAnimation.Keyframes = function(opt_from, opt_to, opt_fromAcc,
    opt_toAcc, opt_domHelper) {
  goog.base(this);

  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
  this.name_ = npf.fx.cssAnimation.Keyframes.getNextKeyframeName();

  this.keyframesMap_ = {};

  if (opt_from) {
    this.from(opt_from, opt_fromAcc);
  }

  if (opt_to) {
    this.to(opt_to, opt_toAcc);
  }
};
goog.inherits(npf.fx.cssAnimation.Keyframes, goog.Disposable);


/**
 * @const {string}
 */
npf.fx.cssAnimation.Keyframes.KEYFRAME_NAME_PREFIX = 'npf_kf_';

/**
 * @private {string}
 */
npf.fx.cssAnimation.Keyframes.vendorPrefix_;


/**
 * @return {string}
 */
npf.fx.cssAnimation.Keyframes.getNextKeyframeName = function() {
  /** @type {number} */
  var counter = 0;

  return function() {
    return npf.fx.cssAnimation.Keyframes.KEYFRAME_NAME_PREFIX + (++counter);
  };
}();

/**
 * @return {string}
 */
npf.fx.cssAnimation.Keyframes.getVendorPrefix = function() {
  if (!goog.isDef(npf.fx.cssAnimation.Keyframes.vendorPrefix_)) {
    /** @type {!Element} */
    var element = goog.dom.createElement(goog.dom.TagName.DIV);

    npf.fx.cssAnimation.Keyframes.vendorPrefix_ = '';

    if (!goog.isDef(element.style['animationName'])) {
      /** @type {!Array.<string>} */
      var vendorPrefixes = npf.userAgent.Support.cssomPrefixes;

      for (var i = 0; i < vendorPrefixes.length; i++) {
        if (goog.isDef(element.style[vendorPrefixes[i] + 'AnimationName'])) {
          npf.fx.cssAnimation.Keyframes.vendorPrefix_ =
            vendorPrefixes[i].toLowerCase();

          break;
        }
      }
    }
  }

  return npf.fx.cssAnimation.Keyframes.vendorPrefix_;
};


/**
 * @private {goog.dom.DomHelper}
 */
npf.fx.cssAnimation.Keyframes.domHelper_;

/**
 * @type {Object.<string,string>}
 * @private
 */
npf.fx.cssAnimation.Keyframes.prototype.endStyles_ = null;

/**
 * @private {boolean}
 */
npf.fx.cssAnimation.Keyframes.prototype.inited_ = false;

/**
 * @type {Object.<number,Object>}
 * @private
 */
npf.fx.cssAnimation.Keyframes.prototype.keyframesMap_;

/**
 * @private {string}
 */
npf.fx.cssAnimation.Keyframes.prototype.name_;

/**
 * @type {Element|StyleSheet}
 * @private
 */
npf.fx.cssAnimation.Keyframes.prototype.styleElement_;


/** @inheritDoc */
npf.fx.cssAnimation.Keyframes.prototype.disposeInternal = function() {
  if (this.styleElement_) {
    goog.style.uninstallStyles(this.styleElement_);
  }

  goog.base(this, 'disposeInternal');

  this.domHelper_ = null;
  this.endStyles_ = null;
  this.keyframesMap_ = null;
  this.styleElement_ = null;
};

/**
 * @return {goog.dom.DomHelper}
 */
npf.fx.cssAnimation.Keyframes.prototype.getDomHelper = function() {
  return this.domHelper_;
};

/**
 * @param {goog.dom.DomHelper} domHelper
 */
npf.fx.cssAnimation.Keyframes.prototype.setDomHelper = function(domHelper) {
  this.domHelper_ = domHelper;
};

/**
 * @return {Element|StyleSheet}
 */
npf.fx.cssAnimation.Keyframes.prototype.getElement = function() {
  return this.styleElement_;
};

/**
 * @return {Object.<string,string>}
 */
npf.fx.cssAnimation.Keyframes.prototype.getEndStyles = function() {
  return this.endStyles_;
};

/**
 * @return {string}
 */
npf.fx.cssAnimation.Keyframes.prototype.getName = function() {
  return this.name_;
};

npf.fx.cssAnimation.Keyframes.prototype.init = function() {
  if (!this.inited_) {
    this.inited_ = true;

    /** @type {!Array.<string>} */
    var rules = [];
    /** @type {string} */
    var vendorPrefix = npf.fx.cssAnimation.Keyframes.getVendorPrefix();
    /** @type {string} */
    var keyframeRule = vendorPrefix ?
      '@-' + vendorPrefix + '-keyframes ' : '@keyframes';

    goog.object.forEach(this.keyframesMap_, function(properties, position) {
      /** @type {string} */
      var keyframeText = position + '% {';

      for (var key in properties) {
        /** @type {string} */
        var name = npf.userAgent.support.getCssPropertyName(key);

        if (name) {
          keyframeText += name + ':' + properties[key] + ';';
        }
      }

      keyframeText += '}';
      rules.push(keyframeText);
    }, this);

    this.styleElement_ = goog.style.installStyles(
      keyframeRule + ' ' + this.name_ + ' {' + rules.join('') + '}',
      this.domHelper_.getDocument()
    );
  }
};

/**
 * @param {number|string} fromOpacity
 * @param {number|string} toOpacity
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToOpacity = function(fromOpacity,
    toOpacity, opt_fromAcc, opt_toAcc) {
  this.setOpacity(fromOpacity, 0, opt_fromAcc);

  return this.setOpacity(toOpacity, 100, opt_toAcc);
};

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromOpacity = function(opacity,
    opt_acc) {
  return this.setOpacity(opacity, 0, opt_acc);
};

/**
 * @param {number|string} opacity
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toOpacity = function(opacity, opt_acc) {
  return this.setOpacity(opacity, 100, opt_acc);
};

/**
 * @param {number|string} opacity
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setOpacity = function(opacity, position,
    opt_acc) {
  return this.insertKeyframe({
    'opacity': opacity
  }, position, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} fromCoords
 * @param {Array.<number|string>|goog.math.Coordinate} toCoords
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToPosition = function(fromCoords,
    toCoords, opt_fromAcc, opt_toAcc) {
  this.setPosition(fromCoords, 0, opt_fromAcc);

  return this.setPosition(toCoords, 100, opt_toAcc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromPosition = function(coords,
    opt_acc) {
  return this.setPosition(coords, 0, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toPosition = function(coords, opt_acc) {
  return this.setPosition(coords, 100, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Coordinate} coords
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setPosition = function(coords, position,
    opt_acc) {
  /** @type {number} */
  var left;
  /** @type {number} */
  var top;

  if (goog.isArray(coords)) {
    if (2 == coords.length) {
      left = coords[0];
      top = coords[1];
    } else {
      throw Error('Position must be 2D');
    }
  } else {
    left = coords.x;
    top = coords.y;
  }

  return this.insertKeyframe({
    'left': goog.isNumber(left) ? left + 'px' : left,
    'top': goog.isNumber(top) ? top + 'px' : top
  }, position, opt_acc);
};

/**
 * @param {number|string} fromLeft
 * @param {number|string} toLeft
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToLeft = function(fromLeft, toLeft,
    opt_fromAcc, opt_toAcc) {
  this.setLeft(fromLeft, 0, opt_fromAcc);

  return this.setLeft(toLeft, 100, opt_toAcc);
};

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromLeft = function(left, opt_acc) {
  return this.setLeft(left, 0, opt_acc);
};

/**
 * @param {number|string} left
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toLeft = function(left, opt_acc) {
  return this.setLeft(left, 100, opt_acc);
};

/**
 * @param {number|string} left
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setLeft = function(left, position,
    opt_acc) {
  return this.insertKeyframe({
    'left': goog.isNumber(left) ? left + 'px' : left
  }, position, opt_acc);
};

/**
 * @param {number|string} fromTop
 * @param {number|string} toTop
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToTop = function(fromTop, toTop,
    opt_fromAcc, opt_toAcc) {
  this.setTop(fromTop, 0, opt_fromAcc);

  return this.setTop(toTop, 100, opt_toAcc);
};

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromTop = function(top, opt_acc) {
  return this.setTop(top, 0, opt_acc);
};

/**
 * @param {number|string} top
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toTop = function(top, opt_acc) {
  return this.setTop(top, 100, opt_acc);
};

/**
 * @param {number|string} top
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setTop = function(top, position,
    opt_acc) {
  return this.insertKeyframe({
    'top': goog.isNumber(top) ? top + 'px' : top
  }, position, opt_acc);
};

/**
 * @param {number|string} fromRight
 * @param {number|string} toRight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToRight = function(fromRight,
    toRight, opt_fromAcc, opt_toAcc) {
  this.setRight(fromRight, 0, opt_fromAcc);

  return this.setRight(toRight, 100, opt_toAcc);
};

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromRight = function(right, opt_acc) {
  return this.setRight(right, 0, opt_acc);
};

/**
 * @param {number|string} right
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toRight = function(right, opt_acc) {
  return this.setRight(right, 100, opt_acc);
};

/**
 * @param {number|string} right
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setRight = function(right, position,
    opt_acc) {
  return this.insertKeyframe({
    'right': goog.isNumber(right) ? right + 'px' : right
  }, position, opt_acc);
};

/**
 * @param {number|string} fromBottom
 * @param {number|string} toBottom
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToBottom = function(fromBottom,
    toBottom, opt_fromAcc, opt_toAcc) {
  this.setBottom(fromBottom, 0, opt_fromAcc);

  return this.setBottom(toBottom, 100, opt_toAcc);
};

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromBottom = function(bottom, opt_acc) {
  return this.setBottom(bottom, 0, opt_acc);
};

/**
 * @param {number|string} bottom
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toBottom = function(bottom, opt_acc) {
  return this.setBottom(bottom, 100, opt_acc);
};

/**
 * @param {number|string} bottom
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setBottom = function(bottom, position,
    opt_acc) {
  return this.insertKeyframe({
    'bottom': goog.isNumber(bottom) ? bottom + 'px' : bottom
  }, position, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} fromSize
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} toSize
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToSize = function(fromSize,
    toSize, opt_fromAcc, opt_toAcc) {
  this.setSize(fromSize, 0, opt_fromAcc);

  return this.setSize(toSize, 100, opt_toAcc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromSize = function(size, opt_acc) {
  return this.setSize(size, 0, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toSize = function(size, opt_acc) {
  return this.setSize(size, 100, opt_acc);
};

/**
 * @param {Array.<number|string>|goog.math.Size|goog.math.Rect} size
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setSize = function(size, position,
    opt_acc) {
  /** @type {number} */
  var width;
  /** @type {number} */
  var height;

  if (goog.isArray(size)) {
    if (2 == size.length) {
      width = size[0];
      height = size[1];
    } else {
      throw Error('Size must be 2D');
    }
  } else {
    width = size.width;
    height = size.height;
  }

  return this.insertKeyframe({
    'width': goog.isNumber(width) ? width + 'px' : width,
    'height': goog.isNumber(height) ? height + 'px' : height
  }, position, opt_acc);
};

/**
 * @param {number|string} fromWidth
 * @param {number|string} toWidth
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToWidth = function(fromWidth,
    toWidth, opt_fromAcc, opt_toAcc) {
  this.setWidth(fromWidth, 0, opt_fromAcc);

  return this.setWidth(toWidth, 100, opt_toAcc);
};

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromWidth = function(width, opt_acc) {
  return this.setWidth(width, 0, opt_acc);
};

/**
 * @param {number|string} width
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toWidth = function(width, opt_acc) {
  return this.setWidth(width, 100, opt_acc);
};

/**
 * @param {number|string} width
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setWidth = function(width, position,
    opt_acc) {
  return this.insertKeyframe({
    'width': goog.isNumber(width) ? width + 'px' : width
  }, position, opt_acc);
};

/**
 * @param {number|string} fromHeight
 * @param {number|string} toHeight
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToHeight = function(fromHeight,
    toHeight, opt_fromAcc, opt_toAcc) {
  this.setHeight(fromHeight, 0, opt_fromAcc);

  return this.setHeight(toHeight, 100, opt_toAcc);
};

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromHeight = function(height, opt_acc) {
  return this.setHeight(height, 0, opt_acc);
};

/**
 * @param {number|string} height
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toHeight = function(height, opt_acc) {
  return this.setHeight(height, 100, opt_acc);
};

/**
 * @param {number|string} height
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setHeight = function(height, position,
    opt_acc) {
  return this.insertKeyframe({
    'height': goog.isNumber(height) ? height + 'px' : height
  }, position, opt_acc);
};

/**
 * @param {string|Array.<number>} fromColor
 * @param {string|Array.<number>} toColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToColor = function(fromColor,
    toColor, opt_fromAcc, opt_toAcc) {
  this.setColor(fromColor, 0, opt_fromAcc);

  return this.setColor(toColor, 100, opt_toAcc);
};

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromColor = function(color, opt_acc) {
  return this.setColor(color, 0, opt_acc);
};

/**
 * @param {string|Array.<number>} color
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toColor = function(color, opt_acc) {
  return this.setColor(color, 100, opt_acc);
};

/**
 * @param {string|Array.<number>} color
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setColor = function(color, position,
    opt_acc) {
  var value = '';

  if (goog.isArray(color)) {
    if (4 == color.length) {
      value = 'rgba(' + color.join(',') + ')';
    } else if (3 == color.length) {
      value = 'rgb(' + color.join(',') + ')';
    } else {
      throw Error('Color must be 3D or 4D');
    }
  } else {
    value = color;
  }

  return this.insertKeyframe({
    'color': value
  }, position, opt_acc);
};

/**
 * @param {string|Array.<number>} fromBgColor
 * @param {string|Array.<number>} toBgColor
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToBgColor = function(fromBgColor,
    toBgColor, opt_fromAcc, opt_toAcc) {
  this.setBgColor(fromBgColor, 0, opt_fromAcc);

  return this.setBgColor(toBgColor, 100, opt_toAcc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromBgColor = function(bgColor,
    opt_acc) {
  return this.setBgColor(bgColor, 0, opt_acc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toBgColor = function(bgColor, opt_acc) {
  return this.setBgColor(bgColor, 100, opt_acc);
};

/**
 * @param {string|Array.<number>} bgColor
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setBgColor = function(bgColor, position,
    opt_acc) {
  var value = '';

  if (goog.isArray(bgColor)) {
    if (4 == bgColor.length) {
      value = 'rgba(' + bgColor.join(',') + ')';
    } else if (3 == bgColor.length) {
      value = 'rgb(' + bgColor.join(',') + ')';
    } else {
      throw Error('Background Color must be 3D or 4D');
    }
  } else {
    value = bgColor;
  }

  return this.insertKeyframe({
    'background-color': value
  }, position, opt_acc);
};

/**
 * @param {string} fromTransform
 * @param {string} toTransform
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromToTransform = function(fromTransform,
    toTransform, opt_fromAcc, opt_toAcc) {
  this.setTransform(fromTransform, 0, opt_fromAcc);

  return this.setTransform(toTransform, 100, opt_toAcc);
};

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromTransform = function(transform,
    opt_acc) {
  return this.setTransform(transform, 0, opt_acc);
};

/**
 * @param {string} transform
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.toTransform = function(transform,
    opt_acc) {
  return this.setTransform(transform, 100, opt_acc);
};

/**
 * @param {string} transform
 * @param {number} position
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.setTransform = function(transform,
    position, opt_acc) {
  return this.insertKeyframe(goog.object.create(
    npf.userAgent.support.getCssPropertyName('transform'), transform
  ), position, opt_acc);
};

/**
 * @param {Object.<string,string|number>} fromRules
 * @param {Object.<string,string|number>} toRules
 * @param {Array.<number>=} opt_fromAcc
 * @param {Array.<number>=} opt_toAcc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.fromTo = function(fromRules, toRules,
    opt_fromAcc, opt_toAcc) {
  this.from(fromRules, opt_fromAcc);

  return this.to(toRules, opt_toAcc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.from = function(rules, opt_acc) {
  return this.insertKeyframe(rules, 0, opt_acc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.to = function(rules, opt_acc) {
  return this.insertKeyframe(rules, 100, opt_acc);
};

/**
 * @param {Object.<string,string|number>} rules
 * @param {number} position from 0 to 100
 * @param {Array.<number>=} opt_acc
 * @return {!npf.fx.cssAnimation.Keyframes}
 */
npf.fx.cssAnimation.Keyframes.prototype.insertKeyframe = function(rules,
    position, opt_acc) {
  position = parseInt(position, 10);

  if (0 <= position && position <= 100) {
    /** @type {Object.<string,string>} */
    var properties = goog.object.clone(rules);

    if (opt_acc) {
      /** @type {string} */
      var timingFunc =
        npf.userAgent.support.getCssPropertyName('animation-timing-function');
      properties[timingFunc] = 'cubic-bezier(' + opt_acc.join(',') + ')';
    }

    if (100 == position) {
      this.endStyles_ = goog.object.clone(rules);
    }

    if (!this.keyframesMap_[position]) {
      this.keyframesMap_[position] = {};
    }

    goog.object.extend(this.keyframesMap_[position], properties);
  }

  return this;
};
