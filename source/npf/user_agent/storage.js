goog.provide('npf.userAgent.storage');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.storage.localStorage_ = null;

/**
 * In FF4, if disabled, window.localStorage should === null.
 *
 * Normally, we could not test that directly and need to do a
 * `('localStorage' in window) && ` test first because otherwise Firefox will
 * throw bugzil.la/365772 if cookies are disabled
 *
 * Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
 * will throw the exception:
 *     QUOTA_EXCEEDED_ERROR DOM Exception 22.
 * Peculiarly, getItem and removeItem calls do not throw.
 *
 * Because we are forced to try/catch this, we'll go aggressive.
 *
 * Just FWIW: IE8 Compat mode supports these features completely:
 *     www.quirksmode.org/dom/html5.html
 * But IE8 doesn't support either with local files.
 * @return {boolean}
 */
npf.userAgent.storage.isLocalStorageSupported = function() {
  if (goog.isNull(npf.userAgent.storage.localStorage_)) {
    npf.userAgent.storage.localStorage_ = false;

    /** @type {string} */
    var mod = npf.userAgent.utils.ID;

    try {
      goog.global.localStorage.setItem(mod, mod);
      goog.global.localStorage.removeItem(mod);

      npf.userAgent.storage.localStorage_ = true;
    } catch (e) { }
  }

  return /** @type {boolean} */ (npf.userAgent.storage.localStorage_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.storage.sessionStorage_ = null;

/**
 * Because we are forced to try/catch this, we'll go aggressive.
 *
 * Just FWIW: IE8 Compat mode supports these features completely:
 *     www.quirksmode.org/dom/html5.html
 * But IE8 doesn't support either with local files.
 * @return {boolean}
 */
npf.userAgent.storage.isSessionStorageSupported = function() {
  if (goog.isNull(npf.userAgent.storage.sessionStorage_)) {
    npf.userAgent.storage.sessionStorage_ = false;

    /** @type {string} */
    var mod = npf.userAgent.utils.ID;

    try {
      goog.global.sessionStorage.setItem(mod, mod);
      goog.global.sessionStorage.removeItem(mod);

      npf.userAgent.storage.sessionStorage_ = true;
    } catch (e) { }
  }

  return /** @type {boolean} */ (npf.userAgent.storage.sessionStorage_);
};

/**
 * @return {boolean}
 */
npf.userAgent.storage.isWebSqlDbSupported = function() {
  // Chrome incognito mode used to throw an exception when using openDatabase
  // It doesn't anymore.
  return 'openDatabase' in goog.global;
};
