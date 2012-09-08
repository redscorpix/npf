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

/** @override */
npf.ui.form.DatePickerRenderer.prototype.createDom = function(component) {
  /** @type {!Element} */
  var element = goog.base(this, 'createDom', component);
  this.appendDayElement(component);
  this.appendMonthElement(component);
  this.appendYearElement(component);

  return element;
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendDayElement = function(component) {
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
  goog.dom.appendChild(component.getContentElement(), dayElement);
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendMonthElement = function(component) {
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
  goog.dom.appendChild(component.getContentElement(), monthElement);
};

/**
 * @param {npf.ui.form.DatePicker} component
 * @protected
 */
npf.ui.form.DatePickerRenderer.prototype.appendYearElement = function(component) {
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
  goog.dom.appendChild(component.getContentElement(), yearElement);
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
 * @param {npf.ui.form.DatePicker} component
 * @param {!Array.<?number>} value
 */
npf.ui.form.DatePickerRenderer.prototype.updateCalendar = function(component,
                                                                   value) {
  /** @type {?number} */
  var day = component.getDay();
  /** @type {?number} */
  var month = component.getMonth();
  /** @type {?number} */
  var year = component.getYear();
  /** @type {Element} */
  var dayElement = component.getDayElement();
  /** @type {Element} */
  var monthElement = component.getMonthElement();
  /** @type {Element} */
  var yearElement = component.getYearElement();
  /** @type {number} */
  var dayStart = 1;
  /** @type {number} */
  var dayFinish = 31;
  /** @type {number} */
  var monthStart = 1;
  /** @type {number} */
  var monthFinish = 12;
  /** @type {number} */
  var yearStart = component.getMinDate().getFullYear();
  /** @type {number} */
  var yearFinish = component.getMaxDate().getFullYear();
  /** @type {string} */
  var dayHtml = '';
  /** @type {string} */
  var monthHtml = '';
  /** @type {string} */
  var yearHtml = '';

  if (day && month && year) {
    if (year == yearStart) {
      monthStart = component.getMinDate().getMonth() + 1;

      if (month == monthStart) {
        dayStart = component.getMinDate().getDate();
      }
    } else if (year == yearFinish) {
      monthFinish = component.getMaxDate().getMonth() + 1;
    }
  }

  if (month) {
    // Если год не знаем, то выводим для високосного года.
    dayFinish = (new Date(year || 2000, month + 1, 0)).getDate();
  }

  if (component.isEmptyValues()) {
    dayHtml += this.getSelectHtml_(goog.isNull(day));
    monthHtml += this.getSelectHtml_(goog.isNull(month));
    yearHtml += this.getSelectHtml_(goog.isNull(year));
  }

  for (var i = dayStart; i <= dayFinish; i++) {
    dayHtml += this.getSelectHtml_(day === i, i);
  }

  for (var i = monthStart; i <= monthFinish; i++) {
    monthHtml += this.getSelectHtml_(month === i, i);
  }

  for (var i = yearStart; i <= yearFinish; i++) {
    yearHtml += this.getSelectHtml_(year === i, i);
  }

  goog.dom.removeChildren(dayElement);
  dayElement.innerHTML = dayHtml;

  goog.dom.removeChildren(monthElement);
  monthElement.innerHTML = monthHtml;

  goog.dom.removeChildren(yearElement);
  yearElement.innerHTML = yearHtml;

  this.setValue(component.getDayElement(), value[2]);
  this.setValue(component.getMonthElement(), value[1]);
  this.setValue(component.getYearElement(), value[0]);
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
