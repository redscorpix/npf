goog.provide('npf.net.ImageLoader');
goog.provide('npf.net.ImageLoader.CorsRequestType');

goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.net.EventType');


/**
 * A goog.net.EventType.COMPLETE event will be dispatched only once all
 * outstanding images have completed uploading.
 *
 * @param {string|!Image|!HTMLImageElement} image
 * @param {npf.net.ImageLoader.CorsRequestType=} opt_corsRequestType
 * @constructor
 * @struct
 */
npf.net.ImageLoader = function(image, opt_corsRequestType) {
  /**
   * @private {!Image|!HTMLImageElement}
   */
  this._image = goog.isString(image) ?
    npf.net.ImageLoader.createImage(image, opt_corsRequestType) : image;
};


/**
 * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
 * @enum {string}
 */
npf.net.ImageLoader.CorsRequestType = {
  ANONYMOUS: 'anonymous',
  USE_CREDENTIALS: 'use-credentials'
};

/**
 * @param {string} src
 * @param {npf.net.ImageLoader.CorsRequestType=} opt_corsRequestType
 * @return {!Image}
 */
npf.net.ImageLoader.createImage = function(src, opt_corsRequestType) {
  var image = new Image();

  if (opt_corsRequestType) {
    image.crossOrigin = opt_corsRequestType;
  }

  image.src = src;

  return image;
};


/**
 * @param {function(this:SCOPE,(!Image|!HTMLImageElement))} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.net.ImageLoader.prototype.load = function(callback, opt_scope) {
  if (this._image.complete) {
    callback.call(opt_scope, this._image);
  } else {
    var handler = new goog.events.EventHandler(this);
    handler.listen(this._image, [
      goog.events.EventType.LOAD,
      goog.net.EventType.ABORT,
      goog.net.EventType.ERROR
    ], function(evt) {
      handler.dispose();
      callback.call(opt_scope, this._image);
    });
  }
};

/**
 * @return {!Image|!HTMLImageElement}
 */
npf.net.ImageLoader.prototype.getImage = function() {
  return this._image;
};
