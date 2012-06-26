goog.provide('npf.ui.SearchInput');

goog.require('goog.events.InputHandler');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.searchInput.Renderer');


/**
 * @param {string=} opt_value
 * @param {string=} opt_placeholder
 * @param {npf.ui.searchInput.Renderer=} opt_renderer
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.SearchInput = function(opt_value, opt_placeholder, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.searchInput.Renderer.getInstance(), opt_domHelper);

	this._value = opt_value || '';
	this._placeholderValue = opt_placeholder || '';
};
goog.inherits(npf.ui.SearchInput, npf.ui.RenderComponent);


/**
 * @enum {string}
 */
npf.ui.SearchInput.EventType = {
	/**
	 * Изменилось значение контрола.
	 * value (string)
	 */
	CHANGE: goog.events.getUniqueId('change'),

	/**
	 * Пустое значение в контроле.
	 */
	CLEAR: goog.events.getUniqueId('clear')
};

/**
 * @type {string}
 * @private
 */
npf.ui.SearchInput.prototype._value = '';

/**
 * @type {string}
 * @private
 */
npf.ui.SearchInput.prototype._placeholderValue = '';

/**
 * @type {boolean}
 * @private
 */
npf.ui.SearchInput.prototype._clearable = true;

/**
 * @type {boolean}
 * @private
 */
npf.ui.SearchInput.prototype._hasIcon = true;

/**
 * @type {goog.events.InputHandler}
 * @private
 */
npf.ui.SearchInput.prototype._inputHandler = null;


/** @inheritDoc */
npf.ui.SearchInput.prototype.createDom = function() {
	goog.base(this, 'createDom');

	/** @type {Element} */
	var placeholderElement = this.getPlaceholderElement();
	/** @type {Element} */
	var clearElement = this.getClearElement();

	this.setInputValue(this._value);
	this.setEmptyInternal('' == this._value);
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	/** @type {goog.events.EventHandler} */
	var handler = this.getHandler();
	/** @type {Element} */
	var iconElement = this.getIconElement();
	/** @type {Element} */
	var clearElement = this.getClearElement();

	if (iconElement) {
		handler.listen(iconElement, goog.events.EventType.CLICK, this._onIconClick, false, this);
	}

	if (clearElement) {
		handler.listen(clearElement, goog.events.EventType.CLICK, this._onClearClick, false, this);
	}

	this._inputHandler = new goog.events.InputHandler(this.getQueryElement());
	handler.listen(this._inputHandler, goog.events.InputHandler.EventType.INPUT, this._onChange, false, this);
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.exitDocument = function() {
	this._inputHandler.dispose();
	this._inputHandler = null;

	goog.base(this, 'exitDocument');
};

/** @inheritDoc */
npf.ui.SearchInput.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._value;
	delete this._placeholderValue;
	delete this._clearable;
	delete this._hasIcon;
	delete this._inputHandler;
};

/**
 * @return {npf.ui.searchInput.Renderer}
 */
npf.ui.SearchInput.prototype.getRenderer = function() {
	return /** @type {npf.ui.searchInput.Renderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.searchInput.Renderer} renderer
 */
npf.ui.SearchInput.prototype.setRenderer = function(renderer) {
	goog.base(this, 'setRenderer', renderer);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype._onIconClick = function(evt) {
	this.getRenderer().focus(this.getQueryElement());
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype._onClearClick = function(evt) {
	this.setValueInternal('', true);
	this.getRenderer().focus(this.getQueryElement());
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.SearchInput.prototype._onChange = function(evt) {
	this.update();
};

/**
 * @return {boolean}
 */
npf.ui.SearchInput.prototype.isClearable = function() {
	return this._clearable;
};

/**
 * @param {boolean} enable
 */
npf.ui.SearchInput.prototype.setClearable = function(enable) {
	this._clearable = enable;
};

/**
 * @return {boolean}
 */
npf.ui.SearchInput.prototype.hasIcon = function() {
	return this._hasIcon;
};

/**
 * @param {boolean} enable
 */
npf.ui.SearchInput.prototype.setIcon = function(enable) {
	this._hasIcon = enable;
};

npf.ui.SearchInput.prototype.focus = function() {
	this.getRenderer().focusAndSelect(this.getQueryElement());
};

/**
 * @return {string}
 */
npf.ui.SearchInput.prototype.getPlaceholderValue = function() {
	return this._placeholderValue;
};

/**
 * @return {string}
 */
npf.ui.SearchInput.prototype.getValue = function() {
	return this._value;
};

npf.ui.SearchInput.prototype.update = function() {
	/** @type {string} */
	var value = this.getRenderer().getValue(this.getQueryElement());
	this.setValueInternal(value, false);
};

/**
 * @param {string} value
 */
npf.ui.SearchInput.prototype.setValue = function(value) {
	this.setValueInternal(value, true);
};

/**
 * @param {string} value
 * @param {boolean} updateInput
 * @protected
 */
npf.ui.SearchInput.prototype.setValueInternal = function(value, updateInput) {
	if (this._value == value) {
		return;
	}

	/** @type {boolean} */
	var oldEmpty = '' == this._value;
	/** @type {boolean} */
	var newEmpty = '' == value;

	this._value = value;

	if (oldEmpty != newEmpty) {
		this.setEmptyInternal(newEmpty);
	}

	if (updateInput) {
		this.setInputValue(value);
	}

	this.dispatchChangeEvent();

	if ('' == this._value) {
		this.dispatchClearEvent();
	}
};

/**
 * @param {string} value
 * @protected
 */
npf.ui.SearchInput.prototype.setInputValue = function(value) {
	this.getRenderer().setValue(this.getQueryElement(), value);
};

/**
 * @param {boolean} empty
 * @protected
 */
npf.ui.SearchInput.prototype.setEmptyInternal = function(empty) {
	this.getRenderer().setVisible(this.getClearElement(), !empty);
	this.getRenderer().setVisible(this.getPlaceholderElement(), empty);
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getPlaceholderElement = function() {
	return this.getRenderer().getPlaceholderElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getQueryElement = function() {
	return this.getRenderer().getQueryElement(this.getElement());
};

/**
 * @return {Element}
 */
npf.ui.SearchInput.prototype.getIconElement = function() {
	return this.getRenderer().getIconElement(this.getElement());
};

/**
 * @return {?Element}
 */
npf.ui.SearchInput.prototype.getClearElement = function() {
	return this.getRenderer().getClearElement(this.getElement());
};

/**
 * @protected
 */
npf.ui.SearchInput.prototype.dispatchChangeEvent = function() {
	this.dispatchEvent({
		type: npf.ui.SearchInput.EventType.CHANGE,
		value: this._value
	});
};

/**
 * @protected
 */
npf.ui.SearchInput.prototype.dispatchClearEvent = function() {
	this.dispatchEvent({
		type: npf.ui.SearchInput.EventType.CLEAR
	});
};
