goog.provide('npf.userAgent.css');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.string');
goog.require('goog.userAgent');
goog.require('npf.userAgent.utils');


/**
 * @typedef {{
 *  breakAfter: boolean,
 *  breakBefore: boolean,
 *  breakInside: boolean,
 *  fill: boolean,
 *  gap: boolean,
 *  rule: boolean,
 *  ruleColor: boolean,
 *  ruleStyle: boolean,
 *  ruleWidth: boolean,
 *  span: boolean,
 *  width: boolean
 * }}
 */
npf.userAgent.css.ColumnStyles;


/**
 * Takes two integers and checks if the first is within 1 of the second.
 * @param {number} a
 * @param {number} b
 * @return {boolean}
 * @private
 */
npf.userAgent.css.roundedEquals_ = function(a, b) {
  return a - 1 === b || a === b || a + 1 === b;
};

/**
 * Detects support for the `all` css property, which is a shorthand to reset all
 * css properties (except direction and unicode-bidi) to their original value.
 * @return {boolean}
 */
npf.userAgent.css.isAllSupported = function() {
  return 'all' in goog.dom.getDomHelper().getDocument().documentElement.style;
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.animation_ = null;

/**
 * Detects whether or not elements can be animated using CSS.
 * @return {boolean}
 */
npf.userAgent.css.isAnimationSupported = function() {
  if (goog.isNull(npf.userAgent.css.animation_)) {
    npf.userAgent.css.animation_ =
      npf.userAgent.utils.testAllProps('animationName', 'a', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.animation_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.appearance_ = null;

/**
 * Detects support for the `appearance` css property, which is used to make an
 * element inherit the style of a standard user interface element. It can also
 * be used to remove the default styles of an element, such as input
 * and buttons.
 * @return {boolean}
 */
npf.userAgent.css.isAppearanceSupported = function() {
  if (goog.isNull(npf.userAgent.css.appearance_)) {
    npf.userAgent.css.appearance_ =
      npf.userAgent.utils.testAllProps('appearance');
  }

  return /** @type {boolean} */ (npf.userAgent.css.appearance_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundFilter_ = null;

/**
 * Detects support for CSS Backdrop Filters, allowing for background blur
 * effects like those introduced in iOS 7. Support for this was added
 * to iOS Safari/WebKit in iOS 9.
 * @return {boolean}
 */
npf.userAgent.css.isBackdropFilterSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundFilter_)) {
    npf.userAgent.css.backgroundFilter_ =
      npf.userAgent.utils.testAllProps('backdropFilter');
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundFilter_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundBlendMode_ = null;

/**
 * Detects the ability for the browser to composite backgrounds using blending
 * modes similar to ones found in Photoshop or Illustrator.
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundBlendModeSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundBlendMode_)) {
    npf.userAgent.css.backgroundBlendMode_ =
      npf.userAgent.utils.testAllProps('backgroundBlendMode', 'text');
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundBlendMode_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundClipText_ = null;

/**
 * Detects the ability to control specifies whether or not an element's
 * background extends beyond its border in CSS.
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundClipTextSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundClipText_)) {
    npf.userAgent.css.backgroundClipText_ =
      npf.userAgent.utils.testAllProps('backgroundClip', 'text');
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundClipText_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundPositionShorthand_ = null;

/**
 * Detects if you can use the shorthand method to define multiple parts of an
 * element's background-position simultaniously.
 * eg `background-position: right 10px bottom 10px`
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundPositionShorthandSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundPositionShorthand_)) {
    var val = 'right 10px bottom 10px';
    /** @type {!Element} */
    var elem = goog.dom.createDom(goog.dom.TagName.A, {
      'style': 'background-position: ' + val
    });

    npf.userAgent.css.backgroundPositionShorthand_ =
      elem.style.backgroundPosition === val;
  }

  return /** @type {boolean} */ (
    npf.userAgent.css.backgroundPositionShorthand_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundPositionXY_ = null;

/**
 * Detects the ability to control an element's background position using css.
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundPositionXYSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundPositionXY_)) {
    npf.userAgent.css.backgroundPositionXY_ =
      npf.userAgent.utils.testAllProps('backgroundPositionX', '3px', true) &&
      npf.userAgent.utils.testAllProps('backgroundPositionY', '5px', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundPositionXY_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundRepeatRound_ = null;

/**
 * Detects the ability to use round as properties for background-repeat.
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundRepeatRoundSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundRepeatRound_)) {
    npf.userAgent.css.backgroundRepeatRound_ =
      npf.userAgent.utils.testAllProps('backgroundRepeat', 'round', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundRepeatRound_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundRepeatSpace_ = null;

/**
 * Detects the ability to use space as properties for background-repeat.
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundRepeatSpaceSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundRepeatSpace_)) {
    npf.userAgent.css.backgroundRepeatSpace_ =
      npf.userAgent.utils.testAllProps('backgroundRepeat', 'space');
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundRepeatSpace_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundSize_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundSizeSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundSize_)) {
    npf.userAgent.css.backgroundSize_ =
      npf.userAgent.utils.testAllProps('backgroundSize', '100%', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundSize_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.backgroundSizeCover_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isBackgroundSizeCoverSupported = function() {
  if (goog.isNull(npf.userAgent.css.backgroundSizeCover_)) {
    npf.userAgent.css.backgroundSizeCover_ =
      npf.userAgent.utils.testAllProps('backgroundSize', 'cover');
  }

  return /** @type {boolean} */ (npf.userAgent.css.backgroundSizeCover_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.borderImage_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isBorderImageSupported = function() {
  if (goog.isNull(npf.userAgent.css.borderImage_)) {
    npf.userAgent.css.borderImage_ =
      npf.userAgent.utils.testAllProps('borderImage', 'url() 1', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.borderImage_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.borderRadius_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isBorderRadiusSupported = function() {
  if (goog.isNull(npf.userAgent.css.borderRadius_)) {
    npf.userAgent.css.borderRadius_ =
      npf.userAgent.utils.testAllProps('borderRadius', '0px', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.borderRadius_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.boxShadow_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isBoxShadowSupported = function() {
  if (goog.isNull(npf.userAgent.css.boxShadow_)) {
    npf.userAgent.css.boxShadow_ =
      npf.userAgent.utils.testAllProps('boxShadow', '1px 1px', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.boxShadow_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.boxSizing_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isBoxSizingSupported = function() {
  if (goog.isNull(npf.userAgent.css.boxSizing_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    npf.userAgent.css.boxSizing_ = npf.userAgent.utils.testAllProps(
        'boxSizing', 'border-box', true) &&
      (!goog.isDef(doc.documentMode) || 7 < doc.documentMode);
  }

  return /** @type {boolean} */ (npf.userAgent.css.boxSizing_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.calc_ = null;

/**
 * Method of allowing calculated values for length units. For example:
 * ```css
 * //lem {
 *   width: calc(100% - 3em);
 * }
 * ```
 * @return {boolean}
 */
npf.userAgent.css.isCalcSupported = function() {
  if (goog.isNull(npf.userAgent.css.calc_)) {
    /** @type {!Array<string>} */
    var prefixes = npf.userAgent.utils.PREFIXES;
    var prop = 'width:';
    npf.userAgent.css.calc_ = !!goog.dom.createDom(goog.dom.TagName.A, {
      'style': prop + prefixes.join('calc(10px);' + prop)
    }).style.length;
  }

  return /** @type {boolean} */ (npf.userAgent.css.calc_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.checked_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isCheckedSupported = function() {
  if (goog.isNull(npf.userAgent.css.checked_)) {
    var styles =
      '#' + npf.userAgent.utils.ID + ' {position:absolute} ' +
      '#' + npf.userAgent.utils.ID + ' input {margin-left:10px} ' +
      '#' + npf.userAgent.utils.ID + ' :checked {' +
        'margin-left:20px;display:block' +
      '}';

    npf.userAgent.css.checked_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        var cb = goog.dom.createDom(goog.dom.TagName.INPUT, {
          'checked': 'checked',
          'type': 'checkbox'
        });
        elem.appendChild(cb);

        return 20 === cb.offsetLeft;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.checked_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.chUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isChUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.chUnit_)) {
    /** @type {!Element} */
    var elem = goog.dom.createElement(npf.userAgent.utils.ID);
    npf.userAgent.css.chUnit_ = false;

    try {
      elem.style.fontSize = '3ch';
      npf.userAgent.css.chUnit_ = -1 < elem.style.fontSize.indexOf('ch');
    } catch (e) { }
  }

  return /** @type {boolean} */ (npf.userAgent.css.chUnit_);
};

/**
 * @private {npf.userAgent.css.ColumnStyles?}
 */
npf.userAgent.css.columnStyles_ = null;

/**
 * @private {boolean}
 */
npf.userAgent.css.columnStylesChecked_ = false;

/**
 * @return {npf.userAgent.css.ColumnStyles?}
 */
npf.userAgent.css.getColumnStylesSupported = function() {
  if (!npf.userAgent.css.columnStylesChecked_) {
    npf.userAgent.css.columnStylesChecked_ = true;

    if (npf.userAgent.utils.testAllProps('columnCount')) {
      npf.userAgent.css.columnStyles_ = {
        breakAfter:
          !!npf.userAgent.utils.testAllProps('columnBreakAfter') ||
          !!npf.userAgent.utils.testAllProps('BreakAfter'),
        breakBefore:
          !!npf.userAgent.utils.testAllProps('columnBreakBefore') ||
          !!npf.userAgent.utils.testAllProps('BreakBefore'),
        breakInside:
          !!npf.userAgent.utils.testAllProps('columnBreakInside') ||
          !!npf.userAgent.utils.testAllProps('BreakInside'),
        fill: !!npf.userAgent.utils.testAllProps('columnFill'),
        gap: !!npf.userAgent.utils.testAllProps('columnGap'),
        rule: !!npf.userAgent.utils.testAllProps('columnRule'),
        ruleColor: !!npf.userAgent.utils.testAllProps('columnRuleColor'),
        ruleStyle: !!npf.userAgent.utils.testAllProps('columnRuleStyle'),
        ruleWidth: !!npf.userAgent.utils.testAllProps('columnRuleWidth'),
        span: !!npf.userAgent.utils.testAllProps('columnSpan'),
        width: !!npf.userAgent.utils.testAllProps('columnWidth')
      };
    }
  }

  return npf.userAgent.css.columnStyles_;
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.cubicBezierRange_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isCubicBezierRangeSupported = function() {
  if (goog.isNull(npf.userAgent.css.cubicBezierRange_)) {
    npf.userAgent.css.cubicBezierRange_ =
      !!goog.dom.createDom(goog.dom.TagName.A, {
        'style': npf.userAgent.utils.PREFIXES.join(
          'transition-timing-function:cubic-bezier(1,0,0,1.1); ')
      }).style.length
  }

  return /** @type {boolean} */ (npf.userAgent.css.cubicBezierRange_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.displayRunIn_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isDisplayRunInSupported = function() {
  if (goog.isNull(npf.userAgent.css.displayRunIn_)) {
    npf.userAgent.css.displayRunIn_ =
      npf.userAgent.utils.testAllProps('display', 'run-in');
  }

  return /** @type {boolean} */ (npf.userAgent.css.displayRunIn_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.displayTable_ = null;

/**
 * `display: table` and `table-cell` test.
 * Both are tested under one name `table-cell`.
 * @return {boolean}
 */
npf.userAgent.css.isDisplayTableSupported = function() {
  if (goog.isNull(npf.userAgent.css.displayTable_)) {
    var styles =
      '#' + npf.userAgent.utils.ID + '{' +
        'display: table; direction: ltr' +
      '}' +
      '#' + npf.userAgent.utils.ID + ' div{' +
        'display: table-cell; padding: 10px' +
      '}';

    npf.userAgent.css.displayTable_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        return elem.childNodes[0].offsetLeft < elem.childNodes[1].offsetLeft;
      }, 2);
  }

  return /** @type {boolean} */ (npf.userAgent.css.displayTable_);
};

/**
 * Tests for `CSS.escape()` support.
 * @return {boolean}
 */
npf.userAgent.css.isEscapeSupported = function() {
  return goog.global.CSS ? 'function' == typeof goog.global.CSS.escape : false;
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.exUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isExUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.exUnit_)) {
    npf.userAgent.css.exUnit_ = false;

    /** @type {!Element} */
    var elem = goog.dom.createElement(goog.dom.TagName.DIV);

    try {
      elem.style.fontSize = '3ex';
      npf.userAgent.css.exUnit_ = -1 < elem.style.fontSize.indexOf('ex');
    } catch (e) { }
  }

  return /** @type {boolean} */ (npf.userAgent.css.exUnit_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.filter_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isFilterSupported = function() {
  if (goog.isNull(npf.userAgent.css.filter_)) {
    if (npf.userAgent.css.isSupportsSupported()) {
      npf.userAgent.css.filter_ = npf.userAgent.utils.testAllProps(
        'filter', 'blur(2px)');
    } else {
      /** @type {!Array<string>} */
      var prefixes = npf.userAgent.utils.PREFIXES;
      /** @type {!goog.dom.DomHelper} */
      var domHelper = goog.dom.getDomHelper();
      /** @type {!Document} */
      var doc = domHelper.getDocument();

      npf.userAgent.css.filter_ =
        !!domHelper.createDom(goog.dom.TagName.A, {
          'style': prefixes.join('filter:blur(2px); ')
        }).style.length &&
        (!goog.isDef(doc.documentMode) || 9 < doc.documentMode);
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.filter_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.flexbox_ = null;

/**
 * Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which
 * allows easy manipulation of layout order and sizing within a container.
 * @return {boolean}
 */
npf.userAgent.css.isFlexboxSupported = function() {
  if (goog.isNull(npf.userAgent.css.flexbox_)) {
    npf.userAgent.css.flexbox_ =
      npf.userAgent.utils.testAllProps('flexBasis', '1px', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.flexbox_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.flexboxLegacy_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isFlexboxLegacySupported = function() {
  if (goog.isNull(npf.userAgent.css.flexboxLegacy_)) {
    npf.userAgent.css.flexboxLegacy_ =
      npf.userAgent.utils.testAllProps('boxDirection', 'reverse', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.flexboxLegacy_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.flexboxTweener_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isFlexboxTweenerSupported = function() {
  if (goog.isNull(npf.userAgent.css.flexboxTweener_)) {
    npf.userAgent.css.flexboxTweener_ =
      npf.userAgent.utils.testAllProps('flexAlign', 'end', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.flexboxTweener_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.flexWrap_ = null;

/**
 * Detects support for the `flex-wrap` CSS property, part of Flexbox, which
 * isn’t present in all Flexbox implementations (notably Firefox).
 *
 * This featured in both the 'tweener' syntax (implemented by IE10) and
 * the 'modern' syntax (implemented by others). This detect will return `true`
 * for either of these implementations, as long as the `flex-wrap` property
 * is supported. So to ensure the modern syntax is supported, use together
 * with `npf.userAgent.css.isFlexboxSupported`:
 * ```javascript
 * if (
 *   npf.userAgent.css.isFlexboxSupported() &&
 *   npf.userAgent.css.isFlexWrapSupported()
 * ) {
 *   // Modern Flexbox with `flex-wrap` supported
 * } else {
 *   // Either old Flexbox syntax, or `flex-wrap` not supported
 * }
 * ```
 * @return {boolean}
 */
npf.userAgent.css.isFlexWrapSupported = function() {
  if (goog.isNull(npf.userAgent.css.flexWrap_)) {
    npf.userAgent.css.flexWrap_ =
      npf.userAgent.utils.testAllProps('flexWrap', 'wrap', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.flexWrap_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.fontFace_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isFontFaceSupported = function() {
  if (goog.isNull(npf.userAgent.css.fontFace_)) {
    /** @type {string} */
    var ua = goog.userAgent.getUserAgentString();
    var match1 = ua.match(/applewebkit\/([0-9]+)/gi);
    /** @type {number} */
    var wkvers = match1 ? parseFloat(match1[1]) : 0;
    /** @type {boolean} */
    var wppre8 = false;

    if (ua.match(/windows phone/gi)) {
      var match2 = ua.match(/iemobile\/([0-9])+/gi);

      if (match2) {
        wppre8 = 9 <= parseFloat(match2[1]);
      }
    }

    npf.userAgent.css.fontFace_ = false;

    if (!(
      ua.match(/w(eb)?osbrowser/gi) || // webos
      (533 > wkvers && ua.match(/android/gi)) || // oldAndroid
      wppre8
    )) {
      var styles = '@font-face {font-family:"font";src:url("https://")}';

      npf.userAgent.css.fontFace_ =
        npf.userAgent.utils.testStyles(styles, function(node, rule) {
          var style = /** @type {HTMLStyleElement} */ (
            goog.dom.getElement('s' + npf.userAgent.utils.ID));
          var sheet = style.sheet || style.styleSheet;
          var cssText = sheet ?
            (sheet.cssRules && sheet.cssRules[0] ?
              sheet.cssRules[0].cssText : sheet.cssText || '') :
            '';
          return /src/i.test(cssText) &&
            0 === cssText.indexOf(rule.split(' ')[0]);
        });
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.fontFace_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.generatedContent_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isGeneratedContentSupported = function() {
  if (goog.isNull(npf.userAgent.css.generatedContent_)) {
    var styles =
      '#' + npf.userAgent.utils.ID + '{font:0/0 a}' +
      '#' + npf.userAgent.utils.ID + ':after{' +
        'content:":)";visibility:hidden;font:7px/1 a' +
      '}';

    npf.userAgent.css.generatedContent_ =
      npf.userAgent.utils.testStyles(styles, function(node) {
        return 7 <= node.offsetHeight;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.generatedContent_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.gradient_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isGradientSupported = function() {
  if (goog.isNull(npf.userAgent.css.gradient_)) {
    var str1 = 'background-image:';
    var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
    var str3 = 'linear-gradient(left top,#9f9, white);';
    /** @type {!Array<string>} */
    var prefixes = npf.userAgent.utils.PREFIXES;
    /** @type {string} */
    var css =
      // standard syntax
      str1 + prefixes.join(str3 + str1).slice(0, -str1.length) +
      // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
      str1 + '-webkit-' + str2;

    // IE6 returns undefined so cast to string
    npf.userAgent.css.gradient_ =
      -1 < ('' + goog.dom.createDom(goog.dom.TagName.A, {
        'style': css
      }).style.backgroundImage).indexOf('gradient');
  }

  return /** @type {boolean} */ (npf.userAgent.css.gradient_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.hiddenScroll_ = null;

/**
 * Detects whether scrollbars on overflowed blocks are hidden (a-la iPhone).
 * @return {boolean}
 */
npf.userAgent.css.isHiddenScrollSupported = function() {
  if (goog.isNull(npf.userAgent.css.hiddenScroll_)) {
    /** @type {string} */
    var styles = '#' + npf.userAgent.utils.ID +
      ' {width:100px;height:100px;overflow:scroll}';
    npf.userAgent.css.hiddenScroll_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        return elem.offsetWidth === elem.clientWidth;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.hiddenScroll_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.hyphen_ = null;

/**
 * @private {boolean?}
 */
npf.userAgent.css.hyphenSoft_ = null;

/**
 * @private {boolean?}
 */
npf.userAgent.css.hyphenSoftFind_ = null;

/**
 * Test for CSS Hyphens, soft Hyphens and soft Hyphens find.
 * @param {function(this:SCOPE,boolean,boolean,boolean)} callback
 * @param {SCOPE=} opt_scope
 * @template SCOPE
 */
npf.userAgent.css.isHyphenSupported = function(callback, opt_scope) {
  if (goog.isNull(npf.userAgent.css.hyphen_)) {
    /** @type {number} */
    var waitTime = 300;
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    /** @type {function()} */
    var runHyphenTest = function() {
      /** @type {!Document} */
      var doc = domHelper.getDocument();

      if (!doc.body && !doc.getElementsByTagName('body')[0]) {
        setTimeout(runHyphenTest, waitTime);

        return;
      }

      /** @type {boolean} */
      var supports = false;
      /** @type {boolean} */
      var softSupports = false;
      /** @type {boolean} */
      var softFindSupports = false;

      if (npf.userAgent.utils.testAllProps('hyphens', 'auto', true)) {
        // Chrome lies about its hyphens support so we need a more robust test
        // crbug.com/107111
        try {
          // Create a div container and a span within that these have to be
          // appended to doc.body, otherwise some browsers can give false
          // negative

          /** @type {!Element} */
          var div = domHelper.createDom(goog.dom.TagName.DIV, {
            'style':
              'position:absolute;top:0;left:0;width:5em;text-align:justify;' +
              'text-justification:newspaper;'
          });
          /** @type {!Element} */
          var span = domHelper.createDom(goog.dom.TagName.SPAN, {
            'innerHTML':
              'Bacon ipsum dolor sit amet jerky velit in culpa hamburger et. ' +
              'Laborum dolor proident, enim dolore duis commodo et strip ' +
              'steak. Salami anim et, veniam consectetur dolore qui ' +
              'tenderloin jowl velit sirloin. Et ad culpa, fatback cillum ' +
              'jowl ball tip ham hock nulla short ribs pariatur aute. Pig ' +
              'pancetta ham bresaola, ut boudin nostrud commodo flank esse ' +
              'cow tongue culpa. Pork belly bresaola enim pig, ea ' +
              'consectetur nisi. Fugiat officia turkey, ea cow jowl pariatur ' +
              'ullamco proident do laborum velit sausage. Magna biltong sint ' +
              'tri-tip commodo sed bacon, esse proident aliquip. Ullamco ham ' +
              'sint fugiat, velit in enim sed mollit nulla cow ut ' +
              'adipisicing nostrud consectetur. Proident dolore beef ribs, ' +
              'laborum nostrud meatball ea laboris rump cupidatat labore ' +
              'culpa. Shankle minim beef, velit sint cupidatat fugiat ' +
              'tenderloin pig et ball tip. Ut cow fatback salami, bacon ball ' +
              'tip et in shank strip steak bresaola. In ut pork belly sed ' +
              'mollit tri-tip magna culpa veniam, short ribs qui in ' +
              'andouille ham consequat. Dolore bacon t-bone, velit short ' +
              'ribs enim strip steak nulla. Voluptate labore ut, biltong ' +
              'swine irure jerky. Cupidatat excepteur aliquip salami dolore. ' +
              'Ball tip strip steak in pork dolor. Ad in esse biltong. ' +
              'Dolore tenderloin exercitation ad pork loin t-bone, dolore in ' +
              'chicken ball tip qui pig. Ut culpa tongue, sint ribeye dolore ' +
              'ex shank voluptate hamburger. Jowl et tempor, boudin pork ' +
              'chop labore ham hock drumstick consectetur tri-tip elit swine ' +
              'meatball chicken ground round. Proident shankle mollit ' +
              'dolore. Shoulder ut duis t-bone quis reprehenderit. Meatloaf ' +
              'dolore minim strip steak, laboris ea aute bacon beef ribs ' +
              'elit shank in veniam drumstick qui. Ex laboris meatball cow ' +
              'tongue pork belly. Ea ball tip reprehenderit pig, sed fatback ' +
              'boudin dolore flank aliquip laboris eu quis. Beef ribs duis ' +
              'beef, cow corned beef adipisicing commodo nisi deserunt ' +
              'exercitation. Cillum dolor t-bone spare ribs, ham hock est ' +
              'sirloin. Brisket irure meatloaf in, boudin pork belly sirloin ' +
              'ball tip. Sirloin sint irure nisi nostrud aliqua. Nostrud ' +
              'nulla aute, enim officia culpa ham hock. Aliqua reprehenderit ' +
              'dolore sunt nostrud sausage, ea boudin pork loin ut t-bone ' +
              'ham tempor. Tri-tip et pancetta drumstick laborum. Ham hock ' +
              'magna do nostrud in proident. Ex ground round fatback, ' +
              'venison non ribeye in.'
          });
          div.appendChild(span);

          domHelper.insertSiblingBefore(
            div, doc.body.firstElementChild || doc.body.firstChild);

          // Get size of unhyphenated text.

          /** @type {number} */
          var spanHeight = span.offsetHeight;
          /** @type {number} */
          var spanWidth = span.offsetWidth;

          // Compare size with hyphenated text.
          div.style.cssText =
            'position:absolute;top:0;left:0;width:5em;text-align:justify;' +
            'text-justification:newspaper;' +
            npf.userAgent.utils.PREFIXES.join('hyphens:auto; ');

          supports =
            span.offsetHeight != spanHeight ||
            span.offsetWidth != spanWidth;

          domHelper.removeNode(div);
          domHelper.removeNode(span);
        } catch (e) { }
      }

      // Use numeric entity instead of &shy; in case it's XHTML.
      softSupports =
        npf.userAgent.css.testHyphens_('&#173;', true, domHelper) &&
        npf.userAgent.css.testHyphens_('&#8203;', false, domHelper);

      softFindSupports =
        npf.userAgent.css.testHyphensFind_('&#173;', domHelper) &&
        npf.userAgent.css.testHyphensFind_('&#8203;', domHelper);

      npf.userAgent.css.hyphen_ = supports;
      npf.userAgent.css.hyphenSoft_ = softSupports;
      npf.userAgent.css.hyphenSoftFind_ = softFindSupports;

      callback.call(opt_scope, supports, softSupports, softFindSupports);
    };

    setTimeout(runHyphenTest, waitTime);
  } else {
    callback.call(opt_scope,
      /** @type {boolean} */ (npf.userAgent.css.hyphen_),
      /** @type {boolean} */ (npf.userAgent.css.hyphenSoft_),
      /** @type {boolean} */ (npf.userAgent.css.hyphenSoftFind_)
    );
  }
};

/**
 * @param {string} delimiter
 * @param {boolean} testWidth
 * @param {!goog.dom.DomHelper} domHelper
 * @return {boolean}
 * @private
 */
npf.userAgent.css.testHyphens_ = function(delimiter, testWidth, domHelper) {
  /** @type {boolean} */
  var result = false;

  try {
    // Create a div container and a span within that these have to be
    // appended to doc.body, otherwise some browsers can give false
    // negative.

    /** @type {!Document} */
    var doc = domHelper.getDocument();
    /** @type {!Element} */
    var div = domHelper.createDom(goog.dom.TagName.DIV, {
      'style': 'position:absolute;top:0;left:0;overflow:visible;width:1.25em;'
    });
    /** @type {!Element} */
    var span = domHelper.createDom(goog.dom.TagName.SPAN, {
      'innerHTML': 'mm'
    });
    /** @type {boolean} */
    var result2 = true;

    div.appendChild(span);
    domHelper.insertSiblingBefore(
      div, doc.body.firstElementChild || doc.body.firstChild);

    // Get height of unwrapped text.

    /** @type {number} */
    var spanSize = span.offsetHeight;

    // Compare height w/ delimiter, to see if it wraps to new line.
    span.innerHTML = 'm' + delimiter + 'm';

    /** @type {boolean} */
    var result1 = span.offsetHeight > spanSize;

    // If we're testing the width too (i.e. for soft-hyphen, not zws),
    // this is because tested Blackberry devices will wrap the text
    // but not display the hyphen.
    if (testWidth) {
      /* get width of wrapped, non-hyphenated text */
      span.innerHTML = 'm<br />m';
      spanSize = span.offsetWidth;

      // Compare width w/ wrapped w/ delimiter to see if hyphen is present.
      span.innerHTML = 'm' + delimiter + 'm';
      result2 = span.offsetWidth > spanSize;
    }

    // results and cleanup
    if (result1 === true && result2 === true) {
      result = true;
    }

    domHelper.removeNode(div);
    domHelper.removeNode(span);
  } catch (e) { }

  return result;
};

/**
 * Testing if in-browser Find functionality will work on hyphenated text.
 * @param {string} delimiter
 * @param {!goog.dom.DomHelper} domHelper
 * @return {boolean}
 * @private
 */
npf.userAgent.css.testHyphensFind_ = function(delimiter, domHelper) {
  /** @type {boolean} */
  var result = false;

  try {
    // Create a dummy input for resetting selection location, and a div
    // container these have to be appended to document.body, otherwise some
    // browsers can give false negative div container gets the doubled testword,
    // separated by the delimiter.
    // Note: giving a width to div gives false positive in iOS Safari.

    /** @type {string} */
    var testword = 'lebowski';
    /** @type {!Document} */
    var doc = domHelper.getDocument();
    /** @type {!Window} */
    var win = domHelper.getWindow();
    /** @type {!Element} */
    var dummy = domHelper.createElement(goog.dom.TagName.INPUT);
    /** @type {!Element} */
    var div = domHelper.createDom(goog.dom.TagName.DIV, {
      'innerHTML': testword + delimiter + testword
    });
    var textrange;

    domHelper.insertSiblingBefore(
      div, doc.body.firstElementChild || doc.body.firstChild);
    domHelper.insertSiblingBefore(dummy, div);

    // Reset the selection to the dummy input element, i.e. BEFORE the div
    // container.
    // stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
    if (dummy.setSelectionRange) {
      dummy.focus();
      dummy.setSelectionRange(0, 0);
    } else if (dummy.createTextRange) {
      textrange = dummy.createTextRange();
      textrange.collapse(true);
      textrange.moveEnd('character', 0);
      textrange.moveStart('character', 0);
      textrange.select();
    }

    // Try to find the doubled testword, without the delimiter.
    if (win.find) {
      result = win.find(testword + testword);
    } else {
      try {
        textrange = win.self.document.body.createTextRange();
        result = textrange.findText(testword + testword);
      } catch (e) { }
    }

    domHelper.removeNode(div);
    domHelper.removeNode(dummy);
  } catch (e) { }

  return result;
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.hsla_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isHslaSupported = function() {
  if (goog.isNull(npf.userAgent.css.hsla_)) {
    /** @type {!Element} */
    var element = goog.dom.createDom(goog.dom.TagName.A, {
      'style': 'background-color:hsla(120,40%,100%,.5)'
    });

    npf.userAgent.css.hsla_ =
      goog.string.contains(element.style.backgroundColor, 'rgba') ||
      goog.string.contains(element.style.backgroundColor, 'hsla');
  }

  return /** @type {boolean} */ (npf.userAgent.css.hsla_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.invalid_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isInvalidSupported = function() {
  if (goog.isNull(npf.userAgent.css.invalid_)) {
    var id = npf.userAgent.utils.ID;
    var styles =
      '#' + id + ' input{height:0;border:0;padding:0;margin:0;width:10px}' +
      '#' + id + ' input:invalid{width:50px}';

    npf.userAgent.css.invalid_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        /** @type {!Element} */
        var input = goog.dom.createDom(goog.dom.TagName.INPUT, {
          'required': true
        });
        elem.appendChild(input);

        return 10 < input.clientWidth;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.invalid_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.lastChild_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isLastChildSupported = function() {
  if (goog.isNull(npf.userAgent.css.lastChild_)) {
    var id = npf.userAgent.utils.ID;
    var styles =
      '#' + id + ' div{width:100px}' +
      '#' + id + ' :last-child{width:200px;display:block}';

    npf.userAgent.css.lastChild_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        return elem.lastChild.offsetWidth > elem.firstChild.offsetWidth;
      }, 2);
  }

  return /** @type {boolean} */ (npf.userAgent.css.lastChild_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.mask_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isMaskSupported = function() {
  if (goog.isNull(npf.userAgent.css.mask_)) {
    npf.userAgent.css.mask_ =
      npf.userAgent.utils.testAllProps('maskRepeat', 'repeat-x', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.mask_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.mediaQuery_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isMediaQuerySupported = function() {
  if (goog.isNull(npf.userAgent.css.mediaQuery_)) {
    npf.userAgent.css.mediaQuery_ = npf.userAgent.utils.mq('only all');
  }

  return /** @type {boolean} */ (npf.userAgent.css.mediaQuery_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.multipleBgs_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isMultipleBgsSupported = function() {
  if (goog.isNull(npf.userAgent.css.multipleBgs_)) {
    // Setting multiple images AND a color on the background shorthand property
    // and then querying the style.background property value for the number of
    // occurrences of "url(" is a reliable method for detecting ACTUAL support
    // for this!

    // If the UA supports multiple backgrounds, there should be three
    // occurrences of the string "url(" in the return value
    // for elemStyle.background.
    npf.userAgent.css.multipleBgs_ =
      (/(url\s*\(.*?){3}/).test(goog.dom.createDom(goog.dom.TagName.A, {
        'style': 'background:url(https://),url(https://),red url(https://)'
      }).style.background);
  }

  return /** @type {boolean} */ (npf.userAgent.css.multipleBgs_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.nthChild_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isNthChildSupported = function() {
  if (goog.isNull(npf.userAgent.css.nthChild_)) {
    // 5 `<div>` elements with `1px` width are created.
    // Then every other element has its `width` set to `2px`.
    // A Javascript loop then tests if the `<div>`s have the expected width
    // using the modulus operator.

    var id = npf.userAgent.utils.ID;
    var styles =
      '#' + id + ' div{width:1px}' +
      '#' + id + ' div:nth-child(2n){width:2px;}';

    npf.userAgent.css.nthChild_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        var elems = elem.getElementsByTagName(goog.dom.TagName.DIV);
        /** @type {boolean} */
        var supports = true;

        for (var i = 0; i < 5; i++) {
          supports = supports && i % 2 + 1 === elems[i].offsetWidth;
        }

        return supports;
      }, 5);
  }

  return /** @type {boolean} */ (npf.userAgent.css.nthChild_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.objectFit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isObjectFitSupported = function() {
  if (goog.isNull(npf.userAgent.css.objectFit_)) {
    npf.userAgent.css.objectFit_ =
      !!npf.userAgent.utils.prefixedCss('objectFit', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.objectFit_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.opacity_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isOpacitySupported = function() {
  if (goog.isNull(npf.userAgent.css.opacity_)) {
    // Browsers that actually have CSS Opacity implemented have done so
    // according to spec, which means their return values are within the
    // range of [0.0,1.0] - including the leading zero.
    npf.userAgent.css.opacity_ =
      (/^0.55$/).test(goog.dom.createDom(goog.dom.TagName.A, {
        'style': npf.userAgent.utils.PREFIXES.join('opacity:.55;')
      }).style.opacity);
  }

  return /** @type {boolean} */ (npf.userAgent.css.opacity_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.overflowScrolling_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isOverflowScrollingSupported = function() {
  if (goog.isNull(npf.userAgent.css.overflowScrolling_)) {
    npf.userAgent.css.overflowScrolling_ =
      npf.userAgent.utils.testAllProps('overflowScrolling', 'touch', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.overflowScrolling_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.pointerEvent_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isPointerEventSupported = function() {
  if (goog.isNull(npf.userAgent.css.pointerEvent_)) {
    npf.userAgent.css.pointerEvent_ =
      'auto' === goog.dom.createDom(goog.dom.TagName.A, {
        'style': 'pointer-events:auto'
      }).style.pointerEvents;
  }

  return /** @type {boolean} */ (npf.userAgent.css.pointerEvent_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.positionSticky_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isPositionStickySupported = function() {
  if (goog.isNull(npf.userAgent.css.positionSticky_)) {
    // Sticky positioning - constrains an element to be positioned inside the
    // intersection of its container box, and the viewport.

    var prop = 'position:';
    var value = 'sticky';
    /** @type {!Array<string>} */
    var prefixes = npf.userAgent.utils.PREFIXES;

    npf.userAgent.css.positionSticky_ =
      -1 < goog.dom.createDom(goog.dom.TagName.A, {
        'style': prop + prefixes.join(value + ';' + prop).slice(0, -prop.length)
      }).style.position.indexOf(value)
  }

  return /** @type {boolean} */ (npf.userAgent.css.positionSticky_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.pseudoAnimation_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isPseudoAnimationSupported = function() {
  if (goog.isNull(npf.userAgent.css.pseudoAnimation_)) {
    /** @type {!goog.dom.DomHelper} */
    var domHelper = goog.dom.getDomHelper();
    /** @type {!Window} */
    var win = domHelper.getWindow();
    npf.userAgent.css.pseudoAnimation_ = false;

    if (npf.userAgent.css.isAnimationSupported() && win.getComputedStyle) {
      var id = npf.userAgent.utils.ID;
      var prefixes = npf.userAgent.utils.PREFIXES;
      var styles =
        '@' + prefixes.join(
          'keyframes csspseudoanimations{from{font-size:10px;}}@').
            replace(/\@$/, '') +
          '#' + id + ':before{content:" ";font-size:5px;' +
          prefixes.join('animation:csspseudoanimations 1ms infinite;') +
        '}';

      npf.userAgent.css.pseudoAnimation_ =
        npf.userAgent.utils.testStyles(styles, function(elem) {
          return '10px' ===
            win.getComputedStyle(elem, ':before').getPropertyValue('font-size');
        });
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.pseudoAnimation_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.pseudoTransition_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isPseudoTransitionSupported = function() {
  if (goog.isNull(npf.userAgent.css.pseudoTransition_)) {
    /** @type {!Window} */
    var win = goog.dom.getDomHelper().getWindow();
    npf.userAgent.css.pseudoTransition_ = false;

    if (npf.userAgent.css.isTransitionSupported() && win.getComputedStyle) {
      var id = npf.userAgent.utils.ID;
      var prefixes = npf.userAgent.utils.PREFIXES;
      var styles =
        '#' + id + ':before{content:" ";font-size:5px;' +
          prefixes.join('transition:0s 100s;') + '}' +
        '#' + id + '.trigger:before{font-size:10px;}';

      npf.userAgent.css.pseudoTransition_ =
        npf.userAgent.utils.testStyles(styles, function(elem) {
          // Force rendering of the element's styles so that the transition will
          // trigger
          win.getComputedStyle(elem, ':before').getPropertyValue('font-size');
          elem.className += 'trigger';

          return '5px' ===
            win.getComputedStyle(elem, ':before').getPropertyValue('font-size');
        });
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.pseudoTransition_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.reflection_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isReflectionSupported = function() {
  if (goog.isNull(npf.userAgent.css.reflection_)) {
    npf.userAgent.css.reflection_ =
      npf.userAgent.utils.testAllProps('boxReflect', 'above', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.reflection_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.region_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isRegionSupported = function() {
  if (goog.isNull(npf.userAgent.css.region_)) {
    // We start with a CSS parser test then we check page geometry to see if
    // it's affected by regions.
    // Later we might be able to retire the second part, as WebKit builds with
    // the false positives die out.

    npf.userAgent.css.region_ = false;

    // CSS regions don't work inside of SVG elements. Rather than update the
    // below test to work in an SVG context, just exit early to save bytes.

    if (!npf.userAgent.utils.isSvg()) {
      // Get the 'flowFrom' property name available in the browser.
      // Either default or vendor prefixed.
      // If the property name can't be found we'll get Boolean 'false' and fail
      // quickly.

      /** @type {string?} */
      var flowFromProperty = npf.userAgent.utils.prefixedCss('flowFrom', true);
      /** @type {string?} */
      var flowIntoProperty = npf.userAgent.utils.prefixedCss('flowInto', true);

      if (flowFromProperty && flowIntoProperty) {
        // If CSS parsing is there, try to determine if regions actually work.

        /** @type {Element} */
        var iframeContainer = goog.dom.createElement(goog.dom.TagName.IFRAME);
        /** @type {Element} */
        var container = goog.dom.createDom(goog.dom.TagName.DIV, {
          'style': 'top:150px;left:150px;padding:0;'
        });
        /** @type {Element} */
        var content = goog.dom.createDom(goog.dom.TagName.DIV, {
          'innerText': 'M'
        });
        /** @type {Element} */
        var region = goog.dom.createDom(goog.dom.TagName.DIV, {
          'style': 'width:50px;height:50px;padding:42px;'
        });

        /** @type {string} */
        var flowName = npf.userAgent.utils.ID + '_flow_for_regions_check';
        var docElement = goog.dom.getDomHelper().getDocument().documentElement;

        region.style[flowFromProperty] = flowName;
        container.appendChild(content);
        container.appendChild(region);
        docElement.appendChild(container);

        var plainRect = content.getBoundingClientRect();

        content.style[flowIntoProperty] = flowName;
        var flowedRect = content.getBoundingClientRect();

        var delta = parseInt(flowedRect.left - plainRect.left, 10);
        docElement.removeChild(container);

        if (42 == delta) {
          npf.userAgent.css.region_ = true;
        } else {
          // IE only allows for the content to come from iframes. This has the
          // side effect of automatic collapsing of iframes once they get
          // the flow-into property set. checking for a change on the height
          // allows us to detect this in a sync way, without having to wait
          // for a frame to load.

          docElement.appendChild(iframeContainer);
          plainRect = iframeContainer.getBoundingClientRect();
          iframeContainer.style[flowIntoProperty] = flowName;
          flowedRect = iframeContainer.getBoundingClientRect();

          if (
            0 < plainRect.height &&
            plainRect.height !== flowedRect.height &&
            0 === flowedRect.height
          ) {
            npf.userAgent.css.region_ = true;
          }
        }

        content = null;
        region = null;
        container = null;
        iframeContainer = null;
      }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.region_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.remUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isRemUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.remUnit_)) {
    // "The 'rem' unit ('root em') is relative to the computed
    // value of the 'font-size' value of the root element."
    // you can test by checking if the prop was ditched.

    /** @type {!Element} */
    var element = goog.dom.createElement(goog.dom.TagName.A);

    try {
      element.style.fontSize = '3rem';
    } catch (e) {}

    npf.userAgent.css.remUnit_ = (/rem/).test(element.style.fontSize);
  }

  return /** @type {boolean} */ (npf.userAgent.css.remUnit_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.resize_ = null;

/**
 * Test for CSS 3 UI "resize" property.
 * @return {boolean}
 */
npf.userAgent.css.isResizeSupported = function() {
  if (goog.isNull(npf.userAgent.css.resize_)) {
    npf.userAgent.css.resize_ =
      npf.userAgent.utils.testAllProps('resize', 'both', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.resize_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.rgba_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isRgbaSupported = function() {
  if (goog.isNull(npf.userAgent.css.rgba_)) {
    npf.userAgent.css.rgba_ =
      -1 < ('' + goog.dom.createDom(goog.dom.TagName.A, {
        'style': 'background-color:rgba(150,255,150,.5)'
      }).style.backgroundColor).indexOf('rgba');
  }

  return /** @type {boolean} */ (npf.userAgent.css.rgba_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.scrollbar_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isScrollbarSupported = function() {
  if (goog.isNull(npf.userAgent.css.scrollbar_)) {
    /** @type {!Array<string>} */
    var prefixes = npf.userAgent.utils.PREFIXES;
    var id = npf.userAgent.utils.ID;
    var styles =
      '#' + id + '{overflow:scroll;width:40px;height:40px;}' +
      '#' + prefixes.join('scrollbar{width:0px} #' + id + '::').
        split('#').
        slice(1).
        join('#') + 'scrollbar{width:0px}';

    npf.userAgent.css.scrollbar_ =
      npf.userAgent.utils.testStyles(styles, function(node) {
        return 40 == node.scrollWidth;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.scrollbar_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.shape_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isShapeSupported = function() {
  if (goog.isNull(npf.userAgent.css.shape_)) {
    npf.userAgent.css.shape_ =
      npf.userAgent.utils.testAllProps('shapeOutside', 'content-box', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.shape_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.siblingGeneral_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isSiblingGeneralSupported = function() {
  if (goog.isNull(npf.userAgent.css.siblingGeneral_)) {
    var id = npf.userAgent.utils.ID;
    var styles =
      '#' + id + ' div{width:100px}' +
      '#' + id + ' div ~ div{width:200px;display:block}';

    npf.userAgent.css.siblingGeneral_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        return 200 == elem.lastChild.offsetWidth;
      }, 2);
  }

  return /** @type {boolean} */ (npf.userAgent.css.siblingGeneral_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.subpixelFont_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isSubpixelFontSupported = function() {
  if (goog.isNull(npf.userAgent.css.subpixelFont_)) {
    /** @type {!Window} */
    var win = goog.dom.getDomHelper().getWindow();
    var styles =
      '#' + npf.userAgent.utils.ID + '{' +
        'position:absolute;top:-10em;visibility:hidden;' +
        'font:normal 10px arial;' +
      '}' +
      '#subpixel{float:left;font-size:33.3333%;}';

    npf.userAgent.css.subpixelFont_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        var subpixel = elem.firstChild;
        subpixel.innerHTML = 'This is a text written in Arial';

        return win.getComputedStyle ? '44px' !== win.getComputedStyle(
          /** @type {!Element} */ (subpixel), null).getPropertyValue('width') :
          false;
      }, 1, ['subpixel'])
  }

  return /** @type {boolean} */ (npf.userAgent.css.subpixelFont_);
};

/**
 * @return {boolean}
 */
npf.userAgent.css.isSupportsSupported = function() {
  var newSyntax = 'CSS' in goog.global && 'supports' in goog.global['CSS'];
  var oldSyntax = 'supportsCSS' in goog.global;

  return !!(newSyntax || oldSyntax);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.target_ = null;

/**
 * Detects support for the ':target' CSS pseudo-class.
 * @return {boolean}
 */
npf.userAgent.css.isTargetSupported = function() {
  if (goog.isNull(npf.userAgent.css.target_)) {
    npf.userAgent.css.target_ = false;

    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    if ('querySelectorAll' in doc) {
      try {
        doc.querySelectorAll(':target');
        npf.userAgent.css.target_ = true;
      } catch (e) { }
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.target_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.textAlignLast_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isTextAlignLastSupported = function() {
  if (goog.isNull(npf.userAgent.css.textAlignLast_)) {
    npf.userAgent.css.textAlignLast_ =
      npf.userAgent.utils.testAllProps('textAlignLast');
  }

  return /** @type {boolean} */ (npf.userAgent.css.textAlignLast_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.textOverflowEllipsis_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isTextOverflowEllipsisSupported = function() {
  if (goog.isNull(npf.userAgent.css.textOverflowEllipsis_)) {
    npf.userAgent.css.textOverflowEllipsis_ =
      npf.userAgent.utils.testAllProps('textOverflow', 'ellipsis');
  }

  return /** @type {boolean} */ (npf.userAgent.css.textOverflowEllipsis_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.textShadow_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isTextShadowSupported = function() {
  if (goog.isNull(npf.userAgent.css.textShadow_)) {
    npf.userAgent.css.textShadow_ =
      npf.userAgent.utils.testProp('textShadow', '1px 1px');
  }

  return /** @type {boolean} */ (npf.userAgent.css.textShadow_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.transform_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isTransformSupported = function() {
  if (goog.isNull(npf.userAgent.css.transform_)) {
    /** @type {string} */
    var ua = goog.userAgent.getUserAgentString();
    npf.userAgent.css.transform_ = -1 === ua.indexOf('Android 2.') &&
      npf.userAgent.utils.testAllProps('transform', 'scale(1)', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.transform_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.transform3d_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isTransform3dSupported = function() {
  if (goog.isNull(npf.userAgent.css.transform3d_)) {
    /** @type {!Document} */
    var doc = goog.dom.getDomHelper().getDocument();

    // Webkit's 3D transforms are passed off to the browser's own graphics
    // renderer.
    // It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
    // some conditions. As a result, Webkit typically recognizes the syntax but
    // will sometimes throw a false positive, thus we must do a more thorough
    // check:
    if (
      npf.userAgent.utils.testAllProps('perspective', '1px', true) &&
      ('webkitPerspective' in doc.documentElement.style)
    ) {
      /** @type {string} */
      var mq = npf.userAgent.css.isSupportsSupported() ?
        // Use CSS Conditional Rules if available
        '@supports (perspective: 1px)' :
        // Otherwise, Webkit allows this media query to succeed only if the
        // feature is enabled.
        // `@media (transform-3d),(-webkit-transform-3d){ ... }`
        '@media (transform-3d),(-webkit-transform-3d)';

      // If loaded inside the body tag and the test element inherits any
      // padding, margin or borders it will fail
      mq +=
        '{' +
          '#' + npf.userAgent.utils.ID + '{' +
            'left:9px;position:absolute;height:5px;margin:0;' +
            'padding:0;border:0' +
          '}' +
        '}';

      npf.userAgent.css.transform3d_ =
        npf.userAgent.utils.testStyles(mq, function(elem) {
          return 9 === elem.offsetLeft && 5 === elem.offsetHeight;
        });
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.transform3d_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.transformStylePreserver3d_ = null;

/**
 * Detects support for `transform-style: preserve-3d`, for getting a proper
 * 3D perspective on elements.
 * @return {boolean}
 */
npf.userAgent.css.isTransformStylePreserver3dSupported = function() {
  if (goog.isNull(npf.userAgent.css.transformStylePreserver3d_)) {
    npf.userAgent.css.transformStylePreserver3d_ =
      npf.userAgent.utils.testAllProps('transformStyle', 'preserve-3d');
  }

  return /** @type {boolean} */ (npf.userAgent.css.transformStylePreserver3d_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.transition_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isTransitionSupported = function() {
  if (goog.isNull(npf.userAgent.css.transition_)) {
    npf.userAgent.css.transition_ =
      npf.userAgent.utils.testAllProps('transition', 'all', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.transition_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.userSelect_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isUserSelectSupported = function() {
  if (goog.isNull(npf.userAgent.css.userSelect_)) {
    npf.userAgent.css.userSelect_ =
      npf.userAgent.utils.testAllProps('userSelect', 'none', true);
  }

  return /** @type {boolean} */ (npf.userAgent.css.userSelect_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.valid_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isValidSupported = function() {
  if (goog.isNull(npf.userAgent.css.valid_)) {
    var id = npf.userAgent.utils.ID;
    var styles =
      '#' + id + ' input{height:0;border:0;padding:0;margin:0;width:10px}' +
      '#' + id + ' input:valid{width:50px}';

    npf.userAgent.css.valid_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        var input = /** @type {!HTMLInputElement} */ (
          goog.dom.createElement(goog.dom.TagName.INPUT));
        elem.appendChild(input);

        return 10 < input.clientWidth;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.valid_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.vhUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isVhUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.vhUnit_)) {
    /** @type {!Window} */
    var win = goog.dom.getDomHelper().getWindow();
    var styles = '#' + npf.userAgent.utils.ID + '{height:50vh;}';

    npf.userAgent.css.vhUnit_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        var style = win.getComputedStyle ?
          getComputedStyle(elem, null) : elem.currentStyle;

        return parseInt(style['height'], 10) == Math.floor(win.innerHeight / 2);
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.vhUnit_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.vmaxUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isVmaxUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.vmaxUnit_)) {
    var styles =
      '#' + npf.userAgent.utils.ID + '1{width: 50vmax}' +
      '#' + npf.userAgent.utils.ID + '2{' +
        'width:50px;height:50px;overflow:scroll' +
      '}' +
      '#' + npf.userAgent.utils.ID + '3{' +
        'position:fixed;top:0;left:0;bottom:0;right:0' +
      '}';

    npf.userAgent.css.vmaxUnit_ =
      npf.userAgent.utils.testStyles(styles, function(node) {
        var elem = node.childNodes[2];
        var scroller = node.childNodes[1];
        var fullSizeElem = node.childNodes[0];
        /** @type {number} */
        var scrollbarWidth = Math.floor(
          (scroller.offsetWidth - scroller.clientWidth) / 2);
        /** @type {number} */
        var oneVw = fullSizeElem.clientWidth / 100;
        /** @type {number} */
        var oneVh = fullSizeElem.clientHeight / 100;
        /** @type {number} */
        var expectedWidth = Math.floor(Math.max(oneVw, oneVh) * 50);
        var style = goog.global.getComputedStyle ?
          getComputedStyle(elem, null) : elem.currentStyle;
        /** @type {number} */
        var compWidth = parseInt(style['width'], 10);

        return npf.userAgent.css.roundedEquals_(expectedWidth, compWidth) ||
          npf.userAgent.css.roundedEquals_(
            expectedWidth, compWidth - scrollbarWidth);
      }, 3);
  }

  return /** @type {boolean} */ (npf.userAgent.css.vmaxUnit_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.vminUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isVminUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.vminUnit_)) {
    var styles =
      '#' + npf.userAgent.utils.ID + '1{width: 50vm;width:50vmin}' +
      '#' + npf.userAgent.utils.ID + '2{' +
        'width:50px;height:50px;overflow:scroll' +
      '}' +
      '#' + npf.userAgent.utils.ID + '3{' +
        'position:fixed;top:0;left:0;bottom:0;right:0' +
      '}';

    npf.userAgent.css.vminUnit_ =
      npf.userAgent.utils.testStyles(styles, function(node) {
        var elem = node.childNodes[2];
        var scroller = node.childNodes[1];
        var fullSizeElem = node.childNodes[0];
        /** @type {number} */
        var scrollbarWidth = Math.floor(
          (scroller.offsetWidth - scroller.clientWidth) / 2);
        /** @type {number} */
        var one_vw = fullSizeElem.clientWidth / 100;
        /** @type {number} */
        var one_vh = fullSizeElem.clientHeight / 100;
        /** @type {number} */
        var expectedWidth = Math.floor(Math.min(one_vw, one_vh) * 50);
        var style = goog.global.getComputedStyle ?
          getComputedStyle(elem, null) : elem.currentStyle;
        /** @type {number} */
        var compWidth = parseInt(style['width'], 10);

        return npf.userAgent.css.roundedEquals_(expectedWidth, compWidth) ||
          npf.userAgent.css.roundedEquals_(
            expectedWidth, compWidth - scrollbarWidth);
      }, 3);
  }

  return /** @type {boolean} */ (npf.userAgent.css.vminUnit_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.vwUnit_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isVwUnitSupported = function() {
  if (goog.isNull(npf.userAgent.css.vwUnit_)) {
    var styles = '#' + npf.userAgent.utils.ID + '{width:50vw;}';

    npf.userAgent.css.vwUnit_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        /** @type {!Window} */
        var win = goog.dom.getDomHelper().getWindow();
        var style = goog.global.getComputedStyle ?
          getComputedStyle(elem, null) : elem.currentStyle;

        return parseInt(style.width, 10) == parseInt(win.innerWidth / 2, 10);
      });
  }

  return /** @type {boolean} */ (npf.userAgent.css.vwUnit_);
};

/**
 * Detects support for the `will-change` css property, which formally signals
 * to the browser that an element will be animating.
 * @return {boolean}
 */
npf.userAgent.css.isWillChangeSupported = function() {
  /** @type {!Document} */
  var doc = goog.dom.getDomHelper().getDocument();

  return 'willChange' in doc.documentElement.style;
};

/**
 * @private {boolean?}
 */
npf.userAgent.css.wrapFlow_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.css.isWrapFlowSupported = function() {
  if (goog.isNull(npf.userAgent.css.wrapFlow_)) {
    npf.userAgent.css.wrapFlow_ = false;

    /** @type {string?} */
    var prefixedProperty = npf.userAgent.utils.prefixedCss('wrapFlow');

    if (prefixedProperty && !npf.userAgent.utils.isSvg()) {
      // If the CSS parsing is there we need to determine if wrap-flow actually
      // works to avoid false positive cases, e.g. the browser parses
      // the property, but it hasn't got the implementation
      // for the functionality yet.

      // First we create a div with two adjacent divs inside it. The first div
      // will be the content, the second div will be the exclusion area.
      // We use the "wrap-flow: end" property to test the actual behavior.
      // (http://dev.w3.org/csswg/css3-exclusions/#wrap-flow-property)
      // The wrap-flow property is applied to the exclusion area what has a 50px
      // left offset and a 100px width.
      // If the wrap-flow property is working correctly then the content should
      // start after the exclusion area, so the content's left offset should
      // be 150px.

      /** @type {Element} */
      var container = goog.dom.createElement(goog.dom.TagName.DIV);
      /** @type {Element} */
      var exclusion = goog.dom.createDom(goog.dom.TagName.DIV, {
        'style': 'position:absolute;left:50px;width:100px;height:20px;' +
          prefixedProperty + ':end;'
      });
      /** @type {Element} */
      var content = goog.dom.createDom(goog.dom.TagName.SPAN, {
        'innerText': 'X'
      });
      /** @type {Element} */
      var docElement = goog.dom.getDomHelper().getDocument().documentElement;

      container.appendChild(exclusion);
      container.appendChild(content);
      docElement.appendChild(container);

      /** @type {number} */
      var leftOffset = content.offsetLeft;

      docElement.removeChild(container);
      exclusion = null;
      content = null;
      container = null;

      npf.userAgent.css.wrapFlow_ = 150 == leftOffset;
    }
  }

  return /** @type {boolean} */ (npf.userAgent.css.wrapFlow_);
};
