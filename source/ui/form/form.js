goog.provide('npf.ui.Form');

goog.require('goog.events');
goog.require('goog.object');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.form.EventType');
goog.require('npf.ui.form.Field');
goog.require('npf.ui.form.Renderer');
goog.require('npf.ui.form.SubmitButton');


/**
 * @param {npf.ui.form.Renderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.Form = function(opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.form.Renderer.getInstance(), opt_domHelper);

	this._fieldsMap = {};
};
goog.inherits(npf.ui.Form, npf.ui.RenderComponent);


/**
 * @type {!Object.<string,npf.ui.form.Field>}
 * @private
 */
npf.ui.Form.prototype._fieldsMap;

/**
 * @type {npf.ui.form.SubmitButton}
 * @private
 */
npf.ui.Form.prototype._submitButton = null;

/**
 * @type {boolean}
 * @private
 */
npf.ui.Form.prototype._prevented = true;


/** @inheritDoc */
npf.ui.Form.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	this.getHandler().listen(this.getElement(), goog.events.EventType.SUBMIT, this._onSubmit, false, this);
};

/** @inheritDoc */
npf.ui.Form.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._fieldsMap;
	delete this._submitButton;
	delete this._prevented;
};

/** @inheritDoc */
npf.ui.Form.prototype.addChildAt = function(child, index, opt_render) {
	goog.base(this, 'addChildAt', child, index, opt_render);

	if (child instanceof npf.ui.form.Field) {
		goog.object.add(this._fieldsMap, child.getName(), child);
	}
};

/** @inheritDoc */
npf.ui.Form.prototype.removeChild = function(child, opt_unrender) {
	if (child) {
		var id = goog.isString(child) ? child : child.getId();
		child = this.getChild(id);

		if (child && child instanceof npf.ui.form.Field) {
			goog.object.remove(this._fieldsMap, child.getName());
		}
	}

	return goog.base(this, 'removeChild', child, opt_unrender);
};

/**
 * @return {npf.ui.form.Renderer}
 */
npf.ui.Form.prototype.getRenderer = function() {
	return /** @type {npf.ui.form.Renderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.form.Renderer} renderer
 */
npf.ui.Form.prototype.setRenderer = function(renderer) {
	goog.base(this, 'setRenderer', renderer);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.ui.Form.prototype._onSubmit = function(evt) {
	if (this._prevented && evt) {
		evt.preventDefault();
	}

	this.onSubmit();
	this.dispatchEvent(npf.ui.form.EventType.SUBMIT);
};

/**
 * @protected
 */
npf.ui.Form.prototype.onSubmit = function() {
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.hasErrors = function() {
	return !goog.object.every(this._fieldsMap, function(field) {
		return !field.hasError();
	}, this);
};

/**
 * @return {!Object}
 */
npf.ui.Form.prototype.getRequestData = function() {
	/** @type {!Object} */
	var result = {};

	goog.object.forEach(this._fieldsMap, function(field) {
		result[field.getName()] = field.getRequestData();
	}, this);

	return result;
};

/**
 * @param {string} name
 * @return {*}
 */
npf.ui.Form.prototype.getValue = function(name) {
	var field = /** @type {npf.ui.form.Field} */ (goog.object.get(this._fieldsMap, name, null));

	return field ? field.getValue() : undefined;
};

/**
 * @param {string} name
 * @return {string}
 */
npf.ui.Form.prototype.getRequestValue = function(name) {
	var field = /** @type {npf.ui.form.Field} */ (goog.object.get(this._fieldsMap, name, null));

	return field ? field.getRequestValue() : '';
};

/**
 * @param {string} name
 * @return {npf.ui.form.Field}
 */
npf.ui.Form.prototype.getField = function(name) {
	return /** @type {npf.ui.form.Field} */ (goog.object.get(this._fieldsMap, name, null));
};

/**
 * @return {npf.ui.form.SubmitButton}
 */
npf.ui.Form.prototype.getSubmitButton = function() {
	return this._submitButton;
};

/**
 * @param {npf.ui.form.SubmitButton} submitButton
 */
npf.ui.Form.prototype.setSubmitButton = function(submitButton) {
	this._submitButton = submitButton;
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.isSubmitEnabled = function() {
	return !!this._submitButton && this._submitButton.isEnabled();
};

/**
 * @param {boolean} enable
 */
npf.ui.Form.prototype.setSubmitButtonEnabled = function(enable) {
	if (this._submitButton) {
		this._submitButton.setEnabled(enable);
	}
};

/**
 * @return {boolean}
 */
npf.ui.Form.prototype.isPrevented = function() {
	return this._prevented;
};

/**
 * @param {boolean} prevent
 */
npf.ui.Form.prototype.setPrevented = function(prevent) {
	this._prevented = prevent;
};

/**
 * @param {Function} f
 * @param {Object=} opt_obj
 */
npf.ui.Form.prototype.forEachField = function(f, opt_obj) {
	var index = 0;

	this.forEachChild(function(child) {
		if (child instanceof npf.ui.form.Field) {
			f.call(opt_obj, child, index++);
		}
	}, this);
};
