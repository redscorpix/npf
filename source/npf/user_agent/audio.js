goog.provide('npf.userAgent.audio');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @typedef {{
 *  m4a: string,
 *  mp3: string,
 *  ogg: string,
 *  opus: string,
 *  wav: string
 * }}
 */
npf.userAgent.audio.Types;

/**
 * @private {npf.userAgent.audio.Types|boolean?}
 */
npf.userAgent.audio.supported_ = null;

/**
 * This tests evaluates support of the audio element, as well as
 * testing what types of content it supports.
 *
 * Codec values from:
 *  github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
 * Note: in some older browsers, "no" was a return value instead of empty
 * string.
 * It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2.
 * It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5.
 * @return {boolean}
 */
npf.userAgent.audio.isSupported = function() {
  if (goog.isNull(npf.userAgent.audio.supported_)) {
    var elem = /** @type {!HTMLAudioElement} */ (
      goog.dom.createElement(goog.dom.TagName.AUDIO));
    npf.userAgent.audio.supported_ = false;

    try {
      if (elem.canPlayType) {
        npf.userAgent.audio.supported_ = {
          m4a: (elem.canPlayType('audio/x-m4a;') ||
            elem.canPlayType('audio/aac;')).replace(/^no$/, ''),
          mp3: elem.canPlayType('audio/mpeg;').replace(/^no$/, ''),
          ogg: elem.canPlayType('audio/ogg; codecs="vorbis"').
            replace(/^no$/, ''),
          opus: elem.canPlayType('audio/ogg; codecs="opus"').
            replace(/^no$/, ''),
          wav: elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')
        };
      }
    } catch (e) { }
  }

  return !!npf.userAgent.audio.supported_;
};

/**
 * Detects if an audio element can automatically restart, once it has finished.
 * @return {boolean}
 */
npf.userAgent.audio.isLoopSupported = function() {
  return ('loop' in goog.dom.createElement(goog.dom.TagName.AUDIO));
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.audio.isM4aSupported = function() {
  return npf.userAgent.audio.isSupported() ?
    npf.userAgent.audio.supported_.m4a : '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.audio.isMp3Supported = function() {
  return npf.userAgent.audio.isSupported() ?
    npf.userAgent.audio.supported_.mp3 : '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.audio.isOggSupported = function() {
  return npf.userAgent.audio.isSupported() ?
    npf.userAgent.audio.supported_.ogg : '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.audio.isOpusSupported = function() {
  return npf.userAgent.audio.isSupported() ?
    npf.userAgent.audio.supported_.opus : '';
};

/**
 * Detects if audio can be downloaded in the background before it starts
 * playing in the `<audio>` element.
 * @return {boolean}
 */
npf.userAgent.audio.isPreloadSupported = function() {
  return ('preload' in goog.dom.createElement(goog.dom.TagName.AUDIO));
};

/**
 * Detects the older non standard webaudio API (as opposed to the standards
 * based AudioContext API).
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.audio.isWavSupported = function() {
  return npf.userAgent.audio.isSupported() ?
    npf.userAgent.audio.supported_.wav : '';
};

/**
 * @return {boolean}
 */
npf.userAgent.audio.isWebAudioSupported = function() {
  /** @type {boolean} */
  var prefixed = 'webkitAudioContext' in goog.global;
  /** @type {boolean} */
  var unprefixed = 'AudioContext' in goog.global;

  return prefixed || unprefixed;
};
