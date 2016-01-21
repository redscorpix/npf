goog.provide('npf.userAgent.applicationCache');


/**
 * Detects support for the Application Cache, for storing data to enable
 * web-based applications run offline.
 * The API has been
 * [heavily criticized](http://alistapart.com/article/application-cache-is-a-douchebag)
 * and discussions are underway to address this.
 * @return {boolean}
 */
npf.userAgent.applicationCache.isSupported = function() {
  return 'applicationCache' in goog.global;
};
