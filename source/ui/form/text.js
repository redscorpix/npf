goog.provide('npf.ui.form.Text');

goog.require('goog.events.InputHandler');
goog.require('goog.format.EmailAddress');
goog.require('goog.string');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.TextRenderer');

/**
 * @param {string} name
 * @param {npf.ui.form.TextRenderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.form.Field}
 */
npf.ui.form.Text = function(name, opt_renderer, opt_domHelper) {
	goog.base(this, name, opt_renderer || npf.ui.form.TextRenderer.getInstance(), opt_domHelper);

	this.addClassName(this.getRenderer().getTextCssClass());
	this.setValueInternal('');
};
goog.inherits(npf.ui.form.Text, npf.ui.form.Field);


/**
 * @enum {string}
 */
npf.ui.form.Text.ErrorMessage = {
	EMAIL: 'Неправильный формат электронной почты.'
};

/**
 * @type {boolean}
 * @private
 */
npf.ui.form.Text.prototype._autoComplete = true;

/**
 * @type {goog.events.InputHandler}
 * @private
 */
npf.ui.form.Text.prototype._inputHandler = null;

/**
 * @type {number}
 * @private
 */
npf.ui.form.Text.prototype._maxLength = 0;


/** @inheritDoc */
npf.ui.form.Text.prototype.createDom = function() {
	goog.base(this, 'createDom');

	this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.Text.prototype.decorateInternal = function(element) {
	goog.base(this, 'decorateInternal', element);

	this.initializeInternal();
};

/** @inheritDoc */
npf.ui.form.Text.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	this._inputHandler = new goog.events.InputHandler(this.getValueElement());
	this._inputHandler.addEventListener(goog.events.InputHandler.EventType.INPUT, this._onInput, false, this);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.exitDocument = function() {
	goog.base(this, 'exitDocument');

	this._inputHandler.dispose();
	this._inputHandler = null;
};

/** @inheritDoc */
npf.ui.form.Text.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._autoComplete;
	delete this._inputHandler;
	delete this._maxLength;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.form.Text.prototype._onInput = function(evt) {
	/** @type {string} */
	var value = goog.string.trim(/** @type {string} */ (this.getRenderer().getValue(this.getValueElement())));

	this.setValue(value);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.initializeInternal = function() {
	this.setMaxLengthInternal(this._maxLength);
	this.setAutoCompleteInternal(this._autoComplete);
	this.bindLabel(this.getValueElement());

	goog.base(this, 'initializeInternal');
};

/**
 * @return {string}
 */
npf.ui.form.Text.prototype.getValue = function() {
	return /** @type {string} */ (goog.base(this, 'getValue'));
};

/**
 * @param {string} value
 */
npf.ui.form.Text.prototype.setValue = function(value) {
	goog.base(this, 'setValue', value);
};

/** @inheritDoc */
npf.ui.form.Text.prototype.isEmpty = function() {
	return '' == this.getValue();
};

/**
 * @return {boolean}
 */
npf.ui.form.Text.prototype.isAutoComplete = function() {
	return this._autoComplete;
};

/**
 * @param {boolean} autoComplete
 */
npf.ui.form.Text.prototype.setAutoComplete = function(autoComplete) {
	if (this._autoComplete != autoComplete) {
		this._autoComplete = autoComplete;
		this.setAutoCompleteInternal(this._autoComplete);
	}
};

/**
 * @param {boolean} autoComplete
 * @protected
 */
npf.ui.form.Text.prototype.setAutoCompleteInternal = function(autoComplete) {
	this.getRenderer().setAutoComplete(this.getValueElement(), autoComplete);
};

/**
 * @return {number}
 */
npf.ui.form.Text.prototype.getMaxLength = function() {
	return this._maxLength;
};

/**
 * @param {number} maxLength
 */
npf.ui.form.Text.prototype.setMaxLength = function(maxLength) {
	if (this._maxLength != maxLength) {
		this._maxLength = maxLength;
		this.setMaxLengthInternal(this._maxLength);
	}
};

/**
 * @param {number} maxLength
 * @protected
 */
npf.ui.form.Text.prototype.setMaxLengthInternal = function(maxLength) {
	this.getRenderer().setMaxLength(this.getValueElement(), maxLength);
};

/**
 * @param {string=} opt_error
 */
npf.ui.form.Text.prototype.addEmailValidator = function(opt_error) {
	/** @type {function(string):string} */
	var validator = function(/** @type {string} */ value) {
		if (goog.format.EmailAddress.isValidAddress(value)) {
			return '';
		} else {
			return opt_error || this.getEmailError();
		}
	};

	this.addValidator(goog.bind(validator, this));
};

/**
 * @return {string}
 */
npf.ui.form.Text.prototype.getEmailError = function() {
	return npf.ui.form.Text.ErrorMessage.EMAIL;
};
