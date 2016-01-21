goog.provide('npf.userAgent.utils');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.math');
goog.require('goog.string');
goog.require('goog.userAgent');
goog.require('npf.svg.dom');


/**
 * @const {!Array<string>}
 */
npf.userAgent.utils.CSSOM_PREFIXES = ['Moz', 'O', 'ms', 'Webkit'];

/**
 * @const {string}
 */
npf.userAgent.utils.ID = 'uas_' + goog.math.randomInt(1000000);

/**
 * @const {!Array<string>}
 */
npf.userAgent.utils.DOM_PREFIXES = ['moz', 'o', 'ms', 'webkit'];

/**
 * List of property values to set for css tests.
 * It is simply an array of kebab-case vendor prefixes you can use within
 * your code.
 *
 * Some common use cases include
 *
 * Generating all possible prefixed version of a CSS property
 * ```js
 * var rule = npf.userAgent.utils.PREFIXES.join(
 *   'transform: rotate(20deg); ');
 *
 * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); ' +
 *   'moz-transform: rotate(20deg); o-transform: rotate(20deg); ' +
 *   'ms-transform: rotate(20deg);'
 * ```
 *
 * Generating all possible prefixed version of a CSS value
 * ```js
 * rule = 'display:' +
 *   npf.userAgent.utils.PREFIXES.join('flex; display:') + 'flex';
 *
 * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; ' +
 *   'display:-o-flex; display:-ms-flex; display:flex'
 * ```
 *
 * @const {!Array<string>}
 */
npf.userAgent.utils.PREFIXES = ['', '-webkit-', '-moz-', '-o-', '-ms-', ''];

/**
 * Browser special CSS prefix.
 * @const {string}
 */
npf.userAgent.utils.VENDOR_PREFIX =
  goog.userAgent.WEBKIT ? 'webkit' :
  goog.userAgent.GECKO ? 'moz' :
  goog.userAgent.OPERA ? 'o' :
  goog.userAgent.EDGE_OR_IE ? 'ms' : '';


/**
 * Tests a given media query, live against the current state of the window
 * adapted from matchMedia polyfill by Scott Jehl and Paul Irish.
 * gist.github.com/786768
 *
 * @example
 * Allows for you to programmatically check if the current browser
 * window state matches a media query.
 *
 * ```js
 *  var query = npf.userAgent.utils.mq('(min-width: 900px)');
 *
 *  if (query) {
 *    // the browser window is larger than 900px
 *  }
 * ```
 *
 * Only valid media queries are supported, therefore you must always include
 * values with your media query
 *
 * ```js
 * // good
 *  npf.userAgent.utils.mq('(min-width: 900px)');
 *
 * // bad
 *  npf.userAgent.utils.mq('min-width');
 * ```
 *
 * If you would just like to test that media queries are supported in general,
 * use
 *
 * ```js
 *  npf.userAgent.utils.mq('only all');
 *  // true if MQ are supported, false if not
 * ```
 *
 *
 * Note that if the browser does not support media queries (e.g. old IE) mq will
 * always return false.
 *
 * @param {string} mq String of the media query we want to test.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 */
npf.userAgent.utils.mq = function(mq, opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  /** @type {!Window} */
  var win = domHelper.getWindow();
  var matchMedia = win.matchMedia || win['msMatchMedia'];

  if (matchMedia) {
    var mql = matchMedia(mq);

    return mql ? !!mql['matches'] : false;
  }

  /** @type {boolean} */
  var bool = false;
  /** @type {string} */
  var styles = '@media ' + mq + ' {#' +
    npf.userAgent.utils.ID + '{position:absolute;}}';

  npf.userAgent.utils.testStyles(styles, function(node) {
    var styles = win.getComputedStyle ?
      win.getComputedStyle(node, null) : node.currentStyle;
    bool = 'absolute' == styles['position'];
  }, null, null, domHelper);

  return bool;
};

/**
 * Returns the prefixed or nonprefixed property name variant of your input.
 *
 * @example
 *
 * ```js
 * var rAF = npf.userAgent.utils.prefixed('requestAnimationFrame', window);
 *
 * raf(function() {
 *  renderFunction();
 * })
 * ```
 *
 * Note that this will return _the actual function_ - not the name of the
 * function. If you need the actual name of the property, pass in `true`
 * as a third argument.
 *
 * ```js
 * var rAFProp = npf.userAgent.utils.prefixed(
 *   'requestAnimationFrame', window, true);
 *
 * rafProp === 'WebkitRequestAnimationFrame' // in older webkit
 * ```
 *
 * @param {string} prop String name of the property to test for.
 * @param {Object} obj An object to test for the prefixed properties on.
 * @param {boolean=} opt_actualFunc
 * @return {*}
 */
npf.userAgent.utils.prefixed = function(prop, obj, opt_actualFunc) {
  /** @type {string} */
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  /** @type {!Array<string>} */
  var domPrefixes = npf.userAgent.utils.DOM_PREFIXES;
  /** @type {!Array<string>} */
  var props = (prop + ' ' + domPrefixes.join(ucProp + ' ') + ucProp).split(' ');

  for (var i in props) {
    if (props[i] in obj) {
      // return the property name as a string
      if (opt_actualFunc) {
        return props[i];
      }

      var item = obj[props[i]];

      return 'function' == typeof item ? goog.bind(item, obj) : item;
    }
  }

  return null;
};

/**
 * Returns the prefixed or nonprefixed property name variant of your input.
 *
 * @example
 *
 * Takes a string css value in the DOM style camelCase (as opposed to the css
 * style kebab-case) form and returns the (possibly prefixed)
 * version of that property that the browser actually supports.
 *
 * For example, in older Firefox...
 * ```js
 * npf.userAgent.utils.prefixedCss('boxSizing')
 * ```
 * returns 'MozBoxSizing'
 *
 * In newer Firefox, as well as any other browser that support the unprefixed
 * version would simply return `boxSizing`. Any browser that does not support
 * the property at all, it will return `null`.
 *
 * One common use case for prefixed is if you're trying to determine which
 * transition end event to bind to, you might do something like...
 * ```js
 * var transEndEventNames = {
 *     'WebkitTransition' : 'webkitTransitionEnd', * Saf 6, Android Browser
 *     'MozTransition'    : 'transitionend',       * only for FF < 15
 *     'transition'       : 'transitionend'        * IE10, Opera, Chrome,
 *                                                 * FF 15+, Saf 7+
 * };
 *
 * var transEndEventName = transEndEventNames[
 *   npf.userAgent.utils.prefixedCss('transition')];
 * ```
 *
 * @param {string} prop String name of the property to test for
 * @param {boolean=} opt_camelCase
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {string?} The string representing the (possibly prefixed) valid
 *                   version of the property, or `null` when it is unsupported.
 */
npf.userAgent.utils.prefixedCss = function(prop, opt_camelCase, opt_domHelper) {
  /** @type {string?} */
  var result;

  if (prop.indexOf('@')) {
    if (-1 < prop.indexOf('-')) {
      // Convert kebab-case to camelCase
      prop = npf.userAgent.utils.cssToDom_(prop);
    }

    /** @type {string} */
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
    /** @type {!Array<string>} */
    var prefixes = npf.userAgent.utils.CSSOM_PREFIXES;
    /** @type {!Array<string>} */
    var props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
    /** @type {!goog.dom.DomHelper} */
    var domHelper = opt_domHelper || goog.dom.getDomHelper();

    // If we don't have a style element, that means we're running async or after
    // the core tests, so we'll need to create our own elements to use

    // inside of an SVG element, in certain browsers, the `style` element is only
    // defined for valid tags. Therefore, if `npf.userAgent.utils.ID`
    // does not have one, we fall back to a less used element and hope
    // for the best.
    var elems = [npf.userAgent.utils.ID, 'tspan'];
    /** @type {CSSStyleDeclaration} */
    var style = domHelper.createElement(npf.userAgent.utils.ID).style;

    while (!style) {
      style = domHelper.createElement(elems.shift()).style;
    }

    for (var i = 0; i < props.length; i++) {
      /** @type {string} */
      var curProp = props[i];

      if (goog.string.contains(curProp, '-')) {
        curProp = npf.userAgent.utils.cssToDom_(curProp);
      }

      if (goog.isDef(style[curProp])) {
        result = curProp;
        break;
      }
    }
  } else {
    result = npf.userAgent.utils.atRule(prop);
  }

  if (result && !opt_camelCase) {
    result = npf.userAgent.utils.domToCss_(result);
  }

  return result;
};

/**
 * A way test for prefixed css properties (e.g. display: -webkit-flex)

 * @example
 *
 * ```js
 * npf.userAgent.utils.prefixedCssValue(
 *   'background', 'linear-gradient(left, red, red)')
 * ```
 *
 * @param {string} prop String name of the property to test for.
 * @param {string} value String value of the non prefixed version of the value
 *                       you want to test for.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {string?} The string representing the (possibly prefixed)
 *                   valid version of the property, or `false`
 *                   when it is unsupported.
 */
npf.userAgent.utils.prefixedCssValue = function(prop, value, opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  /** @type {string|undefined} */
  var result;
  /** @type {CSSStyleDeclaration} */
  var style = domHelper.createElement(goog.dom.TagName.DIV).style;

  if (prop in style) {
    /** @type {number} */
    var i = npf.userAgent.utils.DOM_PREFIXES.length;

    style[prop] = value;
    result = style[prop];

    while (i-- && !result) {
      style[prop] = '-' + npf.userAgent.utils.DOM_PREFIXES[i] + '-' + value;
      result = style[prop];
    }
  }

  return result || null;
};

/**
 * Determines whether a given CSS property is supported in the browser.
 *
 * @example
 *
 * Determines whether a given CSS property, in some prefixed form,
 * is supported by the browser.
 *
 * ```js
 * npf.userAgent.utils.testAllProps('boxSizing')  // true
 * ```
 *
 * It can optionally be given a CSS value in string form to test if a property
 * value is valid
 *
 * ```js
 * npf.userAgent.utils.testAllProps('display', 'block') // true
 * npf.userAgent.utils.testAllProps('display', 'penguin') // false
 * ```
 *
 * A boolean can be passed as a third parameter to skip the value check when
 * native detection (@supports) isn't available.
 *
 * ```js
 * npf.userAgent.utils.testAllProps('shapeOutside', 'content-box', true);
 * ```
 *
 * @param {string} prop String naming the property to test (either camelCase or
 *                      kebab-case).
 * @param {string|null=} opt_value String of the value to test.
 * @param {boolean|null=} opt_skipValueTest Whether to skip testing that
 *                        the value is supported when using non-native
 *                        detection.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 */
npf.userAgent.utils.testAllProps = function(prop, opt_value, opt_skipValueTest,
    opt_domHelper) {
  /** @type {string} */
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  /** @type {!Array<string>} */
  var prefixes = npf.userAgent.utils.CSSOM_PREFIXES;
  /** @type {!Array<string>} */
  var props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

  return npf.userAgent.utils.testProps_(
    props, opt_value, opt_skipValueTest, opt_domHelper);
};

/**
 * Returns the body of a document, or an element that can stand in for
 * the body if a real body does not exist.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {!(HTMLElement|SVGElement)} Returns the real body of a document,
 *          or an artificially created element that stands in for the body.
 */
npf.userAgent.utils.getBody = function(opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  // After page load injecting a fake body doesn't work so check if body exists
  var body = domHelper.getDocument().body;

  if (!body) {
    // Can't use the real body create a fake one.
    body = npf.userAgent.utils.isSvg(domHelper) ?
      npf.svg.dom.createElement('svg', null, domHelper) :
      domHelper.createElement(goog.dom.TagName.BODY);
    body['fake'] = true;
  }

  return /** @type {!(HTMLElement|SVGElement)} */ (body);
};

/**
 * Takes a kebab-case string and converts it to camelCase
 * e.g. box-sizing -> boxSizing
 * @param {string} name String name of kebab-case prop we want to convert
 * @return {string} The camelCase version of the supplied name
 * @private
 */
npf.userAgent.utils.cssToDom_ = function(name) {
  return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
    return m1 + m2.toUpperCase();
  }).replace(/^-/, '');
};

/**
 * Takes a camelCase string and converts it to kebab-case
 * e.g. boxSizing -> box-sizing
 * @param {string} name String name of camelCase prop we want to convert
 * @return {string} The kebab-case version of the supplied name
 * @private
 */
npf.userAgent.utils.domToCss_ = function(name) {
  return name.replace(/([A-Z])/g, function(str, m1) {
    return '-' + m1.toLowerCase();
  }).replace(/^ms-/, '-ms-');
};

/**
 * Detects support for a given event.
 * @example
 *  It lets you determine if the browser supports a supplied event.
 *  By default, it does this detection on a div element
 *
 * ```js
 *  npf.userAgent.utils.hasEvent('blur') // true;
 * ```
 *
 * However, you are able to give an object as a second argument to
 * detect an event on something other than a div.
 *
 * ```js
 *  npf.userAgent.utils.hasEvent('devicelight', window) // true;
 * ```
 * @param {string} eventName Name of an event to test for (e.g. "resize").
 * @param {Element|Window|Document|string=} opt_element
 *                                  Element|document|window|tagName to test on.
 * @return {boolean}
 */
npf.userAgent.utils.hasEvent = function(eventName, opt_element) {
  /** @type {!(Element|Window|Document)} */
  var element;
  /** @type {!goog.dom.DomHelper} */
  var domHelper;

  if (opt_element && !goog.isString(opt_element)) {
    element = /** @type {!(Element|Window|Document)} */ (opt_element);
    domHelper = goog.dom.getDomHelper(element);
  } else {
    domHelper = goog.dom.getDomHelper();
    element = domHelper.createElement(opt_element || goog.dom.TagName.DIV);
  }

  // Testing via the `in` operator is sufficient for modern browsers and IE.
  // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
  // "resize", whereas `in` "catches" those.
  eventName = 'on' + eventName;

  /** @type {boolean} */
  var isSupported = eventName in element;

  // Fallback technique for old Firefox - bit.ly/event-detection
  if (
    !isSupported &&
    !('onblur' in domHelper.getDocument().documentElement)
  ) {
    if (!element.setAttribute) {
      // Switch to generic element if it lacks `setAttribute`.
      // It could be the `document`, `window`, or something else.
      element = domHelper.createElement(goog.dom.TagName.DIV);
    }

    element.setAttribute(eventName, '');
    isSupported = 'function' == typeof element[eventName];

    if (goog.isDef(element[eventName])) {
      // If property was created, "remove it" by setting value to `undefined`.
      element[eventName] = undefined;
    }

    element.removeAttribute(eventName);
  }

  return isSupported;
};

/**
 * Investigates whether a given style property is recognized.
 * Property names can be provided in either camelCase or kebab-case.
 *
 * @example
 *
 * Just like npf.userAgent.utils.testAllProps, only it does not
 * check any vendor prefixed version of the string.
 *
 * Note that the property name must be provided in camelCase
 * (e.g. boxSizing not box-sizing)
 *
 * ```js
 * npf.userAgent.utils.testProp('pointerEvents')  // true
 * ```
 *
 * You can also provide a value as an optional second argument to check if a
 * specific value is supported
 *
 * ```js
 * npf.userAgent.utils.testProp('pointerEvents', 'none')    // true
 * npf.userAgent.utils.testProp('pointerEvents', 'penguin') // false
 * ```
 *
 * @param {string} prop Name of the CSS property to check.
 * @param {string|null=} opt_value Name of the CSS value to check.
 * @param {boolean|null=} opt_useValue Whether or not to check the value if
 *                                    '@supports' isn't supported.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 */
npf.userAgent.utils.testProp = function(prop, opt_value, opt_useValue,
    opt_domHelper) {
  return npf.userAgent.utils.testProps_(
    [prop], opt_value, opt_useValue, opt_domHelper);
};

/**
 * Generic CSS / DOM property test.
 * In testing support for a given CSS property, it's legit to test:
 *   `elem.style[styleName] !== undefined`
 * If the property is supported it will return an empty string,
 * if unsupported it will return undefined.
 *
 * We'll take advantage of this quick test and skip setting a style
 * on our npf.userAgent.utils.ID element, but instead just testing
 * undefined vs empty string.
 *
 * Property names can be provided in either camelCase or kebab-case.
 * @param {!Array<string>} props
 * @param {string|null=} opt_value
 * @param {boolean|null=} opt_skipValueTest
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 * @private
 */
npf.userAgent.utils.testProps_ = function(props, opt_value, opt_skipValueTest,
    opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();

  // Try native detect first
  if (opt_value) {
    /** @type {boolean?} */
    var result = npf.userAgent.utils.nativeTestProps_(
      domHelper, props, opt_value);

    if (goog.isBoolean(result)) {
      return result;
    }
  }

  // If we don't have a style element, that means we're running async or after
  // the core tests, so we'll need to create our own elements to use

  // inside of an SVG element, in certain browsers, the `style` element is only
  // defined for valid tags. Therefore, if `npf.userAgent.utils.ID`
  // does not have one, we fall back to a less used element and hope
  // for the best.
  var elems = [npf.userAgent.utils.ID, 'tspan'];
  /** @type {CSSStyleDeclaration} */
  var style = domHelper.createElement(npf.userAgent.utils.ID).style;

  while (!style) {
    style = domHelper.createElement(elems.shift()).style;
  }

  for (var i = 0; i < props.length; i++) {
    /** @type {string} */
    var prop = props[i];
    /** @type {string|undefined} */
    var before = style[prop];

    if (goog.string.contains(prop, '-')) {
      prop = npf.userAgent.utils.cssToDom_(prop);
    }

    if (goog.isDef(style[prop])) {
      // If value to test has been passed in, do a set-and-check test.
      // 0 (integer) is a valid property value, so check that `value` isn't
      // undefined, rather than just checking it's truthy.
      if (!opt_skipValueTest && opt_value) {
        // Needs a try catch block because of old IE. This is slow, but will
        // be avoided in most cases because `opt_skipValueTest` will be used.
        try {
          style[prop] = opt_value;
        } catch (e) {}

        // If the property value has changed, we assume the value used is
        // supported. If `value` is empty string, it'll fail here (because
        // it hasn't changed), which matches how browsers have implemented
        // CSS.supports()
        if (style[prop] != before) {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  return false;
};

/**
 * Returns a given CSS property at-rule (eg @keyframes), possibly in
 * some prefixed form, or false, in the case of an unsupported rule
 * @example
 * ```js
 *  var keyframes = npf.userAgent.utils.atRule('@keyframes');
 *
 *  if (keyframes) {
 *    // keyframes are supported
 *    // could be `@-webkit-keyframes` or `@keyframes`
 *  } else {
 *    // keyframes === `false`
 *  }
 * ```
 * @param {string} prop String name of the @-rule to test for
 * @return {string?} The string representing the (possibly prefixed) valid
 *                   version of the @-rule, or null when it is unsupported.
 */
npf.userAgent.utils.atRule = function(prop) {
  if (!goog.isDef(goog.global.CSSRule) || !prop) {
    return null;
  }

  // remove literal @ from beginning of provided property
  prop = prop.replace(/^@/, '');

  // CSSRules use underscores instead of dashes

  /** @type {string} */
  var rule = prop.replace(/-/g, '_').toUpperCase() + '_RULE';

  if (rule in goog.global.CSSRule) {
    return '@' + prop;
  }

  /** @type {!Array<string>} */
  var cssomPrefixes = npf.userAgent.utils.CSSOM_PREFIXES;

  for (var i = 0; i < cssomPrefixes.length; i++) {
    // prefixes gives us something like -o-, and we want O_

    /** @type {string} */
    var prefix = cssomPrefixes[i];
    /** @type {string} */
    var thisRule = prefix.toUpperCase() + '_' + rule;

    if (thisRule in goog.global.CSSRule) {
      return '@-' + prefix.toLowerCase() + '-' + prop;
    }
  }

  return null;
};

/**
 * Injects an element with style element and some CSS rules.
 *
 * @example
 *
 * Takes a CSS rule and injects it onto the current page along with
 * (possibly multiple) DOM elements. This lets you check for features
 * that can not be detected by simply checking the
 * [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
 *
 * ```js
 * npf.userAgent.utils.testStyles(
 *  '#id { width: 9px; color: papayawhip; }', function(elem, rule) {
 *     // elem is the first DOM node in the page (by default #id)
 *     // rule is the first argument you supplied - the CSS rule in string form
 *
 *     addTest('widthworks', elem.style.width === '9px')
 *   });
 * ```
 *
 * If your test requires multiple nodes, you can include a third argument
 * indicating how many additional div elements to include on the page. The
 * additional nodes are injected as children of the `elem` that is returned as
 * the first argument to the callback.
 *
 * ```js
 * npf.userAgent.utils.testStyles(
 *   '#id {width: 1px}; #id2 {width: 2px}', function(elem) {
 *     document.getElementById('id').style.width === '1px'; // true
 *     document.getElementById('id2').style.width === '2px'; // true
 *     elem.firstChild === document.getElementById('id2'); // true
 *   }, 1);
 * ```
 *
 * By default, all of the additional elements have an ID of `id[n]`, where
 * `n` is its index (e.g. the first additional, second overall is `#id2`,
 * the second additional is `#id3`, etc.).
 * If you want to have more meaningful IDs for your function, you can provide
 * them as the fourth argument, as an array of strings
 *
 * ```js
 * npf.userAgent.utils.testStyles(
 *   '#foo {width: 10px}; #bar {height: 20px}', function(elem) {
 *     elem.firstChild === document.getElementById('foo'); // true
 *     elem.lastChild === document.getElementById('bar'); // true
 *   }, 2, ['foo', 'bar']);
 * ```
 *
 * @param {string} rule String representing a css rule.
 * @param {function(!Element,string):boolean} callback A function that is used
 *                                            to test the injected element.
 * @param {number|null=} opt_nodes An integer representing the number
 *                                 of additional nodes you want injected.
 * @param {Array<string>=} opt_testnames An array of strings that are used
 *                                       as ids for the additional nodes.
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 */
npf.userAgent.utils.testStyles = function(rule, callback, opt_nodes,
    opt_testnames, opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  /** @type {string} */
  var mod = npf.userAgent.utils.ID;
  /** @type {!Element} */
  var divElement = domHelper.createElement(goog.dom.TagName.DIV);
  /** @type {!(HTMLElement|SVGElement)} */
  var bodyElement = npf.userAgent.utils.getBody(domHelper);

  if (opt_nodes) {
    // In order not to give false positives we create a node for each test
    // This also allows the method to scale for unspecified uses
    while (opt_nodes--) {
      /** @type {!Element} */
      var node = domHelper.createDom(goog.dom.TagName.DIV, {
        'id': opt_testnames ? opt_testnames[opt_nodes] : mod + (opt_nodes + 1)
      });
      divElement.appendChild(node);
    }
  }

  var styleElement = /** @type {!HTMLStyleElement} */ (
    domHelper.createDom(goog.dom.TagName.STYLE, {
      'id': 's' + mod,
      'type': 'text/css'
    }));

  // IE6 will false positive on some tests due to the style element inside
  // the test div somehow interfering offsetHeight, so insert it into body
  // or fakebody.
  // Opera will act all quirky when injecting elements in documentElement
  // when page is served as xml, needs fakebody too. #270

  if (bodyElement['fake']) {
    bodyElement.appendChild(styleElement);
  } else {
    divElement.appendChild(styleElement);
  }

  bodyElement.appendChild(divElement);

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = rule;
  } else {
    styleElement.appendChild(domHelper.getDocument().createTextNode(rule));
  }

  divElement.id = mod;

  /** @type {boolean} */
  var result;

  if (bodyElement['fake']) {
    /** @type {Element} */
    var docElement = domHelper.getDocument().documentElement;
    // avoid crashing IE8, if background image is used
    bodyElement.style.background = '';
    // Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and
    // scrollbars are visible
    bodyElement.style.overflow = 'hidden';
    /** @type {string} */
    var docOverflow = docElement.style.overflow;
    docElement.style.overflow = 'hidden';
    docElement.appendChild(bodyElement);

    result = callback(divElement, rule);

    domHelper.removeNode(bodyElement);
    docElement.style.overflow = docOverflow;
    // Trigger layout so kinetic scrolling isn't disabled in iOS6+

    /** @type {number} */
    var docHeight = docElement.offsetHeight;
  } else {
    result = callback(divElement, rule);
    domHelper.removeNode(divElement);
  }

  return result;
};

/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @return {boolean}
 */
npf.userAgent.utils.isSvg = function(opt_domHelper) {
  /** @type {!goog.dom.DomHelper} */
  var domHelper = opt_domHelper || goog.dom.getDomHelper();
  var docElement = domHelper.getDocument().documentElement;

  return 'svg' == docElement.nodeName.toLowerCase();
};

/**
 * Allows for us to use native feature detection functionality if available.
 * Some prefixed form, or false, in the case of an unsupported rule
 * @param {!goog.dom.DomHelper} domHelper
 * @param {!Array<string>} props An array of property names.
 * @param {string} value A string representing the value we want to check
 *                       via @supports
 * @return {boolean?} A boolean when @supports exists, null otherwise
 * @private
 */
npf.userAgent.utils.nativeTestProps_ = function(domHelper, props, value) {
  /** @type {number} */
  var i = props.length;
  /** @type {!Window} */
  var win = domHelper.getWindow();

  // Start with the JS API:
  // http://www.w3.org/TR/css3-conditional/#the-css-interface
  if ('CSS' in win && 'supports' in win.CSS) {
    // Try every prefixed variant of the property
    while (i--) {
      if (
        win.CSS.supports(
          npf.userAgent.utils.domToCss_(props[i]), value)
      ) {
        return true;
      }
    }

    return false;
  }

  // Otherwise fall back to at-rule (for Opera 12.x)
  if ('CSSSupportsRule' in win) {
    // Build a condition string for every prefixed variant

    /** @type {!Array<string>} */
    var conditionText = [];

    while (i--) {
      conditionText.push(
        '(' + npf.userAgent.utils.domToCss_(props[i]) + ':' + value + ')');
    }

    /** @type {string} */
    var styles = '@supports (' + conditionText.join(' or ') + ') { #' +
      npf.userAgent.utils.ID + ' {position:absolute;}}';

    return npf.userAgent.utils.testStyles(styles, function(node) {
      return 'absolute' == getComputedStyle(node, null).position;
    }, null, null, domHelper);
  }

  return null;
};
