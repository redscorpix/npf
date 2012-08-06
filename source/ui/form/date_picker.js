goog.provide('npf.ui.form.DatePicker');

goog.require('goog.date.Date');
goog.require('goog.dom.forms');
goog.require('goog.events.EventType');
goog.require('goog.math');
goog.require('goog.object');
goog.require('npf.ui.form.DatePickerRenderer');
goog.require('npf.ui.form.Field');


/**
 * @param {string} name
 * @param {npf.ui.form.DatePickerRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.DatePicker = function(name, opt_renderer, opt_domHelper) {
  goog.base(this, name, opt_renderer ||
    npf.ui.form.DatePickerRenderer.getInstance(), opt_domHelper);

  this.addClassName(this.getRenderer().getDatePickerCssClass());

  this.minDate_ = new goog.date.Date(1901, 1, 1);
  this.maxDate_ = new goog.date.Date();
};
goog.inherits(npf.ui.form.DatePicker, npf.ui.form.Field);


/**
 * @type {goog.date.Date}
 * @private
 */
npf.ui.form.DatePicker.prototype.minDate_;

/**
 * @type {goog.date.Date}
 * @private
 */
npf.ui.form.DatePicker.prototype.maxDate_;

/**
 * @type {?number}
 * @private
 */
npf.ui.form.DatePicker.prototype.day_ = null;

/**
 * @type {?number}
 * @private
 */
npf.ui.form.DatePicker.prototype.month_ = null;

/**
 * @type {?number}
 * @private
 */
npf.ui.form.DatePicker.prototype.year_ = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.form.DatePicker.prototype.dayElement_ = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.form.DatePicker.prototype.monthElement_ = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.form.DatePicker.prototype.yearElement_ = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.DatePicker.prototype.isEmptyValues_ = false;


/** @inheritDoc */
npf.ui.form.DatePicker.prototype.createDom = function() {
  goog.base(this, 'createDom');

  /** @type {Element} */
  var element = this.getElement();
  /** @type {npf.ui.form.DatePickerRenderer} */
  var renderer = this.getRenderer();
  this.dayElement_ = renderer.getDayElement(element);
  this.monthElement_ = renderer.getMonthElement(element);
  this.yearElement_ = renderer.getYearElement(element);

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  /** @type {npf.ui.form.DatePickerRenderer} */
  var renderer = this.getRenderer();
  this.dayElement_ = renderer.getDayElement(element);
  this.monthElement_ = renderer.getMonthElement(element);
  this.yearElement_ = renderer.getYearElement(element);

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.enterDocument = function() {
  /** @type {Element} */
  var dayElement = this.getDayElement();
  /** @type {Element} */
  var monthElement = this.getDayElement();
  /** @type {Element} */
  var yearElement = this.getDayElement();
  var EventType = goog.events.EventType;

  this.getHandler()
    .listen(dayElement, EventType.CHANGE, this.onChange_, false, this)
    .listen(monthElement, EventType.CHANGE, this.onChange_, false, this)
    .listen(yearElement, EventType.CHANGE, this.onChange_, false, this);
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.minDate_;
  delete this.maxDate_;
  delete this.day_;
  delete this.month_;
  delete this.year_;
  delete this.dayElement_;
  delete this.monthElement_;
  delete this.yearElement_;
  delete this.isEmptyValues_;
};

/**
 * @return {npf.ui.form.DatePickerRenderer}
 */
npf.ui.form.DatePicker.prototype.getRenderer = function() {
  return /** @type {npf.ui.form.DatePickerRenderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.form.DatePickerRenderer} renderer
 */
npf.ui.form.DatePicker.prototype.setRenderer = function(renderer) {
  goog.base(this, 'setRenderer', renderer);
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.initializeInternal = function() {
  goog.base(this, 'initializeInternal');

  this.bindLabel(/** @type {!Element} */ (this.getDayElement));
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.DatePicker.prototype.onChange_ = function(evt) {
  var day = /** @type {?number} */ (goog.dom.forms.getValue(this.dayElement_) || null);
  var month = /** @type {?number} */ (goog.dom.forms.getValue(this.monthElement_) || null);
  var year = /** @type {?number} */ (goog.dom.forms.getValue(this.yearElement_) || null);

  this.setValue([year, month, day]);
};

/**
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isEmpty = function() {
  return goog.isNull(this.year_) || goog.isNull(this.month_) ||
    goog.isNull(this.day_);
};

/**
 * @return {!Array.<?number>}
 */
npf.ui.form.DatePicker.prototype.getValue = function() {
  return [this.year_, this.month_, this.day_];
};

/**
 * @param {!Array.<?number>} value
 */
npf.ui.form.DatePicker.prototype.setValue = function(value) {
  goog.base(this, 'setValue', value);
};

/**
 * @param {!Array.<?number>} value
 * @protected
 */
npf.ui.form.DatePicker.prototype.setValueInternal = function(value) {
  this.year_ = value[0];
  this.month_ = value[1];
  this.day_ = value[2];
};

/**
 * @param {!Array.<?number>} value
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isSameValue = function(value) {
  return this.year_ === value[0] && this.month_ === value[1] &&
    this.day_ === value[2];
};

/**
 * @param {Array.<?number>} value
 * @return {!Array.<?number>}
 * @protected
 */
npf.ui.form.DatePicker.prototype.correctValueInternal = function(value) {
  /** @type {!Array.<?number>} */
  var result = [null, null, null];

  if (goog.isArray(value) && 3 == value.length) {
    /** @type {number} */
    var minYear = this.minDate_.getFullYear();
    /** @type {number} */
    var maxYear = this.maxDate_.getFullYear();
    /** @type {number} */
    var minMonth = this.minDate_.getMonth() + 1;
    /** @type {number} */
    var maxMonth = this.maxDate_.getMonth() + 1;
    /** @type {number} */
    var minDay = this.minDate_.getDate();
    /** @type {number} */
    var maxDay = this.maxDate_.getDate();

    if (result[0] && result[1] && result[2]) {
      /** @type {!goog.date.Date} */
      var date = new goog.date.Date(result[0], result[1] - 1, /** @type {number} */ (result[2]));

      if (0 > goog.date.Date.compare(date, /** @type {!goog.date.Date} */ (this.minDate_))) {
        result = [minYear, minMonth, minDay];
      } else if (0 < goog.date.Date.compare(date, /** @type {!goog.date.Date} */ (this.maxDate_))) {
        result = [maxYear, maxMonth, maxDay];
      }
    } else {
      if (result[0]) {
        result[0] = goog.math.clamp(/** @type {number} */ (result[0]), minYear,
          maxYear);
      }

      if (result[1]) {
        result[1] = goog.math.clamp(/** @type {number} */ (result[1]), 1, 12);

        if (result[0] && result[0] == minYear) {
          result[1] = Math.max(result[1], minMonth);
        } else if (result[0] && result[0] == maxYear) {
          result[1] = Math.min(result[1], maxMonth);
        }
      }

      if (result[2]) {
        result[2] = goog.math.clamp(/** @type {number} */ (result[2]), 1,
          (new Date(result[0] || 2000, (result[1] || 0) + 1, 0)).getDate());

        if (result[0] === minYear && result[1] === minMonth) {
          result[2] = Math.max(result[0], minDay);
        } else if (result[0] === maxYear && result[1] === maxMonth) {
          result[2] = Math.min(result[0], maxDay);
        }
      }
    }
  }

  return result;
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.renderValueInternal = function(value) {
  this.getRenderer().updateCalendar(this, value);
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.getRequestValue = function() {
  return [
    goog.isNumber(this.year_) ? this.year_ + '' : '',
    goog.isNumber(this.month_) ? this.month_ + '' : '',
    goog.isNumber(this.day_) ? this.day_ + '' : ''
  ].join('-');
};

/**
 * @return {goog.date.Date}
 */
npf.ui.form.DatePicker.prototype.getMinDate = function() {
  return this.minDate_;
};

/**
 * @param {goog.date.Date} minDate
 */
npf.ui.form.DatePicker.prototype.setMinDate = function(minDate) {
  this.minDate_ = minDate;
};

/**
 * @return {goog.date.Date}
 */
npf.ui.form.DatePicker.prototype.getMaxDate = function() {
  return this.maxDate_;
};

/**
 * @param {goog.date.Date} maxDate
 */
npf.ui.form.DatePicker.prototype.setMaxDate = function(maxDate) {
  this.maxDate_ = maxDate;
};

/**
 * @return {Element}
 */
npf.ui.form.DatePicker.prototype.getDayElement = function() {
  return this.dayElement_;
};

/**
 * @return {Element}
 */
npf.ui.form.DatePicker.prototype.getMonthElement = function() {
  return this.monthElement_;
};

/**
 * @return {Element}
 */
npf.ui.form.DatePicker.prototype.getYearElement = function() {
  return this.yearElement_;
};

/**
 * @return {number?}
 */
npf.ui.form.DatePicker.prototype.getDay = function() {
  return this.day_;
};

/**
 * @return {number?}
 */
npf.ui.form.DatePicker.prototype.getMonth = function() {
  return this.month_;
};

/**
 * @return {number?}
 */
npf.ui.form.DatePicker.prototype.getYear = function() {
  return this.year_;
};

/**
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isEmptyValues = function() {
  return this.isEmptyValues_;
};

/**
 * @param {boolean} isEmpty
 */
npf.ui.form.DatePicker.prototype.setEmptyValues = function(isEmpty) {
  this.isEmptyValues_ = isEmpty;
};
