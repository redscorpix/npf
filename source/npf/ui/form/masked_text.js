goog.provide('npf.ui.form.MaskedText');

goog.require('goog.array');
goog.require('goog.events.EventType');
goog.require('goog.userAgent.product');
goog.require('npf.ui.form.Text');
goog.require('npf.ui.form.MaskedTextRenderer');


/**
 * @param {string} name
 * @param {string} mask
 * @param {string|null=} opt_maskedPlaceholderSymbol
 * @param {Object.<string>=} opt_definitions
 * @param {npf.ui.form.MaskedTextRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @struct
 * @extends {npf.ui.form.Text}
 */
npf.ui.form.MaskedText = function(name, mask, opt_maskedPlaceholderSymbol,
    opt_definitions, opt_renderer, opt_domHelper) {

  /**
   * @private {number}
   */
  this.firstNonMaskPos_ = -1;

  /**
   * @private {string}
   */
  this.mask_ = mask;

  /**
   * @private {string}
   */
  this.maskPlaceholder_ = opt_maskedPlaceholderSymbol || '_';

  /**
   * @private {boolean}
   */
  this.maskPlaceholderVisible_ = true;

  /**
   * @private {Array.<RegExp?>}
   */
  this.tests_ = [];

  /** @type {!Object.<string>} */
  var defs = opt_definitions || npf.ui.form.MaskedText.defaultDefinitions;

  goog.array.forEach(this.mask_.split(''), function(token, i) {
    /** @type {RegExp} */
    var test = null;

    if (defs[token]) {
      test = new RegExp(defs[token]);

      if (-1 == this.firstNonMaskPos_) {
        this.firstNonMaskPos_ = i;
      }
    }

    this.tests_.push(test);
  }, this);

  npf.ui.form.MaskedText.base(this, 'constructor', name, opt_renderer ||
    npf.ui.form.MaskedTextRenderer.getInstance(), opt_domHelper);
};
goog.inherits(npf.ui.form.MaskedText, npf.ui.form.Text);


/**
 * @type {!Object.<string>}
 */
npf.ui.form.MaskedText.defaultDefinitions = {
  '9': '[0-9]',
  'a': '[A-Za-z]',
  '*': '[A-Za-z0-9]'
};


/** @inheritDoc */
npf.ui.form.MaskedText.prototype.enterDocument = function() {
  npf.ui.form.MaskedText.base(this, 'enterDocument');

  /** @type {Element} */
  var valueElement = this.getValueElement();

  if (valueElement) {
    this.getHandler().
      listen(valueElement, goog.events.EventType.KEYDOWN, this.onKeyDown_).
      listen(valueElement, goog.events.EventType.KEYPRESS, this.onKeyPress_);
  }
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.disposeInternal = function() {
  npf.ui.form.MaskedText.base(this, 'disposeInternal');

  this.tests_ = null;
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.initializeInternal = function() {
  npf.ui.form.MaskedText.base(this, 'initializeInternal');

  this.applyMaskPlaceholderVisible(this.isMaskPlaceholderVisible());
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.handleFocus = function(e) {
  if (this.isPlaceholderEnabled()) {
    this.applyValue(this.getValue());
    this.setMaskPlaceholderVisible(this.checkMaskPlaceholderVisible());
    this.setPlaceholderVisible(this.checkPlaceholderVisible());
  }

  npf.ui.form.MaskedText.base(this, 'handleFocus', e);

  /** @type {!Array.<number>} */
  var caret = this.getMaxCaret_(this.getValue());
  this.setCaret(caret[0], caret[1]);
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.handleBlur = function(e) {
  if (this.isPlaceholderEnabled()) {
    this.applyValue(this.getValue());
    this.setMaskPlaceholderVisible(this.checkMaskPlaceholderVisible());
    this.setPlaceholderVisible(this.checkPlaceholderVisible());
  }

  npf.ui.form.MaskedText.base(this, 'handleBlur', e);
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.checkPlaceholderVisible = function() {
  return npf.ui.form.MaskedText.base(this, 'checkPlaceholderVisible') &&
    !this.isFocused();
};

/**
 * @param {*} value
 * @return {string}
 * @protected
 * @override
 */
npf.ui.form.MaskedText.prototype.correctValue = function(value) {
  var oldValue = /** @type {string} */ (value);
  /** @type {string} */
  var newValue = '';
  /** @type {number} */
  var index = 0;

  goog.array.every(this.mask_.split(''), function(token, i) {
    if (this.tests_[i]) {
      /** @type {string} */
      var symbol = oldValue.charAt(index);

      if (!symbol || !this.tests_[i].test(symbol)) {
        return false;
      }

      index++;
      newValue += symbol;
    }

    return true;
  }, this);

  return newValue;
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.applyValue = function(value, opt_noRender) {
  npf.ui.form.MaskedText.base(this, 'applyValue', value, opt_noRender);

  if (this.isPlaceholderEnabled()) {
    this.setMaskPlaceholderVisible(this.checkMaskPlaceholderVisible());
  }
};

/** @inheritDoc */
npf.ui.form.MaskedText.prototype.onInput = function() {
  var maskedValue = /** @type {string} */ (this.getValueFromElement());
  /** @type {string} */
  var value = this.convertMaskedTextToValue(maskedValue);
  /** @type {string} */
  var rightMaskedValue = this.convertValueToMaskedText(value);
  /** @type {boolean} */
  var force = maskedValue != rightMaskedValue;
  /** @type {!Array.<number>} */
  var caret = this.getMaxCaret_(this.getValue(), value);

  this.setValue(value, !force, force);
  this.setCaret(caret[0], caret[1]);
};

/**
 * @param {number} pos
 * @return {number}
 * @private
 */
npf.ui.form.MaskedText.prototype.seekNext_ = function(pos) {
  while (++pos < this.mask_.length && !this.tests_[pos]) {};

  return pos;
};

/**
 * @param {number} pos
 * @return {number}
 * @private
 */
npf.ui.form.MaskedText.prototype.seekPrev_ = function(pos) {
  while (--pos >= 0 && !this.tests_[pos]) {};

  return pos;
};

/**
 * @return {Array.<number>}
 */
npf.ui.form.MaskedText.prototype.getCaret = function() {
  var renderer = /** @type {npf.ui.form.FieldRenderer} */ (this.getRenderer());

  return renderer.getCaret(this);
};

/**
 * @param {number} start
 * @param {number=} opt_end
 */
npf.ui.form.MaskedText.prototype.setCaret = function(start, opt_end) {
  var renderer = /** @type {npf.ui.form.FieldRenderer} */ (this.getRenderer());

  return renderer.setCaret(this, start, opt_end);
};

/**
 * @return {string}
 */
npf.ui.form.MaskedText.prototype.getMask = function() {
  return this.mask_;
};

/**
 * @return {Element}
 */
npf.ui.form.MaskedText.prototype.getMaskPlaceholderElement = function() {
  var renderer = /** @type {npf.ui.form.FieldRenderer} */ (this.getRenderer());

  return renderer.getMaskPlaceholderElement(this.getElement());
};

/**
 * @return {{length: number}?}
 */
npf.ui.form.MaskedText.prototype.getMaskPlaceholderSymbolElements = function() {
  var renderer = /** @type {npf.ui.form.FieldRenderer} */ (this.getRenderer());

  return renderer.getMaskPlaceholderSymbolElements(this.getElement());
};

/**
 * @return {string}
 */
npf.ui.form.MaskedText.prototype.getMaskPlaceholderSymbol = function() {
  return this.maskPlaceholder_;
};

/**
 * @return {boolean}
 * @protected
 */
npf.ui.form.MaskedText.prototype.checkMaskPlaceholderVisible = function() {
  if (this.isPlaceholderEnabled()) {
    return !this.isEmpty() || this.isFocused();
  }

  return true;
};

/**
 * @return {boolean}
 */
npf.ui.form.MaskedText.prototype.isMaskPlaceholderVisible = function() {
  return this.maskPlaceholderVisible_;
};

/**
 * @param {boolean} visible
 */
npf.ui.form.MaskedText.prototype.setMaskPlaceholderVisible = function(visible) {
  if (this.isMaskPlaceholderVisible() != visible) {
    this.setMaskPlaceholderVisibleInternal(visible);
    this.applyMaskPlaceholderVisible(this.isMaskPlaceholderVisible());
  }
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.form.MaskedText.prototype.setMaskPlaceholderVisibleInternal = function(
    visible) {
  this.maskPlaceholderVisible_ = visible;
};

/**
 * @param {boolean} visible
 * @protected
 */
npf.ui.form.MaskedText.prototype.applyMaskPlaceholderVisible = function(
    visible) {
  var renderer = /** @type {npf.ui.form.FieldRenderer} */ (this.getRenderer());
  renderer.setMaskPlaceholderVisible(this, visible);
};

/**
 * @return {boolean}
 */
npf.ui.form.MaskedText.prototype.isMaskedSymbol = function(index) {
  return !!this.tests_[index];
};

/**
 * @param {string} text
 * @return {string}
 */
npf.ui.form.MaskedText.prototype.convertMaskedTextToValue = function(text) {
  /** @type {string} */
  var value = '';

  goog.array.every(this.tests_, function(test, i) {
    /** @type {string} */
    var symbol = text.charAt(i);

    if (symbol && (!test || test.test(symbol))) {
      if (test) {
        value += symbol;
      }

      return true;
    }

    return false;
  }, this);

  return value;
};

/**
 * @param {string} oldValue
 * @param {string=} opt_newValue
 * @return {!Array.<number>}
 * @private
 */
npf.ui.form.MaskedText.prototype.getMaxCaret_ = function(oldValue,
    opt_newValue) {
  /** @type {string} */
  var newValue = goog.isString(opt_newValue) ? opt_newValue : oldValue;
  /** @type {string} */
  var oldMaskedText = this.convertValueToMaskedText(oldValue);
  /** @type {string} */
  var maskedText = this.convertValueToMaskedText(newValue);
  /** @type {number} */
  var start = 0;
  /** @type {number} */
  var end = 0;
  /** @type {boolean} */
  var changed = false;
  /** @type {string} */
  var placeholder = this.getMaskPlaceholderSymbol();

  goog.array.every(this.tests_, function(test, i) {
    if (test) {
      /** @type {string} */
      var oldSymbol = oldMaskedText.charAt(i);
      /** @type {string} */
      var newSymbol = maskedText.charAt(i);

      if (newSymbol == placeholder) {
        return false;
      } else {
        if (oldSymbol == newSymbol) {
          if (changed) {
            end = i;
          } else {
            start = i + 1;
            end = i + 1;
          }

          return !changed;
        } else {
          if (!changed) {
            changed = true;
            start = i + 1;
          }

          end = i + 1;

          return true;
        }
      }
    } else {
      if (!changed) {
        start = i + 1;
        end = i + 1;
      }

      return true;
    }
  }, this);

  return [start, end];
};

/**
 * @param {string} value
 * @return {string}
 */
npf.ui.form.MaskedText.prototype.convertValueToMaskedText = function(value) {
  /** @type {number} */
  var index = 0;
  /** @type {boolean} */
  var end = false;
  /** @type {string} */
  var text = '';

  goog.array.every(this.mask_.split(''), function(token, i) {
    if (this.tests_[i]) {
      /** @type {string} */
      var ch = value.charAt(index);

      if (ch && this.tests_[i].test(ch)) {
        index++;
        text += ch;
      } else {
        return false;
      }
    } else {
      text += token;
    }

    return true;
  }, this);

  return text;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.MaskedText.prototype.onKeyDown_ = function(evt) {
  /** @type {number} */
  var keyCode = evt.keyCode;

  // backspace and delete get special treatment
  if (
    8 == keyCode || 46 == keyCode ||
    (goog.userAgent.product.IPHONE && 127 == keyCode)
  ) {
    /** @type {Array.<number>} */
    var range = this.getCaret();
    /** @type {number} */
    var start = range[0];
    /** @type {number} */
    var end = range[1];
    /** @type {!Array.<string>} */
    var masked = this.convertValueToMaskedText(this.getValue()).split('');
    /** @type {number} */
    var maskLength = this.mask_.length;

    if (end == start) {
      if (46 == keyCode) {
        start = this.seekNext_(start - 1);
        end = this.seekNext_(start);
      } else {
        start = this.seekPrev_(start);
      }
    }

    for (var i = start; i < end && i < maskLength; i++) {
      if (this.tests_[i]) {
        masked[i] = this.maskPlaceholder_;
      }
    }

    if (0 <= start) {
      /** @type {number} */
      var j = this.seekNext_(end - 1);

      for (var i = start; i < maskLength; i++) {
        if (this.tests_[i]) {
          if (j < maskLength && this.tests_[i].test(masked[j])) {
            masked[i] = masked[j];
            masked[j] = this.maskPlaceholder_;
          } else {
            break;
          }

          j = this.seekNext_(j);
        }
      }

      this.setValue(this.convertMaskedTextToValue(masked.join('')));
      this.setCaret(Math.max(this.firstNonMaskPos_, start));
    }

    evt.preventDefault();
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.MaskedText.prototype.onKeyPress_ = function(evt) {
  /** @type {number} */
  var keyCode = evt.keyCode;

  if (!evt.ctrlKey && !evt.altKey && !evt.metaKey && 32 <= keyCode) {
    /** @type {Array.<number>} */
    var range = this.getCaret();
    /** @type {number} */
    var start = range[0];
    /** @type {number} */
    var end = range[1];
    /** @type {!Array.<string>} */
    var masked = this.convertValueToMaskedText(this.getValue()).split('');
    /** @type {number} */
    var j;
    /** @type {number} */
    var maskLength = this.mask_.length;

    if (end != start) {
      for (var i = start; i < end && i < maskLength; i++) {
        if (this.tests_[i]) {
          masked[i] = this.maskPlaceholder_;
        }
      }

      if (0 <= start) {
        j = this.seekNext_(end - 1);

        for (var i = start; i < maskLength; i++) {
          if (this.tests_[i]) {
            if (j < maskLength && this.tests_[i].test(masked[j])) {
              masked[i] = masked[j];
              masked[j] = this.maskPlaceholder_;
            } else {
              break;
            }

            j = this.seekNext_(j);
          }
        }

        this.setValue(this.convertMaskedTextToValue(masked.join('')));
        this.setCaret(Math.max(this.firstNonMaskPos_, start));
      }
    }

    /** @type {number} */
    var pos = this.seekNext_(start - 1);

    if (pos < maskLength) {
      /** @type {string} */
      var c = String.fromCharCode(keyCode);

      if (this.tests_[pos].test(c)) {
        for (var i = pos, s = this.maskPlaceholder_; i < maskLength; i++) {
          if (this.tests_[i]) {
            j = this.seekNext_(i);
            /** @type {string} */
            var t = masked[i];
            masked[i] = s;

            if (j >= maskLength || !this.tests_[j].test(t)) {
              break;
            }

            s = t;
          }
        }

        masked[pos] = c;
        this.setValue(this.convertMaskedTextToValue(masked.join('')));

        /** @type {number} */
        var next = this.seekNext_(pos);
        this.setCaret(next);
      }
    }

    evt.preventDefault();
  }
};
