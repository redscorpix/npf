goog.provide('npf.userAgent.events');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.userAgent.utils');


/**
 * Detects support for CustomEvent.
 * @return {boolean}
 */
npf.userAgent.events.isCustomEventSupported = function() {
  return 'CustomEvent' in goog.global &&
    'function' === typeof goog.global['CustomEvent'];
};

/**
 * Tests for Device Motion Event support.
 * @return {boolean}
 */
npf.userAgent.events.isDeviceMotionSupported = function() {
  return 'DeviceMotionEvent' in goog.global;
};

/**
 * Tests for Device Orientation Event support.
 * @return {boolean}
 */
npf.userAgent.events.isDeviceOrientationSupported = function() {
  return 'DeviceOrientationEvent' in goog.global;
};

/**
 * Detects native support for addEventListener.
 * @return {boolean}
 */
npf.userAgent.events.isEventListenerSupported = function() {
  return 'addEventListener' in goog.global;
};

/**
 * @private {boolean?}
 */
npf.userAgent.events.hashChangeEvent_ = null;

/**
 * Detects support for the `hashchange` event, fired when the current location
 * fragment changes.
 * @return {boolean}
 */
npf.userAgent.events.isHashChangeEventSupported = function() {
  if (goog.isNull(npf.userAgent.events.hashChangeEvent_)) {
    npf.userAgent.events.hashChangeEvent_ = false;

    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    /** @type {!Window} */
    var win = domHelper.getWindow();

    if (false !== npf.userAgent.utils.hasEvent('hashchange', win)) {
      /** @type {!Document} */
      var doc = domHelper.getDocument();

      // documentMode logic from YUI to filter out IE8 Compat Mode
      //   which false positives.
      npf.userAgent.events.hashChangeEvent_ =
        !goog.isDef(doc.documentMode) || 7 < doc.documentMode;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.events.hashChangeEvent_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.events.inputEvent_ = null;

/**
 * Tests if the browser is able to detect the input event.
 * @return {boolean}
 */
npf.userAgent.events.isInputEventSupported = function() {
  if (goog.isNull(npf.userAgent.events.inputEvent_)) {
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    /** @type {!Document} */
    var doc = domHelper.getDocument();
    /** @type {Element} */
    var docElement = doc.documentElement;

    npf.userAgent.events.inputEvent_ =
      npf.userAgent.utils.hasEvent('oninput', docElement);

    if (!npf.userAgent.events.inputEvent_) {
      var input = /** @type {!HTMLInputElement} */ (
        domHelper.createElement(goog.dom.TagName.INPUT));
      input.setAttribute('oninput', 'return');

      npf.userAgent.events.inputEvent_ = 'function' == typeof input.oninput;

      if (!npf.userAgent.events.inputEvent_) {
        // IE doesn't support onInput, so we wrap up the non IE APIs
        // (createEvent, addEventListener) in a try catch, rather than test for
        // their trident equivalent.
        try {
          // Older Firefox didn't map oninput attribute to oninput property
          var testEvent = doc.createEvent('KeyboardEvent');
          /** @type {function(Event)} */
          var handler = function(e) {
            npf.userAgent.events.inputEvent_ = true;
            e.preventDefault();
            e.stopPropagation();
          };

          testEvent.initKeyEvent(
            'keypress', true, true, domHelper.getWindow(), false, false,
            false, false, 0, 'e'.charCodeAt(0));
          docElement.appendChild(input);
          input.addEventListener('input', handler, false);
          input.focus();
          input.dispatchEvent(testEvent);
          input.removeEventListener('input', handler, false);
          docElement.removeChild(input);
        } catch (e) { }
      }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.events.inputEvent_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.events.pointerEvent_ = null;

/**
 * Detects support for the DOM Pointer Events API, which provides a unified
 * event interface for pointing input devices, as implemented in IE10+.
 * @return {boolean}
 */
npf.userAgent.events.isPointerEventSupported = function() {
  if (goog.isNull(npf.userAgent.events.pointerEvent_)) {
    // Cannot use `npf.userAgent.utils.prefixed()` for events,
    // so test each prefix.

    /** @type {number} */
    var i = npf.userAgent.utils.DOM_PREFIXES.length;
    /** @type {boolean} */
    var bool = npf.userAgent.utils.hasEvent('pointerdown');

    while (!bool && i--) {
      bool = npf.userAgent.utils.hasEvent(
        npf.userAgent.utils.DOM_PREFIXES[i] + 'pointerdown');
    }

    npf.userAgent.events.pointerEvent_ = bool;
  }

  return /** @type {boolean} */ (npf.userAgent.events.pointerEvent_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.events.searchEvent_ = null;

/**
 * There is a custom `search` event implemented in webkit browsers when
 * using an `input[search]` element.
 * @return {boolean}
 */
npf.userAgent.events.isSearchEventSupported = function() {
  if (goog.isNull(npf.userAgent.events.searchEvent_)) {
    npf.userAgent.events.searchEvent_ =
      npf.userAgent.utils.hasEvent('search');
  }

  return /** @type {boolean} */ (npf.userAgent.events.searchEvent_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.events.touchEvent_ = null;

/**
 * Indicates if the browser supports the W3C Touch Events API.
 *
 * This *does not* necessarily reflect a touchscreen device:
 * - Older touchscreen devices only emulate mouse events.
 * - Modern IE touch devices implement the Pointer Events API instead:
 *   use `npf.userAgent.events.isPointerEventSupported` to detect
 *   support for that.
 * - Some browsers & OS setups may enable touch APIs when no touchscreen
 *   is connected.
 * - Future browsers may implement other event models for touch interactions.
 *
 * See this article:
 * [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).
 *
 * It's recommended to bind both mouse and touch/pointer events simultaneously –
 * see
 * [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).
 * This test will also return `true` for Firefox 4 Multitouch support.
 * @return {boolean}
 */
npf.userAgent.events.isTouchEventSupported = function() {
  if (goog.isNull(npf.userAgent.events.touchEvent_)) {
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    /** @type {!Window} */
    var win = domHelper.getWindow();
    /** @type {!Document} */
    var doc = domHelper.getDocument();

    if (
      ('ontouchstart' in win) || win.DocumentTouch &&
      doc instanceof goog.global['DocumentTouch']
    ) {
      npf.userAgent.events.touchEvent_ = true;
    } else {
      /** @type {!Array<string>} */
      var prefixes = npf.userAgent.utils.PREFIXES;
      var query =
        '@media (' + prefixes.join('touch-enabled),(') + 'heartz){#' +
        npf.userAgent.utils.ID + '{top:9px;position:absolute}}';

      npf.userAgent.events.touchEvent_ =
        npf.userAgent.utils.testStyles(query, function(node) {
          return node.offsetTop === 9;
        });
    }
  }

  return /** @type {boolean} */ (npf.userAgent.events.touchEvent_);
};
