goog.provide('npf.pages.Manager');
goog.provide('npf.pages.Manager.EventType');
goog.provide('npf.pages.ManagerEvent');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.Event');
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

  /**
   * @private {Object.<function(new:npf.pages.Page,...)>}
   */
  this.errorPageCtorsMap_ = {};

  /**
   * @private {Object.<goog.Disposable>}
   */
  this.helpersMap_ = {};

  /**
   * @private {npf.pages.Page}
   */
  this.page_ = null;

  /**
   * @private {Object.<function(new:npf.pages.Page,...)>}
   */
  this.pageCtorsMap_ = {};

  /**
   * @type {Element|goog.ui.Component}
   * @private
   */
  this.parentContainer_ = null;

  /**
   * @private {npf.pages.Request}
   */
  this.request_ = null;

  /**
   * @private {Array.<npf.pages.Request>}
   */
  this.requestHistory_ = [];

  /**
   * @private {number}
   */
  this.requestHistoryLimit_ = 1;

  /**
   * @private {Object.<Array.<string>>}
   */
  this.routeNamesMap_ = {};

  /**
   * @private {npf.Router}
   */
  this.router_ = router;

  /**
   * @private {goog.events.EventHandler}
   */
  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
};
goog.inherits(npf.pages.Manager, goog.events.EventTarget);


/**
 * @const {string}
 */
npf.pages.Manager.ERROR_PAGE_TYPE = 'error';

/**
 * @enum {string}
 */
npf.pages.Manager.EventType = {

  /**
   * Страница загружена.
   * npf.pages.ManagerEvent
   */
  LOAD: goog.events.getUniqueId('load'),

  /**
   * Страница выгружена.
   * npf.pages.ManagerEvent
   */
  UNLOAD: goog.events.getUniqueId('unload')
};


/** @inheritDoc */
npf.pages.Manager.prototype.disposeInternal = function() {
  this.unloadPage(this.getCurrentPage());

  goog.base(this, 'disposeInternal');

  this.errorPageCtorsMap_ = null;
  this.handler_ = null;
  this.helpersMap_ = null;
  this.page_ = null;
  this.pageCtorsMap_ = null;
  this.parentContainer_ = null;
  this.request_ = null;
  this.requestHistory_ = null;
  this.routeNamesMap_ = null;
  this.router_ = null;
};

npf.pages.Manager.prototype.init = function() {
  this.handler_.listen(
    this.router_, npf.Router.EventType.NAVIGATE, this.onNavigate_);
  this.router_.setEnabled(true);
};

/**
 * @param {string|goog.Uri} token
 * @param {boolean=} opt_replace
 */
npf.pages.Manager.prototype.navigate = function(token, opt_replace) {
  this.router_.navigate(token, opt_replace);
};

/**
 * @param {npf.RouterEvent} evt
 * @private
 */
npf.pages.Manager.prototype.onNavigate_ = function(evt) {
  /** @type {goog.Uri} */
  var uri = evt.uri;
  /** @type {npf.router.Route} */
  var route = evt.route;
  /** @type {string} */
  var routeName = evt.name;
  /** @type {Object.<string>} */
  var options = evt.options;

  if (!this.request_ || this.request_.uri.toString() != uri.toString()) {
    var request = new npf.pages.Request(uri, route, routeName, options);
    this.requestPage(request);
  }
};

/**
 * @return {goog.events.EventHandler}
 */
npf.pages.Manager.prototype.getHandler = function() {
  return this.handler_;
};

/**
 * @param {string|goog.Uri} token
 */
npf.pages.Manager.prototype.request = function(token) {
  var info = this.router_.parseToken(token);
  /** @type {!goog.Uri} */
  var uri = info.uri;
  /** @type {npf.router.Route} */
  var route = info.route;
  /** @type {string} */
  var routeName = info.name;
  /** @type {Object.<string>} */
  var options = info.options;

  if (!this.request_ || this.request_.uri.toString() != uri.toString()) {
    var request = new npf.pages.Request(uri, route, routeName, options);
    this.requestPage(request);
  }
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.requestPage = function(request) {
  if (this.request_) {
    this.addRequestToHistory(this.request_);
  }

  this.request_ = request;

  /** @type {function(new:npf.pages.Page,...)?} */
  var Page = null;
  /** @type {string} */
  var pageType = '';

  if (request.name) {
    /** @type {string|undefined} */
    var type = this.getPageTypeByRoute(request.name);

    if (type) {
      pageType = type;
      Page = this.getPageCtor(type)
    }
  }

  if (Page) {
    this.processPage(request, Page, pageType);
  } else {
    this.requestErrorInternal(goog.net.HttpStatus.NOT_FOUND, request);
  }
};

/**
 * @param {goog.net.HttpStatus=} opt_status Defaults
 *                                          to goog.net.HttpStatus.NOT_FOUND.
 */
npf.pages.Manager.prototype.requestError = function(opt_status) {
  /** @type {goog.net.HttpStatus} */
  var status = opt_status || goog.net.HttpStatus.NOT_FOUND;
  /** @type {npf.pages.Request} */
  var request = new npf.pages.Request(this.router_.getUri(), null, '', null);
  this.requestErrorInternal(status, request);
};

/**
 * @param {goog.net.HttpStatus} status
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.requestErrorInternal = function(status, request) {
  /** @type {function(new:npf.pages.Page,...)} */
  var Page = this.errorPageCtorsMap_[status] || null;

  if (Page) {
    this.processPage(request, Page, npf.pages.Manager.ERROR_PAGE_TYPE + status);
  }
};

/**
 * @param {npf.pages.Request} request
 * @param {function(new:npf.pages.Page,...)} Page
 * @param {string} type
 * @protected
 */
npf.pages.Manager.prototype.processPage = function(request, Page, type) {
  /** @type {npf.pages.Page} */
  var currentPage = this.getCurrentPage();

  if (!(currentPage && currentPage.processUrl(request))) {
    this.requestPageInternal(request, Page, type);
  }
};

/**
 * @param {npf.pages.Request} request
 * @param {function(new:npf.pages.Page,...)} Page
 * @param {string} type
 * @protected
 */
npf.pages.Manager.prototype.requestPageInternal = function(request, Page,
    type) {
  this.unloadPage(this.getCurrentPage());
  this.loadPage(request, Page, type);
};

/**
 * @param {npf.pages.Request} request
 * @param {function(new:npf.pages.Page,...)} Page
 * @param {string} type
 * @return {!npf.pages.Page}
 * @protected
 */
npf.pages.Manager.prototype.loadPage = function(request, Page, type) {
  this.page_ = new Page(this, type);
  this.page_.listen(npf.pages.Page.EventType.ERROR,
    this.onPageError_, false, this);
  this.page_.listen(npf.pages.Page.EventType.TITLE_CHANGE,
    this.onPageTitleChange_, false, this);
  this.loadPageInternal(request, this.page_);
  this.dispatchLoadEvent();

  return this.page_;
};

/**
 * @param {npf.pages.Request} request
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.loadPageInternal = function(request, page) {
  this.updateHelpers_(page);
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
 * @param {npf.pages.Page} page
 * @protected
 */
npf.pages.Manager.prototype.unloadPageInternal = function(page) {
  page.dispose();
};

/**
 * @param {npf.pages.Page} page
 * @private
 */
npf.pages.Manager.prototype.updateHelpers_ = function(page) {
  /** @type {Array.<string>} */
  var helperTypes = page.getUsingHelperTypes();
  var helperTypesMap = {};

  if (helperTypes) {
    goog.array.forEach(helperTypes, function(type) {
      helperTypesMap[type] = 1;

      if (!this.helpersMap_[type]) {
        /** @type {goog.Disposable} */
        var helper = this.createHelper(type);

        if (helper) {
          this.helpersMap_[type] = helper;
        }
      }
    }, this);
  }

  /** @type {!Object.<goog.Disposable>} */
  var removeHelpersMap = {};
  /** @type {function(goog.Disposable,string)} */
  var addHelpers = function(helper, type) {
    if (!helperTypesMap[type]) {
      removeHelpersMap[type] = helper;
    }
  };
  /** @type {function(this:npf.pages.Manager,goog.Disposable,string)} */
  var removeHelpers = function(helper, type) {
    goog.object.remove(this.helpersMap_, type);
    this.removeHelper(type, helper);
  };

  goog.object.forEach(this.helpersMap_, addHelpers);
  goog.object.forEach(removeHelpersMap, removeHelpers, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.pages.Manager.prototype.onPageTitleChange_ = function(evt) {
  var page = /** @type {npf.pages.Page} */ (evt.target);
  /** @type {string} */
  var title = page.getTitle();
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
 * @param {npf.pages.PageErrorEvent} evt
 * @private
 */
npf.pages.Manager.prototype.onPageError_ = function(evt) {
  /** @type {goog.net.HttpStatus} */
  var status = evt.status;
  this.requestError(status);
};

/**
 * @param {function(new:npf.pages.Page,...)} Page
 * @param {string} pageType
 * @param {string|Array.<string>=} opt_routeNames
 */
npf.pages.Manager.prototype.addPageCtor = function(Page, pageType,
    opt_routeNames) {
  /** @type {!Array.<string>} */
  var routeNames = [];

  if (goog.isString(opt_routeNames)) {
    routeNames.push(opt_routeNames);
  } else if (goog.isArray(opt_routeNames)) {
    routeNames = opt_routeNames;
  }

  this.pageCtorsMap_[pageType] = Page;
  this.routeNamesMap_[pageType] = routeNames || [];
};

/**
 * @param {string} pageType
 */
npf.pages.Manager.prototype.removePageCtor = function(pageType) {
  goog.object.remove(this.pageCtorsMap_, pageType);
  goog.object.remove(this.routeNamesMap_, pageType);
};

/**
 * @param {function(new:npf.pages.Page,...)} Page
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.addErrorPageCtor = function(Page, httpStatus) {
  this.errorPageCtorsMap_[httpStatus] = Page;
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.removeErrorPageCtor = function(httpStatus) {
  goog.object.remove(this.errorPageCtorsMap_, httpStatus);
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 * @return {boolean}
 */
npf.pages.Manager.prototype.hasErrorPage = function(httpStatus) {
  return !!this.errorPageCtorsMap_[httpStatus];
};

/**
 * @return {Element|goog.ui.Component}
 */
npf.pages.Manager.prototype.getParentContainer = function() {
  return this.parentContainer_;
};

/**
 * @param {Element|goog.ui.Component} parentContainer
 */
npf.pages.Manager.prototype.setParentContainer = function(parentContainer) {
  this.parentContainer_ = parentContainer;
};

/**
 * @return {Object.<goog.Disposable>}
 */
npf.pages.Manager.prototype.getHelpersMap = function() {
  return this.helpersMap_;
};

/**
 * @param {string} type
 * @return {goog.Disposable}
 */
npf.pages.Manager.prototype.getHelper = function(type) {
  return this.helpersMap_[type] || null;
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
  return this.requestHistoryLimit_;
};

/**
 * @param {number} limit
 */
npf.pages.Manager.prototype.setRequestHistoryLimit = function(limit) {
  if (0 > limit || this.requestHistoryLimit_ == limit) {
    return;
  }

  if (limit < this.requestHistoryLimit_) {
    this.requestHistory_ = this.requestHistory_.slice(0, limit - 1);
  }

  this.requestHistoryLimit_ = limit;
};

/**
 * @param {number=} opt_index
 * @return {npf.pages.Request}
 */
npf.pages.Manager.prototype.getRequestFromHistory = function(opt_index) {
  /** @type {number} */
  var index = opt_index || 0;

  return this.requestHistory_[index] || null;
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.addRequestToHistory = function(request) {
  this.requestHistory_.unshift(request);

  if (this.requestHistory_.length > this.requestHistoryLimit_) {
    this.requestHistory_ =
      this.requestHistory_.slice(0, this.requestHistoryLimit_);
  }
};

/**
 * @return {npf.pages.Request}
 */
npf.pages.Manager.prototype.getRequest = function() {
  return this.request_;
};

/**
 * @return {npf.Router}
 */
npf.pages.Manager.prototype.getRouter = function() {
  return this.router_;
};

/**
 * @return {npf.pages.Page}
 */
npf.pages.Manager.prototype.getCurrentPage = function() {
  return this.page_;
};

/**
 * @param {string} pageType
 * @return {boolean}
 */
npf.pages.Manager.prototype.hasPageCtor = function(pageType) {
  return !!this.getPageCtor(pageType);
};

/**
 * @param {string} pageType
 * @return {function(new:npf.pages.Page,...)?}
 */
npf.pages.Manager.prototype.getPageCtor = function(pageType) {
  return this.pageCtorsMap_[pageType] || null;
};

/**
 * @param {string} name
 * @return {string|undefined}
 */
npf.pages.Manager.prototype.getPageTypeByRoute = function(name) {
  return goog.object.findKey(this.routeNamesMap_, function(routeNames) {
    return goog.array.contains(routeNames, name);
  }, this);
};

/**
 * @param {string} name
 * @return {function(new:npf.pages.Page,...)?}
 */
npf.pages.Manager.prototype.getPageCtorByRoute = function(name) {
  /** @type {string|undefined} */
  var type = this.getPageTypeByRoute(name);

  return type ? this.getPageCtor(type) : null;
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
    var route = this.router_.getRoute(routeName);

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
  return this.routeNamesMap_[pageType] || [];
};

/**
 * @protected
 */
npf.pages.Manager.prototype.dispatchLoadEvent = function() {
  var event = new npf.pages.ManagerEvent(npf.pages.Manager.EventType.LOAD,
    this.request_, this.page_);
  this.dispatchEvent(event);
};

/**
 * @param {npf.pages.Page} page
 * @param {npf.pages.Request=} opt_request
 * @protected
 */
npf.pages.Manager.prototype.dispatchUnloadEvent = function(page, opt_request) {
  /** @type {npf.pages.Request} */
  var request = opt_request || this.getRequestFromHistory();
  var event = new npf.pages.ManagerEvent(npf.pages.Manager.EventType.UNLOAD,
    this.request_, this.page_);
  this.dispatchEvent(event);
};


/**
 * @param {npf.pages.Manager.EventType} type
 * @param {npf.pages.Request} request
 * @param {npf.pages.Page} page
 * @constructor
 * @extends {goog.events.Event}
 */
npf.pages.ManagerEvent = function(type, request, page) {
  goog.base(this, type);

  /**
   * @type {npf.pages.Request}
   */
  this.request = request;

  /**
   * @type {npf.pages.Page}
   */
  this.page = page;
};
goog.inherits(npf.pages.ManagerEvent, goog.events.Event);
