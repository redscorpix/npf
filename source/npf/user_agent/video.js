goog.provide('npf.userAgent.video');

goog.require('goog.dom');
goog.require('goog.dom.TagName');


/**
 * @typedef {{
 *  h264: string,
 *  hls: string,
 *  ogg: string,
 *  vp9: string,
 *  webm: string
 * }}
 */
npf.userAgent.video.Types;

/**
 * @private {npf.userAgent.video.Types|boolean?}
 */
npf.userAgent.video.supported_ = null;


/**
 * Detects support for the video element, as well as testing what types of
 * content it supports.
 * @return {boolean}
 */
npf.userAgent.video.isSupported = function() {
  if (goog.isNull(npf.userAgent.video.supported_)) {
    var elem = /** @type {!HTMLVideoElement} */ (
      goog.dom.createElement(goog.dom.TagName.VIDEO));
    npf.userAgent.video.supported_ = false;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown
    try {
      if (elem.canPlayType) {
        npf.userAgent.video.supported_ = {
          // Without QuickTime, this value will be `undefined`.
          h264: elem.canPlayType('video/mp4; codecs="avc1.42E01E"').
            replace(/^no$/, ''),
          hls: elem.canPlayType('application/x-mpegURL; codecs="avc1.42E01E"').
            replace(/^no$/, ''),
          ogg: elem.canPlayType('video/ogg; codecs="theora"').
            replace(/^no$/, ''),
          vp9: elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, ''),
          webm: elem.canPlayType('video/webm; codecs="vp8, vorbis"').
            replace(/^no$/, '')
        };
      }
    } catch (e) {}
  }

  return !!npf.userAgent.video.supported_;
};

/**
 * @private {boolean?}
 */
npf.userAgent.video.autoplay_ = null;

/**
 * @const {string}
 */
npf.userAgent.video.AUTOPLAY_H264_SRC =
  'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAz5tb292AAAA' +
  'bG12aGQAAAAAzaNacc2jWnEAAV+QAAFfkAABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAA' +
  'AAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAGGlv' +
  'ZHMAAAAAEICAgAcAT////3//AAACQ3RyYWsAAABcdGtoZAAAAAHNo1pxzaNacQAAAAEAAAAAAA' +
  'FfkAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAA' +
  'EAAAABAAAAAAAd9tZGlhAAAAIG1kaGQAAAAAzaNacc2jWnEAAV+QAAFfkFXEAAAAAAAhaGRscg' +
  'AAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAAAAAAGWbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAA' +
  'JGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABVnN0YmwAAACpc3RzZAAAAAAAAA' +
  'ABAAAAmWF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAEAAQAEgAAABIAAAAAAAAAAEOSlZU' +
  'L0FWQyBDb2RpbmcAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAxYXZjQwH0AAr/4QAZZ/QACq609N' +
  'QYBBkAAAMAAQAAAwAKjxImoAEABWjOAa8gAAAAEmNvbHJuY2xjAAYAAQAGAAAAGHN0dHMAAAAA' +
  'AAAAAQAAAAUAAEZQAAAAKHN0c3oAAAAAAAAAAAAAAAUAAAIqAAAACAAAAAgAAAAIAAAACAAAAC' +
  'hzdHNjAAAAAAAAAAIAAAABAAAABAAAAAEAAAACAAAAAQAAAAEAAAAYc3RjbwAAAAAAAAACAAAD' +
  'YgAABaQAAAAUc3RzcwAAAAAAAAABAAAAAQAAABFzZHRwAAAAAAREREREAAAAb3VkdGEAAABnbW' +
  'V0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcgAAAAAAAAAAAAAAAAAAAAA6aWxzdAAAADKpdG9v' +
  'AAAAKmRhdGEAAAABAAAAAEhhbmRCcmFrZSAwLjkuOCAyMDEyMDcxODAwAAACUm1kYXQAAAHkBg' +
  'X/4NxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxMjAgLSBILjI2NC9NUEVHLTQgQVZDIGNv' +
  'ZGVjIC0gQ29weWxlZnQgMjAwMy0yMDExIC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC' +
  '5odG1sIC0gb3B0aW9uczogY2FiYWM9MCByZWY9MSBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgx' +
  'OjAgbWU9ZXNhIHN1Ym1lPTkgcHN5PTAgbWl4ZWRfcmVmPTAgbWVfcmFuZ2U9NCBjaHJvbWFfbW' +
  'U9MSB0cmVsbGlzPTAgOHg4ZGN0PTAgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0w' +
  'IGNocm9tYV9xcF9vZmZzZXQ9MCB0aHJlYWRzPTYgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2' +
  'ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0w' +
  'IGJmcmFtZXM9MCB3ZWlnaHRwPTAga2V5aW50PTUwIGtleWludF9taW49NSBzY2VuZWN1dD00MC' +
  'BpbnRyYV9yZWZyZXNoPTAgcmM9Y3FwIG1idHJlZT0wIHFwPTAAgAAAAD5liISscR8A+E4ACAAC' +
  'FoAAITAAAgsAAPgYCoKgoC+L4vi+KAvi+L4YfAEAACMzgABF9AAEUGUgABDJiXnf4AAAAARBmi' +
  'KUAAAABEGaQpQAAAAEQZpilAAAAARBmoKU';

/**
 * @const {string}
 */
npf.userAgent.video.AUTOPLAY_OGG_SRC =
  'data:video/ogg;base64,T2dnUwACAAAAAAAAAABmnCATAAAAAHDEixYBKoB0aGVvcmEDAgEA' +
  'AQABAAAQAAAQAAAAAAAFAAAAAQAAAAAAAAAAAGIAYE9nZ1MAAAAAAAAAAAAAZpwgEwEAAAACrA' +
  '7TDlj///////////////+QgXRoZW9yYSsAAABYaXBoLk9yZyBsaWJ0aGVvcmEgMS4xIDIwMDkw' +
  'ODIyIChUaHVzbmVsZGEpAQAAABoAAABFTkNPREVSPWZmbXBlZzJ0aGVvcmEtMC4yOYJ0aGVvcm' +
  'G+zSj3uc1rGLWpSUoQc5zmMYxSlKQhCDGMYhCEIQhAAAAAAAAAAAAAEW2uU2eSyPxWEvx4OVts' +
  '5ir1aKtUKBMpJFoQ/nk5m41mUwl4slUpk4kkghkIfDwdjgajQYC8VioUCQRiIQh8PBwMhgLBQI' +
  'g4FRba5TZ5LI/FYS/Hg5W2zmKvVoq1QoEykkWhD+eTmbjWZTCXiyVSmTiSSCGQh8PB2OBqNBgL' +
  'xWKhQJBGIhCHw8HAyGAsFAiDgUCw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8P' +
  'Dw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDAwPEhQUFQ0NDhESFRUUDg4PEhQVFRUOEB' +
  'ETFBUVFRARFBUVFRUVEhMUFRUVFRUUFRUVFRUVFRUVFRUVFRUVEAwLEBQZGxwNDQ4SFRwcGw4N' +
  'EBQZHBwcDhATFhsdHRwRExkcHB4eHRQYGxwdHh4dGxwdHR4eHh4dHR0dHh4eHRALChAYKDM9DA' +
  'wOExo6PDcODRAYKDlFOA4RFh0zV1A+EhYlOkRtZ00YIzdAUWhxXDFATldneXhlSFxfYnBkZ2MT' +
  'ExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTEx' +
  'MTExMTExMTEhIVGRoaGhoSFBYaGhoaGhUWGRoaGhoaGRoaGhoaGhoaGhoaGhoaGhoaGhoaGhoa' +
  'GhoaGhoaGhoaGhoaGhoaGhESFh8kJCQkEhQYIiQkJCQWGCEkJCQkJB8iJCQkJCQkJCQkJCQkJC' +
  'QkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQREhgvY2NjYxIVGkJjY2NjGBo4Y2NjY2MvQmNjY2Nj' +
  'Y2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjFRUVFRUVFRUVFRUVFRUVFRUVFRUVFR' +
  'UVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRISEhUXGBkbEhIVFxgZ' +
  'GxwSFRcYGRscHRUXGBkbHB0dFxgZGxwdHR0YGRscHR0dHhkbHB0dHR4eGxwdHR0eHh4REREUFx' +
  'ocIBERFBcaHCAiERQXGhwgIiUUFxocICIlJRcaHCAiJSUlGhwgIiUlJSkcICIlJSUpKiAiJSUl' +
  'KSoqEBAQFBgcICgQEBQYHCAoMBAUGBwgKDBAFBgcICgwQEAYHCAoMEBAQBwgKDBAQEBgICgwQE' +
  'BAYIAoMEBAQGCAgAfF5cdH1e3Ow/L66wGmYnfIUbwdUTe3LMRbqON8B+5RJEvcGxkvrVUjTMrs' +
  'XYhAnIwe0dTJfOYbWrDYyqUrz7dw/JO4hpmV2LsQQvkUeGq1BsZLx+cu5iV0e0eScJ91VIQYrm' +
  'qfdVSK7GgjOU0oPaPOu5IcDK1mNvnD+K8LwS87f8Jx2mHtHnUkTGAurWZlNQa74ZLSFH9oF6FP' +
  'GxzLsjQO5Qe0edcpttd7BXBSqMCL4k/4tFrHIPuEQ7m1/uIWkbDMWVoDdOSuRQ9286kvVUlQjz' +
  'OE6VrNguN4oRXYGkgcnih7t13/9kxvLYKQezwLTrO44sVmMPgMqORo1E0sm1/9SludkcWHwfJw' +
  'TSybR4LeAz6ugWVgRaY8mV/9SluQmtHrzsBtRF/wPY+X0JuYTs+ltgrXAmlk10xQHmTu9VSIAk' +
  '1+vcvU4ml2oNzrNhEtQ3CysNP8UeR35wqpKUBdGdZMSjX4WVi8nJpdpHnbhzEIdx7mwf6W1FKA' +
  'iucMXrWUWVjyRf23chNtR9mIzDoT/6ZLYailAjhFlZuvPtSeZ+2oREubDoWmT3TguY+JHPdRVS' +
  'LKxfKH3vgNqJ/9emeEYikGXDFNzaLjvTeGAL61mogOoeG3y6oU4rW55ydoj0lUTSR/mmRhPmF8' +
  '6uwIfzp3FtiufQCmppaHDlGE0r2iTzXIw3zBq5hvaTldjG4CPb9wdxAme0SyedVKczJ9AtYbgP' +
  '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';

/**
 * Checks for support of the autoplay attribute of the video element.
 * @param {function(this:SCOPE,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.video.isAutoplaySupported = function(callback, opt_scope) {
  if (goog.isBoolean(npf.userAgent.video.autoplay_)) {
    callback.call(opt_scope, npf.userAgent.video.autoplay_);
  } else if (!npf.userAgent.video.isSupported()) {
    callback.call(opt_scope, false);
  } else {
    /** @type {string|undefined} */
    var src;

    if (npf.userAgent.video.isOggSupported()) {
      src = npf.userAgent.video.AUTOPLAY_OGG_SRC;
    } else if (npf.userAgent.video.isH264Supported()) {
      src = npf.userAgent.video.AUTOPLAY_H264_SRC;
    }

    if (src) {
      /** @type {function(boolean=)} */
      var complete = function(opt_support) {
        npf.userAgent.video.autoplay_ = !!opt_support;
        callback.call(opt_scope, npf.userAgent.video.autoplay_);
      };
      var elem = /** @type {!HTMLVideoElement} */ (
        goog.dom.createDom(goog.dom.TagName.VIDEO, {
          'style': 'height:0;position:absolute;width:0'
        }));

      //skip the test if video itself, or the autoplay
      //element on it isn't supported
      if (!('autoplay' in elem)) {
        complete();

        return;
      }

      try {
        elem.src = src;
      } catch (e) {
        complete();

        return;
      }

      elem.setAttribute('autoplay', '');
      elem.style.cssText = 'display:none';
      goog.dom.getDomHelper().getDocument().documentElement.appendChild(elem);

      /** @type {number} */
      var timeout;
      /** @type {function(Event=)} */
      var testAutoplay = function(opt_evt) {
        clearTimeout(timeout);
        elem.removeEventListener('playing', testAutoplay, false);

        /** @type {boolean} */
        var supported =
          opt_evt && 'playing' === opt_evt['type'] || 0 !== elem.currentTime;
        goog.dom.removeNode(elem);

        complete(supported);
      };

      // wait for the next tick to add the listener, otherwise the element may
      // not have time to play in high load situations (e.g. the test suite)
      setTimeout(function() {
        elem.addEventListener('playing', testAutoplay, false);
        timeout = setTimeout(testAutoplay, 300);
      }, 0);
    } else {
      callback.call(opt_scope, false);
    }
  }
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.video.isH264Supported = function() {
  return npf.userAgent.video.isSupported() ?
    npf.userAgent.video.supported_.h264 : '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.video.isHlsSupported = function() {
  return npf.userAgent.video.isSupported() ?
    npf.userAgent.video.supported_.hls : '';
};

/**
 * @private {boolean?}
 */
npf.userAgent.video.loop_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.video.isLoopSupported = function() {
  if (goog.isNull(npf.userAgent.video.loop_)) {
    npf.userAgent.video.loop_ =
      'loop' in goog.dom.createElement(goog.dom.TagName.VIDEO);
  }

  return /** @type {boolean} */ (npf.userAgent.video.loop_);
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.video.isOggSupported = function() {
  return npf.userAgent.video.isSupported() ?
    npf.userAgent.video.supported_.ogg : '';
};

/**
 * @private {boolean?}
 */
npf.userAgent.video.preload_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.video.isPreloadSupported = function() {
  if (goog.isNull(npf.userAgent.video.preload_)) {
    npf.userAgent.video.preload_ =
      'preload' in goog.dom.createElement(goog.dom.TagName.VIDEO);
  }

  return /** @type {boolean} */ (npf.userAgent.video.preload_);
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.video.isVp9Supported = function() {
  return npf.userAgent.video.isSupported() ?
    npf.userAgent.video.supported_.vp9 : '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.video.isWebmSupported = function() {
  return npf.userAgent.video.isSupported() ?
    npf.userAgent.video.supported_.webm : '';
};
