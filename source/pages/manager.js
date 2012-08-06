goog.provide('npf.pages.Manager');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.net.HttpStatus');
goog.require('goog.object');
goog.require('npf.Router');
goog.require('npf.pages.Page');
goog.require('npf.pages.Page.EventType');
goog.require('npf.pages.Request');


/**
 * @param {npf.Router} router
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.pages.Manager = function(router) {
	goog.base(this);

	this._router = router;
	this._pageCtrsMap = {};
	this._errorPageCtrsMap = {};
	this._routeNamesMap = {};
	this._helpersMap = {};
	this._requestHistory = [];

	this._handler = new goog.events.EventHandler();
	this.registerDisposable(this._handler);
};
goog.inherits(npf.pages.Manager, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.pages.Manager.EventType = {

	/**
	 * request (npf.pages.Request)
	 * page (npf.pages.Page)
	 */
	LOAD: goog.events.getUniqueId('load'),

	/**
	 * request (npf.pages.Request)
	 * page (npf.pages.Page)
	 */
	UNLOAD: goog.events.getUniqueId('unload')
};

/**
 * @type {npf.Router}
 * @private
 */
npf.pages.Manager.prototype._router;

/**
 * @type {!Object.<string,Function>}
 * @private
 */
npf.pages.Manager.prototype._pageCtrsMap;

/**
 * @type {!Object.<string,Function>}
 * @private
 */
npf.pages.Manager.prototype._errorPageCtrsMap;

/**
 * @type {!Object.<string,Array.<string>>}
 * @private
 */
npf.pages.Manager.prototype._routeNamesMap;

/**
 * @type {!Object.<string,goog.Disposable>}
 * @private
 */
npf.pages.Manager.prototype._helpersMap;

/**
 * @type {!goog.events.EventHandler}
 * @private
 */
npf.pages.Manager.prototype._handler;

/**
 * @type {npf.pages.Page}
 * @private
 */
npf.pages.Manager.prototype._page = null;

/**
 * @type {?string}
 * @private
 */
npf.pages.Manager.prototype._pageType = null;

/**
 * @type {npf.pages.Request}
 * @private
 */
npf.pages.Manager.prototype._request = null;

/**
 * @type {Element|goog.ui.Component}
 * @private
 */
npf.pages.Manager.prototype._parentContainer = null;

/**
 * @type {!Array.<npf.pages.Request>}
 * @private
 */
npf.pages.Manager.prototype._requestHistory;

/**
 * @type {number}
 * @private
 */
npf.pages.Manager.prototype._requestHistoryLimit = 1;


/** @inheritDoc */
npf.pages.Manager.prototype.disposeInternal = function() {
	this.unloadPage(this.getCurrentPage());

	goog.base(this, 'disposeInternal');

	delete this._router;
	delete this._pageCtrsMap;
	delete this._errorPageCtrsMap;
	delete this._routeNamesMap;
	delete this._helpersMap;
	delete this._handler;
	delete this._page;
	delete this._parentContainer;
	delete this._requestHistory;
	delete this._requestHistoryLimit;
};

npf.pages.Manager.prototype.init = function() {
	this._handler.listen(this._router, npf.Router.EventType.NAVIGATE, this._onNavigate, false, this);
	this._router.setEnabled(true);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.pages.Manager.prototype._onNavigate = function(evt) {
	var uri = /** @type {!goog.Uri} */ (evt.uri);
	var route = /** @type {npf.router.Route} */ (evt.route);
	var routeName = /** @type {string} */ (evt.name);
	var options = /** @type {Object.<string,string>} */ (evt.options);

	if (!this._request || this._request.uri.toString() != uri.toString()) {
		var request = new npf.pages.Request(uri, route, routeName, options);
		this.navigatePage(request);
	}
};

/**
 * @return {!goog.events.EventHandler}
 */
npf.pages.Manager.prototype.getHandler = function() {
	return this._handler;
};

/**
 * @param {string|goog.Uri} token
 */
npf.pages.Manager.prototype.navigate = function(token) {
	var info = this._router.parseToken(token);
	/** @type {!goog.Uri} */
	var uri = info.uri;
	/** @type {npf.router.Route} */
	var route = info.route;
	/** @type {string} */
	var routeName = info.name;
	/** @type {Object.<string,string>} */
	var options = info.options;

	if (!this._request || this._request.uri.toString() != uri.toString()) {
		var request = new npf.pages.Request(uri, route, routeName, options);
		this.navigatePage(request);
	}
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.navigatePage = function(request) {
	if (this._request) {
		this.addRequestToHistory(this._request);
	}

	this._request = request;

	/** @type {Function} */
	var Page = '' == request.name ? null : this.getPageCtrByRoute(request.name);

	if (Page) {
		this.navigatePageInternal(request, Page);
	} else {
		this.navigateErrorInternal(goog.net.HttpStatus.NOT_FOUND, request);
	}
};

/**
 * @param {goog.net.HttpStatus=} opt_status Default is goog.net.HttpStatus.NOT_FOUND.
 */
npf.pages.Manager.prototype.navigateError = function(opt_status) {
	/** @type {goog.net.HttpStatus} */
	var status = opt_status || goog.net.HttpStatus.NOT_FOUND;
	/** @type {npf.pages.Request} */
	var request = new npf.pages.Request(this._router.getUri(), null, '', null);
	this.navigateErrorInternal(status, request);
};

/**
 * @param {goog.net.HttpStatus} status
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.navigateErrorInternal = function(status, request) {
	/** @type {Function} */
	var Page = this._errorPageCtrsMap[/** @type {string} */ (status)] || null;

	if (Page) {
		this.navigatePageInternal(request, Page);
	}
};

/**
 * @param {npf.pages.Request} request
 * @param {Function} Page
 * @protected
 */
npf.pages.Manager.prototype.navigatePageInternal = function(request, Page) {
	this.unloadPage(this.getCurrentPage());
	this.loadPage(request, Page);
};

/**
 * @param {npf.pages.Request} request
 * @param {Function} Page
 * @return {!npf.pages.Page}
 * @protected
 */
npf.pages.Manager.prototype.loadPage = function(request, Page) {
	this._page = /** @type {npf.pages.Page} */ (new Page(this));
	this._page.addEventListener(npf.pages.Page.EventType.ERROR, this._onPageError, false, this);
	this._page.addEventListener(npf.pages.Page.EventType.TITLE_CHANGE, this._onPageTitleChange, false, this);
	this.loadPageInternal(request, this._page);
	this.dispatchLoadEvent();

	return this._page;
};

/**
 * @param {npf.pages.Request} request
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.loadPageInternal = function(request, page) {
	this._updateHelpers(page);
	this.setTitle(page.getTitle());
	page.load(request);
};

/**
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.unloadPage = function(page) {
	if (page) {
		this.unloadPageInternal(page);
		this.dispatchUnloadEvent(page);
	}
};

/**
 * @protected
 */
npf.pages.Manager.prototype.unloadPageInternal = function(page) {
	page.dispose();
};

/**
 * @param {npf.pages.Page} page
 * @private
 */
npf.pages.Manager.prototype._updateHelpers = function(page) {
	/** @type {Array.<string>} */
	var helperTypes = page.getUsingHelperTypes();
	var helperTypesMap = {};

	if (helperTypes) {
		goog.array.forEach(helperTypes, function(type) {
			helperTypesMap[type] = 1;

			if (!this._helpersMap[type]) {
				/** @type {goog.Disposable} */
				var helper = this.createHelper(type);

				if (helper) {
					this._helpersMap[type] = helper;
				}
			}

			if (this._helpersMap[type]) {
				page.setHelper(this._helpersMap[type], type);
			}
		}, this);
	}

	var removeHelpersMap = {};

	goog.object.forEach(this._helpersMap, function(helper, type) {
		if (!helperTypesMap[type]) {
			removeHelpersMap[type] = helper;
		}
	}, this);

	goog.object.forEach(removeHelpersMap, function(helper, type) {
		goog.object.remove(this._helpersMap, type);
		this.removeHelper(type, helper);
	}, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.pages.Manager.prototype._onPageTitleChange = function(evt) {
	var title = /** @type {string} */ (evt.title);
	this.setTitle(title);
};

/**
 * @param {string} title
 */
npf.pages.Manager.prototype.setTitle = function(title) {
	this.setTitleInternal(title);
};

/**
 * @param {string} title
 * @protected
 */
npf.pages.Manager.prototype.setTitleInternal = function(title) {
	document.title = title;
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.pages.Manager.prototype._onPageError = function(evt) {
	var status = /** @type {goog.net.HttpStatus} */ (evt.status);
	this.navigateError(status);
};

/**
 * @param {Function} Page
 * @param {string} pageType
 * @param {string|Array.<string>=} opt_routeNames
 */
npf.pages.Manager.prototype.addPageCtr = function(Page, pageType, opt_routeNames) {
	/** @type {!Array.<string>} */
	var routeNames = [];

	if (goog.isString(opt_routeNames)) {
		routeNames.push(opt_routeNames);
	} else if (goog.isArray(opt_routeNames)) {
		routeNames = opt_routeNames;
	}

	this._pageCtrsMap[pageType] = Page;
	this._routeNamesMap[pageType] = routeNames || [];
};

/**
 * @param {string} pageType
 */
npf.pages.Manager.prototype.removePageCtr = function(pageType) {
	goog.object.remove(this._pageCtrsMap, pageType);
	goog.object.remove(this._routeNamesMap, pageType);
};

/**
 * @param {Function} Page
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.addErrorPageHandler = function(Page, httpStatus) {
	this._errorPageCtrsMap[/** @type {string} */ (httpStatus)] = Page;
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.removeErrorPageHandler = function(httpStatus) {
	goog.object.remove(this._errorPageCtrsMap, /** @type {string} */ (httpStatus));
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 * @return {boolean}
 */
npf.pages.Manager.prototype.hasErrorPage = function(httpStatus) {
	return !!this._errorPageCtrsMap[/** @type {string} */ (httpStatus)];
};

/**
 * @return {Element|goog.ui.Component}
 */
npf.pages.Manager.prototype.getParentContainer = function() {
	return this._parentContainer;
};

/**
 * @param {Element|goog.ui.Component} parentContainer
 */
npf.pages.Manager.prototype.setParentContainer = function(parentContainer) {
	this._parentContainer = parentContainer;
};

/**
 * @return {!Object.<string,goog.Disposable>}
 */
npf.pages.Manager.prototype.getHelpersMap = function() {
	return this._helpersMap;
};

/**
 * @param {string} type
 * @return {goog.Disposable}
 */
npf.pages.Manager.prototype.getHelper = function(type) {
	return this._helpersMap[type] || null;
};

/**
 * @param {string} type
 * @return {goog.Disposable?}
 * @protected
 */
npf.pages.Manager.prototype.createHelper = function(type) {
	return null;
};

/**
 * @param {string} type
 * @param {goog.Disposable} helper
 * @protected
 */
npf.pages.Manager.prototype.removeHelper = function(type, helper) {
	helper.dispose();
};

/**
 * @return {number}
 */
npf.pages.Manager.prototype.getRequestHistoryLimit = function() {
	return this._requestHistoryLimit;
};

/**
 * @param {number} limit
 */
npf.pages.Manager.prototype.setRequestHistoryLimit = function(limit) {
	if (0 > limit || this._requestHistoryLimit == limit) {
		return;
	}

	if (limit < this._requestHistoryLimit) {
		this._requestHistory = this._requestHistory.slice(0, limit - 1);
	}

	this._requestHistoryLimit = limit;
};

/**
 * @param {number=} opt_index
 * @return {npf.pages.Request}
 */
npf.pages.Manager.prototype.getRequestFromHistory = function(opt_index) {
	/** @type {number} */
	var index = opt_index || 0;

	return this._requestHistory[index] || null;
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.addRequestToHistory = function(request) {
	this._requestHistory.unshift(request);

	if (this._requestHistory.length > this._requestHistoryLimit) {
		this._requestHistory = this._requestHistory.slice(0, this._requestHistoryLimit - 1);
	}
};

/**
 * @return {npf.pages.Request}
 */
npf.pages.Manager.prototype.getRequest = function() {
	return this._request;
};

/**
 * @return {npf.Router}
 */
npf.pages.Manager.prototype.getRouter = function() {
	return this._router;
};

/**
 * @return {string?}
 */
npf.pages.Manager.prototype.getCurrentPageType = function() {
	return this._pageType;
};

/**
 * @return {npf.pages.Page}
 */
npf.pages.Manager.prototype.getCurrentPage = function() {
	return this._page;
};

/**
 * @param {string} pageType
 * @return {boolean}
 */
npf.pages.Manager.prototype.hasPageCtr = function(pageType) {
	return !!this.getPageCtr(pageType);
};

/**
 * @param {string} pageType
 * @return {Function}
 */
npf.pages.Manager.prototype.getPageCtr = function(pageType) {
	return this._pageCtrsMap[pageType] || null;
};

/**
 * @param {string} name
 * @return {string?}
 */
npf.pages.Manager.prototype.getPageTypeByRoute = function(name) {
	/** @type {?string} */
	var pageType = null;

	if ('' != name) {
		goog.object.every(this._routeNamesMap, function(routeNames, type) {
			if (-1 < goog.array.indexOf(routeNames, name)) {
				pageType = type;

				return false;
			}

			return true;
		}, this);
	}

	return pageType;
};

/**
 * @param {string} name
 * @return {Function}
 */
npf.pages.Manager.prototype.getPageCtrByRoute = function(name) {
	/** @type {Function} */
	var Page = null;

	goog.object.every(this._routeNamesMap, function(routeNames, type) {
		if (-1 < goog.array.indexOf(routeNames, name)) {
			Page = this.getPageCtr(type);

			return false;
		}

		return true;
	}, this);

	return Page;
};

/**
 * @param {string} pageType
 * @return {npf.router.Route?}
 */
npf.pages.Manager.prototype.getRouteByPageType = function(pageType) {
	/** @type {!Array.<npf.router.Route>} */
	var routes = this.getRoutesByPageType(pageType);

	return routes[0] || null;
};

/**
 * @param {string} pageType
 * @return {!Array.<npf.router.Route>}
 */
npf.pages.Manager.prototype.getRoutesByPageType = function(pageType) {
	/** @type {!Array.<string>} */
	var routeNames = this.getRouteNamesByPageType(pageType);
	/** @type {!Array.<npf.router.Route>} */
	var routes = [];

	goog.array.forEach(routeNames, function(routeName) {
		/** @type {npf.router.Route} */
		var route = this._router.getRoute(routeName);

		if (route) {
			routes.push(route);
		}
	}, this);

	return routes;
};

/**
 * @param {string} pageType
 * @return {!Array.<string>}
 */
npf.pages.Manager.prototype.getRouteNamesByPageType = function(pageType) {
	return this._routeNamesMap[pageType] || [];
};

/**
 * @protected
 */
npf.pages.Manager.prototype.dispatchLoadEvent = function() {
	this.dispatchEvent({
		type: npf.pages.Manager.EventType.LOAD,
		request: this._request,
		page: this._page
	});
};

/**
 * @param {npf.pages.Page} page
 * @param {npf.pages.Request=} opt_request
 * @protected
 */
npf.pages.Manager.prototype.dispatchUnloadEvent = function(page, opt_request) {
	this.dispatchEvent({
		type: npf.pages.Manager.EventType.UNLOAD,
		request: opt_request || this.getRequestFromHistory(),
		page: page
	});
};
