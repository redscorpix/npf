goog.provide('npf.userAgent.proximity');

goog.require('goog.dom');


/**
 * @private {boolean?}
 */
npf.userAgent.proximity.supported_ = null;

/**
 * Detects support for an API that allows users to get proximity related
 * information from the device's proximity sensor.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.proximity.isSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.proximity.supported_)) {
    callback.call(opt_scope, npf.userAgent.proximity.supported_);
  } else {
    /** @type {!Window} */
    var win = goog.dom.getDomHelper().getWindow();

    // Check if the browser has support for the API
    if ('ondeviceproximity' in win && 'onuserproximity' in win) {
      /** @type {number} */
      var timeout;
      /** @type {function()} */
      var advertiseSupport = function() {
        // Clean up after ourselves
        clearTimeout(timeout);
        win.removeEventListener('deviceproximity', advertiseSupport);

        // Advertise support as the browser supports
        // the API and the device has a proximity sensor
        npf.userAgent.proximity.supported_ = true;
        callback.call(opt_scope, true);
      };

      // Check if the device has a proximity sensor
      // ( devices without such a sensor support the events but
      //   will never fire them resulting in a false positive )
      win.addEventListener('deviceproximity', advertiseSupport);

      // If the event doesn't fire in a reasonable amount of time,
      // it means that the device doesn't have a proximity sensor,
      // thus, we can advertise the "lack" of support
      timeout = setTimeout(function() {
        win.removeEventListener('deviceproximity', advertiseSupport);
        npf.userAgent.proximity.supported_ = false;
        callback.call(opt_scope, false);
      }, 300);
    } else {
      npf.userAgent.proximity.supported_ = false;
      callback.call(opt_scope, false);
    }
  }
};
