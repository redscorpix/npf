goog.provide('npf.debug.ErrorReporter');

goog.require('goog.debug.ErrorReporter');


/**
 * Constructs an error reporter. Internal Use Only. To install an error
 * reporter see the {@see #install} method below.
 *
 * @param {string} handlerUrl The URL to which all errors will be reported.
 * @param {function(!Error, !Object.<string, string>)=}
 *     opt_contextProvider When a report is to be sent to the server,
 *     this method will be called, and given an opportunity to modify the
 *     context object before submission to the server.
 * @param {boolean=} opt_noAutoProtect Whether to automatically add handlers for
 *     onerror and to protect entry points.  If apps have other error reporting
 *     facilities, it may make sense for them to set these up themselves and use
 *     the ErrorReporter just for transmission of reports.
 * @constructor
 * @extends {goog.debug.ErrorReporter}
 */
npf.debug.ErrorReporter = function(handlerUrl, opt_contextProvider,
																   opt_noAutoProtect) {
  goog.base(this, handlerUrl, opt_contextProvider, opt_noAutoProtect);
};
goog.inherits(npf.debug.ErrorReporter, goog.debug.ErrorReporter);


/**
 * Installs an error reporter to catch all JavaScript errors raised.
 *
 * @param {string} loggingUrl The URL to which the errors caught will be
 *     reported.
 * @param {function(!Error, !Object.<string, string>)=}
 *     opt_contextProvider When a report is to be sent to the server,
 *     this method will be called, and given an opportunity to modify the
 *     context object before submission to the server.
 * @param {boolean=} opt_noAutoProtect Whether to automatically add handlers for
 *     onerror and to protect entry points.  If apps have other error reporting
 *     facilities, it may make sense for them to set these up themselves and use
 *     the ErrorReporter just for transmission of reports.
 * @return {npf.debug.ErrorReporter} The error reporter.
 */
npf.debug.ErrorReporter.install = function(loggingUrl, opt_contextProvider,
                                           opt_noAutoProtect) {
  return new npf.debug.ErrorReporter(loggingUrl, opt_contextProvider,
     opt_noAutoProtect);
};


/** @inheritDoc */
npf.debug.ErrorReporter.prototype.handleException = function(e, opt_context) {
  if (goog.DEBUG && goog.global.console && e) {
    goog.global.console.error(e.stack);
  }

  goog.base(this, 'handleException', e, opt_context);
};
