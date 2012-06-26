goog.provide('npf.History');

goog.require('goog.History');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.history.EventType');
goog.require('goog.history.Html5History');
goog.require('npf.events.TapHandler');
goog.require('npf.history.TokenTransformer');



/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.History = function() {
	goog.base(this);

	if (npf.History.isHtml5HistorySupported) {
		this._html5History = new goog.history.Html5History(null, new npf.history.TokenTransformer());
		this._html5History.setPathPrefix('');
		this._html5History.setParentEventTarget(this);
		this._html5History.setUseFragment(false);
		this.registerDisposable(this._html5History);
	} else {
		this._history = new goog.History();
		this._history.setParentEventTarget(this);
		this.registerDisposable(this._history);
	}
};
goog.inherits(npf.History, goog.events.EventTarget);


/**
 * @define {boolean}
 */
npf.History.ASSUME_HTML5 = false;

/**
 * @enum {string}
 */
npf.History.EventType = {
	NAVIGATE: goog.history.EventType.NAVIGATE
};

/**
 * @type {string}
 */
npf.History.EXTERNAL_CSS_CLASS = goog.getCssName('external');

/**
 * @type {boolean}
 */
npf.History.isHtml5HistorySupported = npf.History.ASSUME_HTML5 || goog.history.Html5History.isSupported();

/**
 * @type {goog.History}
 * @private
 */
npf.History.prototype._history = null;

/**
 * @type {goog.history.Html5History}
 * @private
 */
npf.History.prototype._html5History = null;

/**
 * @type {boolean}
 * @private
 */
npf.History.prototype._isLinksHandlerEnabled = false;

/**
 * @type {npf.events.TapHandler}
 * @private
 */
npf.History.prototype._tapHandler = null;


/** @inheritDoc */
npf.History.prototype.disposeInternal = function() {
	this.setLinksHandlerEnabled(false);

	goog.base(this, 'disposeInternal');

	delete this._history;
	delete this._html5History;
	delete this._isLinksHandlerEnabled;
	delete this._tapHandler;
};

/**
 * @param {boolean} enable
 */
npf.History.prototype.setEnabled = function(enable) {
	if (this._history) {
		this._history.setEnabled(enable);
	} else if (this._html5History) {
		this._html5History.setEnabled(enable);
	}

	this.setLinksHandlerEnabled(enable);
};

/**
 * @return {string}
 */
npf.History.prototype.getToken = function() {
	if (this._history) {
		return this._history.getToken();
	}	else {
		return this._html5History.getToken();
	}
};

/**
 * @param {string} token
 * @param {string=} opt_title
 */
npf.History.prototype.setToken = function(token, opt_title) {
	if (this._history) {
		return this._history.setToken(token, opt_title);
	} else {
		return this._html5History.setToken(token, opt_title);
	}
};

/**
 * @param {string} token
 * @param {string=} opt_title
 */
npf.History.prototype.replaceToken = function(token, opt_title) {
	if (this._history) {
		return this._history.replaceToken(token, opt_title);
	} else {
		return this._html5History.replaceToken(token, opt_title);
	}
};

/**
 * @return {boolean}
 */
npf.History.prototype.isHtml5Used = function() {
	return !this._history;
};

/**
 * @return {boolean}
 */
npf.History.prototype.isLinksHandlerEnabled = function() {
	return this._isLinksHandlerEnabled;
};

/**
 * @param {boolean} enable
 */
npf.History.prototype.setLinksHandlerEnabled = function(enable) {
	if (this._isLinksHandlerEnabled == enable) {
		return;
	}

	this._isLinksHandlerEnabled = enable;

	if (this._isLinksHandlerEnabled) {
		this._tapHandler = new npf.events.TapHandler(document.body);
		goog.events.listen(this._tapHandler, npf.events.TapHandler.EventType.TAP, this._onTap, false, this);
	} else {
		goog.events.unlisten(this._tapHandler, npf.events.TapHandler.EventType.TAP, this._onTap, false, this);
		this._tapHandler.dispose();
		this._tapHandler = null;
	}
};

/**
 * @param {goog.events.BrowserEvent} evt
 * @private
 */
npf.History.prototype._onTap = function(evt) {
	/** @type {Node} */
	var targetElement = evt ? evt.target : null;

	if (targetElement && !evt.getBrowserEvent()['defaultPrevented']) {
		/** @type {Element} */
		var element = /** @type {Element} */ (goog.dom.getAncestorByTagNameAndClass(targetElement, goog.dom.TagName.A));

		if (element && this.isInnerHandler(element)) {
			var uri = goog.Uri.parse(element.href);
			/** @type {string} */
			var token = uri.getPath();

			if (uri.hasQuery()) {
				token += '?' + uri.getQuery();
			}

			this.setToken(token);
			evt.preventDefault();
		}
	}
};

/**
 * @param {!Element} linkElement
 * @return {boolean}
 * @protected
 */
npf.History.prototype.isInnerHandler = function(linkElement) {
	return !goog.dom.classes.has(linkElement, npf.History.EXTERNAL_CSS_CLASS);
};
