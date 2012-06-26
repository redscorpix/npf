goog.provide('npf.ui.form.Field');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.object');
goog.require('npf.ui.RenderComponent');
goog.require('goog.ui.IdGenerator');
goog.require('npf.ui.form.EventType');
goog.require('npf.ui.form.FieldRenderer');


/**
 * @param {string} name
 * @param {npf.ui.form.FieldRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.form.Field = function(name, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.form.FieldRenderer.getInstance(), opt_domHelper);

	this._name = name;
	this._validators = [];
};
goog.inherits(npf.ui.form.Field, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.form.Field.ErrorMessage = {
	REQUIRED: 'Необходимо заполнить поле'
};

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype._name;

/**
 * @type {*}
 * @private
 */
npf.ui.form.Field.prototype._value;

/**
 * @type {Array.<function(*):string>}
 * @private
 */
npf.ui.form.Field.prototype._validators;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype._required = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype._isEnabled = true;

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype._label = '';

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype._notice = '';

/**
 * @type {string}
 * @private
 */
npf.ui.form.Field.prototype._error = '';

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype._errorVisible = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Field.prototype._hideErrorOnChange = true;


/** @inheritDoc */
npf.ui.form.Field.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._name;
	delete this._value;
	delete this._validators;
	delete this._required;
	delete this._isEnabled;
	delete this._label;
	delete this._notice;
	delete this._error;
	delete this._errorVisible;
	delete this._hideErrorOnChange;
};

/**
 * @return {npf.ui.form.FieldRenderer}
 */
npf.ui.form.Field.prototype.getRenderer = function() {
	return /** @type {npf.ui.form.FieldRenderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.form.FieldRenderer} renderer
 */
npf.ui.form.Field.prototype.setRenderer = function(renderer) {
	goog.base(this, 'setRenderer', renderer);
};

/**
 * @protected
 */
npf.ui.form.Field.prototype.initializeInternal = function() {
	this.renderValueInternal(this.getValue());
	this.setEnabledInternal(this._isEnabled);
	this.setErrorInternal(this._error);
	this.setErrorVisibleInternal(this._errorVisible);
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getName = function() {
	return this._name;
};

/**
 * @return {*}
 */
npf.ui.form.Field.prototype.getValue = function() {
	return this._value;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getRequestValue = function() {
	return this._value + '';
};

/**
 * @param {*} value
 * @param {boolean=} opt_noRender
 */
npf.ui.form.Field.prototype.setValue = function(value, opt_noRender) {
	var correctedValue = this.correctValueInternal(value);

	if (this.isSameValue(correctedValue)) {
		return;
	}

	this.setValueInternal(correctedValue);
	this.renderValueInternal(this.getValue());

	this._error = this.validateInternal();

	if (!this._error && this._hideErrorOnChange) {
		this.setErrorVisible(false);
	}

	this.dispatchEvent({
		type: npf.ui.form.EventType.CHANGE,
		value: this.getValue()
	});
};

/**
 * @param {*} value
 * @protected
 */
npf.ui.form.Field.prototype.setValueInternal = function(value) {
	this._value = value;
};

/**
 * @param {*} value
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isSameValue = function(value) {
	return this.getValue() === value;
};

/**
 * @param {*} value
 * @return {*}
 * @protected
 */
npf.ui.form.Field.prototype.correctValueInternal = function(value) {
	return value;
};

/**
 * @param {*} value
 * @protected
 */
npf.ui.form.Field.prototype.renderValueInternal = function(value) {
	this.getRenderer().setValue(this.getValueElement(), value);
};

/**
 * @return {string}
 * @protected
 */
npf.ui.form.Field.prototype.validateInternal = function() {
	/** @type {string} */
	var error = '';

	if (this.isRequired() && this.isEmpty()) {
		error = this.getRequiredError();
	} else {
		goog.array.every(this._validators, function(validator) {
			error = validator(this.getValue());

			return !error;
		}, this);
	}

	return error;
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isEmpty = function() {
	return false;
};

/**
 * @param {Element} valueElement
 * @protected
 */
npf.ui.form.Field.prototype.bindLabel = function(valueElement) {
	if (!valueElement.id) {
		valueElement.id = goog.ui.IdGenerator.getInstance().getNextUniqueId();
	}

	/** @type {Element} */
	var labelElement = this.getLabelElement();

	if (labelElement) {
		labelElement.setAttribute('for', valueElement.id);
	}
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isRequired = function() {
	return this._required;
};

/**
 * @param {boolean} require
 */
npf.ui.form.Field.prototype.setRequired = function(require) {
	this._required = require;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getLabel = function() {
	return this._label;
};

/**
 * @param {string} label
 * @throws {Error} If the block is already in the document.
 */
npf.ui.form.Field.prototype.setLabel = function(label) {
	if (this.isInDocument()) {
		// Too late.
		throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
	}

	this._label = label;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getNotice = function() {
	return this._notice;
};

/**
 * @param {string} notice
 * @throws {Error} If the block is already in the document.
 */
npf.ui.form.Field.prototype.setNotice = function(notice) {
	if (this.isInDocument()) {
		// Too late.
		throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
	}

	this._notice = notice;
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isEnabled = function() {
	return this._isEnabled;
};

/**
 * @param {boolean} enable
 */
npf.ui.form.Field.prototype.setEnabled = function(enable) {
	if (this._isEnabled != enable) {
		this._isEnabled = enable;
		this.setEnabledInternal(this._isEnabled);
	}
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.form.Field.prototype.setEnabledInternal = function(enable) {
	this.getRenderer().setEnabled(this.getElement(), enable);
};

/**
 * @return {string}
 * @protected
 */
npf.ui.form.Field.prototype.getRequiredError = function() {
	return npf.ui.form.Field.ErrorMessage.REQUIRED;
};

/**
 * @param {function(*):string} validator
 */
npf.ui.form.Field.prototype.addValidator = function(validator) {
	this._validators.push(validator);
};

/**
 * @param {RegExp} regExp
 * @param {string} error
 */
npf.ui.form.Field.prototype.addRegExpValidator = function(regExp, error) {
	this.addValidator(function(value) {
		return goog.isString(value) && !regExp.test(value) ? error : '';
	});
};

npf.ui.form.Field.prototype.focusAndSelect = function() {
	this.getRenderer().focusAndSelect(this.getValueElement());
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isHiddenErrorOnChange = function() {
	return this._hideErrorOnChange;
};

/**
 * @param {boolean} hide
 */
npf.ui.form.Field.prototype.setHiddenErrorOnChange = function(hide) {
	this._hideErrorOnChange = hide;
};

/**
 * Показывает сообщение об ошибке.
 * @param {string} error
 */
npf.ui.form.Field.prototype.showError = function(error) {
	this.setError(error);
	this.setErrorVisible(true);
};

npf.ui.form.Field.prototype.hideError = function() {
	this.setError('');
	this.setErrorVisible(false);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.isErrorVisible = function() {
	return this._errorVisible;
};

/**
 * @param {boolean} visible
 */
npf.ui.form.Field.prototype.setErrorVisible = function(visible) {
	if (this._errorVisible != visible) {
		this._errorVisible = visible;
		this.setErrorVisibleInternal(this._errorVisible);
	}
};

/**
 * @param {boolean} visible
 */
npf.ui.form.Field.prototype.setErrorVisibleInternal = function(visible) {
	this.getRenderer().setErrorVisible(this.getElement(), visible);
};

/**
 * @return {boolean}
 */
npf.ui.form.Field.prototype.hasError = function() {
	return '' != this._error;
};

/**
 * @return {string}
 */
npf.ui.form.Field.prototype.getError = function() {
	return this._error;
};

/**
 * @param {?string=} opt_error
 */
npf.ui.form.Field.prototype.setError = function(opt_error) {
	/** @type {string} */
	var error = goog.isString(opt_error) ? opt_error : '';

	if (this._error != error) {
		this._error = error;
		this.setErrorInternal(this._error);

		if (this._error) {
			this.dispatchEvent({
				type: npf.ui.form.EventType.ERROR,
				value: this.getValue(),
				error: this.getError()
			});
		} else {
			this.dispatchEvent({
				type: npf.ui.form.EventType.VALID,
				value: this.getValue()
			});
		}
	}
};

/**
 * @param {string} error
 * @protected
 */
npf.ui.form.Field.prototype.setErrorInternal = function(error) {
	this.getRenderer().setContent(this.getErrorElement(), error);
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getLabelContainerElement = function() {
	return this.getRenderer().getLabelContainerElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getLabelElement = function() {
	return this.getRenderer().getLabelElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getNoticeElement = function() {
	return this.getRenderer().getNoticeElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getErrorElement = function() {
	return this.getRenderer().getErrorElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.form.Field.prototype.getValueElement = function() {
	return this.getRenderer().getValueElement(this.getElement());
};
