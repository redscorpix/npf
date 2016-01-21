goog.provide('npf.userAgent.image');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.userAgent.canvas');


/**
 * @private {boolean?}
 */
npf.userAgent.image.animatedPng_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.ANIMATED_PNG_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFj' +
  'VEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQ' +
  'AAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJ' +
  'RU5ErkJggg==';

/**
 * Test for animated png support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isAnimatedPngSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.animatedPng_)) {
    callback.call(opt_scope, npf.userAgent.image.animatedPng_);
  } else if (npf.userAgent.canvas.isSupported()) {
    var canvas = /** @type {!HTMLCanvasElement} */ (
      goog.dom.createElement(goog.dom.TagName.CANVAS));
    var ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    var src = npf.userAgent.image.ANIMATED_PNG_SRC;
    npf.userAgent.image.loadImage_(src, function(image, evt) {
      /** @type {boolean} */
      var support = false;

      if (goog.isDef(canvas.getContext)) {
        ctx.drawImage(image, 0, 0);
        support = 0 === ctx.getImageData(0, 0, 1, 1).data[3];
      }

      npf.userAgent.image.animatedPng_ = support;
      callback.call(opt_scope, support);
    });
  } else {
    callback.call(opt_scope, false);
  }
};

/**
 * @param {string} src
 * @param {function(!Image,Event)} callback
 * @private
 */
npf.userAgent.image.loadImage_ = function(src, callback) {
  var image = new Image();
  image.onload = image.onerror = function(evt) {
    callback(image, evt);
  };
  image.src = src;
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.jpeg2000_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.JPEG2000_SRC =
  'data:image/jp2;base64,/0//UQAyAAAAAAABAAAAAgAAAAAAAAAAAAAABAAAAAQAAAAAAAAA' +
  'AAAEBwEBBwEBBwEBBwEB/1IADAAAAAEAAAQEAAH/XAAEQED/ZAAlAAFDcmVhdGVkIGJ5IE9wZW' +
  '5KUEVHIHZlcnNpb24gMi4wLjD/kAAKAAAAAABYAAH/UwAJAQAABAQAAf9dAAUBQED/UwAJAgAA' +
  'BAQAAf9dAAUCQED/UwAJAwAABAQAAf9dAAUDQED/k8+kEAGvz6QQAa/PpBABr994EAk//9k=';

/**
 * Test for JPEG 2000 support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isJpeg2000Supported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.jpeg2000_)) {
    callback.call(opt_scope, npf.userAgent.image.jpeg2000_);
  } else {
    var src = npf.userAgent.image.JPEG2000_SRC;
    npf.userAgent.image.loadImage_(src, function(image) {
      npf.userAgent.image.jpeg2000_ = 1 == image.width;
      callback.call(opt_scope, npf.userAgent.image.jpeg2000_);
    });
  }
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.jpegXhr_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.JPEG_XHR_SRC =
  'data:image/vnd.ms-photo;base64,SUm8AQgAAAAFAAG8AQAQAAAASgAAAIC8BAABAAAAAQA' +
  'AAIG8BAABAAAAAQAAAMC8BAABAAAAWgAAAMG8BAABAAAAHwAAAAAAAAAkw91vA07+S7GFPXd2j' +
  'ckNV01QSE9UTwAZAYBxAAAAABP/gAAEb/8AAQAAAQAAAA==';

/**
 * Test for JPEG XR support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isJpegXrSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.jpegXhr_)) {
    callback.call(opt_scope, npf.userAgent.image.jpegXhr_);
  } else {
    var src = npf.userAgent.image.JPEG_XHR_SRC;
    npf.userAgent.image.loadImage_(src, function(image) {
      npf.userAgent.image.jpegXhr_ = 1 == image.width;
      callback.call(opt_scope, npf.userAgent.image.jpegXhr_);
    });
  }
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.orientation_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.ORIENTATION_SRC =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAA' +
  'BABIBAwABAAAABgASAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
  'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
  'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAIDA' +
  'SIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwU' +
  'FBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoK' +
  'So0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5i' +
  'ZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+' +
  'Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ' +
  '3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2N' +
  'zg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqO' +
  'kpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oAD' +
  'AMBAAIRAxEAPwD+/iiiigD/2Q==';

/**
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isOrientationSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.orientation_)) {
    callback.call(opt_scope, npf.userAgent.image.orientation_);
  } else {
    var img = new Image();
    img.onerror = function() {
      npf.userAgent.image.orientation_ = false;
      npf.userAgent.image.isOrientationSupported(callback, opt_scope);
    };
    img.onload = function() {
      npf.userAgent.image.orientation_ = 2 !== img.width;
      npf.userAgent.image.isOrientationSupported(callback, opt_scope);
    };

    // There may be a way to shrink this more, it's a 1x2 white jpg with the
    // orientation flag set to 6.
    img.src = npf.userAgent.image.ORIENTATION_SRC;
  }
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.webp_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.WEBP_SRC =
  'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3A' +
  'A/vuUAAA=';

/**
 * Tests for lossy WebP support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isWebpSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.webp_)) {
    callback.call(opt_scope, npf.userAgent.image.webp_);
  } else {
    var src = npf.userAgent.image.WEBP_SRC;
    npf.userAgent.image.isWebpSupported_(src, function(support) {
      npf.userAgent.image.webp_ = support;
      callback.call(opt_scope, support);
    });
  }
};

/**
 * @param {string} src
 * @param {function(boolean)} callback
 * @private
 */
npf.userAgent.image.isWebpSupported_ = function(src, callback) {
  npf.userAgent.image.loadImage_(src, function(image, evt) {
    callback(!!evt && 'load' == evt.type ? 1 == image.width : false);
  });
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.webpApha_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.WEBP_ALPHA_SRC =
  'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAA' +
  'BBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';

/**
 * Tests for alpha (both lossy and lossless) WebP support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isWebpAlphaSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.webpApha_)) {
    callback.call(opt_scope, npf.userAgent.image.webpApha_);
  } else {
    var src = npf.userAgent.image.WEBP_ALPHA_SRC;
    npf.userAgent.image.isWebpSupported_(src, function(support) {
      npf.userAgent.image.webpApha_ = support;
      callback.call(opt_scope, support);
    });
  }
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.webpAnimation_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.WEBP_ANIMATION_SRC =
  'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD' +
  '/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA';

/**
 * Tests for Animated WebP support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isWebpAnimationSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.webpAnimation_)) {
    callback.call(opt_scope, npf.userAgent.image.webpAnimation_);
  } else {
    var src = npf.userAgent.image.WEBP_ANIMATION_SRC;
    npf.userAgent.image.isWebpSupported_(src, function(support) {
      npf.userAgent.image.webpAnimation_ = support;
      callback.call(opt_scope, support);
    });
  }
};

/**
 * @private {boolean?}
 */
npf.userAgent.image.webpLossless_ = null;

/**
 * @const {string}
 */
npf.userAgent.image.WEBP_LOSSLESS =
  'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

/**
 * Tests for lossless WebP support.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.image.isWebpLosslessSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.image.webpLossless_)) {
    callback.call(opt_scope, npf.userAgent.image.webpLossless_);
  } else {
    var src = npf.userAgent.image.WEBP_LOSSLESS;
    npf.userAgent.image.isWebpSupported_(src, function(support) {
      npf.userAgent.image.webpLossless_ = support;
      callback.call(opt_scope, support);
    });
  }
};
