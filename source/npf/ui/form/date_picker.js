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
 * @type {number?}
 * @private
 */
npf.ui.form.DatePicker.prototype.day_ = null;

/**
 * @type {number?}
 * @private
 */
npf.ui.form.DatePicker.prototype.month_ = null;

/**
 * @type {number?}
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
  var renderer = /** @type {npf.ui.form.DatePickerRenderer} */ (
    this.getRenderer());
  this.dayElement_ = renderer.getDayElement(element);
  this.monthElement_ = renderer.getMonthElement(element);
  this.yearElement_ = renderer.getYearElement(element);

  this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.decorateInternal = function(element) {
  goog.base(this, 'decorateInternal', element);

  var renderer = /** @type {npf.ui.form.DatePickerRenderer} */ (
    this.getRenderer());
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

  if (dayElement) {
    this.getHandler().listen(dayElement, EventType.CHANGE, this.onChange_);
  }

  if (monthElement) {
    this.getHandler().listen(monthElement, EventType.CHANGE, this.onChange_);
  }

  if (yearElement) {
    this.getHandler().listen(yearElement, EventType.CHANGE, this.onChange_);
  }
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  this.minDate_ = null;
  this.maxDate_ = null;
  this.dayElement_ = null;
  this.monthElement_ = null;
  this.yearElement_ = null;
};

/**
 * @param {*} value
 * @return {boolean}
 * @private
 */
npf.ui.form.DatePicker.prototype.isPossibleValue_ = function(value) {
  return goog.isArray(value) &&
    (goog.isNull(value[0]) || goog.isNumber(value[0])) &&
    (goog.isNull(value[1]) || goog.isNumber(value[1])) &&
    (goog.isNull(value[2]) || goog.isNumber(value[2]));
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.initializeInternal = function() {
  goog.base(this, 'initializeInternal');

  /** @type {Element} */
  var dayElement = this.getDayElement();

  if (dayElement) {
    this.bindLabel(dayElement);
  }
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.DatePicker.prototype.onChange_ = function(evt) {
  var day = /** @type {number?} */ (
    goog.dom.forms.getValue(this.dayElement_) || null);
  var month = /** @type {number?} */ (
    goog.dom.forms.getValue(this.monthElement_) || null);
  var year = /** @type {number?} */ (
    goog.dom.forms.getValue(this.yearElement_) || null);

  this.setValue([year, month, day]);
};

/**
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isEmpty = function() {
  return goog.isNull(this.year_) || goog.isNull(this.month_) ||
    goog.isNull(this.day_);
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.getValue = function() {
  return [this.year_, this.month_, this.day_];
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.setValueInternal = function(value) {
  if (this.isPossibleValue_(value)) {
    var possibleValue = /** @type {!Array.<number?>} */ (value);
    this.year_ = possibleValue[0];
    this.month_ = possibleValue[1];
    this.day_ = possibleValue[2];
  }
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.isSameValue = function(value) {
  return goog.isArray(value) && this.year_ === value[0] &&
    this.month_ === value[1] && this.day_ === value[2];
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.correctValueInternal = function(value) {
  /** @type {!Array.<?number>} */
  var result = [null, null, null];

  if (this.isPossibleValue_(value)) {
    var possibleValue = /** @type {!Array.<number?>} */ (value);
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

    if (possibleValue[0] && possibleValue[1] && possibleValue[2]) {
      var date = new goog.date.Date(
        /** @type {number} */ (possibleValue[0]),
        /** @type {number} */ (possibleValue[1]) - 1,
        /** @type {number} */ (possibleValue[2])
      );

      if (0 > goog.date.Date.compare(date, this.minDate_)) {
        result = [minYear, minMonth, minDay];
      } else if (0 < goog.date.Date.compare(date, this.maxDate_)) {
        result = [maxYear, maxMonth, maxDay];
      }
    } else {
      if (possibleValue[0]) {
        result[0] = goog.math.clamp(
          /** @type {number} */ (possibleValue[0]), minYear, maxYear);
      }

      if (possibleValue[1]) {
        result[1] = goog.math.clamp(/** @type {number} */ (possibleValue[1]), 1, 12);

        if (result[0] && result[0] == minYear) {
          result[1] = Math.max(result[1], minMonth);
        } else if (result[0] && result[0] == maxYear) {
          result[1] = Math.min(result[1], maxMonth);
        }
      }

      if (possibleValue[2]) {
        result[2] = goog.math.clamp(/** @type {number} */ (possibleValue[2]), 1, (
          new Date(result[0] || 2000, (result[1] || 0) + 1, 0)
        ).getDate());

        if (result[0] === minYear && result[1] === minMonth) {
          result[2] = Math.max(possibleValue[2], minDay);
        } else if (result[0] === maxYear && result[1] === maxMonth) {
          result[2] = Math.min(possibleValue[2], maxDay);
        }
      }
    }
  }

  return result;
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.renderValueInternal = function(value) {
  if (this.isPossibleValue_(value)) {
    this.getRenderer().updateCalendar(
      this, /** @type {!Array.<number?>} */ (value));
  }
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.getRequestValue = function() {
  return [
    goog.isNumber(this.year_) ? this.year_ : '',
    goog.isNumber(this.month_) ? this.month_ : '',
    goog.isNumber(this.day_) ? this.day_ : ''
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
