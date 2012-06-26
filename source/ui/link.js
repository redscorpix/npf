goog.provide('npf.ui.Link');

goog.require('goog.dom.classes');
goog.require('goog.dom.TagName');
goog.require('goog.events.BrowserEvent');
goog.require('npf.events.TapHandler');
goog.require('npf.ui.Component');


/**
 * @param {string=} opt_htmlCaption
 * @param {string=} opt_url
 * @constructor
 * @extends {npf.ui.Component}
 */
npf.ui.Link = function(opt_htmlCaption, opt_url) {
	goog.base(this);

	this._caption = opt_htmlCaption || null;
	this._url = opt_url || null;
};
goog.inherits(npf.ui.Link, npf.ui.Component);


/**
 * @type {?string}
 * @private
 */
npf.ui.Link.prototype._caption;

/**
 * @type {?string}
 * @private
 */
npf.ui.Link.prototype._url;

/**
 * @type {Array.<string>}
 * @private
 */
npf.ui.Link.prototype._cssClass = null;


/** @inheritDoc */
npf.ui.Link.prototype.createDom = function() {
	/** @type {string} */
	var tagName = goog.dom.TagName.SPAN;
	/** @type {Object} */
	var attrs = null;

	if (this._url) {
		tagName = goog.dom.TagName.A;
		attrs = {
			'href': this._url
		};
	}

	/** @type {Element} */
	var element = goog.dom.createDom(tagName, attrs, this._caption);

	if (this._cssClass) {
		goog.dom.classes.add(element, this._cssClass.join(' '));
	}

	this.setElementInternal(element);
};

/** @inheritDoc */
npf.ui.Link.prototype.enterDocument = function() {
	goog.base(this, 'enterDocument');

	var tapHandler = new npf.events.TapHandler(this.getElement());
	this.disposeOnExitDocument(tapHandler);

	this.getHandler().listen(tapHandler, npf.events.TapHandler.EventType.TAP, this._onTap, false, this);
};

/** @inheritDoc */
npf.ui.Link.prototype.disposeInternal = function() {
	goog.base(this, 'disposeInternal');

	delete this._caption;
	delete this._url;
	delete this._cssClass;
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.ui.Link.prototype._onTap = function(evt) {
	/** @type {goog.events.BrowserEvent} */
	var event = new goog.events.BrowserEvent(evt.getBrowserEvent());
  event.type = goog.ui.Component.EventType.ACTION;

	this.dispatchEvent(event);
};

/**
 * @return {string?}
 */
npf.ui.Link.prototype.getCaption = function() {
	return this._caption;
};

/**
 * @param {string=} opt_caption
 */
npf.ui.Link.prototype.setCaption = function(opt_caption) {
	this._caption = opt_caption || null;
};

/**
 * @return {string?}
 */
npf.ui.Link.prototype.getUrl = function() {
	return this._url;
};

/**
 * @param {string=} opt_url
 */
npf.ui.Link.prototype.setUrl = function(opt_url) {
	this._url = opt_url || null;
};

/**
 * @return {Array.<string>}
 */
npf.ui.Link.prototype.getCssClass = function() {
	return this._cssClass;
};

/**
 * @param {string|Array.<string>|null} cssClass
 */
npf.ui.Link.prototype.setCssClass = function(cssClass) {
	if (goog.isString(cssClass)) {
		this._cssClass = [cssClass];
	} else {
		this._cssClass = cssClass;
	}
};
