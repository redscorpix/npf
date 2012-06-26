goog.provide('npf.ui.Image');

goog.require('goog.dom.classes');
goog.require('goog.dom.TagName');
goog.require('goog.math.Size');
goog.require('goog.ui.Component');


/**
 * @param {string} src
 * @param {number} width
 * @param {number} height
 * @constructor
 * @extends {goog.ui.Component}
 */
npf.ui.Image = function(src, width, height) {
	goog.base(this);

	this._src = src;
	this._size = new goog.math.Size(width, height);
};
goog.inherits(npf.ui.Image, goog.ui.Component);


/**
 * @type {string}
 * @private
 */
npf.ui.Image.prototype._src;

/**
 * @type {!goog.math.Size}
 * @private
 */
npf.ui.Image.prototype._size;

/**
 * @type {Array.<string>}
 * @private
 */
npf.ui.Image.prototype._cssClass = null;

/**
 * @type {?string}
 * @private
 */
npf.ui.Image.prototype._caption = null;


/** @inheritDoc */
npf.ui.Image.prototype.createDom = function() {
	/** @type {Element} */
	var element = goog.dom.createDom(goog.dom.TagName.IMG, {
		'alt': this._caption || '',
		'src': this._src,
		'width': this._size.width,
		'height': this._size.height
	});

	if (this._cssClass) {
		goog.dom.classes.add(element, this._cssClass.join(' '));
	}

	this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Image.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._src;
	delete this._size;
	delete this._cssClass;
	delete this._caption;
};

/**
 * @return {string}
 */
npf.ui.Image.prototype.getSrc = function() {
	return this._src;
};

/**
 * @return {!goog.math.Size}
 */
npf.ui.Image.prototype.getSize = function() {
	return this._size;
};

/**
 * @return {Array.<string>}
 */
npf.ui.Image.prototype.getCssClass = function() {
	return this._cssClass;
};

/**
 * @param {string|Array.<string>|null} cssClass
 */
npf.ui.Image.prototype.setCssClass = function(cssClass) {
	if (goog.isString(cssClass)) {
		this._cssClass = [cssClass];
	} else {
		this._cssClass = cssClass;
	}
};

/**
 * @param {?string} caption
 */
npf.ui.Image.prototype.setCaption = function(caption) {
	this._caption = caption;
};

/**
 * @return {?string}
 */
npf.ui.Image.prototype.getCaption = function() {
	return this._caption;
};
