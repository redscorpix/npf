goog.provide('npf.ui.form.DatePickerRenderer');

goog.require('goog.dom.TagName');
goog.require('goog.dom.forms');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @constructor
 * @struct
 * @extends {npf.ui.form.FieldRenderer}
 */
npf.ui.form.DatePickerRenderer = function() {
  npf.ui.form.DatePickerRenderer.base(this, 'constructor');
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
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var dayElement = domHelper.createDom(goog.dom.TagName.SELECT, {
    'class': className,
    'name': component.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.DAY
  });
  domHelper.appendChild(element, dayElement);

  return dayElement;
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @param {Element} element
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
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var monthElement = domHelper.createDom(goog.dom.TagName.SELECT, {
    'class': className,
    'name': component.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.MONTH
  });
  domHelper.appendChild(element, monthElement);

  return monthElement;
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @param {Element} element
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
  /** @type {goog.dom.DomHelper} */
  var domHelper = component.getDomHelper();
  /** @type {!Element} */
  var yearElement = domHelper.createDom(goog.dom.TagName.SELECT, {
    'class': className,
    'name': component.getName() + npf.ui.form.DatePickerRenderer.NameSuffix.YEAR
  });
  domHelper.appendChild(element, yearElement);

  return yearElement;
};

/** @inheritDoc */
npf.ui.form.DatePickerRenderer.prototype.setDisabled = function(component,
    disable) {
  var datePicker = /** @type {npf.ui.form.DatePicker} */ (component);
  /** @type {Element} */
  var dayElement = datePicker.getDayElement();
  /** @type {Element} */
  var monthElement = datePicker.getMonthElement();
  /** @type {Element} */
  var yearElement = datePicker.getYearElement();

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
  var minDay = 1;
  /** @type {number} */
  var maxDay = 31;
  /** @type {number} */
  var minMonth = 1;
  /** @type {number} */
  var maxMonth = 12;
  /** @type {number} */
  var minYear = datePicker.getMinDate().getFullYear();
  /** @type {number} */
  var maxYear = datePicker.getMaxDate().getFullYear();
  /** @type {string} */
  var dayHtml = '';
  /** @type {string} */
  var monthHtml = '';
  /** @type {string} */
  var yearHtml = '';
  /** @type {number} */
  var i;

  if (year) {
    if (year == minYear) {
      minMonth = datePicker.getMinDate().getMonth() + 1;
    }

    if (year == maxYear) {
      maxMonth = datePicker.getMaxDate().getMonth() + 1;
    }

    if (month) {
      if (year == minYear && month == minMonth) {
        minDay = datePicker.getMinDate().getDate();
      }

      if (year == maxYear && month == maxMonth) {
        maxDay = datePicker.getMaxDate().getDate();
      }
    }
  }

  if (month) {
    // Если год не знаем, то выводим для високосного года.
    maxDay = Math.min(maxDay, (new Date(year || 2000, month, 0)).getDate());
  }

  if (datePicker.isEmptyValue()) {
    dayHtml += this.getOptionHtml_();
    monthHtml += this.getOptionHtml_();
    yearHtml += this.getOptionHtml_();
  }

  for (i = minDay; i <= maxDay; i++) {
    dayHtml += this.getOptionHtml_(i, datePicker.getDayLabel(i));
  }

  for (i = minMonth; i <= maxMonth; i++) {
    monthHtml += this.getOptionHtml_(i, datePicker.getMonthLabel(i));
  }

  if (datePicker.isYearReversed()) {
    for (i = maxYear; i >= minYear; i--) {
      yearHtml += this.getOptionHtml_(i, datePicker.getYearLabel(i));
    }
  } else {
    for (i = minYear; i <= maxYear; i++) {
      yearHtml += this.getOptionHtml_(i, datePicker.getYearLabel(i));
    }
  }

  if (dayElement) {
    dayElement.innerHTML = dayHtml;
    goog.dom.forms.setValue(dayElement, day || 0);
  }

  if (monthElement) {
    monthElement.innerHTML = monthHtml;
    goog.dom.forms.setValue(monthElement, month || 0);
  }

  if (yearElement) {
    yearElement.innerHTML = yearHtml;
    goog.dom.forms.setValue(yearElement, year || 0);
  }
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
 * @param {number=} opt_value
 * @param {string=} opt_label
 * @return {string}
 * @private
 */
npf.ui.form.DatePickerRenderer.prototype.getOptionHtml_ = function(opt_value,
    opt_label) {
  /** @type {number} */
  var value = opt_value || 0;
  /** @type {number|string} */
  var label = opt_label || value || ' ';

  return '<option value="' + value + '">' + label + '</option>';
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
