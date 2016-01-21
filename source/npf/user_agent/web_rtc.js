goog.provide('npf.userAgent.webRtc');

goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.webRtc.getUserMedia_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.webRtc.isGetUserMediaSupported = function() {
  if (goog.isNull(npf.userAgent.webRtc.getUserMedia_)) {
    npf.userAgent.webRtc.getUserMedia_ = !!npf.userAgent.utils.prefixed(
      'getUserMedia', goog.userAgent.getNavigator());
  }

  return /** @type {boolean} */ (npf.userAgent.webRtc.getUserMedia_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.webRtc.dataChannel_ = null;

/**
 * Detect for the RTCDataChannel API that allows for transfer data directly
 * from one peer to another.
 * @return {boolean}
 */
npf.userAgent.webRtc.isDataChannelSupported = function() {
  if (goog.isNull(npf.userAgent.webRtc.dataChannel_)) {
    npf.userAgent.webRtc.dataChannel_ = false;

    if (npf.userAgent.webRtc.isPeerConnectionSupported()) {
      /** @type {!Array<string>} */
      var domPrefixes = npf.userAgent.utils.DOM_PREFIXES;

      for (var i = 0; i < domPrefixes.length; i++) {
        var peerConnectionConstructor =
          goog.global[domPrefixes[i] + 'RTCPeerConnection'];

        if (peerConnectionConstructor) {
          var peerConnection = new peerConnectionConstructor({
            'iceServers': [{
              'url': 'stun:0'
            }]
          });

          npf.userAgent.webRtc.dataChannel_ =
            'createDataChannel' in peerConnection;
          break;
        }
      }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.webRtc.dataChannel_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.webRtc.peerConnection_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.webRtc.isPeerConnectionSupported = function() {
  if (goog.isNull(npf.userAgent.webRtc.peerConnection_)) {
    npf.userAgent.webRtc.peerConnection_ = !!npf.userAgent.utils.prefixed(
      'RTCPeerConnection', goog.global);
  }

  return /** @type {boolean} */ (npf.userAgent.webRtc.peerConnection_);
};
