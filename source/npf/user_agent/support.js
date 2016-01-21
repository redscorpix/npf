goog.provide('npf.userAgent.support');

goog.require('goog.dom');
goog.require('goog.dom.InputType');
goog.require('goog.dom.TagName');
goog.require('goog.events.EventType');
goog.require('goog.functions');
goog.require('goog.math');
goog.require('goog.object');
goog.require('goog.userAgent');
goog.require('npf.svg.Ns');


/**
 * Source: Modernizr 2.8.2 Custom Build (http://modernizr.com)
 */


/**
 * @type {!Object.<string>}
 * @deprecated
 */
npf.userAgent.support.eventTagNames = goog.object.create(
  goog.events.EventType.SELECT, goog.dom.TagName.INPUT,
  goog.events.EventType.CHANGE, goog.dom.TagName.INPUT,
  goog.events.EventType.SUBMIT, goog.dom.TagName.FORM,
  'reset', goog.dom.TagName.FORM,
  goog.events.EventType.ERROR, goog.dom.TagName.IMG,
  goog.events.EventType.LOAD, goog.dom.TagName.IMG,
  'abort', goog.dom.TagName.IMG
);

/**
 * Create our element that we do most feature tests on.
 * @const {string}
 * @deprecated Use npf.userAgent.support.utils.ID.
 */
npf.userAgent.support.MOD = 'useragentsupport_' + goog.math.randomInt(1000000);

/**
 * @const {string}
 * @deprecated
 */
npf.userAgent.support.SMILE = ':)';

/**
 * @private {!Object.<string>}
 */
npf.userAgent.support.cssPropertyNames_ = {};

/**
 * @private {CSSStyleDeclaration}
 */
npf.userAgent.support.mStyle_ =
  goog.dom.createElement(npf.userAgent.support.MOD).style;

/**
 * Browser special CSS prefix.
 * @type {string}
 * @deprecated Use npf.userAgent.support.utils.VENDOR_PREFIX.
 */
npf.userAgent.support.vendorPrefix =
  goog.userAgent.WEBKIT ? 'webkit' :
  goog.userAgent.GECKO ? 'moz' :
  goog.userAgent.OPERA ? 'o' :
  goog.userAgent.EDGE_OR_IE ? 'ms' : '';

/**
 * List of property values to set for css tests.
 * @type {!Array.<string>}
 * @deprecated
 */
npf.userAgent.support.prefixes = (npf.userAgent.support.vendorPrefix ? ' -' +
  npf.userAgent.support.vendorPrefix + '- ' : ' ').split(' ');

/**
 * @private {string}
 */
npf.userAgent.support.omPrefixes_ = 'Webkit Moz O ms';

/**
 * Following spec is to expose vendor-specific style properties as:
 *   elem.style.WebkitBorderRadius
 * and the following would be incorrect:
 *   elem.style.webkitBorderRadius
 *
 * Webkit ghosts their properties in lowercase but Opera & Moz do not.
 * Microsoft foregoes prefixes entirely <= IE8, but appears to
 * use a lowercase `ms` instead of the correct `Ms` in IE9
 *
 * More here: http://github.com/Modernizr/Modernizr/issues/issue/21
 * @type {!Array.<string>}
 * @deprecated Use npf.userAgent.support.utils.DOM_PREFIXES
 */
npf.userAgent.support.domPrefixes =
  npf.userAgent.support.omPrefixes_.toLowerCase().split(' ');

/**
 * @type {!Array.<string>}
 * @deprecated Use npf.userAgent.support.utils.CSSOM_PREFIXES.
 */
npf.userAgent.support.cssomPrefixes =
  npf.userAgent.support.omPrefixes_.split(' ');


/**
 * Returns property name with proper browser prefix.
 *
 * @param {string} str Property name
 * @return {string} Property name with browser prefix.
 * @deprecated Use npf.userAgent.support.utils.prefixedCss.
 */
npf.userAgent.support.getCssPropertyName = function(str) {
  if (!goog.isDef(npf.userAgent.support.cssPropertyNames_[str])) {
    /** @type {!Element} */
    var element = goog.dom.createElement(goog.dom.TagName.DIV);
    /** @type {function(string):string} */
    var replaceFunc = function(str) {
      return str.charAt(1).toUpperCase();
    };
    /** @type {string} */
    var str1 = str.replace(/\-[a-z]/g, replaceFunc);
    /** @type {string} */
    var str2 = str1.charAt(0).toUpperCase() + str1.substr(1);

    npf.userAgent.support.cssPropertyNames_[str] = '';

    if (goog.isDef(element.style[str1])) {
      npf.userAgent.support.cssPropertyNames_[str] = str;
    } else {
      /** @type {!Array.<string>} */
      var vendorPrefixes = npf.userAgent.support.cssomPrefixes;

      for (var i = 0; i < vendorPrefixes.length; i++) {
        if (goog.isDef(element.style[vendorPrefixes[i] + str2])) {
          npf.userAgent.support.cssPropertyNames_[str] =
            '-' + vendorPrefixes[i].toLowerCase() + '-' + str;

          break;
        }
      }
    }
  }

  return npf.userAgent.support.cssPropertyNames_[str];
};

/**
 * Tests a given media query, live against the current state of the window
 * A few important notes:
 *   - If a browser does not support media queries at all (eg. oldIE) the mq()
 *     will always return false
 *   - A max-width or orientation query will be evaluated against the current
 *     state, which may change later.
 *   - You must specify values. Eg. If you are testing support for the min-width
 *     media query use:
 *     npf.userAgent.support.mq('(min-width:0)')
 *
 * @example
 * npf.userAgent.support.mq('only screen and (max-width:768)')
 *
 * @param {string} mq
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.utils.mq
 */
npf.userAgent.support.mq = function(mq) {
  /** @type {function(string):MediaQueryList} */
  var matchMedia = goog.global.matchMedia ||
    /** @type {function(string):MediaQueryList} */ (
      goog.global['msMatchMedia']);

  if (matchMedia) {
    return !!matchMedia(mq) || matchMedia(mq).matches || false;
  }

  /** @type {boolean} */
  var bool;
  /** @type {string} */
  var cssText = '@media ' + mq + ' {#' + npf.userAgent.support.MOD +
    ' {position:absolute;}}';

  npf.userAgent.support.testStyles_(cssText, function(element) {
    /** @type {!Window} */
    var win = goog.dom.getWindow();
    /** @type {Object} */
    var style = win.getComputedStyle ?
      win.getComputedStyle(element, null) :
      /** @type {Object} */ (element['currentStyle']);
    bool = 'absolute' == style['position'];
  });

  return bool;
};

/**
 * Returns the prefixed or nonprefixed property name variant of your input
 * npf.userAgent.support.prefixed('boxSizing') // 'MozBoxSizing'
 *
 * Properties must be passed as dom-style camelcase, rather than `box-sizing`
 * hypentated style.
 * Return values will also be the camelCase variant, if you need to translate
 * that to hypenated style use:
 *
 *   str.replace(/([A-Z])/g, function(str,m1){
 *     return '-' + m1.toLowerCase();
 *   }).replace(/^ms-/,'-ms-');
 *
 * If you're trying to ascertain which transition end event to bind to, you
 * might do something like...
 *
 *   var transEndEventNames = {
 *     'WebkitTransition' : 'webkitTransitionEnd',
 *     'MozTransition'    : 'transitionend',
 *     'OTransition'      : 'oTransitionEnd',
 *     'msTransition'     : 'msTransitionEnd', // maybe?
 *     'transition'       : 'transitionEnd'
 *   },
 *   transEndEventName =
 *     transEndEventNames[npf.userAgent.support.prefixed('transition')];
 *
 * @param {string} prop
 * @return {string}
 * @deprecated Use npf.userAgent.support.utils.prefixedCss.
 */
npf.userAgent.support.prefixed = function(prop) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
  var props = (prop + ' ' + npf.userAgent.support.domPrefixes.join(ucProp + ' ')
    + ucProp).split(' ');

  return npf.userAgent.support.testPropsPrefixed_(props);
};

/**
 * Investigates whether a given style property is recognized
 * Note that the property names must be provided in the camelCase variant.
 *
 * @example
 *   npf.userAgent.support.testProp('pointerEvents')
 *
 * @param {string} prop
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.utils.testProp.
 */
npf.userAgent.support.testProp = function(prop) {
  return npf.userAgent.support.testProps_([prop]);
};

/**
 * Investigates whether a given style property, or any of its vendor-prefixed
 * variants, is recognized
 * Note that the property names must be provided in the camelCase variant.
 *
 * @example
 *   npf.userAgent.support.testAllProps('boxSizing')
 *
 * @param {string} prop
 * @return {string}
 * @deprecated Use npf.userAgent.support.utils.testAllProps.
 */
npf.userAgent.support.testAllProps = function(prop) {
  /** @type {string} */
  var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
  /** @type {!Array.<string>} */
  var props = (prop + ' ' + npf.userAgent.support.domPrefixes.join(ucProp + ' ')
    + ucProp).split(' ');

  return npf.userAgent.support.testPropsPrefixed_(props);
};

/**
 * @private {boolean?}
 */
npf.userAgent.support.animatedPng_ = null;

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_ANIMATED_PNG', false);

/**
 * @const {string}
 */
npf.userAgent.support.ANIMATED_PNG_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACGFj' +
  'VEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAAGmZjVEwAAAAAAAAAAQ' +
  'AAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYGBgAAAABQAB6MzFdgAAAABJ' +
  'RU5ErkJggg==';

/**
 * @param {function(this: SCOPE, boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @deprecated Use npf.userAgent.support.image.isAnimatedPngSupported.
 */
npf.userAgent.support.getAnimatedPng = function(callback, opt_scope) {
  if (npf.userAgent.support.ASSUME_ANIMATED_PNG) {
    callback.call(opt_scope, true);
  } else if (!npf.userAgent.support.getCanvas()) {
    callback.call(opt_scope, false);
  } else if (goog.isNull(npf.userAgent.support.animatedPng_)) {
    var image = new Image();
    image.onload = function () {
      var canvasElement = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        canvasElement.getContext('2d'));
      ctx.drawImage(image, 0, 0);

      npf.userAgent.support.animatedPng_ =
        0 === ctx.getImageData(0, 0, 1, 1).data[3];

      callback.call(
        opt_scope, /** @type {boolean} */ (npf.userAgent.support.animatedPng_));
    };
    image.src = npf.userAgent.support.ANIMATED_PNG_SRC;
  } else {
    callback.call(
      opt_scope, /** @type {boolean} */ (npf.userAgent.support.animatedPng_));
  }
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_APPLICATION_CACHE', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.applicationCache.isSupported.
 */
npf.userAgent.support.getApplicationCache = function() {
  return npf.userAgent.support.ASSUME_APPLICATION_CACHE ||
    !!goog.global['applicationCache'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_AUDIO_DATA', false);

/**
 * Mozilla Audio Data API
 * https://wiki.mozilla.org/Audio_Data_API
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.audio.isSupported.
 */
npf.userAgent.support.getAudioData = function() {
  return npf.userAgent.support.ASSUME_AUDIO_DATA || !!goog.global['Audio'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_AUDIO_OGG', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.audio.isOggSupported.
 */
npf.userAgent.support.getAudioOgg = function() {
  return npf.userAgent.support.ASSUME_AUDIO_OGG ?
    'probably' : npf.userAgent.support.getAudio_().ogg;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_AUDIO_MP3', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.audio.isMp3Supported.
 */
npf.userAgent.support.getAudioMp3 = function() {
  return npf.userAgent.support.ASSUME_AUDIO_MP3 ?
    'probably' : npf.userAgent.support.getAudio_().mp3;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_AUDIO_WAV', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.audio.isWavSupported.
 */
npf.userAgent.support.getAudioWav = function() {
  return npf.userAgent.support.ASSUME_AUDIO_WAV ?
    'probably' : npf.userAgent.support.getAudio_().wav;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_AUDIO_M4A', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.audio.isM4aSupported.
 */
npf.userAgent.support.getAudioM4a = function() {
  return npf.userAgent.support.ASSUME_AUDIO_M4A ?
    'probably' : npf.userAgent.support.getAudio_().m4a;
};

/**
 * @return {{m4a:string,mp3:string,ogg:string,wav:string}}
 * @private
 */
npf.userAgent.support.getAudio_ = goog.functions.cacheReturnValue(function() {
  var elem = /** @type {!HTMLAudioElement} */ (goog.dom.createElement('audio'));
  var result;

  try {
    if (elem.canPlayType) {
      // Mimetypes accepted:
      //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
      //   http://bit.ly/iphoneoscodecs
      result = {
        m4a: elem.canPlayType('audio/x-m4a;') ||
          elem.canPlayType('audio/aac;').replace(/^no$/, ''),
        mp3: elem.canPlayType('audio/mpeg;').replace(/^no$/, ''),
        ogg: elem.canPlayType('audio/ogg; codecs="vorbis"').
          replace(/^no$/, ''),
        wav: elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')
      };
    }
  } catch(e) { }

  return result || {
    m4a: '',
    mp3: '',
    ogg: '',
    wav: ''
  };
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BACKGROUND_POSITION', false);

/**
 * https://developer.mozilla.org/en/CSS/background-position
 * http://www.w3.org/TR/css3-background/#background-position
 * @return {boolean}
 * @deprecated Use
 *             npf.userAgent.support.css.isBackgroundPositionShorthandSupported.
 */
npf.userAgent.support.getBackgroundPosition = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_BACKGROUND_POSITION) {
      return true;
    }

    var style = goog.dom.createElement(goog.dom.TagName.A).style;
    var val = "right 10px bottom 10px";
    style.cssText = "background-position:" + val + ";";

    return style['backgroundPosition'] === val;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BACKGROUND_REPEAT_ROUND', false);

/**
 * developer.mozilla.org/en/CSS/background-repeat
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBackgroundRepeatRoundSupported.
 */
npf.userAgent.support.getBackgroundRepeatRound = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_BACKGROUND_REPEAT_ROUND) {
      return true;
    }

    /** @type {boolean} */
    var supported;
    var style = '#' + npf.userAgent.support.MOD +
      ' {background-repeat:round;}';

    npf.userAgent.support.testStyles_(style, function(elem, rule) {
      /** @type {!Window} */
      var win = goog.dom.getWindow();
      /** @type {string|undefined} */
      var value = win.getComputedStyle ?
        win.getComputedStyle(elem, null).getPropertyValue('background') :
        /** @type {string|undefined} */ (elem['currentStyle']['background']);
      supported = 'round' == value;
    });

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BACKGROUND_REPEAT_SPACE', false);

/**
 * developer.mozilla.org/en/CSS/background-repeat
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBackgroundRepeatSpaceSupported.
 */
npf.userAgent.support.getBackgroundRepeatSpace = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_BACKGROUND_REPEAT_SPACE) {
      return true;
    }

    /** @type {boolean} */
    var supported;
    var style = '#' + npf.userAgent.support.MOD + ' {background-repeat:space;}';

    npf.userAgent.support.testStyles_(style, function(elem, rule) {
      /** @type {!Window} */
      var win = goog.dom.getWindow();
      /** @type {string|undefined} */
      var value = win.getComputedStyle ?
        win.getComputedStyle(elem, null).getPropertyValue('background') :
        /** @type {string|undefined} */ (elem['currentStyle']['background']);

      supported = 'space' == value;
    });

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BACKGROUND_SIZE', false);

/**
 * In testing support for a given CSS property, it's legit to test:
 *   `elem.style[styleName] !== undefined`
 * If the property is supported it will return an empty string,
 * if unsupported it will return undefined.
 *
 * We'll take advantage of this quick test and skip setting a style
 * on our MOD element, but instead just testing undefined vs
 * empty string.
 *
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBackgroundSizeSupported.
 */
npf.userAgent.support.getBackgroundSize = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_BACKGROUND_SIZE ||
      npf.userAgent.support.testPropsAll_('backgroundSize');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BACKGROUND_COVER', false);

/**
 * developer.mozilla.org/en/CSS/background-size
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBackgroundSizeCoverSupported.
 */
npf.userAgent.support.getBackgroundSizeCover = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_BACKGROUND_COVER) {
      return true;
    }

    /** @type {boolean} */
    var supported;
    var style = '#' + npf.userAgent.support.MOD + '{background-size:cover}';

    npf.userAgent.support.testStyles_(style, function(elem) {
      /** @type {!Window} */
      var win = goog.dom.getWindow();
      /** @type {Object} */
      var style = win.getComputedStyle ? win.getComputedStyle(elem, null) :
        /** @type {Object} */ (elem['currentStyle']);

      supported = 'cover' == style['backgroundSize'];
    });

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BATTERY', false);

/**
 * Battery API
 * https://developer.mozilla.org/en/DOM/window.navigator.mozBattery
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.battery.isSupported.
 */
npf.userAgent.support.getBattery = goog.functions.cacheReturnValue(function() {
  return npf.userAgent.support.ASSUME_BATTERY ||
    !!npf.userAgent.support.testDomProps_('battery', goog.global.navigator);
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BLOB_CONSTRUCTOR', false);

/**
 * Blob constructor
 * http://dev.w3.org/2006/webapi/FileAPI/#constructorBlob
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.blob.isSupported.
 */
npf.userAgent.support.getBlobConstructor = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_BLOB_CONSTRUCTOR) {
      return true;
    }

    /** @type {boolean} */
    var supported = false;

    try {
      supported = !!(new Blob());
    } catch (e) { }

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BORDER_IMAGE', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBorderImageSupported.
 */
npf.userAgent.support.getBorderImage = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_BORDER_IMAGE ||
      npf.userAgent.support.testPropsAll_('borderImage');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BORDER_RADIUS', false);

/**
 * Super comprehensive table about all the unique implementations of
 * border-radius:
 *   http://muddledramblings.com/table-of-css3-border-radius-compliance
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBorderRadiusSupported.
 */
npf.userAgent.support.getBorderRadius = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_BORDER_RADIUS ||
      npf.userAgent.support.testPropsAll_('borderRadius');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BOX_SHADOW', false);

/**
 * WebOS unfortunately false positives on this test.
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBoxShadowSupported.
 */
npf.userAgent.support.getBoxShadow = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_BOX_SHADOW ||
      npf.userAgent.support.testPropsAll_('boxShadow');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_BOX_SIZING', false);

/**
 * developer.mozilla.org/en/CSS/box-sizing
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isBoxSizingSupported.
 */
npf.userAgent.support.getBoxSizing = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_BOX_SIZING) {
      return true;
    }

    /** @type {!Document} */
    var doc = goog.dom.getDocument();
    return npf.userAgent.support.testPropsAll_('boxSizing') &&
      (!goog.isDef(doc['documentMode']) || 7 < doc['documentMode']);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CANVAS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.canvas.isSupported.
 */
npf.userAgent.support.getCanvas = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_CANVAS) {
    return true;
  }

  var elem = /** @type {!HTMLCanvasElement} */ (
    goog.dom.createElement(goog.dom.TagName.CANVAS));
  return !!(elem.getContext && elem.getContext('2d'));
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CANVAS_TO_JPEG', false);

/**
 * @private {boolean?}
 */
npf.userAgent.support.canvasToJpeg_ = null;

/**
 * @param {function(this: SCOPE, boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @deprecated Use npf.userAgent.support.canvas.isJpegDataUrlSupported.
 */
npf.userAgent.support.getCanvasToJpeg = function(callback, opt_scope) {
  if (npf.userAgent.support.ASSUME_CANVAS_TO_JPEG) {
    return true;
  }

  if (goog.isNull(npf.userAgent.support.canvasToJpeg_)) {
    npf.userAgent.support.canvasToDataUrl_('jpeg', function(support) {
      npf.userAgent.support.canvasToJpeg_ = support;
      callback.call(opt_scope, support);
    });
  } else {
    callback.call(
      opt_scope, /** @type {boolean} */ (npf.userAgent.support.canvasToJpeg_));
  }
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CANVAS_TO_WEBP', false);

/**
 * @private {boolean?}
 */
npf.userAgent.support.canvasToWebp_ = null;

/**
 * @param {function(this: SCOPE, boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @deprecated Use npf.userAgent.support.canvas.isWebpDataUrlSupported.
 */
npf.userAgent.support.getCanvasToWebp = function(callback, opt_scope) {
  if (npf.userAgent.support.ASSUME_CANVAS_TO_WEBP) {
    return true;
  }

  if (goog.isNull(npf.userAgent.support.canvasToWebp_)) {
    npf.userAgent.support.canvasToDataUrl_('webp', function(support) {
      npf.userAgent.support.canvasToWebp_ = support;
      callback.call(opt_scope, support);
    });
  } else {
    callback.call(
      opt_scope, /** @type {boolean} */ (npf.userAgent.support.canvasToWebp_));
  }
};

/**
 * @const {string}
 */
npf.userAgent.support.CANVAS_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklE' +
  'QVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

/**
 * canvas.toDataURL type support
 * http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl
 * @param {string} format
 * @param {function(boolean)} callback
 * @private
 */
npf.userAgent.support.canvasToDataUrl_ = function(format, callback) {
  if (!npf.userAgent.support.getCanvas()) {
    callback(false);
  } else {
    var image = new Image();
    image.onload = function() {
      var canvas = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        canvas.getContext('2d'));
      ctx.drawImage(image, 0, 0);

      /** @type {boolean} */
      var support = canvas.toDataURL('image/' + format).
        indexOf('data:image/' + format) === 0;

      callback(support);
    };
    image.src = npf.userAgent.support.CANVAS_SRC;
  }
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CANVAS_TEXT', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.canvas.isTextSupported.
 */
npf.userAgent.support.getCanvasText = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_CANVAS_TEXT) {
      return true;
    }

    var support = false;

    if (npf.userAgent.support.getCanvas()) {
      var element = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        element.getContext('2d'));
      support = goog.isFunction(ctx.fillText);
    }

    return support;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_ANIMATIONS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isAnimationSupported.
 */
npf.userAgent.support.getCssAnimations = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_CSS_ANIMATIONS ||
      npf.userAgent.support.testPropsAll_('animationName');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_COLUMNS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.getColumnStylesSupported.
 */
npf.userAgent.support.getCssColumns = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_CSS_COLUMNS ||
      npf.userAgent.support.testPropsAll_('columnCount');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_GRADIENTS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isGradientSupported.
 */
npf.userAgent.support.getCssGradients = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_CSS_GRADIENTS) {
      return true;
    }

    /*
     * For CSS Gradients syntax, please see:
     * http://webkit.org/blog/175/introducing-css-gradients/
     * https://developer.mozilla.org/en/CSS/-moz-linear-gradient
     * https://developer.mozilla.org/en/CSS/-moz-radial-gradient
     * http://dev.w3.org/csswg/css3-images/#gradients-
     */

    /** @type {string} */
    var str1 = 'background-image:';
    /** @type {string} */
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    /** @type {string} */
    var str3 = 'linear-gradient(left top,#9f9, white);';

    npf.userAgent.support.setCss_(
      (str1 + '-webkit- '.split(' ').join(str2 + str1) +
      npf.userAgent.support.prefixes.join(str3 + str1)
    ).slice(0, -str1.length));

    return npf.userAgent.support.contains_(
      npf.userAgent.support.mStyle_.backgroundImage, 'gradient');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_REFLECTIONS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isReflectionSupported.
 */
npf.userAgent.support.getCssReflections = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_CSS_REFLECTIONS ||
      npf.userAgent.support.testPropsAll_('boxReflect');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_REM_UNIT', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isRemUnitSupported.
 */
npf.userAgent.support.getCssRemUnit = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_CSS_REM_UNIT) {
      return true;
    }

    /** @type {!Element} */
    var div = goog.dom.createElement(goog.dom.TagName.DIV);

    try {
      div.style['fontSize'] = '3rem';
    } catch(er){}

    return /rem/.test(div.style['fontSize']);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_SCROLL_BAR', false);

/**
 * Stylable scrollbars detection.
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isScrollbarSupported.
 */
npf.userAgent.support.getCssScrollBar = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_CSS_SCROLL_BAR) {
      return true;
    }

    /** @type {boolean} */
    var supported;
    var styles = '#' + npf.userAgent.support.MOD +
      '{overflow:scroll;width:40px}#' +
      npf.userAgent.support.prefixes
        .join('scrollbar{width:0px} #' + npf.userAgent.support.MOD + '::')
        .split('#')
        .slice(1)
        .join('#') + "scrollbar{width:0px}";

    npf.userAgent.support.testStyles_(styles, function(node) {
      supported = 'scrollWidth' in node && 40 == node.scrollWidth;
    });

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_TRANSFORMS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isTransformSupported.
 */
npf.userAgent.support.getCssTransforms = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_CSS_TRANSFORMS ||
      npf.userAgent.support.testPropsAll_('transform');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_TRANSFORMS_3D', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isTransform3dSupported.
 */
npf.userAgent.support.getCssTransforms3d = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_CSS_TRANSFORMS_3D) {
      return true;
    }

    /** @type {boolean} */
    var isPropertySupported =
      npf.userAgent.support.testPropsAll_('perspective');
    /** @type {!Document} */
    var doc = goog.dom.getDocument();

    // Webkits 3D transforms are passed off to the browser's own graphics
    // renderer. It works fine in Safari on Leopard and Snow Leopard, but not
    // in Chrome in some conditions. As a result, Webkit typically recognizes
    // the syntax but will sometimes throw a false positive, thus we must do
    // a more thorough check:
    if (
      isPropertySupported &&
      'webkitPerspective' in doc.documentElement.style
    ) {
      // Webkit allows this media query to succeed only if the feature
      // is enabled.
      // `@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),
      // (-ms-transform-3d),(-webkit-transform-3d),(MOD){ ... }`

      /** @type {string} */
      var style = '@media (transform-3d),(-webkit-transform-3d){#' +
        npf.userAgent.support.MOD + '{left:9px;position:absolute;height:3px;}}';

      npf.userAgent.support.testStyles_(style, function(node, rule) {
        // IE8 will bork if you create a custom build that excludes both
        // fontface and generatedcontent tests.
        // So we check for cssRules and that there is a rule available
        // More here: https://github.com/Modernizr/Modernizr/issues/288 &
        // https://github.com/Modernizr/Modernizr/issues/293
        isPropertySupported = node.offsetLeft === 9 && node.offsetHeight === 3;
      });
    }

    return isPropertySupported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CSS_TRANSITIONS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isTransitionSupported.
 */
npf.userAgent.support.getCssTransitions = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_CSS_TRANSITIONS ||
      npf.userAgent.support.testPropsAll_('transition');
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CONTENT_EDITABLE', false);

/**
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#contenteditable
 * This is known to false positive in some mobile browsers
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.contentEditable.isSupported.
 */
npf.userAgent.support.getContentEditable = function() {
  return npf.userAgent.support.ASSUME_CONTENT_EDITABLE ||
    'contentEditable' in goog.dom.getDocument().documentElement;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CONTENT_SECURITY_POLICE', false);

/**
 * Test for (experimental) Content Security Policy 1.1 support.
 *
 * This feature is still quite experimental, but is available now in Chrome 22.
 * If the `SecurityPolicy` property is available, you can be sure the browser
 * supports CSP. If it's not available, the browser still might support an
 * earlier version of the CSP spec.
 *
 * Editor's Draft: https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html
 * @return {boolean}
 * @deprecated
 */
npf.userAgent.support.getContentSecurityPolicy = function() {
  if (npf.userAgent.support.ASSUME_CONTENT_SECURITY_POLICE) {
    return true;
  }

  /** @type {!Document} */
  var doc = goog.dom.getDocument();

  return 'securityPolicy' in doc || 'SecurityPolicy' in doc;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CONTEXT_MENU', false);

/**
 * http://www.w3.org/TR/html5/interactive-elements.html#context-menus
 * Demo at http://thewebrocks.com/demos/context-menu/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.contextMenu.isSupported.
 */
npf.userAgent.support.getContextMenu = function() {
  if (npf.userAgent.support.ASSUME_CONTEXT_MENU) {
    return true;
  }

  /** @type {!Document} */
  var doc = goog.dom.getDocument();

  return 'contextMenu' in doc.documentElement &&
    'HTMLMenuItemElement' in goog.global;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_CORS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.xhr.isCorsSupported.
 */
npf.userAgent.support.getCors = function() {
  return npf.userAgent.support.ASSUME_CORS ||
    !!(goog.global.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_DATA_URI', false);

/**
 * @private {boolean?}
 */
npf.userAgent.support.dataUri_ = null;

/**
 * @const {string}
 */
npf.userAgent.support.DATA_URI_SRC =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

/**
 * https://github.com/Modernizr/Modernizr/issues/14
 * @param {function(this: SCOPE, boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @deprecated Use npf.userAgent.support.url.isDataUriSupported.
 */
npf.userAgent.support.getDataUri = function(callback, opt_scope) {
  if (npf.userAgent.support.ASSUME_DATA_URI) {
    callback.call(opt_scope, true);
  } else if (goog.isNull(npf.userAgent.support.dataUri_)) {
    var image = new Image();
    image.onerror = function() {
      npf.userAgent.support.dataUri_ = false;
      callback.call(opt_scope, false);
    };
    image.onload = function() {
      /** @type {boolean} */
      var supported = 1 == image.width && 1 == image.height;
      npf.userAgent.support.dataUri_ = supported;
      callback.call(opt_scope, supported);
    };
    image.src = npf.userAgent.support.DATA_URI_SRC;
  } else {
    callback.call(
      opt_scope, /** @type {boolean} */ (npf.userAgent.support.dataUri_));
  }
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_DRAD_AND_DROP', false);

/**
 * @return {boolean}
 * @deprecated
 */
npf.userAgent.support.getDragAndDrop = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_DRAD_AND_DROP) {
      return true;
    }

    /** @type {Element} */
    var element = goog.dom.createElement(goog.dom.TagName.DIV);

    return !!(('draggable' in element) ||
      ('ondragstart' in element && 'ondrop' in element));
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_DOWNLOAD_ATTRIBUTE', false);

/**
 * a[download] attribute
 * When used on an <a>, this attribute signifies that the resource it
 * points to should be downloaded by the browser rather than navigating to it.
 * http://developers.whatwg.org/links.html#downloading-resources
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.elements.isDownloadAttributeSupported.
 */
npf.userAgent.support.getDownloadAttribute = function() {
  return npf.userAgent.support.ASSUME_DOWNLOAD_ATTRIBUTE ||
    ('download' in goog.dom.createElement(goog.dom.TagName.A));
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_EVENT_SOURCE', false);

/**
 * Server sent events aka eventsource
 * dev.w3.org/html5/eventsource/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.network.isEventSourceSupported.
 */
npf.userAgent.support.getEventSource = function() {
  return npf.userAgent.support.ASSUME_EVENT_SOURCE ||
    !!goog.global['EventSource'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_EXIF_ORIENTATION', false);

/**
 * @private {boolean?}
 */
npf.userAgent.support.exifOrientation_ = null;

/**
 * @const {string}
 */
npf.userAgent.support.ORIENTATION_SRC =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZgAASUkqAAgAAAA' +
  'BABIBAwABAAAABgASAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA' +
  'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
  'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAIDA' +
  'SIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwU' +
  'FBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoK' +
  'So0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5i' +
  'ZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+' +
  'Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ' +
  '3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2N' +
  'zg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqO' +
  'kpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oAD' +
  'AMBAAIRAxEAPwD+/iiiigD/2Q=='

/**
 * EXIF Orientation test
 *
 * iOS looks at the EXIF Orientation flag in jpgs and rotates the image
 * accordingly. Looks like most desktop browsers just ignore this data.
 *
 * description: www.impulseadventure.com/photo/exif-orientation.html
 * @param {function(this: SCOPE, boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @deprecated Use npf.userAgent.support.image.isOrientationSupported.
 */
npf.userAgent.support.getExifOrientation = function(callback, opt_scope) {
  if (npf.userAgent.support.ASSUME_EXIF_ORIENTATION) {
    callback.call(opt_scope, true);
  } else if (goog.isNull(npf.userAgent.support.exifOrientation_)) {
    var image = new Image();
    image.onerror = function() {
      npf.userAgent.support.exifOrientation_ = false;
      callback.call(opt_scope, false);
    };
    image.onload = function() {
      /** @type {boolean} */
      var supported = 2 !== image.width;
      npf.userAgent.support.exifOrientation_ = supported;
      callback.call(opt_scope, supported);
    };
    image.src = npf.userAgent.support.ORIENTATION_SRC;
  } else {
    callback.call(opt_scope,
      /** @type {boolean} */ (npf.userAgent.support.exifOrientation_));
  }
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_FILE_INPUT', false);

/**
 * Detects whether input type="file" is available on the platform
 * E.g. iOS < 6 and some android version don't support this
 *
 * It's useful if you want to hide the upload feature of your app on devices
 * that don't support it (iphone, ipad, etc).
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.forms.isFileInputSupported.
 */
npf.userAgent.support.getFileInput = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_FILE_INPUT) {
      return true;
    }

    var inputElement = /** @type {HTMLInputElement} */ (
      goog.dom.createElement(goog.dom.TagName.INPUT));
    inputElement.type = goog.dom.InputType.FILE;

    return !inputElement.disabled;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_FILE_SYSTEM', false);

/**
 * FileSystem API
 * dev.w3.org/2009/dap/file-system/file-dir-sys.html
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.file.isFileSystemSupported.
 */
npf.userAgent.support.getFileSystem = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_FILE_SYSTEM ||
      !!npf.userAgent.support.testDomProps_('requestFileSystem', goog.global);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_FLEX_BOX', false);

/**
 * The *new* flexbox
 * dev.w3.org/csswg/css3-flexbox
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isFlexboxSupported.
 */
npf.userAgent.support.getFlexBox = goog.functions.cacheReturnValue(function() {
  return npf.userAgent.support.ASSUME_FLEX_BOX ||
    npf.userAgent.support.testPropsAll_('flexWrap');
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_FONT_FACE', false);

/**
 * font-face detection routine by Diego Perini
 * http://javascript.nwbox.com/CSSSupport/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isFontFaceSupported.
 */
npf.userAgent.support.getFontFace = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_FONT_FACE) {
    return true;
  }

  /** @type {boolean} */
  var isPropertySupported;
  /** @type {string} */
  var style = '@font-face {font-family:"font";src:url("https://")}';

  npf.userAgent.support.testStyles_(style, function(element, rule) {
    var style = /** @type {HTMLStyleElement} */ (
      goog.dom.getElement('s' + npf.userAgent.support.MOD));
    /** @type {StyleSheet} */
    var sheet = /** @type {StyleSheet} */ (style['sheet']) ||
      style.styleSheet;
    /** @type {string} */
    var cssText = '';

    if (sheet['cssRules']) {
      var cssSheet = /** @type {CSSStyleSheet} */ (sheet);
      /** @type {CSSRule} */
      var cssItem = cssSheet.cssRules.item(0);

      if (cssItem) {
        cssText = cssItem.cssText;
      }
    } else if (sheet.cssText) {
      cssText = sheet.cssText;
    }

    isPropertySupported = /src/i.test(cssText) &&
      cssText.indexOf(rule.split(' ')[0]) === 0;
  });

  return isPropertySupported;
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_FULL_SCREEN', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.fullscreen.isSupported.
 */
npf.userAgent.support.getFullScreen = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_FULL_SCREEN) {
      return true;
    }

    /** @type {!Document} */
    var doc = goog.dom.getDocument();

    for (var i = 0; i < npf.userAgent.support.domPrefixes.length; i++) {
      if (doc[npf.userAgent.support.domPrefixes[i] + 'CancelFullScreen']) {
        return true;
      }
    }

    return !!doc['cancelFullScreen'];
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_GENERATED_CONTENT', false);

/**
 * CSS generated content detection
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isGeneratedContentSupported.
 */
npf.userAgent.support.getGeneratedContent = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_GENERATED_CONTENT) {
      return true;
    }

    /** @type {boolean} */
    var isPropertySupported;
    /** @type {string} */
    var style = [
      '#', npf.userAgent.support.MOD, '{font:0/0 a}#',
      npf.userAgent.support.MOD, ':after{content:"',
      npf.userAgent.support.SMILE, '";visibility:hidden;font:3px/1 a}'
    ].join('');

    npf.userAgent.support.testStyles_(style, function(node, rule) {
      isPropertySupported = node.offsetHeight >= 3;
    });

    return isPropertySupported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_GEOLOCATION', false);

/**
 * Tests for the new Geolocation API specification.
 *   This test is a standards compliant-only test; for more complete
 *   testing, including a Google Gears fallback, please see:
 *   http://code.google.com/p/geo-location-javascript/
 * or view a fallback solution using google's geo API:
 *   http://gist.github.com/366184
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.geolocation.isSupported.
 */
npf.userAgent.support.getGeolocation = function() {
  return npf.userAgent.support.ASSUME_GEOLOCATION ||
    ('geolocation' in navigator);
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_HASH_CHANGE', false);

/**
 * documentMode logic from YUI to filter out IE8 Compat Mode which false
 * positives.
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.events.isHashChangeEventSupported.
 */
npf.userAgent.support.getHashChange = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_HASH_CHANGE) {
      return true;
    }

    /** @type {!Document} */
    var doc = goog.dom.getDocument();

    return npf.userAgent.support.hasEvent(
        goog.events.EventType.HASHCHANGE, goog.global) &&
      (!goog.isDef(doc['documentMode']) || 7 < doc['documentMode']);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_HISTORY', false);

/**
 * @param {Window=} opt_win
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.history.isSupported.
 */
npf.userAgent.support.getHistory = function(opt_win) {
  if (npf.userAgent.support.ASSUME_HISTORY) {
    return true;
  }

  var win = opt_win || window;

  return !!(win.history && win.history.pushState);
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_HSLA', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isHslaSupported.
 */
npf.userAgent.support.getHsla = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_HSLA) {
    return true;
  }

  // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
  // except IE9 who retains it as hsla
  npf.userAgent.support.setCss_('background-color:hsla(120,40%,100%,.5)');

  return npf.userAgent.support.contains_(
      npf.userAgent.support.mStyle_.backgroundColor, 'rgba') ||
    npf.userAgent.support.contains_(
      npf.userAgent.support.mStyle_.backgroundColor, 'hsla');
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_INDEXED_DB', false);

/**
 * Vendors had inconsistent prefixing with the experimental Indexed DB:
 *   - Webkit's implementation is accessible through webkitIndexedDB
 *   - Firefox shipped moz_indexedDB before FF4b9, but since then has been
 *     mozIndexedDB
 * For speed, we don't test the legacy (and beta-only) indexedDB
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.indexedDb.isSupported.
 */
npf.userAgent.support.getIndexedDb = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_INDEXED_DB ||
      !!npf.userAgent.support.testDomProps_('indexedDB', goog.global);
  }
);

/**
 * @return {IDBFactory}
 * @deprecated Use npf.userAgent.support.indexedDb.getDbFactory.
 */
npf.userAgent.support.getIndexedDbObject = goog.functions.cacheReturnValue(
  function() {
    return /** @type {IDBFactory} */ (
      npf.userAgent.support.testDomProps_('indexedDB', goog.global) || null);
  }
);

/**
 * @return {IDBTransaction}
 * @deprecated Use npf.userAgent.support.indexedDb.getIdbTransaction.
 */
npf.userAgent.support.getIdbTransactionObject = goog.functions.cacheReturnValue(
  function() {
    return /** @type {IDBTransaction} */ (
      npf.userAgent.support.testDomProps_(
        'IDBTransaction', goog.global) || null);
  }
);

/**
 * @return {IDBKeyRange}
 * @deprecated Use npf.userAgent.support.indexedDb.getIdbKeyRange.
 */
npf.userAgent.support.getIdbKeyRangeObject = goog.functions.cacheReturnValue(
  function() {
    return /** @type {IDBKeyRange} */ (
      npf.userAgent.support.testDomProps_('IDBKeyRange', goog.global) || null);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_INLINE_SVG', false);

/**
 * specifically for SVG inline in HTML, not within XHTML
 * test page: paulirish.com/demo/inline-svg
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.svg.isInlineSupported.
 */
npf.userAgent.support.getInlineSvg = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_INLINE_SVG) {
      return true;
    }

    /** @type {Element} */
    var div = goog.dom.createElement(goog.dom.TagName.DIV);
    div.innerHTML = '<svg/>';

    return (div.firstChild && div.firstChild.namespaceURI) == npf.svg.Ns.SVG;
  }
);

/**
 * @return {!Object.<boolean>}
 * @deprecated Use npf.userAgent.support.forms.getSupportedInputAttributes.
 */
npf.userAgent.support.getInput = function() {
  return npf.userAgent.support.getWebForms_().input;
};

/**
 * @return {!Object.<boolean>}
 * @deprecated Use npf.userAgent.support.forms.
 */
npf.userAgent.support.getInputTypes = function() {
  return npf.userAgent.support.getWebForms_().inputTypes;
};

/**
 * input features and input types go directly onto the ret object, bypassing
 * the tests loop.
 * Hold this guy to execute in a moment.
 * @return {{input:!Object.<boolean>,inputTypes:!Object.<boolean>}}
 * @private
 */
npf.userAgent.support.getWebForms_ = goog.functions.cacheReturnValue(
  function() {
    var inputElement = /** @type {!HTMLInputElement} */ (
      goog.dom.createElement(goog.dom.TagName.INPUT));

    return {
      // Run through HTML5's new input attributes to see if the UA understands
      // any. We're using f which is the <input> element created early on
      // Mike Taylr has created a comprehensive resource for testing these
      // attributes when applied to all input types:
      //   http://miketaylr.com/code/input-type-attr.html
      // spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

      // Only input placeholder is tested while textarea's placeholder is not.
      // Currently Safari 4 and Opera 11 have support only for the input
      // placeholder
      // Both tests are available in feature-detects/forms-placeholder.js
      input: npf.userAgent.support.getWebFormsInput_(inputElement),

      // Run through HTML5's new input types to see if the UA understands any.
      //   This is put behind the tests runloop because it doesn't return a
      //   true/false like all the other tests; instead, it returns an object
      //   containing each input type with its corresponding true/false value

      // Big thanks to @miketaylr for the html5 forms expertise.
      // http://miketaylr.com/
      inputTypes: npf.userAgent.support.getWebFormsInputTypes_(inputElement)
    };
  }
);

/**
 * @param {!HTMLInputElement} inputElement
 * @return {!Object.<boolean>}
 * @private
 */
npf.userAgent.support.getWebFormsInput_ = function(inputElement) {
  /** @type {!Array.<string>} */
  var props = ['autocomplete', 'autofocus', 'list', 'placeholder', 'max', 'min',
    'multiple', 'pattern', 'required', 'step'];
  /** @type {!Object.<boolean>} */
  var attrs = {};

  for (var i = 0, len = props.length; i < len; i++) {
    attrs[props[i]] = !!(props[i] in inputElement);
  }

  if (attrs['list']) {
    /** @type {!Element} */
    var dataListElement = goog.dom.createElement('datalist');
    var dataListClass = /** @type {Function|undefined} */ (
      goog.global['HTMLDataListElement']);
    // safari false positive's on datalist: webk.it/74252
    // see also github.com/Modernizr/Modernizr/issues/146
    attrs['list'] = !!(dataListElement && dataListClass);
  }

  return attrs;
};

/**
 * @param {!HTMLInputElement} inputElement
 * @return {!Object.<boolean>}
 * @private
 */
npf.userAgent.support.getWebFormsInputTypes_ = function(inputElement) {
  /** @type {!Array.<string>} */
  var props = [
    goog.dom.InputType.SEARCH,
    goog.dom.InputType.TEL,
    goog.dom.InputType.URL,
    goog.dom.InputType.EMAIL,
    goog.dom.InputType.DATETIME,
    goog.dom.InputType.DATE,
    goog.dom.InputType.MONTH,
    goog.dom.InputType.WEEK,
    goog.dom.InputType.TIME,
    goog.dom.InputType.DATETIME_LOCAL,
    goog.dom.InputType.NUMBER,
    goog.dom.InputType.RANGE,
    goog.dom.InputType.COLOR
  ];
  /** @type {!Object.<boolean>} */
  var inputs = {};

  for (var i = 0, len = props.length; i < len; i++) {
    /** @type {string} */
    var inputElemType = props[i];
    inputElement.setAttribute('type', inputElemType);

    /** @type {boolean} */
    var bool = inputElement.type !== goog.dom.InputType.TEXT;

    // We first check to see if the type we give it sticks..
    // If the type does, we feed it a textual value, which shouldn't be valid.
    // If the value doesn't stick, we know there's input sanitization which
    // infers a custom UI
    if (bool) {
      inputElement.value = npf.userAgent.support.SMILE;
      inputElement.style.cssText = 'position:absolute;visibility:hidden;';

      if (
        /^range$/.test(inputElemType) &&
        goog.isDef(inputElement.style['WebkitAppearance'])
      ) {
        /** @type {!Document} */
        var doc = goog.dom.getDocument();
        var defaultView = /** @type {ViewCSS} */ (doc['defaultView']);
        goog.dom.appendChild(doc.documentElement, inputElement);

        // Safari 2-4 allows the smiley as a value, despite making a slider
        if (defaultView.getComputedStyle) {
          /** @type {CSSStyleDeclaration} */
          var styleDeclaration = defaultView.getComputedStyle(
            inputElement, null);
          /** @type {string|undefined} */
          var webkitAppearanceStyle = styleDeclaration['WebkitAppearance'];
          bool = webkitAppearanceStyle !== 'textfield' &&
            // Mobile android web browser has false positive, so must
            // check the height to see if the widget is actually there.
            0 !== inputElement.offsetHeight;
        } else {
          bool = false;
        }

        goog.dom.removeNode(inputElement);
      } else if (/^(search|tel)$/.test(inputElemType)) {
        // Spec doesnt define any special parsing or detectable UI
        //   behaviors so we pass these through as true

        // Interestingly, opera fails the earlier test, so it doesn't
        //  even make it here.
      } else if (/^(url|email)$/.test(inputElemType)) {
        // Real url and email support comes with prebaked validation.
        bool = !!inputElement.checkValidity && !inputElement.checkValidity();
      } else {
        // If the upgraded input compontent rejects the :) text, we got a winner
        bool = inputElement.value != npf.userAgent.support.SMILE;
      }
    }

    inputs[props[i]] = !!bool;
  }

  return inputs;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_LOCAL_STORAGE', false);

/**
 * In FF4, if disabled, window.localStorage should === null.
 *
 * Normally, we could not test that directly and need to do a
 *   `('localStorage' in window) && ` test first because otherwise Firefox will
 *   throw bugzil.la/365772 if cookies are disabled
 *
 * Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
 * will throw the exception:
 *   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
 * Peculiarly, getItem and removeItem calls do not throw.
 *
 * Because we are forced to try/catch this, we'll go aggressive.
 *
 * Just FWIW: IE8 Compat mode supports these features completely:
 *   www.quirksmode.org/dom/html5.html
 * But IE8 doesn't support either with local files
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.storage.isLocalStorageSupported.
 */
npf.userAgent.support.getLocalStorage = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_LOCAL_STORAGE) {
      return true;
    }

    /** @type {boolean} */
    var supported = false;

    try {
      goog.global['localStorage']['setItem'](
        npf.userAgent.support.MOD, npf.userAgent.support.MOD);
      goog.global['localStorage']['removeItem'](npf.userAgent.support.MOD);

      supported = true;
    } catch(e) { }

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_LOW_BATTERY', false);

/**
 * Low Battery Level
 * Enable a developer to remove CPU intensive CSS/JS when battery is low
 * developer.mozilla.org/en/DOM/window.navigator.mozBattery
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.battery.isLowLevel.
 */
npf.userAgent.support.getLowBattery = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_LOW_BATTERY) {
      return true;
    }

    var battery = npf.userAgent.support.testDomProps_('battery', navigator);

    return !!battery && !battery['charging'] && battery['level'] <= 0.20;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_MATH', false);

/**
 * MathML
 * http://www.w3.org/Math/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.mathml.isSupported.
 */
npf.userAgent.support.getMath = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_MATH) {
    return true;
  }

  var supported = false;
  /** @type {!Document} */
  var doc = goog.dom.getDocument();

  if (doc.createElementNS) {
    var div = /** @type {!HTMLElement} */ (
      goog.dom.createElement(goog.dom.TagName.DIV));
    div.style.position = 'absolute';

    /** @type {!Element} */
    var mathElement = doc.createElementNS(npf.svg.Ns.MATH_ML, 'math');
    goog.dom.appendChild(div, mathElement);

    /** @type {!Element} */
    var mfracElement = doc.createElementNS(npf.svg.Ns.MATH_ML, 'mfrac');
    goog.dom.appendChild(mathElement, mfracElement);

    /** @type {!Element} */
    var mi1Element = doc.createElementNS(npf.svg.Ns.MATH_ML, 'mi');
    goog.dom.appendChild(mi1Element, doc.createTextNode('xx'));
    goog.dom.appendChild(mfracElement, mi1Element);

    /** @type {!Element} */
    var mi2Element = doc.createElementNS(npf.svg.Ns.MATH_ML, 'mi');
    goog.dom.appendChild(mi2Element, doc.createTextNode('yy'));
    goog.dom.appendChild(mfracElement, mi2Element);

    goog.dom.appendChild(doc.body, div);
    supported = div.offsetHeight > div.offsetWidth;
  }

  return supported;
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_MULTIPLE_BACKGROUNDS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isMultipleBgsSupported.
 */
npf.userAgent.support.getMultipleBackgrounds = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_MULTIPLE_BACKGROUNDS) {
      return true;
    }

    // Setting multiple images AND a color on the background shorthand property
    //  and then querying the style.background property value for the number of
    //  occurrences of "url(" is a reliable method for detecting ACTUAL support
    // for this!

    npf.userAgent.support.setCss_(
      'background:url(https://),url(https://),red url(https://)');

    // If the UA supports multiple backgrounds, there should be three
    // occurrences of the string "url(" in the return value
    // for elemStyle.background
    return /(url\s*\(.*?){3}/.test(npf.userAgent.support.mStyle_.background);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_NOTIFICATION', false);

/**
 * window.webkitNotifications is only used by Chrome
 * http://www.html5rocks.com/en/tutorials/notifications/quick/
 *
 * window.Notification only exist in the draft specs
 * http://dev.w3.org/2006/webapi/WebNotifications/publish/Notifications.html#idl-if-Notification
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.notification.isSupported.
 */
npf.userAgent.support.getNotification = function() {
  return npf.userAgent.support.ASSUME_NOTIFICATION ||
    (
      'Notification' in goog.global &&
      'permission' in goog.global['Notification'] &&
      'requestPermission' in goog.global['Notification']
    );
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_OPACITY', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isOpacitySupported.
 */
npf.userAgent.support.getOpacity = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_OPACITY) {
    return true;
  }

  // Browsers that actually have CSS Opacity implemented have done so
  //  according to spec, which means their return values are within the
  //  range of [0.0,1.0] - including the leading zero.

  npf.userAgent.support.setCss_(
    npf.userAgent.support.prefixes.join('opacity:.55;'));

  // The non-literal . in this regex is intentional:
  //   German Chrome returns this value as 0,55
  // https://github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
  return /^0.55$/.test(npf.userAgent.support.mStyle_.opacity);
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_PERFORMANCE', false);

/**
 * Navigation Timing (Performance)
 * https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/
 * http://www.html5rocks.com/en/tutorials/webperformance/basics/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.performance.isSupported.
 */
npf.userAgent.support.getPerformance = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_PERFORMANCE ||
      !!npf.userAgent.support.testDomProps_('performance', goog.global);
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_POST_MESSAGE', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.postMessage.isSupported.
 */
npf.userAgent.support.getPostMessage = function() {
  return npf.userAgent.support.ASSUME_POST_MESSAGE ||
    !!goog.global['postMessage'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_RGBA', false);

/**
 * http://css-tricks.com/rgba-browser-support/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isRgbaSupported.
 */
npf.userAgent.support.getRgba = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_RGBA) {
    return true;
  }

  npf.userAgent.support.setCss_('background-color:rgba(150,255,150,.5)');

  return npf.userAgent.support.contains_(
    npf.userAgent.support.mStyle_.backgroundColor, 'rgba');
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SCRIPT_ASYNC', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.elements.isScriptAsyncAttributeSupported.
 */
npf.userAgent.support.getScriptAsync = function() {
  return npf.userAgent.support.ASSUME_SCRIPT_ASYNC ||
    ('async' in goog.dom.createElement(goog.dom.TagName.SCRIPT));
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SCRIPT_DEFER', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.elements.isScriptDeferAttributeSupported.
 */
npf.userAgent.support.getScriptDefer = function() {
  return npf.userAgent.support.ASSUME_SCRIPT_DEFER ||
    ('defer' in goog.dom.createElement(goog.dom.TagName.SCRIPT));
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SESSION_STORAGE', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.storage.isSessionStorageSupported.
 */
npf.userAgent.support.getSessionStorage = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_SESSION_STORAGE) {
      return true;
    }

    /** @type {boolean} */
    var supported = false;

    try {
      goog.global['sessionStorage']['setItem'](
        npf.userAgent.support.MOD, npf.userAgent.support.MOD);
      goog.global['sessionStorage']['removeItem'](npf.userAgent.support.MOD);

      supported = true;
    } catch(e) { }

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SMIL', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.svg.isSmilSupported.
 */
npf.userAgent.support.getSmil = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_SMIL) {
    return true;
  }

  /** @type {!Document} */
  var doc = goog.dom.getDocument();

  return !!doc.createElementNS && /SVGAnimate/.test({}.toString.call(
      doc.createElementNS(npf.svg.Ns.SVG, 'animate')));
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_STYLE_SCOPED', false);

/**
 * Browser support test for <style scoped>
 * http://www.w3.org/TR/html5/the-style-element.html#attr-style-scoped
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.elements.isStyleScopedAttributeSupported.
 */
npf.userAgent.support.getStyleScoped = function() {
  return npf.userAgent.support.ASSUME_STYLE_SCOPED ||
    ('scoped' in goog.dom.createElement(goog.dom.TagName.STYLE));
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SVG', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.svg.isSupported.
 */
npf.userAgent.support.getSvg = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_SVG) {
    return true;
  }

  /** @type {!Document} */
  var doc = goog.dom.getDocument();

  return !!doc.createElementNS &&
    !!doc.createElementNS(npf.svg.Ns.SVG, 'svg')['createSVGRect'];
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SVG_CLIP_PATHS', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.svg.isClipPathSupported.
 */
npf.userAgent.support.getSvgClipPaths = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_SVG_CLIP_PATHS) {
      return true;
    }

    /** @type {!Document} */
    var doc = goog.dom.getDocument();

    return !!doc.createElementNS && /SVGClipPath/.test({}.toString.call(
        doc.createElementNS(npf.svg.Ns.SVG, 'clipPath')));
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_SVG_FILTERS', false);

/**
 * Detect support for svg filters - http://www.w3.org/TR/SVG11/filters.html.
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.svg.isFilterSupported.
 */
npf.userAgent.support.getSvgFilters = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_SVG_FILTERS) {
      return true;
    }

    var supported = false;

    try {
      var el = /** @type {Function|undefined} */ (
        goog.global['SVGFEColorMatrixElement']);
      supported = goog.isDef(el) && 2 == el['SVG_FECOLORMATRIX_TYPE_SATURATE'];
    } catch(e) {}

    return supported;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_TEXT_SHADOW', false);

/**
 * FF3.0 will false positive on this test
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.css.isTextShadowSupported.
 */
npf.userAgent.support.getTextShadow = goog.functions.cacheReturnValue(
  function() {
    return npf.userAgent.support.ASSUME_TEXT_SHADOW ||
      '' === goog.dom.createElement(goog.dom.TagName.DIV).style.textShadow;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_TOUCH', false);

/**
 * For more info, see: http://modernizr.github.com/Modernizr/touch.html
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.events.isTouchEventSupported.
 */
npf.userAgent.support.getTouch = goog.functions.cacheReturnValue(function() {
  if (npf.userAgent.support.ASSUME_TOUCH) {
    return true;
  }

  /** @type {!Document} */
  var doc = goog.dom.getDocument();

  if (
    ('ontouchstart' in goog.global) ||
    /** @type {*} */ (goog.global['DocumentTouch']) &&
    doc instanceof goog.global['DocumentTouch']
  ) {
    return true;
  }

  /** @type {boolean} */
  var bool;
  /** @type {string} */
  var rule = [
    '@media (', npf.userAgent.support.prefixes.join('touch-enabled),('),
    npf.userAgent.support.MOD, '){#' + npf.userAgent.support.MOD +
    '{top:9px;position:absolute}}'
  ].join('');
  npf.userAgent.support.testStyles_(rule, function(element, rule) {
    bool = 9 === element.offsetTop;
  });

  return bool;
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_VIDEO_H264', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.video.isH264Supported.
 */
npf.userAgent.support.getVideoH264 = function() {
  return npf.userAgent.support.ASSUME_VIDEO_H264 ?
    'probably' : npf.userAgent.support.getVideo_().h264;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_VIDEO_OGG', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.video.isOggSupported.
 */
npf.userAgent.support.getVideoOgg = function() {
  return npf.userAgent.support.ASSUME_VIDEO_OGG ?
    'probably' : npf.userAgent.support.getVideo_().ogg;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_VIDEO_WEBM', false);

/**
 * @return {string} 'probably', 'maybe' or empty string.
 * @deprecated Use npf.userAgent.support.video.isWebmSupported.
 */
npf.userAgent.support.getVideoWebm = function() {
  return npf.userAgent.support.ASSUME_VIDEO_WEBM ?
    'probably' : npf.userAgent.support.getVideo_().webm;
};

/**
 * @return {{h264:string,ogg:string,webm:string}}
 * @private
 */
npf.userAgent.support.getVideo_ = goog.functions.cacheReturnValue(function() {
  var elem = /** @type {!HTMLVideoElement} */ (
    goog.dom.createElement('video'));
  var result;

  // IE9 Running on Windows Server SKU can cause an exception to be thrown,
  // bug #224
  try {
    if (elem.canPlayType) {
      result = {
        ogg: elem.canPlayType('video/ogg; codecs="theora"')
          .replace(/^no$/, ''),
        // Without QuickTime, this value will be `undefined`.
        // github.com/Modernizr/Modernizr/issues/546
        h264: elem.canPlayType('video/mp4; codecs="avc1.42E01E"')
          .replace(/^no$/, ''),
        webm: elem.canPlayType('video/webm; codecs="vp8, vorbis"')
          .replace(/^no$/, '')
      };
    }
  } catch(e) { }

  return result || {
    h264: '',
    ogg: '',
    webm: ''
  };
});

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_VIBRATE', false);

/**
 * Vibration API
 * http://www.w3.org/TR/vibration/
 * https://developer.mozilla.org/en/DOM/window.navigator.mozVibrate
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.vibration.isSupported.
 */
npf.userAgent.support.getVibrate = function() {
  return npf.userAgent.support.ASSUME_VIBRATE ||
    !!npf.userAgent.support.testDomProps_('vibrate', goog.global.navigator);
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEB_AUDIO', false);

/**
 * Web Audio API
 * https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.audio.isWebAudioSupported.
 */
npf.userAgent.support.getWebAudio = function() {
  return npf.userAgent.support.ASSUME_WEB_AUDIO ||
    !!goog.global['webkitAudioContext'] || !!goog.global['AudioContext'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEB_GL', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.webgl.isSupported.
 */
npf.userAgent.support.getWebGl = function() {
  // This WebGL test may false positive.
  // But really it's quite impossible to know whether webgl will succeed until
  // after you create the context. You might have hardware that can support
  // a 100x100 webgl canvas, but will not support a 1000x1000 webgl
  // canvas. So this feature inference is weak, but intentionally so.

  // It is known to false positive in FF4 with certain hardware and the iPad 2.
  return npf.userAgent.support.ASSUME_WEB_GL ||
    !!goog.global['WebGLRenderingContext'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEB_SOCKET', false);

/**
 * Mozilla is targeting to land MozWebSocket for FF6
 * bugzil.la/659324
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.network.isWebSocketSupported.
 */
npf.userAgent.support.getWebSocket = function() {
  return npf.userAgent.support.ASSUME_WEB_SOCKET ||
    'WebSocket' in goog.global || 'MozWebSocket' in goog.global;
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEB_SOCKET_BINARY', false);

/**
 * binaryType is truthy if there is support.. returns "blob" in new-ish chrome.
 * plus.google.com/115535723976198353696/posts/ERN6zYozENV
 * github.com/Modernizr/Modernizr/issues/370
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.network.isWebSocketBinarySupported.
 */
npf.userAgent.support.getWebSocketBinary = goog.functions.cacheReturnValue(
  function() {
    if (npf.userAgent.support.ASSUME_WEB_SOCKET_BINARY) {
      return true;
    }

    /** @type {string} */
    var protocol = 'https:' == goog.global.location.protocol ? 'wss' : 'ws';

    if ('WebSocket' in goog.global) {
      /** @type {boolean} */
      var protoBin = 'binaryType' in goog.global['WebSocket']['prototype'];

      if (protoBin) {
        return protoBin;
      }

      try {
        return !!(new goog.global['WebSocket'](protocol + '://.')['binaryType']);
      } catch (e){}
    }

    return false;
  }
);

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEB_SQL_DATABASE', false);

/**
 * Web SQL database detection is tricky:
 * In chrome incognito mode, openDatabase is truthy, but using it will
 * throw an exception: http://crbug.com/42380
 * We can create a dummy database, but there is no way to delete it afterwards.
 *
 * We have chosen to allow the Chrome incognito false positive, so that object
 * doesn't litter the web with these test databases. As a developer, you'll have
 * to account for this gotcha yourself.
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.storage.isWebSqlDbSupported.
 */
npf.userAgent.support.getWebSqlDatabase = function() {
  return npf.userAgent.support.ASSUME_WEB_SQL_DATABASE ||
    !!goog.global['openDatabase'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEBP', false);

/**
 * @private {boolean?}
 */
npf.userAgent.support.webp_ = null;

/**
 * @const {string}
 */
npf.userAgent.support.WEBP_SRC =
  'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/' +
  'AAAFzrNsAAP5QAAAAAA==';

/**
 * code.google.com/speed/webp/
 * @param {function(this: SCOPE, boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 * @deprecated Use npf.userAgent.support.image.isWebpSupported.
 */
npf.userAgent.support.getWebp = function(callback, opt_scope) {
  if (npf.userAgent.support.ASSUME_WEBP) {
    callback.call(opt_scope, true);
  } else if (goog.isNull(npf.userAgent.support.webp_)) {
    var image = new Image();
    image.onerror = function() {
      npf.userAgent.support.webp_ = false;
      callback.call(opt_scope, false);
    };
    image.onload = function() {
      /** @type {boolean} */
      var supported = 1 == image.width;
      npf.userAgent.support.webp_ = supported;
      callback.call(opt_scope, supported);
    };
    image.src = npf.userAgent.support.WEBP_SRC;
  } else {
    callback.call(
      opt_scope, /** @type {boolean} */ (npf.userAgent.support.webp_));
  }
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_WEB_WORKER', false);

/**
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.worker.isSupported.
 */
npf.userAgent.support.getWebWorker = function() {
  return npf.userAgent.support.ASSUME_WEB_WORKER || !!goog.global['Worker'];
};

/**
 * @define {boolean}
 */
goog.define('npf.userAgent.support.ASSUME_XHR2', false);

/**
 * XML HTTP Request Level 2
 * www.w3.org/TR/XMLHttpRequest2/
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.xhr.isXhr2Supported.
 */
npf.userAgent.support.getXhr2 = function() {
  return npf.userAgent.support.ASSUME_XHR2 || 'FormData' in goog.global;
};

/**
 * Allows you to add custom styles to the document and test an element
 * afterwards.
 * @param {string} rule
 * @param {function(!HTMLElement,string)} callback
 * @param {number=} opt_nodes
 * @param {Array.<string>=} opt_testNames
 * @private
 */
npf.userAgent.support.testStyles_ = function(rule, callback, opt_nodes,
    opt_testNames) {
  /** @type {number} */
  var nodes = opt_nodes || 0;
  /** @type {string} */
  var docOverflow = '';
  var div = /** @type {!HTMLElement} */ (
    goog.dom.createElement(goog.dom.TagName.DIV));
  /** @type {!Document} */
  var doc = goog.dom.getDocument();
  var body = doc.body;
  var fakeBody = body || goog.dom.createElement(goog.dom.TagName.BODY);

  if (nodes) {
    while (nodes--) {
      /** @type {!Element} */
      var node = goog.dom.createElement(goog.dom.TagName.DIV);
      node.id = opt_testNames ? opt_testNames[nodes] :
        npf.userAgent.support.MOD + (nodes + 1);
      goog.dom.appendChild(div, node);
    }
  }

  /** @type {string} */
  var style = [
    '&#173;','<style id="s', npf.userAgent.support.MOD, '">', rule, '</style>'
  ].join('');
  div.id = npf.userAgent.support.MOD;

  if (body) {
    div.innerHTML += style;
  } else {
    fakeBody.innerHTML += style;
  }

  goog.dom.appendChild(fakeBody, div);

  if (!body) {
    fakeBody.style.background = '';
    fakeBody.style.overflow = 'hidden';
    docOverflow = doc.documentElement.style.overflow;
    doc.documentElement.style.overflow = 'hidden';
    goog.dom.appendChild(doc.documentElement, fakeBody);
  }

  callback(div, rule);

  if (!body) {
    goog.dom.removeNode(fakeBody);
    doc.documentElement.style.overflow = docOverflow;
  } else {
    goog.dom.removeNode(div);
  }
};

/**
 * Returns a boolean for if substr is found within str.
 * @param {string} str
 * @param {string} substr
 * @return {boolean}
 * @private
 */
npf.userAgent.support.contains_ = function(str, substr) {
  return !!~('' + str).indexOf(substr);
};

/**
 * Tests a list of DOM properties we want to check against.
 * We specify literally ALL possible (known and/or likely) properties on
 * the element including the non-vendor prefixed one, for forward-compatibility.
 * @param {string} prop
 * @return {boolean}
 * @private
 */
npf.userAgent.support.testPropsAll_ = function(prop) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  var props = (prop + ' ' +
    npf.userAgent.support.cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

  return npf.userAgent.support.testProps_(props);
};

/**
 * It is a generic CSS / DOM property test; if a browser supports
 *   a certain property, it won't return undefined for it.
 *   A supported CSS property returns empty string when its not yet set.
 * @param {Array.<string>} props
 * @return {boolean}
 * @private
 */
npf.userAgent.support.testProps_ = function(props) {
  for (var i in props) {
    if (
      !npf.userAgent.support.contains_(props[i], '-') &&
      goog.isDef(npf.userAgent.support.mStyle_[props[i]])
    ) {
      return true;
    }
  }

  return false;
};

/**
 * @param {string} prop
 * @param {Object} obj
 * @return {*|undefined}
 * @private
 */
npf.userAgent.support.testDomProps_ = function(prop, obj) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  var props = (prop + ' ' +
    npf.userAgent.support.cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

  for (var i in props) {
    /** @type {*} */
    var item = obj[props[i]];

    if (goog.isDef(item)) {
      return item;
    }
  }

  return undefined;
};

/**
 * It is a generic CSS / DOM property test; if a browser supports
 *   a certain property, it won't return undefined for it.
 *   A supported CSS property returns empty string when its not yet set.
 * @param {!Array.<string>} props
 * @return {string}
 * @private
 */
npf.userAgent.support.testPropsPrefixed_ = function(props) {
  for (var i in props) {
    if (goog.isDef(npf.userAgent.support.mStyle_[props[i]])) {
      return props[i];
    }
  }

  return '';
};

/**
 * Detects support for a given event, with an optional element to test on
 *
 * @example
 *   npf.userAgent.support.hasEvent('gesturestart', elem)
 *
 * @param {string} eventName
 * @param {Element|Window=} opt_element
 * @return {boolean}
 * @deprecated Use npf.userAgent.support.utils.hasEvent.
 */
npf.userAgent.support.hasEvent = function(eventName, opt_element) {
  /** @type {Element|Window} */
  var element = opt_element ||
    goog.dom.createElement(npf.userAgent.support.eventTagNames[eventName] ||
      goog.dom.TagName.DIV);
  /** @type {string} */
  var eventFullName = 'on' + eventName;

  // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
  // "resize", whereas `in` "catches" those

  /** @type {boolean} */
  var isPropertySupported = eventFullName in element;

  if (!isPropertySupported) {
    // If it has no `setAttribute` (i.e. doesn't implement Node interface),
    // try generic element
    if (!element.setAttribute) {
      element = goog.dom.createElement(goog.dom.TagName.DIV);
    }

    if (element.setAttribute && element.removeAttribute) {
      element.setAttribute(eventFullName, '');
      isPropertySupported = goog.isFunction(element[eventFullName]);

      // If property was created, "remove it" (by setting value to `undefined`)
      if (goog.isDef(element[eventFullName])) {
        element[eventFullName] = undefined;
      }

      element.removeAttribute(eventFullName);
    }
  }

  element = null;

  return isPropertySupported;
};

/**
 * @param {string} str
 * @private
 */
npf.userAgent.support.setCss_ = function(str) {
  npf.userAgent.support.mStyle_.cssText = str;
};
