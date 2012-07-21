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
	this._pagesMap = {};
	this._errorPagesMap = {};
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
 * @type {!Object.<string,npf.pages.Page>}
 * @private
 */
npf.pages.Manager.prototype._pagesMap;

/**
 * @type {!Object.<string,npf.pages.Page>}
 * @private
 */
npf.pages.Manager.prototype._errorPagesMap;

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
	goog.object.forEach(this._pagesMap, function(page) {
		page.dispose();
	}, this);

	goog.object.forEach(this._errorPagesMap, function(page) {
		page.dispose();
	}, this);

	goog.base(this, 'disposeInternal');

	delete this._router;
	delete this._pagesMap;
	delete this._errorPagesMap;
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
		this.loadInternal(uri, route, routeName, options);
	}
};

/**
 * @return {!goog.events.EventHandler}
 */
npf.pages.Manager.prototype.getHandler = function() {
	return this._handler;
};

/**
 * @param {string|!goog.Uri} token
 */
npf.pages.Manager.prototype.load = function(token) {
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
		this.loadInternal(uri, route, routeName, options);
	}
};

/**
 * @param {goog.Uri} uri
 * @param {npf.router.Route=} opt_route
 * @param {string=} opt_routeName
 * @param {Object.<string,string>=} opt_options
 * @protected
 */
npf.pages.Manager.prototype.loadInternal = function(uri, opt_route, opt_routeName, opt_options) {
	/** @type {npf.pages.Page} */
	var page = opt_routeName ? this.getPageByRoute(opt_routeName) : null;

	if (page) {
		var request = new npf.pages.Request(uri, opt_route || null, goog.isDef(opt_routeName) ? opt_routeName : '', opt_options || null);

		this._load(request, page);
	} else {
		this.loadError();
	}
};

/**
 * @param {npf.pages.Request} request
 * @param {npf.pages.Page} page
 * @private
 */
npf.pages.Manager.prototype._load = function(request, page) {
	if (this._request) {
		this.addRequestToHistory(this._request);
	}

	this._request = request;

	/** @type {npf.pages.Page} */
	var unloadPage = this._page && this._page !== page ? this._page : null;
	this.loadPage(page, unloadPage);
};

/**
 * @param {npf.pages.Page} page
 * @param {npf.pages.Page=} opt_unloadedPage
 * @protected
 */
npf.pages.Manager.prototype.loadPage = function(page, opt_unloadedPage) {
	if (opt_unloadedPage) {
		this.unloadPageInternal(opt_unloadedPage);
	}

	this._updateHelpers(page);
	this.setTitle(page.getTitle());
	this.loadPageInternal(page);
};

/**
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.loadPageInternal = function(page) {
	this._page = page;
	page.load(this.getRequest());
	this.dispatchLoadEvent();
};

/**
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.unloadPageInternal = function(page) {
	page.unload();
	this.dispatchUnloadEvent(page);
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
	this.loadError(status);
};

/**
 * @param {goog.net.HttpStatus=} opt_status
 */
npf.pages.Manager.prototype.loadError = function(opt_status) {
	/** @type {goog.net.HttpStatus} */
	var status = opt_status || goog.net.HttpStatus.NOT_FOUND;
	/** @type {npf.pages.Page} */
	var page = this._errorPagesMap[/** @type {string} */ (status)] || null;

	if (page) {
		this.loadErrorInternal(status, this._router.getUri(), page);
	}
};

/**
 * @param {number} status
 * @param {goog.Uri} uri
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.loadErrorInternal = function(status, uri, page) {
	var request = new npf.pages.Request(uri, null, '', null);
	this._load(request, page);
};

/**
 * @param {npf.pages.Page} page
 * @param {string} pageType
 * @param {string|Array.<string>=} opt_routeNames
 */
npf.pages.Manager.prototype.addPage = function(page, pageType, opt_routeNames) {
	/** @type {!Array.<string>} */
	var routeNames = [];

	if (goog.isString(opt_routeNames)) {
		routeNames.push(opt_routeNames);
	} else if (goog.isArray(opt_routeNames)) {
		routeNames = opt_routeNames;
	}

	/** @type {npf.pages.Page} */
	var existPage = this._pagesMap[pageType] || null;

	if (existPage) {
		existPage.dispose();
	}

	page.addEventListener(npf.pages.Page.EventType.ERROR, this._onPageError, false, this);
	page.addEventListener(npf.pages.Page.EventType.TITLE_CHANGE, this._onPageTitleChange, false, this);

	page.setManager(this);
	this._pagesMap[pageType] = page;
	this._routeNamesMap[pageType] = routeNames || [];
};

/**
 * @param {string} pageType
 */
npf.pages.Manager.prototype.removePage = function(pageType) {
	/** @type {npf.pages.Page} */
	var page = this._pagesMap[pageType] || null;

	if (page) {
		page.dispose();
		goog.object.remove(this._pagesMap, pageType);
		goog.object.remove(this._routeNamesMap, pageType);
	}
};

/**
 * @param {npf.pages.Page} page
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.addErrorPage = function(page, httpStatus) {
	/** @type {npf.pages.Page} */
	var existPage = this._errorPagesMap[/** @type {string} */ (httpStatus)] || null;

	if (existPage) {
		existPage.dispose();
	}

	page.setManager(this);
	this._errorPagesMap[/** @type {string} */ (httpStatus)] = page;
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.removeErrorPage = function(httpStatus) {
	/** @type {npf.pages.Page} */
	var page = this._errorPagesMap[/** @type {string} */ (httpStatus)] || null;

	if (page) {
		page.dispose();
		goog.object.remove(this._errorPagesMap, /** @type {string} */ (httpStatus));
	}
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 * @return {boolean}
 */
npf.pages.Manager.prototype.hasErrorPage = function(httpStatus) {
	return !!this._errorPagesMap[/** @type {string} */ (httpStatus)];
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
	/** @type {npf.pages.Page} */
	var page = this.getCurrentPage();

	if (page) {
		return this.getPageType(page);
	}

	return null;
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
npf.pages.Manager.prototype.hasPage = function(pageType) {
	return !!this.getPage(pageType);
};

/**
 * @param {string} pageType
 * @return {npf.pages.Page}
 */
npf.pages.Manager.prototype.getPage = function(pageType) {
	return this._pagesMap[pageType] || null;
};

/**
 * @param {string} name
 * @return {npf.pages.Page}
 */
npf.pages.Manager.prototype.getPageByRoute = function(name) {
	/** @type {npf.pages.Page} */
	var page = null;

	goog.object.every(this._routeNamesMap, function(routeNames, pageType) {
		if (-1 < goog.array.indexOf(routeNames, name)) {
			page = this.getPage(pageType);

			return false;
		}

		return true;
	}, this);

	return page;
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
 * @param {npf.pages.Page} page
 * @return {string?}
 */
npf.pages.Manager.prototype.getPageType = function(page) {
	if (page) {
		for (var type in this._pagesMap) {
			if (this._pagesMap[type] === page) {
				return type;
			}
		}
	}

	return null;
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
