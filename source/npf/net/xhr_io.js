goog.provide('npf.net.XhrIo');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('goog.structs');


/**
 * @param {goog.net.XmlHttpFactory=} opt_xmlHttpFactory Factory to use when
 *     creating XMLHttpRequest objects.
 * @constructor
 * @struct
 * @extends {goog.net.XhrIo}
 */
npf.net.XhrIo = function(opt_xmlHttpFactory) {
  npf.net.XhrIo.base(this, 'constructor', opt_xmlHttpFactory);

  /**
   * @private {XMLHttpRequest}
   */
  this.nativeXhr_ = null;
};
goog.inherits(npf.net.XhrIo, goog.net.XhrIo);


/**
 * @private {number}
 */
npf.net.XhrIo.globalHandleCounter_ = 0;

/**
 * @type {!Object.<function(npf.net.XhrIo, goog.net.EventType)>}
 * @private
 */
npf.net.XhrIo.globalHandles_ = {};

/**
 * All non-disposed instances of npf.net.XhrIo created
 * by {@link npf.net.XhrIo.send} are in this Array.
 * @see npf.net.XhrIo.cleanup
 * @private {!Array.<npf.net.XhrIo>}
 */
npf.net.XhrIo.sendInstances_ = [];

/**
 * @param {function(npf.net.XhrIo, goog.net.EventType)} handler
 * @return {number}
 */
npf.net.XhrIo.addGlobalHandler = function(handler) {
  npf.net.XhrIo.globalHandleCounter_++;
  npf.net.XhrIo.globalHandles_[npf.net.XhrIo.globalHandleCounter_] = handler;

  return npf.net.XhrIo.globalHandleCounter_;
};

/**
 * @param {number} id
 * @return {boolean}
 */
npf.net.XhrIo.removeGlobalHandler = function(id) {
  return goog.object.remove(npf.net.XhrIo.globalHandles_, id);
};

/**
 * Static send that creates a short lived instance of XhrIo to send the
 * request.
 * @see npf.net.XhrIo.cleanup
 * @param {string|goog.Uri} url Uri to make request to.
 * @param {Function=} opt_callback Callback function for when request is
 *     complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=}
 *     opt_content Body data.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 * @param {boolean=} opt_withCredentials Whether to send credentials with the
 *     request. Default to false. See {@link goog.net.XhrIo#setWithCredentials}.
 */
npf.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content,
    opt_headers, opt_timeoutInterval, opt_withCredentials) {
  var x = new npf.net.XhrIo();
  npf.net.XhrIo.sendInstances_.push(x);

  if (opt_callback) {
    x.listen(goog.net.EventType.COMPLETE, opt_callback);
  }

  x.listenOnce(goog.net.EventType.READY, function() {
    this.dispose();
    goog.array.remove(npf.net.XhrIo.sendInstances_, this);
  });

  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }

  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials);
  }

  x.send(url, opt_method, opt_content, opt_headers);
};

/**
 * Disposes all non-disposed instances of npf.net.XhrIo created by
 * {@link npf.net.XhrIo.send}.
 * {@link npf.net.XhrIo.send} cleans up the npf.net.XhrIo instance
 * it creates when the request completes or fails.  However, if
 * the request never completes, then the npf.net.XhrIo is not disposed.
 * This can occur if the window is unloaded before the request completes.
 * We could have {@link npf.net.XhrIo.send} return the npf.net.XhrIo
 * it creates and make the client of {@link npf.net.XhrIo.send} be
 * responsible for disposing it in this case.  However, this makes things
 * significantly more complicated for the client, and the whole point
 * of {@link npf.net.XhrIo.send} is that it's simple and easy to use.
 * Clients of {@link npf.net.XhrIo.send} should call
 * {@link npf.net.XhrIo.cleanupAllPendingStaticSends} when doing final
 * cleanup on window unload.
 */
npf.net.XhrIo.cleanup = function() {
  /** @type {!Array.<npf.net.XhrIo>} */
  var instances = npf.net.XhrIo.sendInstances_;

  while (instances.length) {
    instances.pop().dispose();
  }
};


/** @inheritDoc */
npf.net.XhrIo.prototype.disposeInternal = function() {
  npf.net.XhrIo.base(this, 'disposeInternal');

  this.nativeXhr_ = null;
};

/** @inheritDoc */
npf.net.XhrIo.prototype.send = function(url, opt_method, opt_content,
    opt_headers) {
  /** @type {!Object} */
  var headers = this.parseRequestHeaders(opt_headers);

  npf.net.XhrIo.base(this, 'send', url, opt_method, opt_content, headers);
};

/**
 * @return {XMLHttpRequest}
 */
npf.net.XhrIo.prototype.getNativeXhr = function() {
  return this.nativeXhr_;
};

/**
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {!Object}
 * @protected
 */
npf.net.XhrIo.prototype.parseRequestHeaders = function(opt_headers) {
  /** @type {!Object} */
  var headers = {};

  if (opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers[key] = value;
    });
  }

  if (!headers['X-Requested-With']) {
    headers['X-Requested-With'] = 'XMLHttpRequest';
  }

  return headers;
};

/**
 * @return {boolean}
 */
npf.net.XhrIo.prototype.isServerError = function() {
  /** @type {number} */
  var status = this.getStatus();

  return status >= 500 && status < 600;
};

/** @inheritDoc */
npf.net.XhrIo.prototype.dispatchEvent = function(e) {
  var eventType = /** @type {goog.net.EventType|null|undefined} */ (
    goog.isString(e) ? e : e.type);

  if (eventType) {
    goog.object.forEach(npf.net.XhrIo.globalHandles_, function(handler) {
      handler(this, /** @type {goog.net.EventType} */ (eventType));
    }, this);
  }

  return npf.net.XhrIo.base(this, 'dispatchEvent', e);
};

/**
 * @param {string} prop
 * @return {*|undefined}
 */
npf.net.XhrIo.prototype.getResponseJsonProperty = function(prop) {
  var jsonData = this.getResponseJson();

  return goog.isObject(jsonData) ? jsonData[prop] : undefined;
};
