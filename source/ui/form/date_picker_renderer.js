goog.provide('npf.ui.form.DatePickerRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.DatePickerRenderer = function() {
	goog.base(this);
};
goog.inherits(npf.ui.form.DatePickerRenderer, npf.ui.form.FieldRenderer);
goog.addSingletonGetter(npf.ui.form.DatePickerRenderer);


/**
 * @enum {string}
 */
npf.ui.form.DatePickerRenderer.NameSuffix = {
	DAY: '_day',
	MONTH: '_month',
	YEAR: '_year'
};

/**
 * @param {npf.ui.form.DatePicker} field
 * @return {!Element}
 */
npf.ui.form.DatePickerRenderer.prototype.createDom = function(field) {
	/** @type {!Element} */
	var element = goog.base(this, 'createDom', field);
	this.appendDayElement(field);
	this.appendMonthElement(field);
	this.appendYearElement(field);

	return element;
};

/**
 * @param {npf.ui.form.DatePicker} field
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendDayElement = function(field) {
	/** @type {string} */
	var className = [
		this.getValueCssClass(),
		this.getDayCssClass()
	].join(' ');
	/** @type {Element} */
	var dayElement = goog.dom.createDom(goog.dom.TagName.SELECT, {
		'class': className,
		'name': field.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.DAY
	});
	goog.dom.appendChild(field.getContentElement(), dayElement);
};

/**
 * @param {npf.ui.form.DatePicker} field
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendMonthElement = function(field) {
	/** @type {string} */
	var className = [
		this.getValueCssClass(),
		this.getMonthCssClass()
	].join(' ');
	/** @type {Element} */
	var monthElement = goog.dom.createDom(goog.dom.TagName.SELECT, {
		'class': className,
		'name': field.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.MONTH
	});
	goog.dom.appendChild(field.getContentElement(), monthElement);
};

/**
 * @param {npf.ui.form.DatePicker} field
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendYearElement = function(field) {
	/** @type {string} */
	var className = [
		this.getValueCssClass(),
		this.getYearCssClass()
	].join(' ');
	/** @type {Element} */
	var yearElement = goog.dom.createDom(goog.dom.TagName.SELECT, {
		'class': className,
		'name': field.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.YEAR
	});
	goog.dom.appendChild(field.getContentElement(), yearElement);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.DatePickerRenderer.prototype.getDayElement = function(element) {
	if (element) {
		return goog.dom.getElementByClass(this.getDayCssClass(), element);
	}

	return null;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.DatePickerRenderer.prototype.getMonthElement = function(element) {
	if (element) {
		return goog.dom.getElementByClass(this.getMonthCssClass(), element);
	}

	return null;
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.DatePickerRenderer.prototype.getYearElement = function(element) {
	if (element) {
		return goog.dom.getElementByClass(this.getYearCssClass(), element);
	}

	return null;
};

/**
 * @param {npf.ui.form.DatePicker} field
 * @param {!Array.<?number>} value
 */
npf.ui.form.DatePickerRenderer.prototype.updateCalendar = function(field, value) {
	/** @type {?number} */
	var day = field.getDay();
	/** @type {?number} */
	var month = field.getMonth();
	/** @type {?number} */
	var year = field.getYear();
	/** @type {Element} */
	var dayElement = field.getDayElement();
	/** @type {Element} */
	var monthElement = field.getMonthElement();
	/** @type {Element} */
	var yearElement = field.getYearElement();
	/** @type {number} */
	var dayStart = 1;
	/** @type {number} */
	var dayFinish = 31;
	/** @type {number} */
	var monthStart = 1;
	/** @type {number} */
	var monthFinish = 12;
	/** @type {number} */
	var yearStart = field.getMinDate().getFullYear();
	/** @type {number} */
	var yearFinish = field.getMaxDate().getFullYear();
	/** @type {string} */
	var dayHtml = '';
	/** @type {string} */
	var monthHtml = '';
	/** @type {string} */
	var yearHtml = '';

	if (day && month && year) {
		if (year == yearStart) {
			monthStart = field.getMinDate().getMonth() + 1;

			if (month == monthStart) {
				dayStart = field.getMinDate().getDate();
			}
		} else if (year == yearFinish) {
			monthFinish = field.getMaxDate().getMonth() + 1;
		}
	}

	if (month) {
		dayFinish = (new Date(year || 2000, month + 1, 0)).getDate(); // Если год не знаем, то выводим для високосного года.
	}

	if (field.isEmptyValues()) {
		dayHtml += this._getSelectHtml(goog.isNull(day));
		monthHtml += this._getSelectHtml(goog.isNull(month));
		yearHtml += this._getSelectHtml(goog.isNull(year));
	}

	for (var i = dayStart; i <= dayFinish; i++) {
		dayHtml += this._getSelectHtml(day === i, i);
	}

	for (var i = monthStart; i <= monthFinish; i++) {
		monthHtml += this._getSelectHtml(month === i, i);
	}

	for (var i = yearStart; i <= yearFinish; i++) {
		yearHtml += this._getSelectHtml(year === i, i);
	}

	goog.dom.removeChildren(dayElement);
	dayElement.innerHTML = dayHtml;

	goog.dom.removeChildren(monthElement);
	monthElement.innerHTML = monthHtml;

	goog.dom.removeChildren(yearElement);
	yearElement.innerHTML = yearHtml;

	this.setValue(field.getDayElement(), value[2]);
	this.setValue(field.getMonthElement(), value[1]);
	this.setValue(field.getYearElement(), value[0]);
};

/**
 * @param {boolean} selected
 * @param {number=} opt_value
 * @return {string}
 * @private
 */
npf.ui.form.DatePickerRenderer.prototype._getSelectHtml = function(selected, opt_value) {
	return ['<option value="', opt_value || 0, '"', selected ? ' selected="selected"' : '', '>', opt_value || '&nbsp;', '</option>'].join('');
};

/**
 * @return {string}
 */
npf.ui.form.DatePickerRenderer.prototype.getDatePickerCssClass = function() {
	return goog.getCssName(this.getStructuralCssClass(), 'datePicker');
};

/**
 * @return {string}
 */
npf.ui.form.DatePickerRenderer.prototype.getDayCssClass = function() {
	return goog.getCssName(this.getStructuralCssClass(), 'day');
};

/**
 * @return {string}
 */
npf.ui.form.DatePickerRenderer.prototype.getMonthCssClass = function() {
	return goog.getCssName(this.getStructuralCssClass(), 'month');
};

/**
 * @return {string}
 */
npf.ui.form.DatePickerRenderer.prototype.getYearCssClass = function() {
	return goog.getCssName(this.getStructuralCssClass(), 'year');
};
