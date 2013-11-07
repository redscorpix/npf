goog.provide('npf.net.XhrIo2');
goog.provide('npf.net.XhrIo2.ResponseType');

goog.require('goog.Timer');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.debug.entryPointRegistry');
goog.require('goog.events.BrowserEvent');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.HttpStatus');
goog.require('goog.net.XmlHttp');
goog.require('goog.net.XmlHttp.OptionType');
goog.require('goog.net.XmlHttp.ReadyState');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.uri.utils');
goog.require('goog.userAgent');
goog.require('npf.net.EventType');


/**
 * Basic class for handling XMLHttpRequests.
 * @param {goog.net.XmlHttpFactory=} opt_xmlHttpFactory Factory to use
 *    when creating XMLHttpRequest objects.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.net.XhrIo2 = function(opt_xmlHttpFactory) {
  goog.base(this);

  /**
   * Map of default headers to add to every request, use:
   * XhrIo.headers.set(name, value)
   * @type {goog.structs.Map}
   */
  this.headers = new goog.structs.Map();

  /**
   * @private {goog.net.XmlHttpFactory}
   */
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
};
goog.inherits(npf.net.XhrIo2, goog.events.EventTarget);


/**
 * Response types that may be requested for XMLHttpRequests.
 * @enum {string}
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute
 */
npf.net.XhrIo2.ResponseType = {
  DEFAULT: '',
  TEXT: 'text',
  DOCUMENT: 'document',
  // Not supported as of Chrome 10.0.612.1 dev
  BLOB: 'blob',
  ARRAY_BUFFER: 'arraybuffer'
};


/**
 * A reference to the XhrIo logger
 * @private {goog.debug.Logger}
 */
npf.net.XhrIo2.prototype.logger_ =
  goog.debug.Logger.getLogger('npf.net.XhrIo2');


/**
 * The Content-Type HTTP header name
 * @type {string}
 */
npf.net.XhrIo2.CONTENT_TYPE_HEADER = 'Content-Type';


/**
 * The pattern matching the 'http' and 'https' URI schemes
 * @type {!RegExp}
 */
npf.net.XhrIo2.HTTP_SCHEME_PATTERN = /^https?$/i;


/**
 * The methods that typically come along with form data.  We set different
 * headers depending on whether the HTTP action is one of these.
 */
npf.net.XhrIo2.METHODS_WITH_FORM_DATA = ['POST', 'PUT'];


/**
 * The Content-Type HTTP header value for a url-encoded form
 * @type {string}
 */
npf.net.XhrIo2.FORM_CONTENT_TYPE =
  'application/x-www-form-urlencoded;charset=utf-8';


/**
 * @private {number}
 */
npf.net.XhrIo2.globalHandleCounter_ = 0;

/**
 * @type {!Object.<function(npf.net.XhrIo2, goog.net.EventType)>}
 * @private
 */
npf.net.XhrIo2.globalHandles_ = {};


/**
 * The XMLHttpRequest Level two timeout delay ms property name.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
 *
 * @private {string}
 * @const
 */
npf.net.XhrIo2.XHR2_TIMEOUT_ = 'timeout';


/**
 * The XMLHttpRequest Level two ontimeout handler property name.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
 *
 * @private {string}
 * @const
 */
npf.net.XhrIo2.XHR2_ON_TIMEOUT_ = 'ontimeout';

/**
 * All non-disposed instances of npf.net.XhrIo2 created
 * by {@link npf.net.XhrIo2.send} are in this Array.
 * @see npf.net.XhrIo2.cleanup
 * @private {Array.<!npf.net.XhrIo2>}
 */
npf.net.XhrIo2.sendInstances_ = [];

/**
 * @param {function(npf.net.XhrIo2, goog.net.EventType)} handler
 * @return {number}
 */
npf.net.XhrIo2.addGlobalHandler = function(handler) {
  npf.net.XhrIo2.globalHandleCounter_++;
  npf.net.XhrIo2.globalHandles_[npf.net.XhrIo2.globalHandleCounter_] = handler;

  return npf.net.XhrIo2.globalHandleCounter_;
};

/**
 * @param {number} id
 * @return {boolean}
 */
npf.net.XhrIo2.removeGlobalHandler = function(id) {
  return goog.object.remove(npf.net.XhrIo2.globalHandles_, id);
};

/**
 * Static send that creates a short lived instance of XhrIo to send the
 * request.
 * @see npf.net.XhrIo2.cleanup
 * @param {string|goog.Uri} url Uri to make request to.
 * @param {Function=} opt_callback Callback function for when request is
 *     complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {ArrayBuffer|Blob|Document|FormData|string=} opt_content Body data.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 * @param {boolean=} opt_withCredentials Whether to send credentials with the
 *     request. Default to false. See {@link npf.net.XhrIo2#setWithCredentials}.
 */
npf.net.XhrIo2.send = function(url, opt_callback, opt_method, opt_content,
                               opt_headers, opt_timeoutInterval,
                               opt_withCredentials) {
  var x = new npf.net.XhrIo2();
  npf.net.XhrIo2.sendInstances_.push(x);
  if (opt_callback) {
    x.listen(goog.net.EventType.COMPLETE, opt_callback);
  }
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_);
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials);
  }
  x.send(url, opt_method, opt_content, opt_headers);
};


/**
 * Disposes all non-disposed instances of npf.net.XhrIo2 created by
 * {@link npf.net.XhrIo2.send}.
 * {@link npf.net.XhrIo2.send} cleans up the npf.net.XhrIo2 instance
 * it creates when the request completes or fails.  However, if
 * the request never completes, then the npf.net.XhrIo2 is not disposed.
 * This can occur if the window is unloaded before the request completes.
 * We could have {@link npf.net.XhrIo2.send} return the npf.net.XhrIo2
 * it creates and make the client of {@link npf.net.XhrIo2.send} be
 * responsible for disposing it in this case.  However, this makes things
 * significantly more complicated for the client, and the whole point
 * of {@link npf.net.XhrIo2.send} is that it's simple and easy to use.
 * Clients of {@link npf.net.XhrIo2.send} should call
 * {@link npf.net.XhrIo2.cleanup} when doing final
 * cleanup on window unload.
 */
npf.net.XhrIo2.cleanup = function() {
  var instances = npf.net.XhrIo2.sendInstances_;
  while (instances.length) {
    instances.pop().dispose();
  }
};


/**
 * Installs exception protection for all entry point introduced by
 * npf.net.XhrIo2 instances which are not protected by
 * {@link goog.debug.ErrorHandler#protectWindowSetTimeout},
 * {@link goog.debug.ErrorHandler#protectWindowSetInterval}, or
 * {@link goog.events.protectBrowserEventEntryPoint}.
 *
 * @param {goog.debug.ErrorHandler} errorHandler Error handler with which to
 *     protect the entry point(s).
 */
npf.net.XhrIo2.protectEntryPoints = function(errorHandler) {
  npf.net.XhrIo2.prototype.onReadyStateChangeEntryPoint_ =
      errorHandler.protectEntryPoint(
          npf.net.XhrIo2.prototype.onReadyStateChangeEntryPoint_);
};


/**
 * Disposes of the specified npf.net.XhrIo2 created by
 * {@link npf.net.XhrIo2.send} and removes it from
 * {@link npf.net.XhrIo2.pendingStaticSendInstances_}.
 * @private
 */
npf.net.XhrIo2.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(npf.net.XhrIo2.sendInstances_, this);
};


/**
 * Whether XMLHttpRequest is active.  A request is active from the time send()
 * is called until onReadyStateChange() is complete, or error() or abort()
 * is called.
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.active_ = false;


/**
 * Reference to an XMLHttpRequest object that is being used for the transfer.
 * @type {XMLHttpRequest|GearsHttpRequest}
 * @private
 */
npf.net.XhrIo2.prototype.xhr_ = null;


/**
 * The options to use with the current XMLHttpRequest object.
 * @private {Object}
 */
npf.net.XhrIo2.prototype.xhrOptions_ = null;


/**
 * Last URL that was requested.
 * @type {string|goog.Uri}
 * @private
 */
npf.net.XhrIo2.prototype.lastUri_ = '';


/**
 * Method for the last request.
 * @private {string}
 */
npf.net.XhrIo2.prototype.lastMethod_ = '';


/**
 * Last error code.
 * @private {goog.net.ErrorCode}
 */
npf.net.XhrIo2.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;


/**
 * Last error message.
 * @type {Error|string}
 * @private
 */
npf.net.XhrIo2.prototype.lastError_ = '';


/**
 * This is used to ensure that we don't dispatch an multiple ERROR events. This
 * can happen in IE when it does a synchronous load and one error is handled in
 * the ready statte change and one is handled due to send() throwing an
 * exception.
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.errorDispatched_ = false;


/**
 * Used to make sure we don't fire the complete event from inside a send call.
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.inSend_ = false;


/**
 * Used in determining if a call to {@link #onReadyStateChange_} is from within
 * a call to this.xhr_.open.
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.inOpen_ = false;


/**
 * Used in determining if a call to {@link #onReadyStateChange_} is from within
 * a call to this.xhr_.abort.
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.inAbort_ = false;


/**
 * Number of milliseconds after which an incomplete request will be aborted and
 * a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no timeout is set.
 * @private {number}
 */
npf.net.XhrIo2.prototype.timeoutInterval_ = 0;


/**
 * Window timeout ID used to cancel the timeout event handler if the request
 * completes successfully.
 * @private {?number}
 */
npf.net.XhrIo2.prototype.timeoutId_ = null;


/**
 * The requested type for the response. The empty string means use the default
 * XHR behavior.
 * @private {npf.net.XhrIo2.ResponseType}
 */
npf.net.XhrIo2.prototype.responseType_ = npf.net.XhrIo2.ResponseType.DEFAULT;


/**
 * Whether a "credentialed" request is to be sent (one that is aware of cookies
 * and authentication) . This is applicable only for cross-domain requests and
 * more recent browsers that support this part of the HTTP Access Control
 * standard.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-withcredentials-attribute
 *
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.withCredentials_ = false;

/**
 * True if we can use XMLHttpRequest's timeout directly.
 * @private {boolean}
 */
npf.net.XhrIo2.prototype.useXhr2Timeout_ = false;


/**
 * Returns the number of milliseconds after which an incomplete request will be
 * aborted, or 0 if no timeout is set.
 * @return {number} Timeout interval in milliseconds.
 */
npf.net.XhrIo2.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
};


/**
 * Sets the number of milliseconds after which an incomplete request will be
 * aborted and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no
 * timeout is set.
 * @param {number} ms Timeout interval in milliseconds; 0 means none.
 */
npf.net.XhrIo2.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
};


/**
 * Sets the desired type for the response. At time of writing, this is only
 * supported in very recent versions of WebKit (10.0.612.1 dev and later).
 *
 * If this is used, the response may only be accessed via {@link #getResponse}.
 *
 * @param {npf.net.XhrIo2.ResponseType} type The desired type for the response.
 */
npf.net.XhrIo2.prototype.setResponseType = function(type) {
  this.responseType_ = type;
};


/**
 * Gets the desired type for the response.
 * @return {npf.net.XhrIo2.ResponseType} The desired type for the response.
 */
npf.net.XhrIo2.prototype.getResponseType = function() {
  return this.responseType_;
};


/**
 * Sets whether a "credentialed" request that is aware of cookie and
 * authentication information should be made.
 * @param {boolean} withCredentials Whether this should be a "credentialed"
 *     request.
 */
npf.net.XhrIo2.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
};


/**
 * Gets whether a "credentialed" request is to be sent.
 * @return {boolean} The desired type for the response.
 */
npf.net.XhrIo2.prototype.getWithCredentials = function() {
  return this.withCredentials_;
};


/**
 * Instance send that actually uses XMLHttpRequest to make a server call.
 * @param {string|goog.Uri} url Uri to make request to.
 * @param {string=} opt_method Send method, default: GET.
 * @param {ArrayBuffer|Blob|Document|FormData|string=} opt_content Body data.
 * @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
 *     request.
 */
npf.net.XhrIo2.prototype.send = function(url, opt_method, opt_content,
                                         opt_headers) {
  if (this.xhr_) {
    throw Error('[npf.net.XhrIo2] Object is active with another request=' +
        this.lastUri_ + '; newUri=' + url);
  }

  var method = opt_method ? opt_method.toUpperCase() : 'GET';

  this.lastUri_ = url;
  this.lastError_ = '';
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = false;
  this.active_ = true;

  // Use the factory to create the XHR object and options
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ?
      this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();

  // Set up the onreadystatechange callback
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);
  this.xhr_.upload.onloadend = goog.bind(this.onLoadEnd_, this);
  this.xhr_.upload.onloadstart = goog.bind(this.onLoadStart_, this);
  this.xhr_.upload.onprogress = goog.bind(this.onProgress_, this);

  /**
   * Try to open the XMLHttpRequest (always async), if an error occurs here it
   * is generally permission denied
   * @preserveTry
   */
  try {
    goog.log.fine(this.logger_, this.formatMsg_('Opening Xhr'));
    this.inOpen_ = true;
    this.xhr_.open(method, url, true);  // Always async!
    this.inOpen_ = false;
  } catch (err) {
    goog.log.fine(this.logger_,
      this.formatMsg_('Error opening Xhr: ' + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }

  // We can't use null since this won't allow requests with form data to have a
  // content length specified which will cause some proxies to return a 411
  // error.
  var content = opt_content || '';

  var headers = this.headers.clone();
  /** @type {!Object} */
  var parsedRequestHeaders = this.parseRequestHeaders(opt_headers);

  // Add headers specific to this request
  goog.structs.forEach(parsedRequestHeaders, function(value, key) {
    headers.set(key, value);
  });

  // Find whether a content type header is set, ignoring case.
  // HTTP header names are case-insensitive.  See:
  // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
  var contentTypeKey = goog.array.find(headers.getKeys(),
      npf.net.XhrIo2.isContentTypeHeader_);

  var contentIsFormData = (goog.global['FormData'] &&
      (content instanceof goog.global['FormData']));
  if (goog.array.contains(npf.net.XhrIo2.METHODS_WITH_FORM_DATA, method) &&
      !contentTypeKey && !contentIsFormData) {
    // For requests typically with form data, default to the url-encoded form
    // content type unless this is a FormData request.  For FormData,
    // the browser will automatically add a multipart/form-data content type
    // with an appropriate multipart boundary.
    headers.set(npf.net.XhrIo2.CONTENT_TYPE_HEADER,
                npf.net.XhrIo2.FORM_CONTENT_TYPE);
  }

  // Add the headers to the Xhr object
  goog.structs.forEach(headers, function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);

  if (this.responseType_) {
    this.xhr_.responseType = this.responseType_;
  }

  if (goog.object.containsKey(this.xhr_, 'withCredentials')) {
    this.xhr_.withCredentials = this.withCredentials_;
  }

  /**
   * Try to send the request, or other wise report an error (404 not found).
   * @preserveTry
   */
  try {
    this.cleanUpTimeoutTimer_(); // Paranoid, should never be running.
    if (this.timeoutInterval_ > 0) {
      this.useXhr2Timeout_ = npf.net.XhrIo2.shouldUseXhr2Timeout_(this.xhr_);
      goog.log.fine(this.logger_, this.formatMsg_('Will abort after ' +
          this.timeoutInterval_ + 'ms if incomplete, xhr2 ' +
          this.useXhr2Timeout_));
      if (this.useXhr2Timeout_) {
        this.xhr_[npf.net.XhrIo2.XHR2_TIMEOUT_] = this.timeoutInterval_;
        this.xhr_[npf.net.XhrIo2.XHR2_ON_TIMEOUT_] =
            goog.bind(this.timeout_, this);
      } else {
        this.timeoutId_ = goog.Timer.callOnce(this.timeout_,
            this.timeoutInterval_, this);
      }
    }
    goog.log.fine(this.logger_, this.formatMsg_('Sending request'));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false;

  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_('Send error: ' + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
  }
};

/**
 * @param {Object|goog.structs.Map=} opt_headers
 * @return {!Object}
 * @protected
 */
npf.net.XhrIo2.prototype.parseRequestHeaders = function(opt_headers) {
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
 * Determines if the argument is an XMLHttpRequest that supports the level 2
 * timeout value and event.
 *
 * Currently, FF 21.0 OS X has the fields but won't actually call the timeout
 * handler.  Perhaps the confusion in the bug referenced below hasn't
 * entirely been resolved.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=525816
 *
 * @param {!XMLHttpRequest|!GearsHttpRequest} xhr The request.
 * @return {boolean} True if the request supports level 2 timeout.
 * @private
 */
npf.net.XhrIo2.shouldUseXhr2Timeout_ = function(xhr) {
  return goog.userAgent.IE &&
      goog.userAgent.isVersionOrHigher(9) &&
      goog.isNumber(xhr[npf.net.XhrIo2.XHR2_TIMEOUT_]) &&
      goog.isDef(xhr[npf.net.XhrIo2.XHR2_ON_TIMEOUT_]);
};


/**
 * @param {string} header An HTTP header key.
 * @return {boolean} Whether the key is a content type header (ignoring
 *     case.
 * @private
 */
npf.net.XhrIo2.isContentTypeHeader_ = function(header) {
  return goog.string.caseInsensitiveEquals(
      npf.net.XhrIo2.CONTENT_TYPE_HEADER, header);
};


/**
 * Creates a new XHR object.
 * @return {XMLHttpRequest|GearsHttpRequest} The newly created XHR object.
 * @protected
 */
npf.net.XhrIo2.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ?
    this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
};


/**
 * The request didn't complete after {@link npf.net.XhrIo2#timeoutInterval_}
 * milliseconds; raises a {@link goog.net.EventType.TIMEOUT} event and aborts
 * the request.
 * @private
 */
npf.net.XhrIo2.prototype.timeout_ = function() {
  if (typeof goog == 'undefined') {
    // If goog is undefined then the callback has occurred as the application
    // is unloading and will error.  Thus we let it silently fail.
  } else if (this.xhr_) {
    this.lastError_ = 'Timed out after ' + this.timeoutInterval_ +
                      'ms, aborting';
    this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
    goog.log.fine(this.logger_, this.formatMsg_(this.lastError_));
    this.dispatchEvent(goog.net.EventType.TIMEOUT);
    this.abort(goog.net.ErrorCode.TIMEOUT);
  }
};


/**
 * Something errorred, so inactivate, fire error callback and clean up
 * @param {goog.net.ErrorCode} errorCode The error code.
 * @param {Error} err The error object.
 * @private
 */
npf.net.XhrIo2.prototype.error_ = function(errorCode, err) {
  this.active_ = false;
  if (this.xhr_) {
    this.inAbort_ = true;
    this.xhr_.abort();  // Ensures XHR isn't hung (FF)
    this.inAbort_ = false;
  }
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_();
};


/**
 * Dispatches COMPLETE and ERROR in case of an error. This ensures that we do
 * not dispatch multiple error events.
 * @private
 */
npf.net.XhrIo2.prototype.dispatchErrors_ = function() {
  if (!this.errorDispatched_) {
    this.errorDispatched_ = true;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR);
  }
};


/**
 * Abort the current XMLHttpRequest
 * @param {goog.net.ErrorCode=} opt_failureCode Optional error code to use -
 *     defaults to ABORT.
 */
npf.net.XhrIo2.prototype.abort = function(opt_failureCode) {
  if (this.xhr_ && this.active_) {
    goog.log.fine(this.logger_, this.formatMsg_('Aborting'));
    this.active_ = false;
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.cleanUpXhr_();
  }
};


/**
 * Nullifies all callbacks to reduce risks of leaks.
 * @override
 * @protected
 */
npf.net.XhrIo2.prototype.disposeInternal = function() {
  if (this.xhr_) {
    // We explicitly do not call xhr_.abort() unless active_ is still true.
    // This is to avoid unnecessarily aborting a successful request when
    // dispose() is called in a callback triggered by a complete response, but
    // in which browser cleanup has not yet finished.
    // (See http://b/issue?id=1684217.)
    if (this.active_) {
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false;
    }
    this.cleanUpXhr_(true);
  }

  goog.base(this, 'disposeInternal');
};


/**
 * Internal handler for the XHR object's readystatechange event.  This method
 * checks the status and the readystate and fires the correct callbacks.
 * If the request has ended, the handlers are cleaned up and the XHR object is
 * nullified.
 * @private
 */
npf.net.XhrIo2.prototype.onReadyStateChange_ = function() {
  if (this.isDisposed()) {
    // This method is the target of an untracked goog.Timer.callOnce().
    return;
  }
  if (!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    // Were not being called from within a call to this.xhr_.send
    // this.xhr_.abort, or this.xhr_.open, so this is an entry point
    this.onReadyStateChangeEntryPoint_();
  } else {
    this.onReadyStateChangeHelper_();
  }
};

/**
 * @param {Event} evt
 * @private
 */
npf.net.XhrIo2.prototype.onLoadEnd_ = function(evt) {
  var event = new goog.events.BrowserEvent(evt);
  event.type = npf.net.EventType.LOAD_END;
  this.dispatchEvent(event);
};

/**
 * @param {Event} evt
 * @private
 */
npf.net.XhrIo2.prototype.onLoadStart_ = function(evt) {
  var event = new goog.events.BrowserEvent(evt);
  event.type = npf.net.EventType.LOAD_START;
  this.dispatchEvent(event);
};

/**
 * @param {Event} evt
 * @private
 */
npf.net.XhrIo2.prototype.onProgress_ = function(evt) {
  var event = new goog.events.BrowserEvent(evt);
  event.type = goog.net.EventType.PROGRESS;
  this.dispatchEvent(event);
};


/**
 * Used to protect the onreadystatechange handler entry point.  Necessary
 * as {#onReadyStateChange_} maybe called from within send or abort, this
 * method is only called when {#onReadyStateChange_} is called as an
 * entry point.
 * {@see #protectEntryPoints}
 * @private
 */
npf.net.XhrIo2.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
};


/**
 * Helper for {@link #onReadyStateChange_}.  This is used so that
 * entry point calls to {@link #onReadyStateChange_} can be routed through
 * {@link #onReadyStateChangeEntryPoint_}.
 * @private
 */
npf.net.XhrIo2.prototype.onReadyStateChangeHelper_ = function() {
  if (!this.active_) {
    // can get called inside abort call
    return;
  }

  if (typeof goog == 'undefined') {
    // NOTE(user): If goog is undefined then the callback has occurred as the
    // application is unloading and will error.  Thus we let it silently fail.

  } else if (
      this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] &&
      this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE &&
      this.getStatus() == 2) {
    // NOTE(user): In IE if send() errors on a *local* request the readystate
    // is still changed to COMPLETE.  We need to ignore it and allow the
    // try/catch around send() to pick up the error.
    goog.log.fine(this.logger_, this.formatMsg_(
        'Local request error detected and ignored'));

  } else {

    // In IE when the response has been cached we sometimes get the callback
    // from inside the send call and this usually breaks code that assumes that
    // XhrIo is asynchronous.  If that is the case we delay the callback
    // using a timer.
    if (this.inSend_ &&
        this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
      goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
      return;
    }

    this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);

    // readyState indicates the transfer has finished
    if (this.isComplete()) {
      goog.log.fine(this.logger_, this.formatMsg_('Request complete'));

      this.active_ = false;

      try {
        // Call the specific callbacks for success or failure. Only call the
        // success if the status is 200 (HTTP_OK) or 304 (HTTP_CACHED)
        if (this.isSuccess()) {
          this.dispatchEvent(goog.net.EventType.COMPLETE);
          this.dispatchEvent(goog.net.EventType.SUCCESS);
        } else {
          this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
          this.lastError_ =
              this.getStatusText() + ' [' + this.getStatus() + ']';
          this.dispatchErrors_();
        }
      } finally {
        this.cleanUpXhr_();
      }
    }
  }
};


/**
 * Remove the listener to protect against leaks, and nullify the XMLHttpRequest
 * object.
 * @param {boolean=} opt_fromDispose If this is from the dispose (don't want to
 *     fire any events).
 * @private
 */
npf.net.XhrIo2.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    // Cancel any pending timeout event handler.
    this.cleanUpTimeoutTimer_();

    // Save reference so we can mark it as closed after the READY event.  The
    // READY event may trigger another request, thus we must nullify this.xhr_
    var xhr = this.xhr_;
    this.xhr_ = null;
    this.xhrOptions_ = null;

    if (!opt_fromDispose) {
      this.dispatchEvent(goog.net.EventType.READY);
    }

    try {
      // NOTE(user): Not nullifying in FireFox can still leak if the callbacks
      // are defined in the same scope as the instance of XhrIo.
      xhr.onreadystatechange = null;
    } catch (e) {
      // This seems to occur with a Gears HTTP request. Delayed the setting of
      // this onreadystatechange until after READY is sent out and catching the
      // error to see if we can track down the problem.
      goog.log.error(this.logger_,
          'Problem encountered resetting onreadystatechange: ' + e.message);
    }
  }
};


/**
 * Make sure the timeout timer isn't running.
 * @private
 */
npf.net.XhrIo2.prototype.cleanUpTimeoutTimer_ = function() {
  if (this.xhr_ && this.useXhr2Timeout_) {
    this.xhr_[npf.net.XhrIo2.XHR2_ON_TIMEOUT_] = null;
  }
  if (goog.isNumber(this.timeoutId_)) {
    goog.Timer.clear(this.timeoutId_);
    this.timeoutId_ = null;
  }
};


/**
 * @return {boolean} Whether there is an active request.
 */
npf.net.XhrIo2.prototype.isActive = function() {
  return !!this.xhr_;
};


/**
 * @return {boolean} Whether the request has completed.
 */
npf.net.XhrIo2.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
};


/**
 * @return {boolean} Whether the request completed with a success.
 */
npf.net.XhrIo2.prototype.isSuccess = function() {
  var status = this.getStatus();
  // A zero status code is considered successful for local files.
  return goog.net.HttpStatus.isSuccess(status) ||
      status === 0 && !this.isLastUriEffectiveSchemeHttp_();
};


/**
 * @return {boolean} whether the effective scheme of the last URI that was
 *     fetched was 'http' or 'https'.
 * @private
 */
npf.net.XhrIo2.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return npf.net.XhrIo2.HTTP_SCHEME_PATTERN.test(scheme);
};


/**
 * Get the readystate from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {goog.net.XmlHttp.ReadyState} goog.net.XmlHttp.ReadyState.*.
 */
npf.net.XhrIo2.prototype.getReadyState = function() {
  return this.xhr_ ?
      /** @type {goog.net.XmlHttp.ReadyState} */ (this.xhr_.readyState) :
      goog.net.XmlHttp.ReadyState.UNINITIALIZED;
};


/**
 * Get the status from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {number} Http status.
 */
npf.net.XhrIo2.prototype.getStatus = function() {
  /**
   * IE doesn't like you checking status until the readystate is greater than 2
   * (i.e. it is recieving or complete).  The try/catch is used for when the
   * page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
   * @preserveTry
   */
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
        this.xhr_.status : -1;
  } catch (e) {
    goog.log.warning(this.logger_, 'Can not get status: ' + e.message);
    return -1;
  }
};


/**
 * Get the status text from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @return {string} Status text.
 */
npf.net.XhrIo2.prototype.getStatusText = function() {
  /**
   * IE doesn't like you checking status until the readystate is greater than 2
   * (i.e. it is recieving or complete).  The try/catch is used for when the
   * page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
   * @preserveTry
   */
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
        this.xhr_.statusText : '';
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get status: ' + e.message);
    return '';
  }
};


/**
 * Get the last Uri that was requested
 * @return {string} Last Uri.
 */
npf.net.XhrIo2.prototype.getLastUri = function() {
  return String(this.lastUri_);
};


/**
 * Get the response text from the Xhr object
 * Will only return correct result when called from the context of a callback.
 * @return {string} Result from the server, or '' if no result available.
 */
npf.net.XhrIo2.prototype.getResponseText = function() {
  if (
    this.xhr_ &&
    (
      npf.net.XhrIo2.ResponseType.DEFAULT == this.xhr_.responseType ||
      npf.net.XhrIo2.ResponseType.TEXT == this.xhr_.responseType
    )
  ) {
    return /** @type {string} */ (this.xhr_.response);
  }

  return '';
};


/**
 * Get the response XML from the Xhr object
 * Will only return correct result when called from the context of a callback.
 * @return {Document} The DOM Document representing the XML file, or null
 * if no result available.
 */
npf.net.XhrIo2.prototype.getResponseXml = function() {
  if (
    this.xhr_ &&
    npf.net.XhrIo2.ResponseType.DOCUMENT == this.xhr_.responseType
  ) {
    return /** @type {Document} */ (this.xhr_.response);
  }

  return null;
};


/**
 * Get the response and evaluates it as JSON from the Xhr object
 * Will only return correct result when called from the context of a callback
 * @param {string=} opt_xssiPrefix Optional XSSI prefix string to use for
 *     stripping of the response before parsing. This needs to be set only if
 *     your backend server prepends the same prefix string to the JSON response.
 * @return {Object|undefined} JavaScript object.
 */
npf.net.XhrIo2.prototype.getResponseJson = function(opt_xssiPrefix) {
  /** @type {string} */
  var responseText = this.getResponseText();

  if (!responseText) {
    return undefined;
  }

  if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length);
  }

  return goog.json.parse(responseText);
};


/**
 * Emulating the response means following the rules laid out at
 * http://www.w3.org/TR/XMLHttpRequest/#the-response-attribute
 *
 * On browsers with no support for this (Chrome < 10, Firefox < 4, etc), only
 * response types of DEFAULT or TEXT may be used, and the response returned will
 * be the text response.
 *
 * On browsers with Mozilla's draft support for array buffers (Firefox 4, 5),
 * only response types of DEFAULT, TEXT, and ARRAY_BUFFER may be used, and the
 * response returned will be either the text response or the Mozilla
 * implementation of the array buffer response.
 *
 * On browsers will full support, any valid response type supported by the
 * browser may be used, and the response provided by the browser will be
 * returned.
 *
 * @return {*} The response.
 */
npf.net.XhrIo2.prototype.getResponse = function() {
  return this.xhr_ ? this.xhr_.response : null;
};


/**
 * Get the value of the response-header with the given name from the Xhr object
 * Will only return correct result when called from the context of a callback
 * and the request has completed
 * @param {string} key The name of the response-header to retrieve.
 * @return {string|undefined} The value of the response-header named key.
 */
npf.net.XhrIo2.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ?
      this.xhr_.getResponseHeader(key) : undefined;
};


/**
 * Gets the text of all the headers in the response.
 * Will only return correct result when called from the context of a callback
 * and the request has completed.
 * @return {string} The value of the response headers or empty string.
 */
npf.net.XhrIo2.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ?
      this.xhr_.getAllResponseHeaders() : '';
};


/**
 * Returns all response headers as a key-value map.
 * Multiple values for the same header key can be combined into one,
 * separated by a comma and a space.
 * Note that the native getResponseHeader method for retrieving a single header
 * does a case insensitive match on the header name. This method does not
 * include any case normalization logic, it will just return a key-value
 * representation of the headers.
 * See: http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
 * @return {!Object.<string, string>} An object with the header keys as keys
 *     and header values as values.
 */
npf.net.XhrIo2.prototype.getResponseHeaders = function() {
  /** @type {!Object.<string>} */
  var headersObject = {};
  /** @type {!Array.<string>} */
  var headersArray = this.getAllResponseHeaders().split('\r\n');

  for (var i = 0; i < headersArray.length; i++) {
    if (goog.string.isEmpty(headersArray[i])) {
      continue;
    }

    /** @type {!Array.<string>} */
    var keyValue = goog.string.splitLimit(headersArray[i], ': ', 2);

    if (headersObject[keyValue[0]]) {
      headersObject[keyValue[0]] += ', ' + keyValue[1];
    } else {
      headersObject[keyValue[0]] = keyValue[1];
    }
  }
  return headersObject;
};


/**
 * Get the last error message
 * @return {goog.net.ErrorCode} Last error code.
 */
npf.net.XhrIo2.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
};


/**
 * Get the last error message
 * @return {string} Last error message.
 */
npf.net.XhrIo2.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ :
      String(this.lastError_);
};


/**
 * Adds the last method, status and URI to the message.  This is used to add
 * this information to the logging calls.
 * @param {string} msg The message text that we want to add the extra text to.
 * @return {string} The message with the extra text appended.
 * @private
 */
npf.net.XhrIo2.prototype.formatMsg_ = function(msg) {
  return msg + ' [' + this.lastMethod_ + ' ' + this.lastUri_ + ' ' +
      this.getStatus() + ']';
};

/**
 * @return {boolean}
 */
npf.net.XhrIo2.prototype.isServerError = function() {
  /** @type {number} */
  var status = this.getStatus();

  return status >= 500 && status < 600;
};

/** @inheritDoc */
npf.net.XhrIo2.prototype.dispatchEvent = function(e) {
  var eventType = /** @type {goog.net.EventType|null|undefined} */ (
    goog.isString(e) ? e : e.type);

  if (eventType) {
    goog.object.forEach(npf.net.XhrIo2.globalHandles_, function(handler) {
      handler(this, /** @type {goog.net.EventType} */ (eventType));
    }, this);
  }

  return goog.base(this, 'dispatchEvent', e);
};

/**
 * @param {string} prop
 * @return {*|undefined}
 */
npf.net.XhrIo2.prototype.getResponseJsonProperty = function(prop) {
  var jsonData = this.getResponseJson();

  if (goog.isObject(jsonData)) {
    return jsonData[prop];
  }

  return undefined;
};



// Register the xhr handler as an entry point, so that
// it can be monitored for exception handling, etc.
goog.debug.entryPointRegistry.register(
    /**
     * @param {function(!Function): !Function} transformer The transforming
     *     function.
     */
    function(transformer) {
      npf.net.XhrIo2.prototype.onReadyStateChangeEntryPoint_ =
          transformer(npf.net.XhrIo2.prototype.onReadyStateChangeEntryPoint_);
    });
