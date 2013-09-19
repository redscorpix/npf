goog.provide('npf.ui.form.DatePickerRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
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
 * @type {string}
 */
npf.ui.form.DatePickerRenderer.CSS_CLASS =
  goog.getCssName('npf-form-datePicker');

/**
 * @enum {string}
 */
npf.ui.form.DatePickerRenderer.NameSuffix = {
  DAY: '_day',
  MONTH: '_month',
  YEAR: '_year'
};


/** @inheritDoc */
npf.ui.form.DatePickerRenderer.prototype.appendContent = function(component,
    element) {
  /** @type {Element} */
  var contentElement = this.getContentElement(element);
  var datePicker = /** @type {npf.ui.form.DatePicker} */ (component);
  /** @type {Element} */
  var dayElement = this.appendDayElement(datePicker, contentElement);
  this.appendMonthElement(datePicker, contentElement);
  this.appendYearElement(datePicker, contentElement);

  if (dayElement && component.isLabelEnabled()) {
    this.bindLabel(this.getLabelElement(element), dayElement);
  }
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @param {Element} element
 * @return {Element}
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendDayElement = function(component,
    element) {
  /** @type {string} */
  var className = [
    this.getValueCssClass(),
    this.getDayCssClass()
  ].join(' ');
  /** @type {!Element} */
  var dayElement = component.getDomHelper().createDom(goog.dom.TagName.SELECT, {
    'class': className,
    'name': component.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.DAY
  });
  goog.dom.appendChild(element, dayElement);

  return dayElement;
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @return {Element}
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendMonthElement = function(
    component, element) {
  /** @type {string} */
  var className = [
    this.getValueCssClass(),
    this.getMonthCssClass()
  ].join(' ');
  /** @type {!Element} */
  var monthElement = component.getDomHelper().createDom(goog.dom.TagName.SELECT, {
    'class': className,
    'name': component.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.MONTH
  });
  goog.dom.appendChild(element, monthElement);

  return monthElement;
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @return {Element}
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendYearElement = function(component,
    element) {
  /** @type {string} */
  var className = [
    this.getValueCssClass(),
    this.getYearCssClass()
  ].join(' ');
  /** @type {!Element} */
  var yearElement = component.getDomHelper().createDom(goog.dom.TagName.SELECT, {
    'class': className,
    'name': component.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.YEAR
  });
  goog.dom.appendChild(element, yearElement);

  return yearElement;
};

/** @inheritDoc */
npf.ui.form.DatePickerRenderer.prototype.setDisabled = function(component,
    disable) {
  /** @type {Element} */
  var dayElement = component.getDayElement();
  /** @type {Element} */
  var monthElement = component.getMonthElement();
  /** @type {Element} */
  var yearElement = component.getYearElement();

  if (dayElement) {
    goog.dom.forms.setDisabled(dayElement, disable);
  }

  if (monthElement) {
    goog.dom.forms.setDisabled(monthElement, disable);
  }

  if (yearElement) {
    goog.dom.forms.setDisabled(yearElement, disable);
  }
};

/**
 * @param {npf.ui.form.Field} component
 * @return {!Array.<number?>}
 * @override
 */
npf.ui.form.DatePickerRenderer.prototype.getValue = function(component) {
  var datePicker = /** @type {npf.ui.form.DatePicker} */ (component);
  /** @type {Element} */
  var dayElement = datePicker.getDayElement();
  /** @type {Element} */
  var monthElement = datePicker.getMonthElement();
  /** @type {Element} */
  var yearElement = datePicker.getYearElement();
  /** @type {number?} */
  var day = null;
  /** @type {number?} */
  var month = null;
  /** @type {number?} */
  var year = null;

  if (dayElement) {
    /** @type {string|Array.<string>} */
    var rawDay = goog.dom.forms.getValue(dayElement);
    day = goog.isString(rawDay) ? parseInt(rawDay, 10) : null;
  }

  if (monthElement) {
    /** @type {string|Array.<string>} */
    var rawMonth = goog.dom.forms.getValue(monthElement);
    month = goog.isString(rawMonth) ? parseInt(rawMonth, 10) : null;
  }

  if (yearElement) {
    /** @type {string|Array.<string>} */
    var rawYear = goog.dom.forms.getValue(yearElement);
    year = goog.isString(rawYear) ? parseInt(rawYear, 10) : null;
  }

  return [year, month, day];
};

/** @inheritDoc */
npf.ui.form.DatePickerRenderer.prototype.setValue = function(component, value) {
  var datePicker = /** @type {npf.ui.form.DatePicker} */ (component);
  var values = /** @type {Array.<number?>} */ (value);
  /** @type {number?} */
  var day = values[2];
  /** @type {number?} */
  var month = values[1];
  /** @type {number?} */
  var year = values[0];
  /** @type {Element} */
  var dayElement = datePicker.getDayElement();
  /** @type {Element} */
  var monthElement = datePicker.getMonthElement();
  /** @type {Element} */
  var yearElement = datePicker.getYearElement();
  /** @type {number} */
  var dayStart = 1;
  /** @type {number} */
  var dayFinish = 31;
  /** @type {number} */
  var monthStart = 1;
  /** @type {number} */
  var monthFinish = 12;
  /** @type {number} */
  var yearStart = datePicker.getMinDate().getFullYear();
  /** @type {number} */
  var yearFinish = datePicker.getMaxDate().getFullYear();
  /** @type {string} */
  var dayHtml = '';
  /** @type {string} */
  var monthHtml = '';
  /** @type {string} */
  var yearHtml = '';
  /** @type {number} */
  var i;

  if (day && month && year) {
    if (year == yearStart) {
      monthStart = datePicker.getMinDate().getMonth() + 1;

      if (month == monthStart) {
        dayStart = datePicker.getMinDate().getDate();
      }
    } else if (year == yearFinish) {
      monthFinish = datePicker.getMaxDate().getMonth() + 1;
    }
  }

  if (month) {
    // Если год не знаем, то выводим для високосного года.
    dayFinish = (new Date(year || 2000, month + 1, 0)).getDate();
  }

  if (datePicker.isEmptyValue()) {
    dayHtml += this.getSelectHtml_(goog.isNull(day));
    monthHtml += this.getSelectHtml_(goog.isNull(month));
    yearHtml += this.getSelectHtml_(goog.isNull(year));
  }

  for (i = dayStart; i <= dayFinish; i++) {
    dayHtml += this.getSelectHtml_(day === i, i);
  }

  for (i = monthStart; i <= monthFinish; i++) {
    monthHtml += this.getSelectHtml_(month === i, i);
  }

  for (i = yearStart; i <= yearFinish; i++) {
    yearHtml += this.getSelectHtml_(year === i, i);
  }

  goog.dom.removeChildren(dayElement);
  dayElement.innerHTML = dayHtml;

  goog.dom.removeChildren(monthElement);
  monthElement.innerHTML = monthHtml;

  goog.dom.removeChildren(yearElement);
  yearElement.innerHTML = yearHtml;

  goog.dom.forms.setValue(datePicker.getDayElement(), day);
  goog.dom.forms.setValue(datePicker.getMonthElement(), month);
  goog.dom.forms.setValue(datePicker.getYearElement(), year);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.DatePickerRenderer.prototype.getDayElement = function(element) {
  return this.getElementByClass(this.getDayCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.DatePickerRenderer.prototype.getMonthElement = function(element) {
  return this.getElementByClass(this.getMonthCssClass(), element);
};

/**
 * @param {Element} element
 * @return {Element}
 */
npf.ui.form.DatePickerRenderer.prototype.getYearElement = function(element) {
  return this.getElementByClass(this.getYearCssClass(), element);
};

/**
 * @param {boolean} selected
 * @param {number=} opt_value
 * @return {string}
 * @private
 */
npf.ui.form.DatePickerRenderer.prototype.getSelectHtml_ = function(selected,
    opt_value) {
  return ['<option value="', opt_value || 0, '"',
    selected ? ' selected="selected"' : '', '>',
    opt_value || '&nbsp;', '</option>'].join('');
};

/**
 * @return {string}
 */
npf.ui.form.DatePickerRenderer.prototype.getFieldCssClass = function() {
  return npf.ui.form.DatePickerRenderer.CSS_CLASS;
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
