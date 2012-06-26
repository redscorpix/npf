goog.provide('npf.ui.SimpleComponent');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.ui.Component');


/**
 * @param {string|Array.<string>=} opt_className
 * @param {string|Array.<string>=} opt_contentClassName
 * @constructor
 * @extends {goog.ui.Component}
 */
npf.ui.SimpleComponent = function(opt_className, opt_contentClassName) {
	goog.base(this);

	if (goog.isArray(opt_className)) {
		this._classNames = opt_className;
	} else if (goog.isString(opt_className)) {
		this._classNames = [opt_className];
	}

	if (goog.isArray(opt_contentClassName)) {
		this._contentClassNames = opt_contentClassName;
	} else if (goog.isString(opt_contentClassName)) {
		this._contentClassNames = [opt_contentClassName];
	}
};
goog.inherits(npf.ui.SimpleComponent, goog.ui.Component);


/**
 * @type {Array.<string>}
 * @private
 */
npf.ui.SimpleComponent.prototype._classNames = null;

/**
 * @type {Array.<string>}
 * @private
 */
npf.ui.SimpleComponent.prototype._contentClassNames = null;

/**
 * @type {Element}
 * @private
 */
npf.ui.SimpleComponent.prototype._contentElement = null;

/**
 * @type {string}
 * @private
 */
npf.ui.SimpleComponent.prototype._tagName = goog.dom.TagName.DIV;

/**
 * @type {string}
 * @private
 */
npf.ui.SimpleComponent.prototype._contentTagName = goog.dom.TagName.DIV;


/** @inheritDoc */
npf.ui.SimpleComponent.prototype.createDom = function() {
	var element = goog.dom.createDom(this._tagName, this._classNames);
	this.setElementInternal(element);

	if (this._contentClassNames) {
		this._contentElement = goog.dom.createDom(this._contentTagName, this._contentClassNames);
		goog.dom.appendChild(element, this._contentElement);
	} else {
		this._contentElement = element;
	}
};

/** @inheritDoc */
npf.ui.SimpleComponent.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._classNames;
	delete this._contentClassNames;
	delete this._contentElement;
	delete this._tagName;
	delete this._contentTagName;
};

/** @inheritDoc */
npf.ui.SimpleComponent.prototype.getContentElement = function() {
	return this._contentElement;
};

/**
 * @return {Array.<string>?}
 */
npf.ui.SimpleComponent.prototype.getClassNames = function() {
	return this._classNames;
};

/**
 * @return {Array.<string>?}
 */
npf.ui.SimpleComponent.prototype.getContentClassNames = function() {
	return this._contentClassNames;
};

/**
 * @return {string}
 */
npf.ui.SimpleComponent.prototype.getTagName = function() {
	return this._tagName;
};

/**
 * @param {string} tagName
 */
npf.ui.SimpleComponent.prototype.setTagName = function(tagName) {
	this._tagName = tagName;
};

/**
 * @return {string}
 */
npf.ui.SimpleComponent.prototype.getContentTagName = function() {
	return this._contentTagName;
};

/**
 * @param {string} tagName
 */
npf.ui.SimpleComponent.prototype.setContentTagName = function(tagName) {
	this._contentTagName = tagName;
};
