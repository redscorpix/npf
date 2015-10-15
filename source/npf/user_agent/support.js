goog.provide('npf.userAgent.Support');
goog.provide('npf.userAgent.support');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.EventType');
goog.require('goog.math');
goog.require('goog.object');
goog.require('goog.userAgent');
goog.require('npf.svg.Ns');


/**
 * Source: Modernizr 2.6.2 Custom Build (http://modernizr.com)
 * @constructor
 */
npf.userAgent.Support = function() {
  /**
   * @type {!Object.<npf.userAgent.Support.Property_,*>}
   * @private
   */
  this.checks_ = {};

  /**
   * @private {CSSStyleDeclaration}
   */
  this.mStyle_ = goog.dom.createElement(npf.userAgent.Support.MOD).style;

  /**
   * @private {!Object.<string>}
   */
  this.cssPropertyNames_ = {};
};
goog.addSingletonGetter(npf.userAgent.Support);


/**
 * @enum {number}
 * @private
 */
npf.userAgent.Support.Property_ = {
  ANIMATED_PNG: 1,
  AUDIO: 2,
  BACKGROUND_POSITION: 3,
  BACKGROUND_REPEAT_ROUND: 4,
  BACKGROUND_REPEAT_SPACE: 5,
  BACKGROUND_SIZE: 6,
  BACKGROUND_SIZE_COVER: 7,
  BATTERY: 8,
  BLOB_CONSTRUCTOR: 9,
  BORDER_IMAGE: 10,
  BORDER_RADIUS: 11,
  BOX_SHADOW: 12,
  BOX_SIZING: 13,
  CANVAS: 14,
  CANVAS_TEXT: 15,
  CANVAS_TO_JPEG: 16,
  CANVAS_TO_WEBP: 17,
  CSS_ANIMATIONS: 18,
  CSS_COLUMNS: 19,
  CSS_GRADIENTS: 20,
  CSS_REFLECTIONS: 21,
  CSS_REM_UNIT: 22,
  CSS_SCROLL_BAR: 23,
  CSS_TRANSFORMS: 24,
  CSS_TRANSFORMS_3D: 25,
  CSS_TRANSITIONS: 26,
  DATA_URI: 27,
  DRAG_AND_DROP: 28,
  EXIF_ORIENTATION: 29,
  FILE_INPUT: 30,
  FILE_SYSTEM: 31,
  FLEX_BOX: 32,
  FONT_FACE: 33,
  GENERATED_CONTENT: 34,
  HASH_CHANGE: 35,
  HSLA: 36,
  INDEXED_DB: 37,
  INLINE_SVG: 38,
  INPUT: 39,
  INPUT_TYPES: 40,
  LOCAL_STORAGE: 41,
  LOW_BATTERY: 42,
  MATH: 43,
  MULTIPLE_BACKGROUNDS: 44,
  NOTIFICATION: 45,
  OPACITY: 46,
  PERFORMANCE: 47,
  RGBA: 48,
  SESSION_STORAGE: 49,
  SMIL: 50,
  SVG: 51,
  SVG_CLIP_PATHS: 52,
  SVG_FILTERS: 53,
  TEXT_SHADOW: 54,
  TOUCH: 55,
  VIDEO: 56,
  WEBP: 57
};

/**
 * @typedef {{m4a:string,mp3:string,ogg:string,wav:string}}
 */
npf.userAgent.Support.AudioFeature;

/**
 * @typedef {{ogg:string,h264:string,webm:string}}
 */
npf.userAgent.Support.VideoFeature;

/**
 * @type {!Object.<string>}
 */
npf.userAgent.Support.eventTagNames = goog.object.create(
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
 */
npf.userAgent.Support.MOD = 'useragentsupport_' + goog.math.randomInt(1000000);

/**
 * @const {string}
 */
npf.userAgent.Support.SMILE = ':)';

/**
 * Browser special CSS prefix.
 * @type {string}
 */
npf.userAgent.Support.vendorPrefix =
  goog.userAgent.WEBKIT ? 'webkit' :
  goog.userAgent.GECKO ? 'moz' :
  // TODO(max@): Dirty hack. From 12.10 prefix was removed for  Transitions,
  // Animations and Transforms
  goog.userAgent.OPERA ? (goog.userAgent.isVersionOrHigher('12.10') ? '' : 'o') :
  goog.userAgent.IE ? 'ms' : '';

/**
 * List of property values to set for css tests.
 * @type {!Array.<string>}
 */
npf.userAgent.Support.prefixes = (npf.userAgent.Support.vendorPrefix ? ' -' +
  npf.userAgent.Support.vendorPrefix + '- ' : ' ').split(' ');

/**
 * @private {string}
 */
npf.userAgent.Support.omPrefixes_ = 'Webkit Moz O ms';

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
 */
npf.userAgent.Support.domPrefixes =
  npf.userAgent.Support.omPrefixes_.toLowerCase().split(' ');

/**
 * @type {!Array.<string>}
 */
npf.userAgent.Support.cssomPrefixes =
  npf.userAgent.Support.omPrefixes_.split(' ');


/**
 * Returns property name with proper browser prefix.
 *
 * @param {string} str Property name
 * @return {string} Property name with browser prefix.
 */
npf.userAgent.Support.prototype.getCssPropertyName = function(str) {
  if (!goog.isDef(this.cssPropertyNames_[str])) {
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

    this.cssPropertyNames_[str] = '';

    if (goog.isDef(element.style[str1])) {
      this.cssPropertyNames_[str] = str;
    } else {
      /** @type {!Array.<string>} */
      var vendorPrefixes = npf.userAgent.Support.cssomPrefixes;

      for (var i = 0; i < vendorPrefixes.length; i++) {
        if (goog.isDef(element.style[vendorPrefixes[i] + str2])) {
          this.cssPropertyNames_[str] = '-' + vendorPrefixes[i].toLowerCase() +
            '-' + str;

          break;
        }
      }
    }
  }

  return this.cssPropertyNames_[str];
};

/**
 * Returns property name with proper browser prefix.
 *
 * @param {string} str Property name
 * @return {string} Property name with browser prefix.
 */
npf.userAgent.support.getCssPropertyName = function(str) {
  return npf.userAgent.Support.getInstance().getCssPropertyName(str);
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
 *     npf.userAgent.Support.getInstance().mq('(min-width:0)')
 *
 * @example
 * npf.userAgent.Support.getInstance().mq('only screen and (max-width:768)')
 *
 * @param {string} mq
 * @return {boolean}
 */
npf.userAgent.Support.prototype.mq = function(mq) {
  /** @type {function(string):MediaQueryList} */
  var matchMedia = goog.global.matchMedia ||
    /** @type {function(string):MediaQueryList} */ (
      goog.global['msMatchMedia']);

  if (matchMedia) {
    return matchMedia(mq).matches;
  }

  /** @type {boolean} */
  var bool;
  /** @type {string} */
  var cssText = '@media ' + mq + ' { #' + npf.userAgent.Support.MOD +
    ' { position: absolute; } }';

  this.testStyles_(cssText, function(element) {
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
 * @param {string} mq
 * @return {boolean}
 */
npf.userAgent.support.mq = function(mq) {
  return npf.userAgent.Support.getInstance().mq(mq);
};

/**
 * Returns the prefixed or nonprefixed property name variant of your input
 * npf.userAgent.Support.getInstance().prefixed('boxSizing') // 'MozBoxSizing'
 *
 * Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
 * Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
 *
 *   str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
 *
 * If you're trying to ascertain which transition end event to bind to, you might do something like...
 *
 *   var transEndEventNames = {
 *     'WebkitTransition' : 'webkitTransitionEnd',
 *     'MozTransition'    : 'transitionend',
 *     'OTransition'      : 'oTransitionEnd',
 *     'msTransition'     : 'msTransitionEnd', // maybe?
 *     'transition'       : 'transitionEnd'
 *   },
 *   transEndEventName = transEndEventNames[ npf.userAgent.Support.getInstance().prefixed('transition') ];
 *
 * @param {string} prop
 * @return {string}
 */
npf.userAgent.Support.prototype.prefixed = function(prop) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
  var props = (prop + ' ' + npf.userAgent.Support.domPrefixes.join(ucProp + ' ')
    + ucProp).split(' ');

  return this.testPropsPrefixed_(props);
};

/**
 * @param {string} prop
 * @return {string}
 */
npf.userAgent.support.prefixed = function(prop) {
  return npf.userAgent.Support.getInstance().prefixed(prop);
};

/**
 * Investigates whether a given style property is recognized
 * Note that the property names must be provided in the camelCase variant.
 *
 * @example
 *   npf.userAgent.Support.getInstance().testProp('pointerEvents')
 *
 * @param {string} prop
 * @return {boolean}
 */
npf.userAgent.Support.prototype.testProp = function(prop) {
  return this.testProps_([prop]);
};

/**
 * @param {string} prop
 * @return {boolean}
 */
npf.userAgent.support.testProp = function(prop) {
  return npf.userAgent.Support.getInstance().testProp(prop);
};

/**
 * Investigates whether a given style property, or any of its vendor-prefixed
 * variants, is recognized
 * Note that the property names must be provided in the camelCase variant.
 *
 * @example
 *   npf.userAgent.Support.getInstance().testAllProps('boxSizing')
 *
 * @param {string} prop
 * @return {string}
 */
npf.userAgent.Support.prototype.testAllProps = function(prop) {
  /** @type {string} */
  var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
  /** @type {!Array.<string>} */
  var props = (prop + ' ' + npf.userAgent.Support.domPrefixes.join(ucProp + ' ')
    + ucProp).split(' ');

  return this.testPropsPrefixed_(props);
};

/**
 * @param {string} prop
 * @return {string}
 */
npf.userAgent.support.testAllProps = function(prop) {
  return npf.userAgent.Support.getInstance().testAllProps(prop);
};

/**
 * http://en.wikipedia.org/wiki/APNG
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.Support.prototype.getAnimatedPng = function(callback, opt_scope) {
  var propName = npf.userAgent.Support.Property_.ANIMATED_PNG;

  if (!this.getCanvas()) {
    callback.call(opt_scope, false);
  }

  if (goog.isDef(this.checks_[propName])) {
    callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
  } else {
    var image = new Image();
    image.onload = goog.bind(function () {
      var canvasElement = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        canvasElement.getContext('2d'));
      ctx.drawImage(image, 0, 0);

      this.checks_[propName] = 0 === ctx.getImageData(0, 0, 1, 1).data[3];

      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAA' +
      'AfFcSJAAAACGFjVEwAAAABAAAAAcMq2TYAAAANSURBVAiZY2BgYPgPAAEEAQB9ssjfAAAA' +
      'GmZjVEwAAAAAAAAAAQAAAAEAAAAAAAAAAAD6A+gBAbNU+2sAAAARZmRBVAAAAAEImWNgYG' +
      'BgAAAABQAB6MzFdgAAAABJRU5ErkJggg==';
  }
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.support.getAnimatedPng = function(callback, opt_scope) {
  return npf.userAgent.Support.getInstance().getAnimatedPng(
    callback, opt_scope);
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getApplicationCache = function() {
  return !!goog.global['applicationCache'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getApplicationCache = function() {
  return npf.userAgent.Support.getInstance().getApplicationCache();
};

/**
 * Mozilla Audio Data API
 * https://wiki.mozilla.org/Audio_Data_API
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getAudioData = function() {
  return !!goog.global['Audio'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getAudioData = function() {
  return npf.userAgent.Support.getInstance().getAudioData();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getAudioOgg = function() {
  if (this.getAudio()) {
    var features = /** @type {npf.userAgent.Support.AudioFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.AUDIO]);

    if (features) {
      return features.ogg;
    }
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getAudioOgg = function() {
  return npf.userAgent.Support.getInstance().getAudioOgg();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getAudioMp3 = function() {
  if (this.getAudio()) {
    var features = /** @type {npf.userAgent.Support.AudioFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.AUDIO]);

    if (features) {
      return features.mp3;
    }
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getAudioMp3 = function() {
  return npf.userAgent.Support.getInstance().getAudioMp3();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getAudioWav = function() {
  if (this.getAudio()) {
    var features = /** @type {npf.userAgent.Support.AudioFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.AUDIO]);

    if (features) {
      return features.wav;
    }
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getAudioWav = function() {
  return npf.userAgent.Support.getInstance().getAudioWav();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getAudioM4a = function() {
  if (this.getAudio()) {
    var features = /** @type {npf.userAgent.Support.AudioFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.AUDIO]);

    if (features) {
      return features.m4a;
    }
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getAudioM4a = function() {
  return npf.userAgent.Support.getInstance().getAudioM4a();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getAudio = function() {
  if (!goog.isDef(this.checks_[npf.userAgent.Support.Property_.AUDIO])) {
    var elem = /** @type {!HTMLAudioElement} */ (
      goog.dom.createElement('audio'));
    /** @type {npf.userAgent.Support.AudioFeature?} */
    var types = null;

    try {
      if (elem.canPlayType) {
        // Mimetypes accepted:
        //   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
        //   http://bit.ly/iphoneoscodecs
        types = {
          m4a: elem.canPlayType('audio/x-m4a;') ||
            elem.canPlayType('audio/aac;').replace(/^no$/, ''),
          mp3: elem.canPlayType('audio/mpeg;').replace(/^no$/, ''),
          ogg: elem.canPlayType('audio/ogg; codecs="vorbis"').
            replace(/^no$/, ''),
          wav: elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/, '')
        };
      }
    } catch(e) { }

    this.checks_[npf.userAgent.Support.Property_.AUDIO] = types;
  }

  return !!this.checks_[npf.userAgent.Support.Property_.AUDIO];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getAudio = function() {
  return npf.userAgent.Support.getInstance().getAudio();
};

/**
 * https://developer.mozilla.org/en/CSS/background-position
 * http://www.w3.org/TR/css3-background/#background-position
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBackgroundPosition = function() {
  var propName = npf.userAgent.Support.Property_.BACKGROUND_POSITION;

  if (!goog.isDef(this.checks_[propName])) {
    var style = goog.dom.createElement(goog.dom.TagName.A).style;
    var val = "right 10px bottom 10px";
    style.cssText = "background-position:" + val + ";";

    this.checks_[propName] = style['backgroundPosition'] === val;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBackgroundPosition = function() {
  return npf.userAgent.Support.getInstance().getBackgroundPosition();
};

/**
 * developer.mozilla.org/en/CSS/background-repeat
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBackgroundRepeatRound = function() {
  var propName = npf.userAgent.Support.Property_.BACKGROUND_REPEAT_ROUND;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var supported;
    var style = '#' + npf.userAgent.Support.MOD +
      ' { background-repeat: round; }';

    this.testStyles_(style, function(elem, rule) {
      /** @type {!Window} */
      var win = goog.dom.getWindow();
      /** @type {string|undefined} */
      var value = win.getComputedStyle ?
        win.getComputedStyle(elem, null).getPropertyValue('background') :
        /** @type {string|undefined} */ (elem['currentStyle']['background']);
      supported = 'round' == value;
    });
    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBackgroundRepeatRound = function() {
  return npf.userAgent.Support.getInstance().getBackgroundRepeatRound();
};

/**
 * developer.mozilla.org/en/CSS/background-repeat
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBackgroundRepeatSpace = function() {
  var propName = npf.userAgent.Support.Property_.BACKGROUND_REPEAT_SPACE;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var supported;
    var style = '#' + npf.userAgent.Support.MOD +
      ' { background-repeat: space; }';

    this.testStyles_(style, function(elem, rule) {
      /** @type {!Window} */
      var win = goog.dom.getWindow();
      /** @type {string|undefined} */
      var value = win.getComputedStyle ?
        win.getComputedStyle(elem, null).getPropertyValue('background') :
        /** @type {string|undefined} */ (elem['currentStyle']['background']);

      supported = 'space' == value;
    });
    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBackgroundRepeatSpace = function() {
  return npf.userAgent.Support.getInstance().getBackgroundRepeatSpace();
};

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
 */
npf.userAgent.Support.prototype.getBackgroundSize = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.BACKGROUND_SIZE, 'backgroundSize');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBackgroundSize = function() {
  return npf.userAgent.Support.getInstance().getBackgroundSize();
};

/**
 * developer.mozilla.org/en/CSS/background-size
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBackgroundSizeCover = function() {
  var propName = npf.userAgent.Support.Property_.BACKGROUND_SIZE_COVER;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var supported;
    var style = '#' + npf.userAgent.Support.MOD + '{background-size:cover}';

    this.testStyles_(style, function(elem) {
      /** @type {!Window} */
      var win = goog.dom.getWindow();
      /** @type {Object} */
      var style = win.getComputedStyle ? win.getComputedStyle(elem, null) :
        /** @type {Object} */ (elem['currentStyle']);

      supported = 'cover' == style['backgroundSize'];
    });

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBackgroundSizeCover = function() {
  return npf.userAgent.Support.getInstance().getBackgroundSizeCover();
};

/**
 * Battery API
 * https://developer.mozilla.org/en/DOM/window.navigator.mozBattery
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBattery = function() {
  var propName = npf.userAgent.Support.Property_.BATTERY;

  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] = !!this.testDomProps_(
      'battery', goog.global.navigator);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBattery = function() {
  return npf.userAgent.Support.getInstance().getBattery();
};

/**
 * Blob constructor
 * http://dev.w3.org/2006/webapi/FileAPI/#constructorBlob
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBlobConstructor = function() {
  var propName = npf.userAgent.Support.Property_.BLOB_CONSTRUCTOR;

  if (!goog.isDef(this.checks_[propName])) {
    var supported = false;

    try {
      supported = !!(new goog.global.Blob());
    } catch (e) { }

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBlobConstructor = function() {
  return npf.userAgent.Support.getInstance().getBlobConstructor();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBorderImage = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.BORDER_IMAGE, 'borderImage');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBorderImage = function() {
  return npf.userAgent.Support.getInstance().getBorderImage();
};

/**
 * Super comprehensive table about all the unique implementations of
 * border-radius:
 *   http://muddledramblings.com/table-of-css3-border-radius-compliance
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBorderRadius = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.BORDER_RADIUS, 'borderRadius');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBorderRadius = function() {
  return npf.userAgent.Support.getInstance().getBorderRadius();
};

/**
 * WebOS unfortunately false positives on this test.
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBoxShadow = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.BOX_SHADOW, 'boxShadow');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBoxShadow = function() {
  return npf.userAgent.Support.getInstance().getBoxShadow();
};

/**
 * developer.mozilla.org/en/CSS/box-sizing
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getBoxSizing = function() {
  var propName = npf.userAgent.Support.Property_.CANVAS;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    this.checks_[propName] = this.testPropsAll_('boxSizing') && (
      !goog.isDef(doc['documentMode']) || 7 < doc['documentMode']
    );
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getBoxSizing = function() {
  return npf.userAgent.Support.getInstance().getBoxSizing();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCanvas = function() {
  var propName = npf.userAgent.Support.Property_.CANVAS;

  if (!goog.isDef(this.checks_[propName])) {
    var elem = /** @type {!HTMLCanvasElement} */ (
      goog.dom.createElement(goog.dom.TagName.CANVAS));
    this.checks_[propName] = !!(elem.getContext && elem.getContext('2d'));
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCanvas = function() {
  return npf.userAgent.Support.getInstance().getCanvas();
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.Support.prototype.getCanvasToJpeg = function(callback,
    opt_scope) {
  this.canvasToDataUrl_(
    npf.userAgent.Support.Property_.CANVAS_TO_JPEG, callback, opt_scope);
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.support.getCanvasToJpeg = function(callback, opt_scope) {
  return npf.userAgent.Support.getInstance().getCanvasToJpeg(
    callback, opt_scope);
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.Support.prototype.getCanvasToWebp = function(callback,
    opt_scope) {
  this.canvasToDataUrl_(
    npf.userAgent.Support.Property_.CANVAS_TO_WEBP, callback, opt_scope);
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.support.getCanvasToWebp = function(callback, opt_scope) {
  return npf.userAgent.Support.getInstance().getCanvasToWebp(
    callback, opt_scope);
};

/**
 * canvas.toDataURL type support
 * http://www.w3.org/TR/html5/the-canvas-element.html#dom-canvas-todataurl
 * @param {npf.userAgent.Support.Property_} propName
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 * @private
 */
npf.userAgent.Support.prototype.canvasToDataUrl_ = function(propName, callback,
    opt_scope) {
  var Property = npf.userAgent.Support.Property_;

  if (goog.isDef(this.checks_[propName])) {
    callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
  } else if (!this.getCanvas()) {
    this.checks_[Property.CANVAS_TO_JPEG] = false;
    this.checks_[Property.CANVAS_TO_WEBP] = false;
    callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
  } else {
    var image = new Image();
    image.onload = goog.bind(function() {
      var canvas = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        canvas.getContext('2d'));
      ctx.drawImage(image, 0, 0);

      this.checks_[Property.CANVAS_TO_JPEG] =
        canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
      this.checks_[Property.CANVAS_TO_WEBP] =
        canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAA' +
      'AfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
  }
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCanvasText = function() {
  var propName = npf.userAgent.Support.Property_.CANVAS_TEXT;

  if (!goog.isDef(this.checks_[propName])) {
    var support = false;

    if (this.getCanvas()) {
      var element = /** @type {!HTMLCanvasElement} */ (
        goog.dom.createElement(goog.dom.TagName.CANVAS));
      var ctx = /** @type {CanvasRenderingContext2D} */ (
        element.getContext('2d'));
      support = goog.isFunction(ctx.fillText);
    }

    this.checks_[propName] = support;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCanvasText = function() {
  return npf.userAgent.Support.getInstance().getCanvasText();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssAnimations = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.CSS_ANIMATIONS, 'animationName');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssAnimations = function() {
  return npf.userAgent.Support.getInstance().getCssAnimations();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssColumns = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.CSS_COLUMNS, 'columnCount');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssColumns = function() {
  return npf.userAgent.Support.getInstance().getCssColumns();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssGradients = function() {
  var propName = npf.userAgent.Support.Property_.CSS_GRADIENTS;

  if (!goog.isDef(this.checks_[propName])) {
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

    this.setCss_((str1 + '-webkit- '.split(' ').join(str2 + str1) +
      npf.userAgent.Support.prefixes.join(str3 + str1)).slice(0, -str1.length));

    this.checks_[propName] = this.contains_(
      this.mStyle_.backgroundImage, 'gradient');
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssGradients = function() {
  return npf.userAgent.Support.getInstance().getCssGradients();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssReflections = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.CSS_REFLECTIONS, 'boxReflect');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssReflections = function() {
  return npf.userAgent.Support.getInstance().getCssReflections();
};

/**
 * Stylable scrollbars detection.
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssRemUnit = function() {
  var propName = npf.userAgent.Support.Property_.CSS_REM_UNIT;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Element} */
    var div = goog.dom.createElement(goog.dom.TagName.DIV);

    try {
      div.style['fontSize'] = '3rem';
    } catch(er){}

    this.checks_[propName] = /rem/.test(div.style['fontSize']);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssRemUnit = function() {
  return npf.userAgent.Support.getInstance().getCssRemUnit();
};

/**
 * Stylable scrollbars detection.
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssScrollBar = function() {
  var propName = npf.userAgent.Support.Property_.CSS_SCROLL_BAR;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var supported;
    var styles = '#' + npf.userAgent.Support.MOD +
      '{overflow: scroll; width: 40px }#' +
      npf.userAgent.Support.prefixes
        .join('scrollbar{width:0px} #' + npf.userAgent.Support.MOD + '::')
        .split('#')
        .slice(1)
        .join('#') + "scrollbar{width:0px}";

    this.testStyles_(styles, function(node) {
      supported = 'scrollWidth' in node && 40 == node.scrollWidth;
    });

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssScrollBar = function() {
  return npf.userAgent.Support.getInstance().getCssScrollBar();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssTransforms = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.CSS_TRANSFORMS, 'transform');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssTransforms = function() {
  return npf.userAgent.Support.getInstance().getCssTransforms();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssTransforms3d = function() {
  var propName = npf.userAgent.Support.Property_.CSS_TRANSFORMS_3D;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var isPropertySupported = !!this.testPropsAll_('perspective');
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

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
        npf.userAgent.Support.MOD + '{left:9px;position:absolute;height:3px;}}';

      this.testStyles_(style, function(node, rule) {
        // IE8 will bork if you create a custom build that excludes both
        // fontface and generatedcontent tests.
        // So we check for cssRules and that there is a rule available
        // More here: https://github.com/Modernizr/Modernizr/issues/288 &
        // https://github.com/Modernizr/Modernizr/issues/293
        isPropertySupported = node.offsetLeft === 9 && node.offsetHeight === 3;
      });
    }

    this.checks_[propName] = isPropertySupported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssTransforms3d = function() {
  return npf.userAgent.Support.getInstance().getCssTransforms3d();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCssTransitions = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.CSS_TRANSITIONS, 'transition');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCssTransitions = function() {
  return npf.userAgent.Support.getInstance().getCssTransitions();
};

/**
 * contentEditable
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#contenteditable
 * This is known to false positive in some mobile browsers
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getContentEditable = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  return 'contentEditable' in doc.documentElement;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getContentEditable = function() {
  return npf.userAgent.Support.getInstance().getContentEditable();
};

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
 */
npf.userAgent.Support.prototype.getContentSecurityPolicy = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  return 'SecurityPolicy' in doc;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getContentSecurityPolicy = function() {
  return npf.userAgent.Support.getInstance().getContentSecurityPolicy();
};

/**
 * http://www.w3.org/TR/html5/interactive-elements.html#context-menus
 * Demo at http://thewebrocks.com/demos/context-menu/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getContextMenu = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  return 'contextMenu' in doc.documentElement &&
    'HTMLMenuItemElement' in goog.global;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getContextMenu = function() {
  return npf.userAgent.Support.getInstance().getContextMenu();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getCors = function() {
  return !!(goog.global.XMLHttpRequest &&
    'withCredentials' in new XMLHttpRequest());
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getCors = function() {
  return npf.userAgent.Support.getInstance().getCors();
};

/**
 * https://github.com/Modernizr/Modernizr/issues/14
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.Support.prototype.getDataUri = function(callback, opt_scope) {
  var propName = npf.userAgent.Support.Property_.DATA_URI;

  if (goog.isDef(this.checks_[propName])) {
    callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
  } else {
    var datauri = new Image();
    datauri.onerror = goog.bind(function() {
      this.checks_[propName] = false;
      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    datauri.onload = goog.bind(function() {
      this.checks_[propName] = datauri.width == 1 && datauri.height == 1;
      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    datauri.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQAB' +
      'AAACAUwAOw==';
  }
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.support.getDataUri = function(callback, opt_scope) {
  return npf.userAgent.Support.getInstance().getDataUri(callback, opt_scope);
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getDragAndDrop = function() {
  var propName = npf.userAgent.Support.Property_.DRAG_AND_DROP;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {Element} */
    var element = goog.dom.createElement(goog.dom.TagName.DIV);

    this.checks_[propName] = !!(('draggable' in element) ||
      ('ondragstart' in element && 'ondrop' in element));
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getDragAndDrop = function() {
  return npf.userAgent.Support.getInstance().getDragAndDrop();
};

/**
 * a[download] attribute
 * When used on an <a>, this attribute signifies that the resource it
 * points to should be downloaded by the browser rather than navigating to it.
 * http://developers.whatwg.org/links.html#downloading-resources
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getDownloadAttribute = function() {
  return 'download' in goog.dom.createElement(goog.dom.TagName.A);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getDownloadAttribute = function() {
  return npf.userAgent.Support.getInstance().getDownloadAttribute();
};

/**
 * Server sent events aka eventsource
 * dev.w3.org/html5/eventsource/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getEventSource = function() {
  return !!goog.global['EventSource'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getEventSource = function() {
  return npf.userAgent.Support.getInstance().getEventSource();
};

/**
 * EXIF Orientation test
 *
 * iOS looks at the EXIF Orientation flag in jpgs and rotates the image
 * accordingly. Looks like most desktop browsers just ignore this data.
 *
 * description: www.impulseadventure.com/photo/exif-orientation.html
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.Support.prototype.getExifOrientation = function(callback,
    opt_scope) {
  var propName = npf.userAgent.Support.Property_.EXIF_ORIENTATION;

  if (goog.isDef(this.checks_[propName])) {
    callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
  } else {
    var image = new Image();
    image.onerror = goog.bind(function() {
      this.checks_[propName] = false;
      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    image.onload = goog.bind(function() {
      this.checks_[propName] = 2 !== image.width;
      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    image.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QAiRXhpZ' +
      'gAASUkqAAgAAAABABIBAwABAAAABgASAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQE' +
      'BAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBA' +
      'QEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE' +
      'BAQEBAQEBAQH/wAARCAABAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECA' +
      'wQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaE' +
      'II0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZ' +
      'WZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMX' +
      'Gx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAA' +
      'AAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRM' +
      'iMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVV' +
      'ldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba' +
      '3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAP' +
      'wD+/iiiigD/2Q==';
  }
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.support.getExifOrientation = function(callback, opt_scope) {
  return npf.userAgent.Support.getInstance().getExifOrientation(
    callback, opt_scope);
};

/**
 * Detects whether input type="file" is available on the platform
 * E.g. iOS < 6 and some android version don't support this
 *
 * It's useful if you want to hide the upload feature of your app on devices
 * that don't support it (iphone, ipad, etc).
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getFileInput = function() {
  var propName = npf.userAgent.Support.Property_.FILE_INPUT;

  if (!goog.isDef(this.checks_[propName])) {
    var inputElement = /** @type {HTMLInputElement} */ (
      goog.dom.createDom(goog.dom.TagName.INPUT, {
        'type': 'file'
      })
    );
    this.checks_[propName] = !inputElement.disabled;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getFileInput = function() {
  return npf.userAgent.Support.getInstance().getFileInput();
};

/**
 * FileSystem API
 * dev.w3.org/2009/dap/file-system/file-dir-sys.html
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getFileSystem = function() {
  var propName = npf.userAgent.Support.Property_.FILE_SYSTEM;

  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] =
      !!this.testDomProps_('requestFileSystem', goog.global);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getFileSystem = function() {
  return npf.userAgent.Support.getInstance().getFileSystem();
};

/**
 * The *new* flexbox
 * dev.w3.org/csswg/css3-flexbox
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getFlexBox = function() {
  return this.isCssPropertySupported_(
    npf.userAgent.Support.Property_.FLEX_BOX, 'flexWrap');
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getFlexBox = function() {
  return npf.userAgent.Support.getInstance().getFlexBox();
};

/**
 * font-face detection routine by Diego Perini
 * http://javascript.nwbox.com/CSSSupport/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getFontFace = function() {
  var propName = npf.userAgent.Support.Property_.FONT_FACE;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var isPropertySupported;
    /** @type {string} */
    var style = '@font-face {font-family:"font";src:url("https://")}';

    this.testStyles_(style, function(element, rule) {
      var style = /** @type {HTMLStyleElement} */ (
        goog.dom.getElement('s' + npf.userAgent.Support.MOD));
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

      isPropertySupported =
        /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
    });

    this.checks_[propName] = isPropertySupported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getFontFace = function() {
  return npf.userAgent.Support.getInstance().getFontFace();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getFullScreen = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  for (var i = 0; i < npf.userAgent.Support.domPrefixes.length; i++) {
    if (doc[npf.userAgent.Support.domPrefixes[i] + 'CancelFullScreen']) {
      return true;
    }
  }

  return !!doc['cancelFullScreen'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getFullScreen = function() {
  return npf.userAgent.Support.getInstance().getFullScreen();
};

/**
 * CSS generated content detection
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getGeneratedContent = function() {
  var propName = npf.userAgent.Support.Property_.GENERATED_CONTENT;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var isPropertySupported;
    /** @type {string} */
    var style = [
      '#', npf.userAgent.Support.MOD, '{font:0/0 a}#',
      npf.userAgent.Support.MOD, ':after{content:"',
      npf.userAgent.Support.SMILE, '";visibility:hidden;font:3px/1 a}'
    ].join('');

    this.testStyles_(style, function(node, rule) {
      isPropertySupported = node.offsetHeight >= 3;
    });

    this.checks_[propName] = isPropertySupported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getGeneratedContent = function() {
  return npf.userAgent.Support.getInstance().getGeneratedContent();
};

/**
 * Tests for the new Geolocation API specification.
 *   This test is a standards compliant-only test; for more complete
 *   testing, including a Google Gears fallback, please see:
 *   http://code.google.com/p/geo-location-javascript/
 * or view a fallback solution using google's geo API:
 *   http://gist.github.com/366184
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getGeolocation = function() {
  return 'geolocation' in navigator;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getGeolocation = function() {
  return npf.userAgent.Support.getInstance().getGeolocation();
};

/**
 * documentMode logic from YUI to filter out IE8 Compat Mode which false
 * positives.
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getHashChange = function() {
  var propName = npf.userAgent.Support.Property_.HASH_CHANGE;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    this.checks_[propName] =
      this.hasEvent(goog.events.EventType.HASHCHANGE, goog.global) &&
      (!goog.isDef(doc['documentMode']) || 7 < doc['documentMode']);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getHashChange = function() {
  return npf.userAgent.Support.getInstance().getHashChange();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getHistory = function() {
  return !!(goog.global.history && goog.global.history.pushState);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getHistory = function() {
  return npf.userAgent.Support.getInstance().getHistory();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getHsla = function() {
  var propName = npf.userAgent.Support.Property_.HSLA;

  if (!goog.isDef(this.checks_[propName])) {
    // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
    // except IE9 who retains it as hsla
    this.setCss_('background-color:hsla(120,40%,100%,.5)');

    this.checks_[propName] =
      this.contains_(this.mStyle_.backgroundColor, 'rgba') ||
      this.contains_(this.mStyle_.backgroundColor, 'hsla');
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getHsla = function() {
  return npf.userAgent.Support.getInstance().getHsla();
};

/**
 * Vendors had inconsistent prefixing with the experimental Indexed DB:
 *   - Webkit's implementation is accessible through webkitIndexedDB
 *   - Firefox shipped moz_indexedDB before FF4b9, but since then has been
 *     mozIndexedDB
 * For speed, we don't test the legacy (and beta-only) indexedDB
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getIndexedDb = function() {
  var propName = npf.userAgent.Support.Property_.INDEXED_DB;

  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] = !!this.testDomProps_('indexedDB', goog.global);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getIndexedDb = function() {
  return npf.userAgent.Support.getInstance().getIndexedDb();
};

/**
 * specifically for SVG inline in HTML, not within XHTML
 * test page: paulirish.com/demo/inline-svg
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getInlineSvg = function() {
  var propName = npf.userAgent.Support.Property_.INLINE_SVG;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {Element} */
    var div = goog.dom.createElement(goog.dom.TagName.DIV);
    div.innerHTML = '<svg/>';

    this.checks_[propName] = (div.firstChild && div.firstChild.namespaceURI) ==
      npf.svg.Ns.SVG;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getInlineSvg = function() {
  return npf.userAgent.Support.getInstance().getInlineSvg();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getInput = function() {
  var propName = npf.userAgent.Support.Property_.INPUT;

  if (!goog.isDef(this.checks_[propName])) {
    this.webForms_();
  }

  return !!this.checks_[propName];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getInput = function() {
  return npf.userAgent.Support.getInstance().getInput();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getInputTypes = function() {
  var propName = npf.userAgent.Support.Property_.INPUT_TYPES;

  if (!goog.isDef(this.checks_[propName])) {
    this.webForms_();
  }

  return !!this.checks_[propName];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getInputTypes = function() {
  return npf.userAgent.Support.getInstance().getInputTypes();
};

/**
 * input features and input types go directly onto the ret object, bypassing
 * the tests loop.
 * Hold this guy to execute in a moment.
 * @private
 */
npf.userAgent.Support.prototype.webForms_ = function() {
  var inputElement = /** @type {!HTMLInputElement} */ (
    goog.dom.createElement(goog.dom.TagName.INPUT));

  // Run through HTML5's new input attributes to see if the UA understands any.
  // We're using f which is the <input> element created early on
  // Mike Taylr has created a comprehensive resource for testing these attributes
  //   when applied to all input types:
  //   http://miketaylr.com/code/input-type-attr.html
  // spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

  // Only input placeholder is tested while textarea's placeholder is not.
  // Currently Safari 4 and Opera 11 have support only for the input placeholder
  // Both tests are available in feature-detects/forms-placeholder.js
  this.checks_[npf.userAgent.Support.Property_.INPUT] =
    this.webFormsInput_(inputElement);

  // Run through HTML5's new input types to see if the UA understands any.
  //   This is put behind the tests runloop because it doesn't return a
  //   true/false like all the other tests; instead, it returns an object
  //   containing each input type with its corresponding true/false value

  // Big thanks to @miketaylr for the html5 forms expertise. http://miketaylr.com/
  this.checks_[npf.userAgent.Support.Property_.INPUT_TYPES] =
    this.webFormsInputTypes_(inputElement);
};

/**
 * @param {!HTMLInputElement} inputElement
 * @return {!Object.<boolean>}
 * @private
 */
npf.userAgent.Support.prototype.webFormsInput_ = function(inputElement) {
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
npf.userAgent.Support.prototype.webFormsInputTypes_ = function(inputElement) {
  /** @type {!Array.<string>} */
  var props = ['search', 'tel', 'url', 'email', 'datetime', 'date', 'month',
    'week', 'time', 'datetime-local', 'number', 'range', 'color'];
  /** @type {!Object.<boolean>} */
  var inputs = {};

  for (var i = 0, len = props.length; i < len; i++) {
    /** @type {string} */
    var inputElemType = props[i];
    inputElement.setAttribute('type', inputElemType);

    /** @type {boolean} */
    var bool = inputElement.type !== 'text';

    // We first check to see if the type we give it sticks..
    // If the type does, we feed it a textual value, which shouldn't be valid.
    // If the value doesn't stick, we know there's input sanitization which
    // infers a custom UI
    if (bool) {
      inputElement.value = npf.userAgent.Support.SMILE;
      inputElement.style.cssText = 'position:absolute;visibility:hidden;';

      if (
        /^range$/.test(inputElemType) &&
        goog.isDef(inputElement.style['WebkitAppearance'])
      ) {
        /** @type {!Document} */
        var doc = goog.dom.getDomHelper().getDocument();
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
        bool = inputElement.value != npf.userAgent.Support.SMILE;
      }
    }

    inputs[props[i]] = !!bool;
  }

  return inputs;
};

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
 */
npf.userAgent.Support.prototype.getLocalStorage = function() {
  var propName = npf.userAgent.Support.Property_.LOCAL_STORAGE;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var supported = false;

    try {
      goog.global['localStorage']['setItem'](npf.userAgent.Support.MOD,
        npf.userAgent.Support.MOD);
      goog.global['localStorage']['removeItem'](npf.userAgent.Support.MOD);

      supported = true;
    } catch(e) { }

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getLocalStorage = function() {
  return npf.userAgent.Support.getInstance().getLocalStorage();
};

/**
 * Low Battery Level
 * Enable a developer to remove CPU intensive CSS/JS when battery is low
 * developer.mozilla.org/en/DOM/window.navigator.mozBattery
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getLowBattery = function() {
  var propName = npf.userAgent.Support.Property_.LOW_BATTERY;

  if (!goog.isDef(this.checks_[propName])) {
    var minLevel = 0.20;
    var battery = this.testDomProps_('battery', navigator);

    this.checks_[propName] = !!(battery && !battery['charging'] &&
      battery['level'] <= minLevel);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getLowBattery = function() {
  return npf.userAgent.Support.getInstance().getLowBattery();
};

/**
 * MathML
 * http://www.w3.org/Math/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getMath = function() {
  var propName = npf.userAgent.Support.Property_.MATH;

  if (!goog.isDef(this.checks_[propName])) {
    var supported = false;
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

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

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getMath = function() {
  return npf.userAgent.Support.getInstance().getMath();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getMultipleBackgrounds = function() {
  var propName = npf.userAgent.Support.Property_.MULTIPLE_BACKGROUNDS;

  if (!goog.isDef(this.checks_[propName])) {
    // Setting multiple images AND a color on the background shorthand property
    //  and then querying the style.background property value for the number of
    //  occurrences of "url(" is a reliable method for detecting ACTUAL support
    // for this!

    this.setCss_('background:url(https://),url(https://),red url(https://)');

    // If the UA supports multiple backgrounds, there should be three
    // occurrences of the string "url(" in the return value
    // for elemStyle.background
    this.checks_[propName] = /(url\s*\(.*?){3}/.test(this.mStyle_.background);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getMultipleBackgrounds = function() {
  return npf.userAgent.Support.getInstance().getMultipleBackgrounds();
};

/**
 * window.webkitNotifications is only used by Chrome
 * http://www.html5rocks.com/en/tutorials/notifications/quick/
 *
 * window.Notification only exist in the draft specs
 * http://dev.w3.org/2006/webapi/WebNotifications/publish/Notifications.html#idl-if-Notification
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getNotification = function() {
  var propName = npf.userAgent.Support.Property_.NOTIFICATION;

  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] = !!this.testDomProps_('Notifications', goog.global);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getNotification = function() {
  return npf.userAgent.Support.getInstance().getNotification();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getOpacity = function() {
  var propName = npf.userAgent.Support.Property_.OPACITY;

  if (!goog.isDef(this.checks_[propName])) {
    // Browsers that actually have CSS Opacity implemented have done so
    //  according to spec, which means their return values are within the
    //  range of [0.0,1.0] - including the leading zero.

    this.setCss_(npf.userAgent.Support.prefixes.join('opacity:.55;'));

    // The non-literal . in this regex is intentional:
    //   German Chrome returns this value as 0,55
    // https://github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
    this.checks_[propName] = /^0.55$/.test(this.mStyle_.opacity);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getOpacity = function() {
  return npf.userAgent.Support.getInstance().getOpacity();
};

/**
 * Navigation Timing (Performance)
 * https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/NavigationTiming/
 * http://www.html5rocks.com/en/tutorials/webperformance/basics/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getPerformance = function() {
  var propName = npf.userAgent.Support.Property_.PERFORMANCE;

  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] = !!this.testDomProps_('performance', goog.global);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getPerformance = function() {
  return npf.userAgent.Support.getInstance().getPerformance();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getPostMessage = function() {
  return !!goog.global['postMessage'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getPostMessage = function() {
  return npf.userAgent.Support.getInstance().getPostMessage();
};

/**
 * http://css-tricks.com/rgba-browser-support/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getRgba = function() {
  var propName = npf.userAgent.Support.Property_.RGBA;

  if (!goog.isDef(this.checks_[propName])) {
    this.setCss_('background-color:rgba(150,255,150,.5)');

    this.checks_[propName] = this.contains_(
      this.mStyle_.backgroundColor, 'rgba');
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getRgba = function() {
  return npf.userAgent.Support.getInstance().getRgba();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getScriptAsync = function() {
  return 'async' in goog.dom.createElement(goog.dom.TagName.SCRIPT);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getScriptAsync = function() {
  return npf.userAgent.Support.getInstance().getScriptAsync();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getScriptDefer = function() {
  return 'defer' in goog.dom.createElement(goog.dom.TagName.SCRIPT);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getScriptDefer = function() {
  return npf.userAgent.Support.getInstance().getScriptDefer();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getSessionStorage = function() {
  var propName = npf.userAgent.Support.Property_.SESSION_STORAGE;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {boolean} */
    var supported = false;

    try {
      goog.global['sessionStorage']['setItem'](npf.userAgent.Support.MOD,
        npf.userAgent.Support.MOD);
      goog.global['sessionStorage']['removeItem'](npf.userAgent.Support.MOD);

      supported = true;
    } catch(e) { }

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getSessionStorage = function() {
  return npf.userAgent.Support.getInstance().getSessionStorage();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getSmil = function() {
  var propName = npf.userAgent.Support.Property_.SMIL;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    this.checks_[propName] = !!doc.createElementNS &&
      /SVGAnimate/.test({}.toString.call(
        doc.createElementNS(npf.svg.Ns.SVG, 'animate')));
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getSmil = function() {
  return npf.userAgent.Support.getInstance().getSmil();
};

/**
 * Browser support test for <style scoped>
 * http://www.w3.org/TR/html5/the-style-element.html#attr-style-scoped
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getStyleScoped = function() {
  return 'scoped' in goog.dom.createElement(goog.dom.TagName.STYLE);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getStyleScoped = function() {
  return npf.userAgent.Support.getInstance().getStyleScoped();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getSvg = function() {
  var propName = npf.userAgent.Support.Property_.SVG;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    this.checks_[propName] = !!doc.createElementNS &&
      !!doc.createElementNS(npf.svg.Ns.SVG, 'svg')['createSVGRect'];
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getSvg = function() {
  return npf.userAgent.Support.getInstance().getSvg();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getSvgClipPaths = function() {
  var propName = npf.userAgent.Support.Property_.SVG_CLIP_PATHS;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();
    this.checks_[propName] = !!doc.createElementNS &&
      /SVGClipPath/.test({}.toString.call(
        doc.createElementNS(npf.svg.Ns.SVG, 'clipPath')));
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getSvgClipPaths = function() {
  return npf.userAgent.Support.getInstance().getSvgClipPaths();
};

/**
 * Detect support for svg filters - http://www.w3.org/TR/SVG11/filters.html.
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getSvgFilters = function() {
  var propName = npf.userAgent.Support.Property_.SVG_FILTERS;

  if (!goog.isDef(this.checks_[propName])) {
    var supported = false;

    try {
      var el = /** @type {Function|undefined} */ (goog.global['SVGFEColorMatrixElement']);
      supported = goog.isDef(el) && 2 == el['SVG_FECOLORMATRIX_TYPE_SATURATE'];
    } catch(e) {}

    this.checks_[propName] = supported;
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getSvgFilters = function() {
  return npf.userAgent.Support.getInstance().getSvgFilters();
};

/**
 * FF3.0 will false positive on this test
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getTextShadow = function() {
  var propName = npf.userAgent.Support.Property_.TEXT_SHADOW;

  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] =
      goog.dom.createElement(goog.dom.TagName.DIV).style.textShadow === '';
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getTextShadow = function() {
  return npf.userAgent.Support.getInstance().getTextShadow();
};

/**
 * For more info, see: http://modernizr.github.com/Modernizr/touch.html
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getTouch = function() {
  var propName = npf.userAgent.Support.Property_.TOUCH;

  if (!goog.isDef(this.checks_[propName])) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    if (
      ('ontouchstart' in goog.global) ||
      /** @type {*} */ (goog.global['DocumentTouch']) &&
      doc instanceof goog.global['DocumentTouch']
    ) {
      this.checks_[propName] = true;
    } else {
      /** @type {boolean} */
      var bool;
      /** @type {string} */
      var rule = [
        '@media (', npf.userAgent.Support.prefixes.join('touch-enabled),('),
        npf.userAgent.Support.MOD, '){#' + npf.userAgent.Support.MOD +
        '{top:9px;position:absolute}}'
      ].join('');
      this.testStyles_(rule, function(element, rule) {
        bool = 9 === element.offsetTop;
      });

      this.checks_[propName] = bool;
    }
  }

  return /** @type {boolean} */ (this.checks_[propName]);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getTouch = function() {
  return npf.userAgent.Support.getInstance().getTouch();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getVideoH264 = function() {
  if (this.getVideo()) {
    var feature = /** @type {npf.userAgent.Support.VideoFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.VIDEO]);

    return feature ? feature.h264 : '';
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getVideoH264 = function() {
  return npf.userAgent.Support.getInstance().getVideoH264();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getVideoOgg = function() {
  if (this.getVideo()) {
    var feature = /** @type {npf.userAgent.Support.VideoFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.VIDEO]);

    return feature ? feature.ogg : '';
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getVideoOgg = function() {
  return npf.userAgent.Support.getInstance().getVideoOgg();
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.Support.prototype.getVideoWebm = function() {
  if (this.getVideo()) {
    var feature = /** @type {npf.userAgent.Support.VideoFeature?} */ (
      this.checks_[npf.userAgent.Support.Property_.VIDEO]);

    return feature ? feature.webm : '';
  }

  return '';
};

/**
 * @return {string} 'probably', 'maybe' or empty string.
 */
npf.userAgent.support.getVideoWebm = function() {
  return npf.userAgent.Support.getInstance().getVideoWebm();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getVideo = function() {
  if (!goog.isDef(this.checks_[npf.userAgent.Support.Property_.VIDEO])) {
    var elem = /** @type {!HTMLVideoElement} */ (
      goog.dom.createElement('video'));
    /** @type {npf.userAgent.Support.VideoFeature?} */
    var types = null;

    // IE9 Running on Windows Server SKU can cause an exception to be thrown,
    // bug #224
    try {
      if (elem.canPlayType) {
        types = {
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

    this.checks_[npf.userAgent.Support.Property_.VIDEO] = types;
  }

  return !!this.checks_[npf.userAgent.Support.Property_.VIDEO];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getVideo = function() {
  return npf.userAgent.Support.getInstance().getVideo();
};

/**
 * Vibration API
 * http://www.w3.org/TR/vibration/
 * https://developer.mozilla.org/en/DOM/window.navigator.mozVibrate
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getVibrate = function() {
  return !!this.testDomProps_('vibrate', goog.global.navigator);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getVibrate = function() {
  return npf.userAgent.Support.getInstance().getVibrate();
};

/**
 * Web Audio API
 * https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getWebAudio = function() {
  return !!goog.global['webkitAudioContext'] || !!goog.global['AudioContext'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getWebAudio = function() {
  return npf.userAgent.Support.getInstance().getWebAudio();
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getWebGl = function() {
  // This WebGL test may false positive.
  // But really it's quite impossible to know whether webgl will succeed until
  // after you create the context. You might have hardware that can support
  // a 100x100 webgl canvas, but will not support a 1000x1000 webgl
  // canvas. So this feature inference is weak, but intentionally so.

  // It is known to false positive in FF4 with certain hardware and the iPad 2.
  return !!goog.global['WebGLRenderingContext'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getWebGl = function() {
  return npf.userAgent.Support.getInstance().getWebGl();
};

/**
 * Mozilla is targeting to land MozWebSocket for FF6
 * bugzil.la/659324
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getWebSocket = function() {
  return 'WebSocket' in goog.global || 'MozWebSocket' in goog.global;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getWebSocket = function() {
  return npf.userAgent.Support.getInstance().getWebSocket();
};

/**
 * binaryType is truthy if there is support.. returns "blob" in new-ish chrome.
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getWebSocketBinary = function() {
  return 'WebSocket' in goog.global &&
    !!(new WebSocket('ws://.'))['binaryType'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getWebSocketBinary = function() {
  return npf.userAgent.Support.getInstance().getWebSocketBinary();
};

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
 */
npf.userAgent.Support.prototype.getWebSqlDatabase = function() {
  return !!goog.global['openDatabase'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getWebSqlDatabase = function() {
  return npf.userAgent.Support.getInstance().getWebSqlDatabase();
};

/**
 * code.google.com/speed/webp/
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.Support.prototype.getWebp = function(callback, opt_scope) {
  var propName = npf.userAgent.Support.Property_.WEBP;

  if (goog.isDef(this.checks_[propName])) {
    callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
  } else {
    var image = new Image();
    image.onerror = goog.bind(function() {
      this.checks_[propName] = false;
      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    image.onload = goog.bind(function() {
      this.checks_[propName] = 1 == image.width;
      callback.call(opt_scope, /** @type {boolean} */ (this.checks_[propName]));
    }, this);
    image.src = 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBA' +
      'AEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';
  }
};

/**
 * @param {function(boolean)} callback
 * @param {Object=} opt_scope
 */
npf.userAgent.support.getWebp = function(callback, opt_scope) {
  return npf.userAgent.Support.getInstance().getWebp(callback, opt_scope);
};

/**
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getWebWorker = function() {
  return !!goog.global['Worker'];
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getWebWorker = function() {
  return npf.userAgent.Support.getInstance().getWebWorker();
};

/**
 * XML HTTP Request Level 2
 * www.w3.org/TR/XMLHttpRequest2/
 * @return {boolean}
 */
npf.userAgent.Support.prototype.getXhr2 = function() {
  return 'FormData' in goog.global;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.getXhr2 = function() {
  return npf.userAgent.Support.getInstance().getXhr2();
};

/**
 * @param {npf.userAgent.Support.Property_} propName
 * @param {string} cssName
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype.isCssPropertySupported_ = function(
    propName, cssName) {
  if (!goog.isDef(this.checks_[propName])) {
    this.checks_[propName] = this.testPropsAll_(cssName);
  }

  return /** @type {boolean} */ (this.checks_[propName]);
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
npf.userAgent.Support.prototype.testStyles_ = function(rule, callback,
    opt_nodes, opt_testNames) {
  /** @type {number} */
  var nodes = opt_nodes || 0;
  /** @type {string} */
  var docOverflow = '';
  var div = /** @type {!HTMLElement} */ (
    goog.dom.createElement(goog.dom.TagName.DIV));
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();
  var body = doc.body;
  var fakeBody = body || goog.dom.createElement(goog.dom.TagName.BODY);

  if (nodes) {
    while (nodes--) {
      /** @type {!Element} */
      var node = goog.dom.createElement(goog.dom.TagName.DIV);
      node.id = opt_testNames ? opt_testNames[nodes] :
        npf.userAgent.Support.MOD + (nodes + 1);
      goog.dom.appendChild(div, node);
    }
  }

  /** @type {string} */
  var style = [
    '&#173;','<style id="s', npf.userAgent.Support.MOD, '">', rule, '</style>'
  ].join('');
  div.id = npf.userAgent.Support.MOD;

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
npf.userAgent.Support.prototype.contains_ = function(str, substr) {
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
npf.userAgent.Support.prototype.testPropsAll_ = function(prop) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  var props = (prop + ' ' +
    npf.userAgent.Support.cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

  return this.testProps_(props);
};

/**
 * It is a generic CSS / DOM property test; if a browser supports
 *   a certain property, it won't return undefined for it.
 *   A supported CSS property returns empty string when its not yet set.
 * @param {Array.<string>} props
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype.testProps_ = function(props) {
  for (var i in props) {
    if (!this.contains_(props[i], '-') && goog.isDef(this.mStyle_[props[i]])) {
      return true;
    }
  }

  return false;
};

/**
 * @param {string} prop
 * @param {Object} obj
 * @param {Element=} opt_elem
 * @return {*}
 * @private
 */
npf.userAgent.Support.prototype.testDomProps_ = function(prop, obj, opt_elem) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  var props = (prop + ' ' +
    npf.userAgent.Support.cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

  for (var i in props) {
    /** @type {*} */
    var item = obj[props[i]];

    if (goog.isDef(item)) {
      if (goog.isNull(opt_elem)) {
        return props[i];
      }

      if (goog.isFunction(item)) {
        return goog.bind(item, opt_elem || obj);
      }

      return item;
    }
  }

  return false;
};

/**
 * It is a generic CSS / DOM property test; if a browser supports
 *   a certain property, it won't return undefined for it.
 *   A supported CSS property returns empty string when its not yet set.
 * @param {!Array.<string>} props
 * @return {string}
 * @private
 */
npf.userAgent.Support.prototype.testPropsPrefixed_ = function(props) {
  for (var i in props) {
    if (goog.isDef(this.mStyle_[props[i]])) {
      return props[i];
    }
  }

  return '';
};

/**
 * Detects support for a given event, with an optional element to test on
 *
 * @example
 *   npf.userAgent.Support.getInstance().hasEvent('gesturestart', elem)
 *
 * @param {string} eventName
 * @param {Element|Window=} opt_element
 * @return {boolean}
 */
npf.userAgent.Support.prototype.hasEvent = function(eventName, opt_element) {
  /** @type {Element|Window} */
  var element = opt_element ||
    goog.dom.createElement(npf.userAgent.Support.eventTagNames[eventName] ||
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
npf.userAgent.Support.prototype.setCss_ = function(str) {
  this.mStyle_.cssText = str;
};
