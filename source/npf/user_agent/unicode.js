goog.provide('npf.userAgent.unicode');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.unicode.supported_ = null;

/**
 * Detects if unicode characters are supported in the current document.
 *
 * Detection is made by testing missing glyph box rendering against star
 * character. If widths are the same, this "probably" means the browser
 * didn't support the star character and rendered a glyph box instead.
 * Just need to ensure the font characters have different widths.
 *
 * @return {boolean}
 */
npf.userAgent.unicode.isSupported = function() {
  if (goog.isNull(npf.userAgent.unicode.supported_)) {
    /** @type {string} */
    var styles = '#' + npf.userAgent.utils.ID +
      '{font-family:Arial,sans;font-size:300em;}';

    npf.userAgent.unicode.supported_ =
      npf.userAgent.utils.testStyles(styles, function(node) {
        /** @type {boolean} */
        var isSvg = npf.userAgent.utils.isSvg();
        /** @type {!Element} */
        var missingGlyph = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'innerHTML': isSvg ? '\u5987' : '&#5987'
        });
        /** @type {!Element} */
        var star = goog.dom.createDom(goog.dom.TagName.SPAN, {
          'innerHTML': isSvg ? '\u2606' : '&#9734'
        });

        node.appendChild(missingGlyph);
        node.appendChild(star);

        return 'offsetWidth' in missingGlyph &&
          missingGlyph.offsetWidth !== star.offsetWidth;
      });
  }

  return /** @type {boolean} */ (npf.userAgent.unicode.supported_);
};

/**
 * @private {boolean?}
 */
npf.userAgent.unicode.range_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.unicode.isRangeSupported = function() {
  if (goog.isNull(npf.userAgent.unicode.range_)) {
    /** @type {string} */
    var styles =
      '@font-face{' +
        'font-family:"unicodeRange";' +
        'src:local("Arial");' +
        'unicode-range:U+0020,U+002E' +
      '}' +
      '#' + npf.userAgent.utils.ID + ' span{' +
        'font-size:20px;' +
        'display:inline-block;' +
        'font-family:"unicodeRange",monospace' +
      '}' +
      '#' + npf.userAgent.utils.ID + ' .mono{font-family:monospace}';

    npf.userAgent.unicode.range_ =
      npf.userAgent.utils.testStyles(styles, function(elem) {
        // we use specify a unicode-range of 002E (the `.` glyph,
        // and a monospace font as the fallback. If the first of
        // these test glyphs is a different width than the other
        // the other three (which are all monospace), then we
        // have a winner.
        var testGlyphs = ['.', '.', 'm', 'm'];

        for (var i = 0; i < testGlyphs.length; i++) {
          /** @type {!Element} */
          var elm = goog.dom.createDom(goog.dom.TagName.SPAN, {
            'class': i % 2 ? 'mono' : '',
            'innerHTML': testGlyphs[i]
          });
          elem.appendChild(elm);
          testGlyphs[i] = elm.clientWidth;
        }

        return testGlyphs[0] !== testGlyphs[1] &&
          testGlyphs[2] === testGlyphs[3];
      });
  }

  return /** @type {boolean} */ (npf.userAgent.unicode.range_);
};
