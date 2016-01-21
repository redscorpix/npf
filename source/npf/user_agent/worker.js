goog.provide('npf.userAgent.worker');

goog.require('npf.userAgent.blob');
goog.require('npf.userAgent.typedArray');
goog.require('npf.userAgent.url');
goog.require('npf.userAgent.utils');


/**
 * Detects support for the basic `Worker` API from the Web Workers spec.
 * Web Workers provide a simple means for web content to run scripts
 * in background threads.
 * @return {boolean}
 */
npf.userAgent.worker.isSupported = function() {
  return 'Worker' in goog.global;
};

/**
 * @private {boolean?}
 */
npf.userAgent.worker.creatingFromBlob_ = null;

/**
 * Detects support for creating Web Workers from Blob URIs.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.worker.isCreatingFromBlobSupported = function(callback,
    opt_scope) {
  if (goog.isBoolean(npf.userAgent.worker.creatingFromBlob_)) {
    callback.call(opt_scope, npf.userAgent.worker.creatingFromBlob_);
  } else {
    /** @type {number} */
    var timeout;
    /** @type {string} */
    var url;
    /** @type {Worker} */
    var worker;
    /** @type {function()} */
    var cleanup = function() {
      if (url) {
        URL.revokeObjectURL(url);
      }

      if (worker) {
        worker.terminate();
      }

      if (timeout) {
        clearTimeout(timeout);
      }
    };
    /** @type {function()} */
    var fail = function() {
      cleanup();
      npf.userAgent.worker.creatingFromBlob_ = false;
      callback.call(opt_scope, false);
    };

    try {
      // we're avoiding using npf.userAgent.DOM_PREFIXES as the prefix
      // capitalization on these guys are notoriously peculiar.
      var BlobBuilder = goog.global['BlobBuilder'] ||
        goog.global['MozBlobBuilder'] || goog.global['WebKitBlobBuilder'] ||
        goog.global['MSBlobBuilder'] || goog.global['OBlobBuilder'];
      var URL = goog.global['URL'] || goog.global['MozURL'] ||
        goog.global['webkitURL'] || goog.global['MSURL'] || goog.global['OURL'];
      /** @type {string} */
      var data = npf.userAgent.utils.ID;
      /** @type {!Blob} */
      var blob;
      /** @type {string} */
      var scriptText = 'this.onmessage=function(e){postMessage(e.data)}';

      try {
        blob = new Blob([scriptText], {
          'type': 'text/javascript'
        });
      } catch (e) {
        // we'll fall back to the deprecated BlobBuilder
      }

      if (!blob) {
        var bb = new BlobBuilder();
        bb.append(scriptText);
        blob = bb.getBlob();
      }

      url = URL['createObjectURL'](blob);
      worker = new Worker(url);

      worker.onmessage = function(e) {
        npf.userAgent.worker.creatingFromBlob_ = data === e.data;
        callback.call(opt_scope, npf.userAgent.worker.creatingFromBlob_);
        cleanup();
      };

      // Just in case...
      worker.onerror = fail;
      timeout = setTimeout(fail, 200);

      worker.postMessage(data);
    } catch (e) {
      fail();
    }
  }
};

/**
 * @const {string}
 */
npf.userAgent.worker.SCRIPT_SRC =
  'data:text/javascript;base64,dGhpcy5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7cG9zdE1lc3' +
  'NhZ2UoZS5kYXRhKX0=';

/**
 * @private {boolean?}
 */
npf.userAgent.worker.creatingFromDataUri_ = null;

/**
 * Detects support for creating Web Workers from Data URIs.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.worker.isCreatingFromDataUriSupported = function(callback,
    opt_scope) {
  if (goog.isBoolean(npf.userAgent.worker.creatingFromDataUri_)) {
    callback.call(opt_scope, npf.userAgent.worker.creatingFromDataUri_);
  } else {
    /** @type {number} */
    var timeout;
    /** @type {function(boolean=)} */
    var complete = function(opt_support) {
      clearTimeout(timeout);
      npf.userAgent.worker.creatingFromDataUri_ = !!opt_support;
      callback.call(opt_scope, npf.userAgent.worker.creatingFromDataUri_);
    };

    try {
      var data = npf.userAgent.utils.ID;
      var worker = new Worker(npf.userAgent.worker.SCRIPT_SRC);

      worker.onmessage = function(e) {
        worker.terminate();
        worker = null;
        complete(data === e.data);
      };

      // Just in case...
      worker.onerror = function() {
        worker = null;
        complete();
      };

      timeout = setTimeout(complete, 200);

      worker.postMessage(data);
    } catch (e) {
      complete();
    }
  }
};

/**
 * Detects support for the `SharedWorker` API from the Web Workers spec.
 * @return {boolean}
 */
npf.userAgent.worker.isSharedWorkerSupported = function() {
  return 'SharedWorker' in goog.global;
};

/**
 * @private {boolean?}
 */
npf.userAgent.worker.transferableObject_ = null;

/**
 * Detects whether web workers can use `transferables` objects.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.worker.isTransferableObjectSupported = function(callback,
    opt_scope) {
  if (goog.isBoolean(npf.userAgent.worker.transferableObject_)) {
    callback.call(opt_scope, npf.userAgent.worker.transferableObject_);
  } else if (!(
    npf.userAgent.blob.isSupported() &&
    npf.userAgent.url.isBlobUrlSupported() &&
    npf.userAgent.worker.isSupported() &&
    npf.userAgent.typedArray.isSupported()
  )) {
    callback.call(opt_scope, false);
  } else {
    /** @type {number} */
    var timeout;
    /** @type {string} */
    var url;
    /** @type {Worker} */
    var worker;
    /** @type {function()} */
    var cleanup = function() {
      if (url) {
        URL.revokeObjectURL(url);
      }

      if (worker) {
        worker.terminate();
      }

      clearTimeout(timeout);
    };
    /** @type {function()} */
    var fail = function() {
      cleanup();
      npf.userAgent.worker.transferableObject_ = false;
      callback.call(opt_scope, false);
    };

    try {
      var blob = new Blob(['var hello="world"'], {
        'type': 'text/javascript'
      });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);

      // Just in case...
      worker.onerror = fail;
      timeout = setTimeout(fail, 200);

      // Building an minimal array buffer to send to the worker
      var buffer = new ArrayBuffer(1);

      // Sending the buffer to the worker
      worker.postMessage(buffer, [buffer]);

      cleanup();

      // If length of buffer is now 0, transferables are working
      npf.userAgent.worker.transferableObject_ = 0 === buffer.byteLength;
      callback.call(opt_scope, npf.userAgent.worker.transferableObject_);
    } catch (e) {
      fail();
    }
  }
};
