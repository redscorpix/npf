goog.provide('npf.ui.form.DatePicker');

goog.require('goog.date.Date');
goog.require('goog.dom.forms');
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
	goog.base(this, name, opt_renderer || npf.ui.form.DatePickerRenderer.getInstance(), opt_domHelper);

	this.addClassName(this.getRenderer().getDatePickerCssClass());

	this._minDate = new goog.date.Date(1901, 1, 1);
	this._maxDate = new goog.date.Date();
};
goog.inherits(npf.ui.form.DatePicker, npf.ui.form.Field);


/**
 * @type {goog.date.Date}
 * @private
 */
npf.ui.form.DatePicker.prototype._minDate;

/**
 * @type {goog.date.Date}
 * @private
 */
npf.ui.form.DatePicker.prototype._maxDate;

/**
 * @type {?number}
 * @private
 */
npf.ui.form.DatePicker.prototype._day = null;

/**
 * @type {?number}
 * @private
 */
npf.ui.form.DatePicker.prototype._month = null;

/**
 * @type {?number}
 * @private
 */
npf.ui.form.DatePicker.prototype._year = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.form.DatePicker.prototype._dayElement = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.form.DatePicker.prototype._monthElement = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.form.DatePicker.prototype._yearElement = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.DatePicker.prototype._isEmptyValues = false;


/** @inheritDoc */
npf.ui.form.DatePicker.prototype.createDom = function() {
	goog.base(this, 'createDom');

	/** @type {Element} */
	var element = this.getElement();
	/** @type {npf.ui.form.DatePickerRenderer} */
	var renderer = /** @type {npf.ui.form.DatePickerRenderer} */ (this.getRenderer());
	this._dayElement = renderer.getDayElement(element);
	this._monthElement = renderer.getMonthElement(element);
	this._yearElement = renderer.getYearElement(element);

	this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.decorateInternal = function(element) {
	goog.base(this, 'decorateInternal', element);

	/** @type {npf.ui.form.DatePickerRenderer} */
	var renderer = /** @type {npf.ui.form.DatePickerRenderer} */ (this.getRenderer());
	this._dayElement = renderer.getDayElement(element);
	this._monthElement = renderer.getMonthElement(element);
	this._yearElement = renderer.getYearElement(element);

	this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.enterDocument = function() {
	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();
	/** @type {Element} */
	var dayElement = this.getDayElement();
	/** @type {Element} */
	var monthElement = this.getDayElement();
	/** @type {Element} */
	var yearElement = this.getDayElement();

	handler.listen(dayElement, goog.events.EventType.CHANGE, this._onChange, false, this);
	handler.listen(monthElement, goog.events.EventType.CHANGE, this._onChange, false, this);
	handler.listen(yearElement, goog.events.EventType.CHANGE, this._onChange, false, this);
};

/** @inheritDoc */
npf.ui.form.DatePicker.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._minDate;
	delete this._maxDate;
	delete this._day;
	delete this._month;
	delete this._year;
	delete this._dayElement;
	delete this._monthElement;
	delete this._yearElement;
	delete this._isEmptyValues;
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
npf.ui.form.DatePicker.prototype._onChange = function(evt) {
	/** @type {?number} */
	var day = /** @type {?number} */ (goog.dom.forms.getValue(this._dayElement) || null);
	/** @type {?number} */
	var month = /** @type {?number} */ (goog.dom.forms.getValue(this._monthElement) || null);
	/** @type {?number} */
	var year = /** @type {?number} */ (goog.dom.forms.getValue(this._yearElement) || null);

	this.setValue([year, month, day]);
};

/**
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isEmpty = function() {
	return goog.isNull(this._year) || goog.isNull(this._month) || goog.isNull(this._day);
};

/**
 * @return {!Array.<?number>}
 */
npf.ui.form.DatePicker.prototype.getValue = function() {
	return [this._year, this._month, this._day];
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
	this._year = value[0];
	this._month = value[1];
	this._day = value[2];
};

/**
 * @param {!Array.<?number>} value
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isSameValue = function(value) {
	return this._year === value[0] && this._month === value[1] && this._day === value[2];
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
		var minYear = this._minDate.getFullYear();
		/** @type {number} */
		var maxYear = this._maxDate.getFullYear();
		/** @type {number} */
		var minMonth = this._minDate.getMonth() + 1;
		/** @type {number} */
		var maxMonth = this._maxDate.getMonth() + 1;
		/** @type {number} */
		var minDay = this._minDate.getDate();
		/** @type {number} */
		var maxDay = this._maxDate.getDate();

		if (result[0] && result[1] && result[2]) {
			/** @type {!goog.date.Date} */
			var date = new goog.date.Date(result[0], result[1] - 1, /** @type {number} */ (result[2]));

			if (0 > goog.date.Date.compare(date, /** @type {!goog.date.Date} */ (this._minDate))) {
				result = [minYear, minMonth, minDay];
			} else if (0 < goog.date.Date.compare(date, /** @type {!goog.date.Date} */ (this._maxDate))) {
				result = [maxYear, maxMonth, maxDay];
			}
		} else {
			if (result[0]) {
				result[0] = goog.math.clamp(/** @type {number} */ (result[0]), minYear, maxYear);
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
				result[2] = goog.math.clamp(/** @type {number} */ (result[2]), 1, (new Date(result[0] || 2000, (result[1] || 0) + 1, 0)).getDate());

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
		goog.isNumber(this._year) ? this._year + '' : '',
		goog.isNumber(this._month) ? this._month + '' : '',
		goog.isNumber(this._day) ? this._day + '' : ''
	].join('-');
};

/**
 * @return {goog.date.Date}
 */
npf.ui.form.DatePicker.prototype.getMinDate = function() {
	return this._minDate;
};

/**
 * @param {goog.date.Date} minDate
 */
npf.ui.form.DatePicker.prototype.setMinDate = function(minDate) {
	this._minDate = minDate;
};

/**
 * @return {goog.date.Date}
 */
npf.ui.form.DatePicker.prototype.getMaxDate = function() {
	return this._maxDate;
};

/**
 * @param {goog.date.Date} maxDate
 */
npf.ui.form.DatePicker.prototype.setMaxDate = function(maxDate) {
	this._maxDate = maxDate;
};

/**
 * @return {Element}
 */
npf.ui.form.DatePicker.prototype.getDayElement = function() {
	return this._dayElement;
};

/**
 * @return {Element}
 */
npf.ui.form.DatePicker.prototype.getMonthElement = function() {
	return this._monthElement;
};

/**
 * @return {Element}
 */
npf.ui.form.DatePicker.prototype.getYearElement = function() {
	return this._yearElement;
};

/**
 * @return {number?}
 */
npf.ui.form.DatePicker.prototype.getDay = function() {
	return this._day;
};

/**
 * @return {number?}
 */
npf.ui.form.DatePicker.prototype.getMonth = function() {
	return this._month;
};

/**
 * @return {number?}
 */
npf.ui.form.DatePicker.prototype.getYear = function() {
	return this._year;
};

/**
 * @return {boolean}
 */
npf.ui.form.DatePicker.prototype.isEmptyValues = function() {
	return this._isEmptyValues;
};

/**
 * @param {boolean} isEmpty
 */
npf.ui.form.DatePicker.prototype.setEmptyValues = function(isEmpty) {
	this._isEmptyValues = isEmpty;
};
