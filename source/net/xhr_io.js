goog.provide('npf.net.XhrIo');

goog.require('goog.net.XhrIo');
goog.require('goog.object');
goog.require('goog.structs');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');


/**
 * @param {goog.net.XmlHttpFactory=} opt_xmlHttpFactory
 * @constructor
 * @extends {goog.net.XhrIo}
 */
npf.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.base(this, opt_xmlHttpFactory);
};
goog.inherits(npf.net.XhrIo, goog.net.XhrIo);


/**
 * @type {?function(npf.net.XhrIo, goog.net.EventType)}
 */
npf.net.XhrIo.preprocessHandle = null;

/**
 * All non-disposed instances of npf.net.XhrIo created
 * by {@link goog.net.XhrIo.send} are in this Array.
 * @see goog.net.XhrIo.cleanupAllPendingStaticSends
 * @type {!Array.<npf.net.XhrIo>}
 * @private
 */
npf.net.XhrIo.sendInstances_ = [];

/**
 * Static send that creates a short lived instance of XhrIo to send the
 * request.
 * @see goog.net.XhrIo.cleanupAllPendingStaticSends
 * @param {string|goog.Uri} url Uri to make request to.
 * @param {Function=} opt_callback Callback function for when request is
 *     complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {string|Object=} opt_content Post data. This can be a Gears blob
 *     if the underlying HTTP request object is a Gears HTTP request.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 */
npf.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content,
                              opt_headers, opt_timeoutInterval) {
  /** @type {!npf.net.XhrIo} */
  var x = new npf.net.XhrIo();
  npf.net.XhrIo.sendInstances_.push(x);

  if (opt_callback) {
    goog.events.listen(x, goog.net.EventType.COMPLETE, opt_callback);
  }

  goog.events.listen(x, goog.net.EventType.READY,
     goog.partial(npf.net.XhrIo.cleanupSend_, x));

  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }

  x.send(url, opt_method, opt_content, opt_headers);
};

/**
 * Disposes all non-disposed instances of npf.net.XhrIo created by
 * {@link goog.net.XhrIo.send}.
 * {@link goog.net.XhrIo.send} cleans up the npf.net.XhrIo instance
 * it creates when the request completes or fails.  However, if
 * the request never completes, then the npf.net.XhrIo is not disposed.
 * This can occur if the window is unloaded before the request completes.
 * We could have {@link goog.net.XhrIo.send} return the npf.net.XhrIo
 * it creates and make the client of {@link goog.net.XhrIo.send} be
 * responsible for disposing it in this case.  However, this makes things
 * significantly more complicated for the client, and the whole point
 * of {@link goog.net.XhrIo.send} is that it's simple and easy to use.
 * Clients of {@link goog.net.XhrIo.send} should call
 * {@link goog.net.XhrIo.cleanupAllPendingStaticSends} when doing final
 * cleanup on window unload.
 */
npf.net.XhrIo.cleanup = function() {
  /** @type {!Array.<npf.net.XhrIo>} */
  var instances = npf.net.XhrIo.sendInstances_;

  while (instances.length) {
    instances.pop().dispose();
  }
};

/**
 * Installs exception protection for all entry point introduced by
 * npf.net.XhrIo instances which are not protected by
 * {@link goog.debug.ErrorHandler#protectWindowSetTimeout},
 * {@link goog.debug.ErrorHandler#protectWindowSetInterval}, or
 * {@link goog.events.protectBrowserEventEntryPoint}.
 *
 * @param {goog.debug.ErrorHandler} errorHandler Error handler with which to
 *     protect the entry point(s).
 */
npf.net.XhrIo.protectEntryPoints = function(errorHandler) {
  npf.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ =
    errorHandler.protectEntryPoint(npf.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
};

/**
 * Disposes of the specified npf.net.XhrIo created by
 * {@link goog.net.XhrIo.send} and removes it from
 * {@link goog.net.XhrIo.pendingStaticSendInstances_}.
 * @param {npf.net.XhrIo} XhrIo An XhrIo created by {@link goog.net.XhrIo.send}.
 * @private
 */
npf.net.XhrIo.cleanupSend_ = function(XhrIo) {
  XhrIo.dispose();
  goog.array.remove(npf.net.XhrIo.sendInstances_, XhrIo);
};

/**
 * Instance send that actually uses XMLHttpRequest to make a server call.
 * @param {string|goog.Uri} url Uri to make request to.
 * @param {string=} opt_method Send method, default: GET.
 * @param {string|Object=} opt_content GET, POST or PUT content.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the request.
 * @override
 */
npf.net.XhrIo.prototype.send = function(url, opt_method, opt_content, opt_headers) {
  /** @type {!goog.Uri} */
  var inputUri = goog.Uri.parse(url);
  /** @type {string} */
  var inputMethod = opt_method ? opt_method.toUpperCase() : 'GET';
  /** @type {!goog.Uri} */
  var uri = this.parseRequestUri(inputUri, inputMethod, opt_content,
    opt_headers);
  /** @type {string} */
  var method = this.parseRequestMethod(inputUri, inputMethod, opt_content,
    opt_headers);
  /** @type {string} */
  var content = this.parseRequestContent(inputUri, inputMethod, opt_content,
    opt_headers);
  /** @type {!Object} */
  var headers = this.parseRequestHeaders(inputUri, inputMethod, opt_content,
    opt_headers);

  goog.base(this, 'send', uri, method, content, headers);
};

/**
 * @param {goog.Uri} uri
 * @param {string} method
 * @param {string|Object=} opt_content
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {!goog.Uri}
 * @protected
 */
npf.net.XhrIo.prototype.parseRequestUri = function(uri, method, opt_content,
                                                   opt_headers) {
  /** @type {!goog.Uri} */
  var result = uri.clone();

  if ('DELETE' == method || 'PUT' == method) {
    // Прячем метод в GET-параметр.
    uri.getQueryData().set('_method', method);
  } else if ('GET' == method) {
    // Добавляем параметры в URI.

    /** @type {goog.Uri.QueryData} */
    var content = this.parseContent(uri, method, opt_content, opt_headers);

    if (content) {
      uri.getQueryData().extend(content);
    }
  }

  return uri;
};

/**
 * @param {goog.Uri} uri
 * @param {string} method
 * @param {string|Object=} opt_content
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {string}
 * @protected
 */
npf.net.XhrIo.prototype.parseRequestMethod = function(uri, method, opt_content,
                                                      opt_headers) {
  if ('DELETE' == method || 'PUT' == method) {
    method = 'POST';
  }

  return method;
};

/**
 * @param {goog.Uri} uri
 * @param {string} method
 * @param {string|Object=} opt_content
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {string}
 * @protected
 */
npf.net.XhrIo.prototype.parseRequestContent = function(uri, method, opt_content,
                                                       opt_headers) {
  /** @type {string} */
  var plainContent = '';

  if ('GET' != method) {
    /** @type {goog.Uri.QueryData} */
    var content = this.parseContent(uri, method, opt_content, opt_headers);

    if (content) {
      plainContent = content.toString();
    }
  }

  return plainContent;
};

/**
 * @param {goog.Uri} uri
 * @param {string} method
 * @param {string|Object=} opt_content
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {goog.Uri.QueryData?}
 * @protected
 */
npf.net.XhrIo.prototype.parseContent = function(uri, method, opt_content,
                                                opt_headers) {
  /** @type {goog.Uri.QueryData} */
  var content = null;

  if (goog.isString(opt_content)) {
    /** @type {goog.Uri.QueryData} */
    var contentFromString = goog.Uri.parse('?' + opt_content).getQueryData();

    if (contentFromString) {
      content = contentFromString;
    }
  } else if (goog.isObject(opt_content)) {
    content = new goog.Uri.QueryData();
    content.extend(opt_content);
  }

  return content;
};

/**
 * @param {goog.Uri} uri
 * @param {string} method
 * @param {string|Object=} opt_content
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {!Object}
 * @protected
 */
npf.net.XhrIo.prototype.parseRequestHeaders = function(uri, method, opt_content,
                                                       opt_headers) {
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
  var eventType =
    /** @type {goog.net.EventType|null|undefined} */ (goog.isString(e) ? e : e.type);

  if (npf.net.XhrIo.preprocessHandle && eventType) {
    npf.net.XhrIo.preprocessHandle(this, eventType);
  }

  return goog.base(this, 'dispatchEvent', e);
};

/**
 * @return {*|undefined}
 */
npf.net.XhrIo.prototype.getResponseJsonResult = function() {
  var jsonData = this.getResponseJson();

  return goog.isObject(jsonData) ? jsonData['result'] : undefined;
};

/**
 * @return {*|undefined}
 */
npf.net.XhrIo.prototype.getResponseJsonErrors = function() {
  var jsonData = this.getResponseJson();

  return goog.isObject(jsonData) ? jsonData['errors'] : undefined;
};

// it can be monitored for exception handling, etc.
goog.debug.entryPointRegistry.register(
  /**
   * @param {function(!Function): !Function} transformer The transforming function.
   */
  function(transformer) {
    npf.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ =
      transformer(npf.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
  });
