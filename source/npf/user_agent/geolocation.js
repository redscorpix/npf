goog.provide('npf.userAgent.geolocation');

goog.require('goog.userAgent');


/**
 * Detects support for the Geolocation API for users to provide their location
 * to web applications.
 * @return {boolean}
 */
npf.userAgent.geolocation.isSupported = function() {
  // geolocation is often considered a trivial feature detect...
  // Turns out, it's quite tricky to get right:
  //
  // Using !!navigator.geolocation does two things we don't want. It:
  //   1. Leaks memory in IE9.
  //   2. Disables page caching in WebKit: webk.it/43956
  //
  // Meanwhile, in Firefox < 8, an about:config setting could expose
  // a false positive that would throw an exception: bugzil.la/688158

  return 'geolocation' in goog.userAgent.getNavigator();
};
