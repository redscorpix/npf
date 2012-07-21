goog.provide('npf.userAgent.Support');
goog.provide('npf.userAgent.support');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events.EventType');
goog.require('goog.math');
goog.require('goog.object');


/**
 * @constructor
 */
npf.userAgent.Support = function() {
	this._checks = {};
	this._mStyle = goog.dom.createElement(npf.userAgent.Support.MOD).style;

	this._tests = goog.object.create(
		npf.userAgent.Support.Property.APPLICATION_CACHE, this._testApplicationCache,
		npf.userAgent.Support.Property.AUDIO, this._testAudio,
		npf.userAgent.Support.Property.BACKGROUND_SIZE, this._testBackgroundSize,
		npf.userAgent.Support.Property.BORDER_IMAGE, this._testBorderImage,
		npf.userAgent.Support.Property.BORDER_RADIUS, this._testBorderRadius,
		npf.userAgent.Support.Property.BOX_SHADOW, this._testBoxShadow,
		npf.userAgent.Support.Property.CANVAS, this._testCanvas,
		npf.userAgent.Support.Property.CANVAS_TEXT, this._testCanvasText,
		npf.userAgent.Support.Property.CSS_ANIMATIONS, this._testCssAnimations,
		npf.userAgent.Support.Property.CSS_COLUMNS, this._testCssColumns,
		npf.userAgent.Support.Property.CSS_GRADIENTS, this._testCssGradients,
		npf.userAgent.Support.Property.CSS_REFLECTIONS, this._testCssReflections,
		npf.userAgent.Support.Property.CSS_TRANSFORMS, this._testCssTransforms,
		npf.userAgent.Support.Property.CSS_TRANSFORMS_3D, this._testCssTransforms3d,
		npf.userAgent.Support.Property.CSS_TRANSITIONS, this._testCssTransitions,
		npf.userAgent.Support.Property.DRAG_AND_DROP, this._testDragAndDrop,
		npf.userAgent.Support.Property.FLEX_BOX, this._testFlexbox,
		npf.userAgent.Support.Property.FLEX_BOX_LEGACY, this._testFlexboxLegacy,
		npf.userAgent.Support.Property.FONT_FACE, this._testFontFace,
		npf.userAgent.Support.Property.GENERATED_CONTENT, this._testGeneratedContent,
		npf.userAgent.Support.Property.GEOLOCATION, this._testGeolocation,
		npf.userAgent.Support.Property.HASH_CHANGE, this._testHashChange,
		npf.userAgent.Support.Property.HISTORY, this._testHistory,
		npf.userAgent.Support.Property.HSLA, this._testHsla,
		npf.userAgent.Support.Property.INDEXED_DB, this._testIndexedDb,
		npf.userAgent.Support.Property.INLINE_SVG, this._testInlineSvg,
		npf.userAgent.Support.Property.INPUT, this._webforms,
		npf.userAgent.Support.Property.INPUT_TYPES, this._webforms,
		npf.userAgent.Support.Property.LOCAL_STORAGE, this._testLocalStorage,
		npf.userAgent.Support.Property.MULTIPLE_BACKGROUNDS, this._testMultipleBackgrounds,
		npf.userAgent.Support.Property.OPACITY, this._testOpacity,
		npf.userAgent.Support.Property.POST_MESSAGE, this._testPostMessage,
		npf.userAgent.Support.Property.RGBA, this._testRgba,
		npf.userAgent.Support.Property.SESSION_STORAGE, this._testSessionStorage,
		npf.userAgent.Support.Property.SMIL, this._testSmil,
		npf.userAgent.Support.Property.SVG, this._testSvg,
		npf.userAgent.Support.Property.SVG_CLIP_PATHS, this._testSvgClipPaths,
		npf.userAgent.Support.Property.TEXT_SHADOW, this._testTextShadow,
		npf.userAgent.Support.Property.TOUCH, this._testTouch,
		npf.userAgent.Support.Property.VIDEO, this._testVideo,
		npf.userAgent.Support.Property.WEB_GL, this._testWebgl,
		npf.userAgent.Support.Property.WEB_SOCKETS, this._testWebSockets,
		npf.userAgent.Support.Property.WEB_SQL_DATABASE, this._testWebSqlDatabase,
		npf.userAgent.Support.Property.WEB_WORKERS, this._testWebWorkers
	);
};
goog.addSingletonGetter(npf.userAgent.Support);


/**
 * @enum {string}
 */
npf.userAgent.Support.Property = {
	APPLICATION_CACHE: 'applicationcache',
	AUDIO: 'audio',
	BACKGROUND_SIZE: 'backgroundsize',
	BORDER_IMAGE: 'borderimage',
	BORDER_RADIUS: 'borderradius',
	BOX_SHADOW: 'boxshadow',
	CANVAS: 'canvas',
	CANVAS_TEXT: 'canvastext',
	CSS_ANIMATIONS: 'cssanimations',
	CSS_COLUMNS: 'csscolumns',
	CSS_GRADIENTS: 'cssgradients',
	CSS_REFLECTIONS: 'cssreflections',
	CSS_TRANSFORMS: 'csstransforms',
	CSS_TRANSFORMS_3D: 'csstransforms3d',
	CSS_TRANSITIONS: 'csstransitions',
	DRAG_AND_DROP: 'draganddrop',
	FLEX_BOX: 'flexbox',
	FLEX_BOX_LEGACY: 'flexboxLegacy',
	FONT_FACE: 'fontface',
	GENERATED_CONTENT: 'generatedcontent',
	GEOLOCATION: 'geolocation',
	HASH_CHANGE: 'hashchange',
	HISTORY: 'history',
	HSLA: 'hsla',
	INDEXED_DB: 'indexeddb',
	INLINE_SVG: 'inlinesvg',
	INPUT: 'input',
	INPUT_TYPES: 'inputtypes',
	LOCAL_STORAGE: 'localstorage',
	MULTIPLE_BACKGROUNDS: 'multiplebackgrounds',
	OPACITY: 'opacity',
	POST_MESSAGE: 'postmessage',
	RGBA: 'rgba',
	SESSION_STORAGE: 'sessionstorage',
	SMIL: 'smil',
	SVG: 'svg',
	SVG_CLIP_PATHS: 'svgclippaths',
	TEXT_SHADOW: 'textshadow',
	TOUCH: 'touch',
	VIDEO: 'video',
	WEB_GL: 'webgl',
	WEB_SOCKETS: 'websockets',
	WEB_SQL_DATABASE: 'websqldatabase',
	WEB_WORKERS: 'webworkers'
};

/**
 * @type {!Object.<string,string>}
 */
npf.userAgent.Support.eventTagNames = function() {
	return goog.object.create(
		goog.events.EventType.SELECT, goog.dom.TagName.INPUT,
		goog.events.EventType.CHANGE, goog.dom.TagName.INPUT,
		goog.events.EventType.SUBMIT, goog.dom.TagName.FORM,
		'reset', goog.dom.TagName.FORM,
		goog.events.EventType.ERROR, goog.dom.TagName.IMG,
		goog.events.EventType.LOAD, goog.dom.TagName.IMG,
		'abort', goog.dom.TagName.IMG
	);
}();

/**
 * Modernizr version.
 * @type {string}
 * @const
 */
npf.userAgent.Support.VERSION = '2.0.6';

/**
 * Create our element that we do most feature tests on.
 * @type {string}
 * @const
 */
npf.userAgent.Support.MOD = 'useragentsupport_' + goog.math.randomInt(1000000);

/**
 * @type {string}
 * @const
 */
npf.userAgent.Support.SMILE = ':)';

/**
 * @enum {string}
 */
npf.userAgent.Support.Ns = {
	SVG: 'http://www.w3.org/2000/svg'
};

/**
 * Browser special CSS prefix.
 * @type {?string}
 */
npf.userAgent.Support.vendorPrefix =
  goog.userAgent.WEBKIT ? 'webkit' :
  goog.userAgent.GECKO ? 'moz' :
  goog.userAgent.OPERA ? 'o' :
  goog.userAgent.IE ? 'ms' : '';

/**
 * List of property values to set for css tests. See ticket #21
 * @type {Array.<string>}
 */
npf.userAgent.Support.prefixes = (npf.userAgent.Support.vendorPrefix ? ' -' + npf.userAgent.Support.vendorPrefix + '- ' : ' ').split(' ');

/**
 * @type {string}
 * @private
 */
npf.userAgent.Support._omPrefixes = 'Webkit Moz O ms';

/**
 * Following spec is to expose vendor-specific style properties as:
 * 	elem.style.WebkitBorderRadius
 * and the following would be incorrect:
 * 	elem.style.webkitBorderRadius
 *
 * Webkit ghosts their properties in lowercase but Opera & Moz do not.
 * Microsoft foregoes prefixes entirely <= IE8, but appears to
 * use a lowercase `ms` instead of the correct `Ms` in IE9
 *
 * More here: http://github.com/Modernizr/Modernizr/issues/issue/21
 * @type {Array.<string>}
 */
npf.userAgent.Support.domPrefixes = npf.userAgent.Support._omPrefixes.toLowerCase().split(' ');

npf.userAgent.Support.cssomPrefixes = npf.userAgent.Support._omPrefixes.split(' ');

/**
 * @type {!Object.<npf.userAgent.Support.Property,*>}
 * @private
 */
npf.userAgent.Support.prototype._checks;

/**
 * @type {CSSStyleDeclaration}
 * @private
 */
npf.userAgent.Support.prototype._mStyle;

/**
 * @type {!Object.<npf.userAgent.Support.Property,Function>}
 * @private
 */
npf.userAgent.Support.prototype._tests;


/**
 * @param {npf.userAgent.Support.Property} prop
 * @return {*}
 */
npf.userAgent.Support.prototype.isPropertySupported = function(prop) {
	if (!goog.isDef(this._checks[prop]) && this._tests[prop]) {
		this._checks[prop] = goog.bind(this._tests[prop], this)();
	}

	return this._checks[prop];
};

/**
 * Tests a given media query, live against the current state of the window
 * A few important notes:
 * 	- If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
 * 	- A max-width or orientation query will be evaluated against the current state, which may change later.
 * 	- You must specify values. Eg. If you are testing support for the min-width media query use:
 * 		npf.userAgent.Support.getInstance().mq('(min-width:0)')
 *
 * @example
 * npf.userAgent.Support.getInstance().mq('only screen and (max-width:768)')
 *
 * @param {string} mq
 * @return boolean
 */
npf.userAgent.Support.prototype.mq = function(mq) {
	var matchMedia = window['matchMedia'] || window['msMatchMedia'];

	if (matchMedia) {
		return matchMedia(mq)['matches'];
	}

	/** @type {boolean} */
	var bool;

	this._testStyles('@media ' + mq + ' { #' + npf.userAgent.Support.MOD + ' { position: absolute; } }', function(node) {
		bool = (window.getComputedStyle ? window.getComputedStyle(node, null) : node.currentStyle)['position'] == 'absolute';
	});

	return bool;
};

/**
 * Returns the prefixed or nonprefixed property name variant of your input
 * npf.userAgent.Support.getInstance().prefixed('boxSizing') // 'MozBoxSizing'
 *
 * Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
 * Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
 *
 * 	str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
 *
 * If you're trying to ascertain which transition end event to bind to, you might do something like...
 *
 * 	var transEndEventNames = {
 * 		'WebkitTransition' : 'webkitTransitionEnd',
 * 		'MozTransition'    : 'transitionend',
 * 		'OTransition'      : 'oTransitionEnd',
 * 		'msTransition'     : 'msTransitionEnd', // maybe?
 * 		'transition'       : 'transitionEnd'
 * 	},
 * 	transEndEventName = transEndEventNames[ npf.userAgent.Support.getInstance().prefixed('transition') ];
 *
 * @param {string} prop
 * @return {string}
 */
npf.userAgent.Support.prototype.prefixed = function(prop) {
	var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
	var props = (prop + ' ' + npf.userAgent.Support.domPrefixes.join(ucProp + ' ') + ucProp).split(' ');

	return this._testPropsPrefixed(props);
};

/**
 * Investigates whether a given style property is recognized
 * Note that the property names must be provided in the camelCase variant.
 *
 * @example
 * 	npf.userAgent.Support.getInstance().testProp('pointerEvents')
 *
 * @param {string} prop
 * @return {boolean}
 */
npf.userAgent.Support.prototype.testProp = function(prop) {
	return this._testProps([prop]);
};

/**
 * Investigates whether a given style property, or any of its vendor-prefixed variants, is recognized
 * Note that the property names must be provided in the camelCase variant.
 *
 * @example
 * 	npf.userAgent.Support.getInstance().testAllProps('boxSizing')
 *
 * @param {string} prop
 * @return {string}
 */
npf.userAgent.Support.prototype.testAllProps = function(prop) {
	/** @type {string} */
	var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
	/** @type {!Array.<string>} */
	var props = (prop + ' ' + npf.userAgent.Support.domPrefixes.join(ucProp + ' ') + ucProp).split(' ');

	return this._testPropsPrefixed(props);
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testApplicationCache = function() {
	return !!window.applicationCache;
};

/**
 * @return {{ogg:boolean,mp3:boolean,wav:boolean,m4a:boolean}?}
 * @private
 */
npf.userAgent.Support.prototype._testAudio = function() {
	/** @type {!Element} */
	var elem = goog.dom.createElement('audio');
	var types = null;

	try {
		if (elem.canPlayType) {
			types = {};
			types.ogg = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
			types.mp3 = elem.canPlayType('audio/mpeg;').replace(/^no$/,'');

			// Mimetypes accepted:
			//   https://developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
			//   http://bit.ly/iphoneoscodecs
			types.wav = elem.canPlayType('audio/wav; codecs="1"').replace(/^no$/,'');
			types.m4a = elem.canPlayType('audio/x-m4a;') || elem.canPlayType('audio/aac;').replace(/^no$/,'');
		}
	} catch(e) { }

	return types;
};

/**
 * In testing support for a given CSS property, it's legit to test:
 * 	`elem.style[styleName] !== undefined`
 * If the property is supported it will return an empty string,
 * if unsupported it will return undefined.
 *
 * We'll take advantage of this quick test and skip setting a style
 * on our modernizr element, but instead just testing undefined vs
 * empty string.
 *
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testBackgroundSize = function() {
	return this._testPropsAll('backgroundSize');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testBorderImage = function() {
	return this._testPropsAll('borderImage');
};

/**
 * Super comprehensive table about all the unique implementations of
 * border-radius: http://muddledramblings.com/table-of-css3-border-radius-compliance
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testBorderRadius = function() {
	return this._testPropsAll('borderRadius');
};

/**
 * WebOS unfortunately false positives on this test.
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testBoxShadow = function() {
	return this._testPropsAll('boxShadow');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCanvas = function() {
	// On the S60 and BB Storm, getContext exists, but always returns undefined
	// http://github.com/Modernizr/Modernizr/issues/issue/97/

	/** @type {!Element} */
	var elem = goog.dom.createElement(goog.dom.TagName.CANVAS);

	return !!(elem.getContext && elem.getContext('2d'));
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCanvasText = function() {
	return /** @type {boolean} */ (this.isPropertySupported(npf.userAgent.Support.Property.CANVAS)) && !!goog.dom.createElement(goog.dom.TagName.CANVAS).getContext('2d').fillText;
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssAnimations = function() {
	return this._testPropsAll('animationName');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssColumns = function() {
	return this._testPropsAll('columnCount');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssGradients = function() {
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

	this._mStyle.cssText = (str1 + '-webkit- '.split(' ').join(str2 + str1) + npf.userAgent.Support.prefixes.join(str3 + str1)).slice(0, -str1.length);

	return this._contains(this._mStyle.backgroundImage, 'gradient');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssReflections = function() {
	return this._testPropsAll('boxReflect');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssTransforms = function() {
	return !!this._testPropsAll('transform');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssTransforms3d = function() {
	/** @type {boolean} */
	var isPropertySupported = !!this._testPropsAll('perspective');

	// Webkits 3D transforms are passed off to the browser's own graphics renderer.
	//   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
	//   some conditions. As a result, Webkit typically recognizes the syntax but
	//   will sometimes throw a false positive, thus we must do a more thorough check:
	if (isPropertySupported && 'webkitPerspective' in document.documentElement.style) {
		// Webkit allows this media query to succeed only if the feature is enabled.
		// `@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){ ... }`

		/** @type {string} */
		var id = 'testCssTransforms3d';
		/** @type {string} */
		var style = ['@media (', npf.userAgent.Support.prefixes.join('transform-3d),('), npf.userAgent.Support.MOD, ')', '{#', id, '{left:9px;position:absolute;height:3px;}}'].join('');

		this._testStyles(style, function(node, rule) {
			// IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
			// So we check for cssRules and that there is a rule available
			// More here: https://github.com/Modernizr/Modernizr/issues/288 & https://github.com/Modernizr/Modernizr/issues/293
			isPropertySupported = node.childNodes[0].offsetLeft === 9 && node.childNodes[0].offsetHeight === 3;
		}, id);
	}

	return isPropertySupported;
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testCssTransitions = function() {
	return this._testPropsAll('transition');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testDragAndDrop = function() {
	/** @type {Element} */
	var element = goog.dom.createElement(goog.dom.TagName.DIV);

	return ('draggable' in element) || ('ondragstart' in element && 'ondrop' in element);
};

/**
 * The *new* flexbox
 * dev.w3.org/csswg/css3-flexbox
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testFlexbox = function() {
	return this._testPropsAll('flexWrap');
};

/**
 * The *old* flexbox
 * www.w3.org/TR/2009/WD-css3-flexbox-20090723/
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testFlexboxLegacy = function() {
	return this._testPropsAll('boxDirection');
};

/**
 * font-face detection routine by Diego Perini
 * http://javascript.nwbox.com/CSSSupport/
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testFontFace = function() {
	/** @type {boolean} */
	var isPropertySupported;
	/** @type {string} */
	var id = 'testFontFace';
	/** @type {string} */
	var style = '@font-face {font-family:"font";src:url("https://")}';

	this._testStyles(style, function(node, rule) {
		var style = document.styleSheets[document.styleSheets.length - 1];
		// IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
		// So we check for cssRules and that there is a rule available
		// More here: https://github.com/Modernizr/Modernizr/issues/288 & https://github.com/Modernizr/Modernizr/issues/293
		var cssText = style.cssRules && style.cssRules[0] ? style.cssRules[0].cssText : style.cssText || "";

		isPropertySupported = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
	}, id);

	return isPropertySupported;
};

/**
 * CSS generated content detection
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testGeneratedContent = function() {
	/** @type {boolean} */
	var isPropertySupported;
	/** @type {string} */
	var id = 'testGeneratedContent';
	/** @type {string} */
	var style = ['#', id, ':after{content:"', npf.userAgent.Support.SMILE, '";visibility:hidden}'].join('');

	this._testStyles(style, function(node, rule) {
		// IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
		// So we check for cssRules and that there is a rule available
		// More here: https://github.com/Modernizr/Modernizr/issues/288 & https://github.com/Modernizr/Modernizr/issues/293
		isPropertySupported = node.childNodes[0].offsetHeight >= 1;
	}, id);

	return isPropertySupported;
};

/**
 * Tests for the new Geolocation API specification.
 *   This test is a standards compliant-only test; for more complete
 *   testing, including a Google Gears fallback, please see:
 *   http://code.google.com/p/geo-location-javascript/
 * or view a fallback solution using google's geo API:
 *   http://gist.github.com/366184
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testGeolocation = function() {
	return 'geolocation' in navigator;
};

/**
 * documentMode logic from YUI to filter out IE8 Compat Mode which false positives.
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testHashChange = function() {
	return this.hasEvent(goog.events.EventType.HASHCHANGE, window) && (!goog.isDef(document.documentMode) || document.documentMode > 7);
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testHistory = function() {
	return !!(window.history && window.history.pushState);
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testHsla = function() {
	// Same as rgba(), in fact, browsers re-map hsla() to rgba() internally, except IE9 who retains it as hsla
	this._mStyle.cssText = 'background-color:hsla(120,40%,100%,.5)';

	return this._contains(this._mStyle.backgroundColor, 'rgba') || this._contains(this._mStyle.backgroundColor, 'hsla');
};

/**
 * Vendors had inconsistent prefixing with the experimental Indexed DB:
 * 	- Webkit's implementation is accessible through webkitIndexedDB
 * 	- Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
 * For speed, we don't test the legacy (and beta-only) indexedDB
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testIndexedDb = function() {
	for (var i = -1, len = npf.userAgent.Support.domPrefixes.length; ++i < len;) {
		if (window[npf.userAgent.Support.domPrefixes[i].toLowerCase() + 'IndexedDB']){
			return true;
		}
	}

	return !!window.indexedDB;
};

/**
 * specifically for SVG inline in HTML, not within XHTML
 * test page: paulirish.com/demo/inline-svg
 * @return {boolean}
 */
npf.userAgent.Support.prototype._testInlineSvg = function() {
	/** @type {Element} */
	var div = goog.dom.createElement(goog.dom.TagName.DIV);
	div.innerHTML = '<svg/>';

	return (div.firstChild && div.firstChild.namespaceURI) == npf.userAgent.Support.Ns.SVG;
};

/**
 * In FF4, if disabled, window.localStorage should === null.
 *
 * Normally, we could not test that directly and need to do a
 * 	`('localStorage' in window) && ` test first because otherwise Firefox will
 * 	throw bugzil.la/365772 if cookies are disabled
 *
 * Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
 * will throw the exception:
 * 	QUOTA_EXCEEDED_ERRROR DOM Exception 22.
 * Peculiarly, getItem and removeItem calls do not throw.
 *
 * Because we are forced to try/catch this, we'll go aggressive.
 *
 * Just FWIW: IE8 Compat mode supports these features completely:
 * 	www.quirksmode.org/dom/html5.html
 * But IE8 doesn't support either with local files
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testLocalStorage = function() {
	try {
		window.localStorage.setItem(npf.userAgent.Support.MOD, npf.userAgent.Support.MOD);
		window.localStorage.removeItem(npf.userAgent.Support.MOD);

		return true;
	} catch(e) {
		return false;
	}
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testMultipleBackgrounds = function() {
	// Setting multiple images AND a color on the background shorthand property
	//  and then querying the style.background property value for the number of
	//  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

	this._mStyle.cssText = 'background:url(https://),url(https://),red url(https://)';

	// If the UA supports multiple backgrounds, there should be three occurrences
	//   of the string "url(" in the return value for elemStyle.background
	return /(url\s*\(.*?){3}/.test(this._mStyle.background);
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testOpacity = function() {
	// Browsers that actually have CSS Opacity implemented have done so
	//  according to spec, which means their return values are within the
	//  range of [0.0,1.0] - including the leading zero.

	this._mStyle.cssText = npf.userAgent.Support.prefixes.join('opacity:.55;');

	// The non-literal . in this regex is intentional:
	//   German Chrome returns this value as 0,55
	// https://github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
	return /^0.55$/.test(this._mStyle.opacity);
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testPostMessage = function() {
	return !!window.postMessage;
};

/**
 * http://css-tricks.com/rgba-browser-support/
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testRgba = function() {
	// Set an rgba() color and check the returned value
	this._mStyle.cssText = 'background-color:rgba(150,255,150,.5)';

	return this._contains(this._mStyle.backgroundColor, 'rgba');
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testSessionStorage = function() {
	try {
		window.sessionStorage.setItem(npf.userAgent.Support.MOD, npf.userAgent.Support.MOD);
		window.sessionStorage.removeItem(npf.userAgent.Support.MOD);

		return true;
	} catch(e) {
		return false;
	}
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testSmil = function() {
	return !!document.createElementNS && /SVGAnimate/.test({}.toString.call(document.createElementNS(npf.userAgent.Support.Ns.SVG, 'animate')));
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testSvg = function() {
	return !!document.createElementNS && !!document.createElementNS(npf.userAgent.Support.Ns.SVG, 'svg')['createSVGRect'];
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testSvgClipPaths = function() {
	return !!document.createElementNS && /SVGClipPath/.test({}.toString.call(document.createElementNS(npf.userAgent.Support.Ns.SVG, 'clipPath')));
};

/**
 * FF3.0 will false positive on this test
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testTextShadow = function() {
	return goog.dom.createElement(goog.dom.TagName.DIV).style.textShadow === '';
};

/**
 * Test only indicates if the browser supports
 *    touch events, which does not necessarily reflect a touchscreen
 *    device, as evidenced by tablets running Windows 7 or, alas,
 *    the Palm Pre / WebOS (touch) phones.
 *
 * Additionally, Chrome (desktop) used to lie about its support on this,
 *    but that has since been rectified: http://crbug.com/36415
 *
 * We also test for Firefox 4 Multitouch Support.
 *
 * For more info, see: http://modernizr.github.com/Modernizr/touch.html
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testTouch = function() {
	/** @type {boolean} */
	var isPropertySupported;

	if (('ontouchstart' in window) || window['DocumentTouch'] && document instanceof window['DocumentTouch']) {
		isPropertySupported = true;
	} else {
		/** @type {string} */
		var id = 'testTouch';
		/** @type {string} */
		var style = ['@media (', npf.userAgent.Support.prefixes.join('touch-enabled),('), npf.userAgent.Support.MOD, ')', '{#', id, '{top:9px;position:absolute}}'].join('');

		this._testStyles(style, function(node, rule) {
			// IE8 will bork if you create a custom build that excludes both fontface and generatedcontent tests.
			// So we check for cssRules and that there is a rule available
			// More here: https://github.com/Modernizr/Modernizr/issues/288 & https://github.com/Modernizr/Modernizr/issues/293
			isPropertySupported = node.childNodes[0].offsetTop === 9;
		}, id);
	}

	return isPropertySupported;
};

// These tests evaluate support of the video/audio elements, as well as
// testing what types of content they support.
//
// We're using the Boolean constructor here, so that we can extend the value
// e.g.  npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.VIDEO) // true
//       npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.VIDEO).ogg // 'probably'
//
// Codec values from : http://github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
//                     thx to NielsLeenheer and zcorpan

// Note: in FF 3.5.1 and 3.5.0, "no" was a return value instead of empty string.
//   npf.userAgent.Support does not normalize for that.

/**
 * @return {boolean|!Boolean}
 * @private
 */
npf.userAgent.Support.prototype._testVideo = function() {
	/** @type {Element} */
	var elem = goog.dom.createElement('video');
	/** @type {boolean|!Boolean} */
	var bool = false;

	// IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
	try {
		bool = !!elem.canPlayType;

		if (bool) {
			bool = new Boolean(bool);
			bool.ogg = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,'');
			// Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
			bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,'');
			bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
		}
	} catch(e) { }

	return !!bool;
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testWebgl = function() {
	// This WebGL test may false positive.
	// But really it's quite impossible to know whether webgl will succeed until after you create the context.
	// You might have hardware that can support a 100x100 webgl canvas, but will not support a 1000x1000 webgl
	// canvas. So this feature inference is weak, but intentionally so.

	// It is known to false positive in FF4 with certain hardware and the iPad 2.
	return !!window.WebGLRenderingContext;
};

/**
 * Mozilla is targeting to land MozWebSocket for FF6
 * bugzil.la/659324
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testWebSockets = function() {
	return 'WebSocket' in window || 'MozWebSocket' in window;
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
 * @private
 */
npf.userAgent.Support.prototype._testWebSqlDatabase = function() {
	return !!window.openDatabase;
};

/**
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testWebWorkers = function() {
	return !!window.Worker;
};

/**
 * input features and input types go directly onto the ret object, bypassing the tests loop.
 * Hold this guy to execute in a moment.
 * @private
 */
npf.userAgent.Support.prototype._webforms = function() {
	/** @type {!Element} */
	var inputElement = goog.dom.createElement(goog.dom.TagName.INPUT);

	// Run through HTML5's new input attributes to see if the UA understands any.
	// We're using f which is the <input> element created early on
	// Mike Taylr has created a comprehensive resource for testing these attributes
	//   when applied to all input types:
	//   http://miketaylr.com/code/input-type-attr.html
	// spec: http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

	// Only input placeholder is tested while textarea's placeholder is not.
	// Currently Safari 4 and Opera 11 have support only for the input placeholder
	// Both tests are available in feature-detects/forms-placeholder.js
	this._checks[npf.userAgent.Support.Property.INPUT] = (function(props) {
		/** @type {!Object.<string,boolean>} */
		var attrs = {};

		for (var i = 0, len = props.length; i < len; i++) {
			attrs[props[i]] = !!(props[i] in inputElement);
		}

		if (attrs['list']) {
			// safari false positive's on datalist: webk.it/74252
			// see also github.com/Modernizr/Modernizr/issues/146
			attrs['list'] = !!(goog.dom.createElement('datalist') && window['HTMLDataListElement']);
		}

		return attrs;
	})('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));

	// Run through HTML5's new input types to see if the UA understands any.
	//   This is put behind the tests runloop because it doesn't return a
	//   true/false like all the other tests; instead, it returns an object
	//   containing each input type with its corresponding true/false value

	// Big thanks to @miketaylr for the html5 forms expertise. http://miketaylr.com/
	this._checks[npf.userAgent.Support.Property.INPUT_TYPES] = (function(props) {
		/** @type {!Object.<string,boolean>} */
		var inputs = {};

		for (var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++) {
			inputElement.setAttribute('type', inputElemType = props[i]);
			bool = inputElement.type !== 'text';

			// We first check to see if the type we give it sticks..
			// If the type does, we feed it a textual value, which shouldn't be valid.
			// If the value doesn't stick, we know there's input sanitization which infers a custom UI
			if (bool) {
				inputElement.value = npf.userAgent.Support.SMILE;
				inputElement.style.cssText = 'position:absolute;visibility:hidden;';

				if (/^range$/.test(inputElemType) && inputElement.style.WebkitAppearance !== undefined) {
					document.documentElement.appendChild(inputElement);
					defaultView = document.defaultView;

					// Safari 2-4 allows the smiley as a value, despite making a slider
					bool =  defaultView.getComputedStyle &&
						defaultView.getComputedStyle(inputElement, null).WebkitAppearance !== 'textfield' &&
						// Mobile android web browser has false positive, so must
						// check the height to see if the widget is actually there.
						(inputElement.offsetHeight !== 0);
					document.documentElement.removeChild(inputElement);
				} else if (/^(search|tel)$/.test(inputElemType)) {
					// Spec doesnt define any special parsing or detectable UI
					//   behaviors so we pass these through as true

					// Interestingly, opera fails the earlier test, so it doesn't
					//  even make it here.
				} else if (/^(url|email)$/.test(inputElemType)) {
					// Real url and email support comes with prebaked validation.
					bool = inputElement.checkValidity && inputElement.checkValidity() === false;
				} else {
					// If the upgraded input compontent rejects the :) text, we got a winner
					bool = inputElement.value != npf.userAgent.Support.SMILE;
				}
			}

			inputs[props[i]] = !!bool;
		}

		return inputs;
	})('search tel url email datetime date month week time datetime-local number range color'.split(' '));
};

/**
 * Allows you to add custom styles to the document and test an element afterwards
 * this._testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
 * @param {string} rule
 * @param {function(!Element, string)} callback
 * @param {string=} opt_appendChildId
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testStyles = function(rule, callback, opt_appendChildId) {
	/** @type {Element} */
	var div = goog.dom.createElement(goog.dom.TagName.DIV);

	if (opt_appendChildId) {
		/** @type {!Element} */
		var node = goog.dom.createElement(goog.dom.TagName.DIV);
		node.id = opt_appendChildId;
		goog.dom.appendChild(div, node);
	}

	// <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
	// when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
	// with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
	// http://msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx

	/** @type {string} */
	var style = ['&shy;', '<style>', rule, '</style>'].join('');
	div.id = npf.userAgent.Support.MOD;
	div.innerHTML += style;
	goog.dom.appendChild(document.documentElement, div);

	var ret = callback(div, rule);
	goog.dom.removeNode(div);

	return !!ret;
};

/**
 * Returns a boolean for if substr is found within str.
 * @param {string} str
 * @param {string} substr
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._contains = function(str, substr) {
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
npf.userAgent.Support.prototype._testPropsAll = function(prop) {
	var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
	var props = (prop + ' ' + npf.userAgent.Support.cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

	return this._testProps(props);
};

/**
 * It is a generic CSS / DOM property test; if a browser supports
 *   a certain property, it won't return undefined for it.
 *   A supported CSS property returns empty string when its not yet set.
 * @param {!Array.<string>} props
 * @return {boolean}
 * @private
 */
npf.userAgent.Support.prototype._testProps = function(props) {
	for (var i in props) {
		if (!this._contains(props[i], '-') && goog.isDef(this._mStyle[props[i]])) {
			return true;
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
npf.userAgent.Support.prototype._testPropsPrefixed = function(props) {
	for (var i in props) {
		if (goog.isDef(this._mStyle[props[i]])) {
			return props[i];
		}
	}

	return '';
};

/**
 * Detects support for a given event, with an optional element to test on
 *
 * @example
 * 	npf.userAgent.Support.getInstance().hasEvent('gesturestart', elem)
 *
 * @param {string} eventName
 * @param {Element|Window=} opt_element
 * @return {boolean}
 */
npf.userAgent.Support.prototype.hasEvent = function(eventName, opt_element) {
	/** @type {Element|Window} */
	var element = opt_element || goog.dom.createElement(npf.userAgent.Support.eventTagNames[eventName] || goog.dom.TagName.DIV);
	/** @type {string} */
	var eventFullName = 'on' + eventName;

	// When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those

	/** @type {boolean} */
	var isPropertySupported = eventFullName in element;

	if (!isPropertySupported) {
		// If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
		if (!element.setAttribute) {
			element = goog.dom.createElement(goog.dom.TagName.DIV);
		}

		if (element.setAttribute && element.removeAttribute) {
			element.setAttribute(eventFullName, '');
			isPropertySupported = !!element[eventFullName];

			// If property was created, "remove it" (by setting value to `undefined`)
			if (goog.isDef(element[eventFullName])) {
				element[eventFullName] = undefined;
			}

			element.removeAttribute(eventFullName);
		}
	}

	return isPropertySupported;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isApplicationCacheSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.APPLICATION_CACHE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isAudioSupported = function() {
	return !!npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.AUDIO);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isAudioOggSupported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.AUDIO);

	return types ? types.ogg : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isAudioMp3Supported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.AUDIO);

	return types ? types.mp3 : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isAudioWavSupported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.AUDIO);

	return types ? types.wav : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isAudioM4aSupported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.AUDIO);

	return types ? types.m4a : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isBackgroundSizeSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.BACKGROUND_SIZE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isBorderImageSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.BORDER_IMAGE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isBorderRadiusSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.BORDER_RADIUS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isBoxShadowSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.BOX_SHADOW));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCanvasSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CANVAS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCanvasTextSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CANVAS_TEXT));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssAnimationSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_ANIMATIONS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssColumnSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_COLUMNS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssGradientSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_GRADIENTS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssReflectionSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_REFLECTIONS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssTransformSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_TRANSFORMS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssTransform3dSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_TRANSFORMS_3D));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isCssTransitionSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.CSS_TRANSITIONS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isDragAndDropSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.DRAG_AND_DROP));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isFlexBoxSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.FLEX_BOX));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isFlexBoxLegacySupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.FLEX_BOX_LEGACY));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isFontFaceSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.FONT_FACE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isGeneratedContentSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.GENERATED_CONTENT));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isGeolocationSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.GEOLOCATION));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isHashChangeSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.HASH_CHANGE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isHistorySupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.HISTORY));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isHslaSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.HSLA));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isIndexedDbSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.INDEXED_DB));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isInlineSvgSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.INLINE_SVG));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isInputSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.INPUT));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isInputTypesSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.INPUT_TYPES));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isLocalStorageSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.LOCAL_STORAGE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isMultipleBackgroundSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.MULTIPLE_BACKGROUNDS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isOpacitySupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.OPACITY));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isPostMessageSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.POST_MESSAGE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isRgbaSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.RGBA));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isSessionStorageSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.SESSION_STORAGE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isSmilSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.SMIL));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isSvgSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.SVG));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isSvgClipPathSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.SVG_CLIP_PATHS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isTextShadowSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.TEXT_SHADOW));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isTouchSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.TOUCH));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isVideoSupported = function() {
	return !!npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.VIDEO);
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isVideoOggSupported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.VIDEO);

	return types ? types.ogg : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isVideoH264Supported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.VIDEO);

	return types ? types.h264 : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isVideoWebmSupported = function() {
	var types = npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.VIDEO);

	return types ? types.webm : false;
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isWebGlSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.WEB_GL));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isWebSocketSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.WEB_SOCKETS));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isWebSqlDatabaseSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.WEB_SQL_DATABASE));
};

/**
 * @return {boolean}
 */
npf.userAgent.support.isWebWorkersSupported = function() {
	return /** @type {boolean} */ (npf.userAgent.Support.getInstance().isPropertySupported(npf.userAgent.Support.Property.WEB_WORKERS));
};

/**
 * Returns property name with proper browser prefix.
 *
 * @param {string} str Property name
 * @return {string} Property name with browser prefix.
 */
npf.userAgent.support.getCssPropertyName = function(str) {
	/** @type {string} */
	var returnValue = '';

	if (npf.userAgent.Support.vendorPrefix) {
		returnValue = '-' + npf.userAgent.Support.vendorPrefix + '-';
	}

  return returnValue + str;
};
