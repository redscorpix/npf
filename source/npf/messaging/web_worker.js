goog.provide('npf.messaging.webWorker');

goog.require('goog.fs.url');
goog.require('goog.json');
goog.require('goog.object');


/**
 * @private {boolean?}
 */
npf.messaging.webWorker.supported_ = null;

/**
 * @return {boolean}
 */
npf.messaging.webWorker.isSupported = function() {
  if (goog.isBoolean(npf.messaging.webWorker.supported_)) {
    return npf.messaging.webWorker.supported_;
  }

  /** @type {boolean} */
  var supported = true;

  if (
    !goog.global['Worker'] ||
    !goog.global['Blob'] ||
    !goog.fs.url.browserSupportsObjectUrls()
  ) {
    supported = false;
  }

  if (supported) {
    // IE don't allow to create webworkers from string. We should check it.
    // https://connect.microsoft.com/IE/feedback/details/801810/web-workers-from-blob-urls-in-ie-10-and-11
    try {
      var worker = npf.messaging.webWorker.create(goog.nullFunction);
      worker.terminate();
    } catch (e) {
      supported = false;
    }
  }

  npf.messaging.webWorker.supported_ = supported;

  return supported;
};

/**
 * @param {function(!Object)} fn
 * @param {Object<boolean|number|string|Object|Function>=} opt_attrs
 * @return {!Worker}
 */
npf.messaging.webWorker.create = function(fn, opt_attrs) {
  var content = '(function(){var window=self=this;';

  if (opt_attrs) {
    goog.object.forEach(opt_attrs, function(attr, key) {
      /** @type {string} */
      var serialized = goog.isFunction(attr) ?
        attr.toString() : goog.json.serialize(attr);
      content += 'self["' + key + '"]=' + serialized + ';';
    });
  }

  content +='(' + fn.toString() + ')(self)})()';

  var blob = new Blob([content], {
    type: 'application/javascript'
  });
  var blobUrl = goog.fs.url.createObjectUrl(blob);
  var worker = new Worker(blobUrl);
  var onFirstMessage = function() {
    goog.fs.url.revokeObjectUrl(blobUrl);
    worker.removeEventListener('message', onFirstMessage);
  };
  worker.addEventListener('message', onFirstMessage);

  return worker;
};
