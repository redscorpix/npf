goog.provide('npf.userAgent.indexedDb');

goog.require('npf.userAgent.utils');


/**
 * @private {IDBFactory}
 */
npf.userAgent.indexedDb.idbFactory_ = null;

/**
 * @return {IDBFactory}
 */
npf.userAgent.indexedDb.getIdbFactory = function() {
  // Vendors had inconsistent prefixing with the experimental Indexed DB:
  // - Webkit's implementation is accessible through webkitIndexedDB
  // - Firefox shipped moz_indexedDB before FF4b9, but since then has been
  //   mozIndexedDB
  // For speed, we don't test the legacy (and beta-only) indexedDB

  if (!npf.userAgent.indexedDb.idbFactory_) {
    npf.userAgent.indexedDb.idbFactory_ = /** @type {IDBFactory} */ (
      npf.userAgent.utils.prefixed('indexedDB', goog.global));
  }

  return npf.userAgent.indexedDb.idbFactory_;
};

/**
 * @private {IDBTransaction}
 */
npf.userAgent.indexedDb.idbTransation_ = null;

/**
 * @return {IDBTransaction}
 */
npf.userAgent.indexedDb.getIdbTransaction = function() {
  if (!npf.userAgent.indexedDb.idbTransation_) {
    npf.userAgent.indexedDb.idbTransation_ = /** @type {IDBTransaction} */ (
      npf.userAgent.utils.prefixed('IDBTransaction', goog.global));
  }

  return npf.userAgent.indexedDb.idbTransation_;
};

/**
 * @private {IDBKeyRange}
 */
npf.userAgent.indexedDb.idbKeyRange_ = null;

/**
 * @return {IDBKeyRange}
 */
npf.userAgent.indexedDb.getIdbKeyRange = function() {
  if (!npf.userAgent.indexedDb.idbKeyRange_) {
    npf.userAgent.indexedDb.idbKeyRange_ = /** @type {IDBKeyRange} */ (
      npf.userAgent.utils.prefixed('IDBKeyRange', goog.global));
  }
  return npf.userAgent.indexedDb.idbKeyRange_;
};

/**
 * Detects support for the IndexedDB client-side storage API (final spec).
 * @return {boolean}
 */
npf.userAgent.indexedDb.isSupported = function() {
  return !!npf.userAgent.indexedDb.getIdbFactory();
};

/**
 * @private {boolean?}
 */
npf.userAgent.indexedDb.blob_ = null;

/**
 * Detects if the browser can save File/Blob objects to IndexedDB.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.indexedDb.isBlobSupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.indexedDb.blob_)) {
    callback.call(opt_scope, npf.userAgent.indexedDb.blob_);
  } else {
    /** @type {IDBFactory} */
    var indexedDb = npf.userAgent.indexedDb.getIdbFactory();

    if (!indexedDb || !('deleteDatabase' in indexedDb)) {
      npf.userAgent.indexedDb.blob_ = false;
      callback.call(opt_scope, false);
    } else {
      // Calling `deleteDatabase` in a try…catch because some contexts
      // (e.g. data URIs) will throw a `SecurityError`
      try {
        /** @type {string} */
        var dbName = 'detect-blob-support';
        indexedDb.deleteDatabase(dbName).onsuccess = function() {
          var request = indexedDb.open(dbName, 1);
          request.onupgradeneeded = function() {
            request.result.createObjectStore('store');
          };
          request.onsuccess = function() {
            var db = request.result;
            /** @type {boolean} */
            var supportsBlob;

            try {
              db.transaction('store', 'readwrite').
                objectStore('store').
                put(new Blob(), 'key');
              supportsBlob = true;
            } catch (e) {
              supportsBlob = false;
            } finally {
              npf.userAgent.indexedDb.blob_ = supportsBlob;
              callback.call(opt_scope, supportsBlob);
              db.close();
              indexedDb.deleteDatabase(dbName);
            }
          };
        };
      } catch (e) {
        npf.userAgent.indexedDb.blob_ = false;
        callback.call(opt_scope, false);
      }
    }
  }
};

/**
 * @return {boolean}
 */
npf.userAgent.indexedDb.isDeleteAllow = function() {
  /** @type {IDBFactory} */
  var indexedDb = npf.userAgent.indexedDb.getIdbFactory();

  return !!indexedDb && 'deleteDatabase' in indexedDb;
};
