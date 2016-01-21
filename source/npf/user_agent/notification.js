goog.provide('npf.userAgent.notification');


/**
 * Detects support for the Notifications API.
 * @return {boolean}
 */
npf.userAgent.notification.isSupported = function() {
  return 'Notification' in goog.global &&
    'permission' in goog.global.Notification &&
    'requestPermission' in goog.global.Notification;
};
