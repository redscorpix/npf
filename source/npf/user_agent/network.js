goog.provide('npf.userAgent.network');

goog.require('goog.userAgent');


/**
 * Detects support for an API that allows for asynchronous transfer of small
 * HTTP data from the client to a server.
 * @return {boolean}
 */
npf.userAgent.network.isBeaconSupported = function() {
  return 'sendBeacon' in goog.userAgent.getNavigator();
};

/**
 * Tests for server sent events aka eventsource.
 * @return {boolean}
 */
npf.userAgent.network.isEventSourceSupported = function() {
  return 'EventSource' in goog.global;
};

/**
 * Detects support for the fetch API, a modern replacement for XMLHttpRequest.
 * @return {boolean}
 */
npf.userAgent.network.isFetchSupported = function() {
  return 'fetch' in goog.global;
};

/**
 * @private {boolean?}
 */
npf.userAgent.network.lowBandwidth_ = null;

/**
 * Tests for determining low-bandwidth via `navigator.connection`.
 *
 * There are two iterations of the `navigator.connection` interface.
 *
 * The first is present in Android 2.2+ and only in the Browser (not WebView).
 * - http://docs.phonegap.com/en/1.2.0/phonegap_connection_connection.md.html#connection.type
 * - http://davidbcalhoun.com/2010/using-navigator-connection-android
 *
 * The second is specced at http://dev.w3.org/2009/dap/netinfo/ and perhaps
 * landing in WebKit.
 * - http://bugs.webkit.org/show_bug.cgi?id=73528
 *
 * Unknown devices are assumed as fast.
 *
 * For more rigorous network testing, consider boomerang.js:
 * http://github.com/bluesmoon/boomerang/
 * @return {boolean}
 */
npf.userAgent.network.isLowBandwidthSupported = function() {
  if (goog.isNull(npf.userAgent.network.lowBandwidth_)) {
    var connection = goog.userAgent.getNavigator()['connection'];

    npf.userAgent.network.lowBandwidth_ = !!connection && (
      3 == connection['type'] || // connection.CELL_2G
      4 == connection['type'] || // connection.CELL_3G
      /^[23]g$/.test(connection['type']) // string value in new spec
    );
  }

  return /** @type {boolean} */ (npf.userAgent.network.lowBandwidth_);
};

/**
 * @return {boolean}
 */
npf.userAgent.network.isWebSocketSupported = function() {
  return 'WebSocket' in goog.global && 2 === goog.global.WebSocket.CLOSING;
};

/**
 * @private {boolean?}
 */
npf.userAgent.network.webSocketBinary_ = null;

/**
 * binaryType is truthy if there is support.. returns "blob" in new-ish chrome.
 * plus.google.com/115535723976198353696/posts/ERN6zYozENV
 * @return {boolean}
 */
npf.userAgent.network.isWebSocketBinarySupported = function() {
  if (goog.isNull(npf.userAgent.network.webSocketBinary_)) {
    npf.userAgent.network.webSocketBinary_ = false;

    var protocol = 'https:' == location.protocol ? 'wss' : 'ws';

    if ('WebSocket' in goog.global) {
      npf.userAgent.network.webSocketBinary_ =
        'binaryType' in WebSocket.prototype;

      if (!npf.userAgent.network.webSocketBinary_) {
        try {
          npf.userAgent.network.webSocketBinary_ =
            !!(new WebSocket(protocol + '://.').binaryType);
        } catch (e) {}
      }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.network.webSocketBinary_);
};
