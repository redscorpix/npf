goog.provide('npf.ui.navigation.Item');

goog.require('npf.events.TapHandler');
goog.require('npf.ui.RenderComponent');
goog.require('npf.ui.navigation.ItemRenderer');


/**
 * @param {string} type
 * @param {string} url
 * @param {string} caption
 * @param {npf.ui.navigation.ItemRenderer=} opt_renderer Renderer used to render or decorate the release.
 * @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document interaction.
 * @constructor
 * @extends {npf.ui.RenderComponent}
 */
npf.ui.navigation.Item = function(type, url, caption, opt_renderer, opt_domHelper) {
	goog.base(this, opt_renderer || npf.ui.navigation.ItemRenderer.getInstance(), opt_domHelper);

	this._type = type;
	this._url = url;
	this._caption = caption;
};
goog.inherits(npf.ui.navigation.Item, npf.ui.RenderComponent);


/**
 * @type {string}
 * @private
 */
npf.ui.navigation.Item.prototype._type;

/**
 * @type {string}
 * @private
 */
npf.ui.navigation.Item.prototype._caption;

/**
 * @type {string}
 * @private
 */
npf.ui.navigation.Item.prototype._url;

/**
 * @type {boolean}
 * @private
 */
npf.ui.navigation.Item.prototype._isSelected = false;

/**
 * @type {boolean}
 * @private
 */
npf.ui.navigation.Item.prototype._isEnabled = true;


/** @inheritDoc */
npf.ui.navigation.Item.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var tapHandler = new npf.events.TapHandler(this.getElement());
	this.disposeOnExitDocument(tapHandler);

	this.getHandler().listen(tapHandler, npf.events.TapHandler.EventType.TAP, this._onTap, false, this);
};

/** @inheritDoc */
npf.ui.navigation.Item.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._type;
	delete this._caption;
	delete this._url;
	delete this._isSelected;
	delete this._isEnabled;
};

/**
 * @return {npf.ui.navigation.ItemRenderer}
 */
npf.ui.navigation.Item.prototype.getRenderer = function() {
	return /** @type {npf.ui.navigation.ItemRenderer} */ (goog.base(this, 'getRenderer'));
};

/**
 * @param {npf.ui.navigation.ItemRenderer} renderer
 */
npf.ui.navigation.Item.prototype.setRenderer = function(renderer) {
	return goog.base(this, 'setRenderer', renderer);
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.navigation.Item.prototype._onTap = function(evt) {
	if (evt && !this._isEnabled) {
		evt.preventDefault();
	}
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getType = function() {
	return this._type;
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getCaption = function() {
	return this._caption;
};

/**
 * @param {string} caption
 */
npf.ui.navigation.Item.prototype.setCaption = function(caption) {
	if (this._caption != caption) {
		this._caption = caption;
		this.setCaptionInternal(this._caption);
	}
};

/**
 * @param {string} caption
 * @protected
 */
npf.ui.navigation.Item.prototype.setCaptionInternal = function(caption) {
	/** @type {npf.ui.navigation.ItemRenderer} */
	var renderer = this.getRenderer();
	/** @type {Element} */
	var captionElement = renderer.getCaptionElement(this.getElement());
	renderer.setCaption(captionElement, caption);
};

/**
 * @return {string}
 */
npf.ui.navigation.Item.prototype.getUrl = function() {
	return this._url;
};

/**
 * @param {string} url
 */
npf.ui.navigation.Item.prototype.setUrl = function(url) {
	if (this._url != url) {
		this._url = url;
		this.setUrlInternal(this._url);
	}
};

/**
 * @param {string} url
 * @protected
 */
npf.ui.navigation.Item.prototype.setUrlInternal = function(url) {
	/** @type {npf.ui.navigation.ItemRenderer} */
	var renderer = this.getRenderer();
	/** @type {Element} */
	var linkElement = renderer.getLinkElement(this.getElement());
	renderer.setUrl(linkElement, url);
};

/**
 * @return {boolean}
 */
npf.ui.navigation.Item.prototype.isSelected = function() {
	return this._isSelected;
};

/**
 * @param {boolean} select
 */
npf.ui.navigation.Item.prototype.setSelected = function(select) {
	if (this._isSelected != select) {
		this._isSelected = select;
		this.setSelectedInternal(this._isSelected);
	}
};

/**
 * @param {boolean} select
 * @protected
 */
npf.ui.navigation.Item.prototype.setSelectedInternal = function(select) {
	this.getRenderer().setSelected(this.getElement(), select);
};

/**
 * @return {boolean}
 */
npf.ui.navigation.Item.prototype.isEnabled = function() {
	return this._isEnabled;
};

/**
 * @param {boolean} enable
 */
npf.ui.navigation.Item.prototype.setEnabled = function(enable) {
	if (this._isEnabled != enable) {
		this._isEnabled = enable;
		this.setEnabledInternal(this._isEnabled);
	}
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.ui.navigation.Item.prototype.setEnabledInternal = function(enable) {
	this.getRenderer().setEnabled(this.getElement(), enable);
};
