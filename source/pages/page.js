goog.provide('npf.pages.Page');

goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.net.HttpStatus');
goog.require('goog.object');
goog.require('npf.Router');
goog.require('npf.pages.Request');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.pages.Page = function() {
	goog.base(this);

	this._helpersMap = {};

	this._handler = new goog.events.EventHandler();
	this.registerDisposable(this._handler);
};
goog.inherits(npf.pages.Page, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.pages.Page.EventType = {
	/**
	 * status (number)
	 */
	ERROR: goog.events.getUniqueId('error'),
	/**
	 * title (string)
	 */
	TITLE_CHANGE: goog.events.getUniqueId('titleChange')
};

/**
 * @enum {string}
 */
npf.pages.Page.ErrorPageType = {
	ERROR404: goog.net.HttpStatus.NOT_FOUND + '',
	ERROR500: goog.net.HttpStatus.INTERNAL_SERVER_ERROR + '',
	ERROR503: goog.net.HttpStatus.SERVICE_UNAVAILABLE + ''
};

/**
 * @type {!Object.<string,goog.Disposable>}
 * @private
 */
npf.pages.Page.prototype._helpersMap;

/**
 * @type {!goog.events.EventHandler}
 * @private
 */
npf.pages.Page.prototype._handler;

/**
 * @type {boolean}
 * @private
 */
npf.pages.Page.prototype._isLoaded = false;

/**
 * Флаг, была ли страница загружена до текущей загрузки.
 * @type {boolean}
 * @private
 */
npf.pages.Page.prototype._wasLoaded = false;

/**
 * @type {string}
 * @private
 */
npf.pages.Page.prototype._title = '';

/**
 * @type {npf.pages.Manager}
 * @private
 */
npf.pages.Page.prototype._manager = null;


/** @inheritDoc */
npf.pages.Page.prototype.disposeInternal = function() {
	this.unload();

	goog.base(this, 'disposeInternal');

	delete this._helpersMap;
	delete this._handler;
	delete this._isLoaded;
	delete this._wasLoaded;
	delete this._title;
	delete this._manager;
};

/**
 * @param {npf.pages.Request} request
 */
npf.pages.Page.prototype.load = function(request) {
	if (this._isLoaded) {
		this._wasLoaded = true;
	}

	this._isLoaded = true;

	try {
		this.initHelpers(request);
		this.loadInternal(request);
	} catch (e) {
		if (goog.DEBUG && window.console) {
  		window.console.error(e.stack);
  	}

  	throw e;
	}
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Page.prototype.loadInternal = function(request) {

};

npf.pages.Page.prototype.unload = function() {
	if (!this._isLoaded) {
		return;
	}

	this._isLoaded = false;

	try {
		this.unloadInternal();
		this.removeHelpers();
		this._wasLoaded = false;
	} catch (e) {
		if (goog.DEBUG && window.console) {
  		window.console.error(e.stack);
  	}

  	throw e;
	}
};

/**
 * @protected
 */
npf.pages.Page.prototype.unloadInternal = function() {

};

/**
 * @return {boolean}
 */
npf.pages.Page.prototype.isLoaded = function() {
	return this._isLoaded;
};

/**
 * @return {boolean}
 */
npf.pages.Page.prototype.wasLoaded = function() {
	return this._wasLoaded;
};

/**
 * @return {!goog.events.EventHandler}
 */
npf.pages.Page.prototype.getHandler = function() {
	return this._handler;
};

/**
 * @return {Element|goog.ui.Component}
 */
npf.pages.Page.prototype.getParentContainer = function() {
	return this._manager ? this._manager.getParentContainer() : null;
};

/**
 * @param {goog.ui.Component} container
 * @param {boolean=} opt_render only for container-component
 */
npf.pages.Page.prototype.appendToParentContainer = function(container, opt_render) {
	var parentContainer = this._manager.getParentContainer() || document.body;

	if (parentContainer.getElement) {
		parentContainer.addChild(container, opt_render);
	} else {
		container.render(/** @type {Element} */ (parentContainer));
	}
};

/**
 * @param {goog.ui.Component} container
 * @param {boolean=} opt_unrender only for container-component
 */
npf.pages.Page.prototype.removeFromParentContainer = function(container, opt_unrender) {
	var parentContainer = this._manager.getParentContainer();

	if (parentContainer && parentContainer.getElement) {
		parentContainer.removeChild(container, opt_unrender);
	} else {
		goog.dom.removeNode(container.getElement());
	}
};

/**
 * @return {string}
 */
npf.pages.Page.prototype.getTitle = function() {
	return this._title;
};

/**
 * @param {string} title
 */
npf.pages.Page.prototype.setTitle = function(title) {
	if (this._title == title) {
		return;
	}

	this._title = title;
	this.dispatchTitleChangeEvent(this._title);
};

/**
 * @return {Array.<string>}
 */
npf.pages.Page.prototype.getUsingHelperTypes = function() {
	return null;
};

/**
 * @return {!Object.<string,goog.Disposable>}
 */
npf.pages.Page.prototype.getHelpersMap = function() {
	return this._helpersMap;
};

/**
 * @param {string} type
 * @return {goog.Disposable}
 */
npf.pages.Page.prototype.getHelper = function(type) {
	return /** @type {goog.Disposable} */ (goog.object.get(this._helpersMap, type, null));
};

/**
 * @param {goog.Disposable} helper
 * @param {string} type
 */
npf.pages.Page.prototype.setHelper = function(helper, type) {
	goog.object.set(this._helpersMap, type, helper);
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Page.prototype.initHelpers = function(request) {};

/**
 * @protected
 */
npf.pages.Page.prototype.removeHelpers = function() {
	this._helpersMap = {};
};

/**
 * @return {npf.pages.Manager}
 */
npf.pages.Page.prototype.getManager = function() {
	return this._manager;
};

/**
 * @param {npf.pages.Manager} manager
 */
npf.pages.Page.prototype.setManager = function(manager) {
	this._manager = manager;
};

/**
 * @return {Array.<npf.router.Route>}
 */
npf.pages.Page.prototype.getRoutes = function() {
	/** @type {npf.Router} */
	var router = this.getRouter();

	return router ? router.getRoutes() : null;
};

/**
 * @return {Array.<string>}
 */
npf.pages.Page.prototype.getRouteNames = function() {
	/** @type {npf.Router} */
	var router = this.getRouter();

	return router ? router.getRouteNames() : null;
};

/**
 * @param {string} name
 * @return {npf.router.Route}
 */
npf.pages.Page.prototype.getRoute = function(name) {
	/** @type {npf.Router} */
	var router = this.getRouter();

	return router ? router.getRoute(name) : null;
};

/**
 * @param {number} index
 * @return {npf.router.Route}
 */
npf.pages.Page.prototype.getRouteAt = function(index) {
	/** @type {npf.Router} */
	var router = this.getRouter();

	return router ? router.getRouteAt(index) : null;
};

/**
 * @param {number} index
 * @return {string?}
 */
npf.pages.Page.prototype.getRouteNameAt = function(index) {
	/** @type {npf.Router} */
	var router = this.getRouter();

	return router ? router.getRouteNameAt(index) : null;
};

/**
 * @param {string|npf.router.Route} routeName
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
 * @param {boolean=} opt_replace
 */
npf.pages.Page.prototype.navigateRoute = function(routeName, opt_optionsMap, opt_query, opt_replace) {
	/** @type {npf.Router} */
	var router = this.getRouter();

	if (router) {
		router.navigateRoute(routeName, opt_optionsMap, opt_query, opt_replace);
	}
};

/**
 * @param {string|goog.Uri} token
 * @param {boolean=} opt_replace
 */
npf.pages.Page.prototype.navigate = function(token, opt_replace) {
	/** @type {npf.Router} */
	var router = this.getRouter();

	if (router) {
		router.navigate(token, opt_replace);
	}
};

/**
 * @return {npf.Router}
 */
npf.pages.Page.prototype.getRouter = function() {
	return this._manager ? this._manager.getRouter() : null;
};

/**
 * @return {npf.pages.Request}
 */
npf.pages.Page.prototype.getRequest = function() {
	return this._manager ? this._manager.getRequest() : null;
};

/**
 * @param {number=} opt_index
 * @return {npf.pages.Request}
 */
npf.pages.Page.prototype.getRequestFromHistory = function(opt_index) {
	return this._manager ? this._manager.getRequestFromHistory(opt_index) : null;
};

/**
 * @param {number} status
 * @protected
 */
npf.pages.Page.prototype.dispatchErrorEvent = function(status) {
	this.dispatchEvent({
		type: npf.pages.Page.EventType.ERROR,
		status: status
	});
};

/**
 * @param {string} title
 * @protected
 */
npf.pages.Page.prototype.dispatchTitleChangeEvent = function(title) {
	this.dispatchEvent({
		type: npf.pages.Page.EventType.TITLE_CHANGE,
		title: title
	});
};
