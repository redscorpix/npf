goog.provide('npf.userAgent.serviceWorker');

goog.require('goog.userAgent');


/**
 * ServiceWorkers (formerly Navigation Controllers) are a way to persistently
 * cache resources to built apps that work better offline.
 * @return {boolean}
 */
npf.userAgent.serviceWorker.isSupported = function() {
  return 'serviceWorker' in goog.userAgent.getNavigator();
};
