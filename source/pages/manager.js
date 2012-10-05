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

  this.router_ = router;
  this.pageCtorsMap_ = {};
  this.errorPageCtorsMap_ = {};
  this.routeNamesMap_ = {};
  this.helpersMap_ = {};
  this.requestHistory_ = [];

  this.handler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.handler_);
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
npf.pages.Manager.prototype.router_;

/**
 * @type {Object.<string,Function>}
 * @private
 */
npf.pages.Manager.prototype.pageCtorsMap_;

/**
 * @type {Object.<string,Function>}
 * @private
 */
npf.pages.Manager.prototype.errorPageCtorsMap_;

/**
 * @type {Object.<string,Array.<string>>}
 * @private
 */
npf.pages.Manager.prototype.routeNamesMap_;

/**
 * @type {Object.<string,goog.Disposable>}
 * @private
 */
npf.pages.Manager.prototype.helpersMap_;

/**
 * @type {goog.events.EventHandler}
 * @private
 */
npf.pages.Manager.prototype.handler_;

/**
 * @type {npf.pages.Page}
 * @private
 */
npf.pages.Manager.prototype.page_ = null;

/**
 * @type {?string}
 * @private
 */
npf.pages.Manager.prototype.pageType_ = null;

/**
 * @type {npf.pages.Request}
 * @private
 */
npf.pages.Manager.prototype.request_ = null;

/**
 * @type {Element|goog.ui.Component}
 * @private
 */
npf.pages.Manager.prototype.parentContainer_ = null;

/**
 * @type {Array.<npf.pages.Request>}
 * @private
 */
npf.pages.Manager.prototype.requestHistory_;

/**
 * @type {number}
 * @private
 */
npf.pages.Manager.prototype.requestHistoryLimit_ = 1;


/** @inheritDoc */
npf.pages.Manager.prototype.disposeInternal = function() {
  this.unloadPage(this.getCurrentPage());

  goog.base(this, 'disposeInternal');

  this.router_ = null;
  this.pageCtorsMap_ = null;
  this.errorPageCtorsMap_ = null;
  this.routeNamesMap_ = null;
  this.helpersMap_ = null;
  this.handler_ = null;
  this.page_ = null;
  this.request_ = null;
  this.parentContainer_ = null;
  this.requestHistory_ = null;
};

npf.pages.Manager.prototype.init = function() {
  this.handler_.listen(this.router_, npf.Router.EventType.NAVIGATE,
    this.onNavigate_);
  this.router_.setEnabled(true);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.pages.Manager.prototype.onNavigate_ = function(evt) {
  var uri = /** @type {!goog.Uri} */ (evt.uri);
  var route = /** @type {npf.router.Route} */ (evt.route);
  var routeName = /** @type {string} */ (evt.name);
  var options = /** @type {Object.<string,string>} */ (evt.options);

  if (!this.request_ || this.request_.uri.toString() != uri.toString()) {
    var request = new npf.pages.Request(uri, route, routeName, options);
    this.navigatePage(request);
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
npf.pages.Manager.prototype.navigate = function(token) {
  var info = this.router_.parseToken(token);
  /** @type {!goog.Uri} */
  var uri = info.uri;
  /** @type {npf.router.Route} */
  var route = info.route;
  /** @type {string} */
  var routeName = info.name;
  /** @type {Object.<string,string>} */
  var options = info.options;

  if (!this.request_ || this.request_.uri.toString() != uri.toString()) {
    var request = new npf.pages.Request(uri, route, routeName, options);
    this.navigatePage(request);
  }
};

/**
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.navigatePage = function(request) {
  if (this.request_) {
    this.addRequestToHistory(this.request_);
  }

  this.request_ = request;

  /** @type {Function} */
  var Page = '' == request.name ? null : this.getPageCtorByRoute(request.name);

  if (Page) {
    this.navigatePage_(request, Page);
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
  var request = new npf.pages.Request(this.router_.getUri(), null, '', null);
  this.navigateErrorInternal(status, request);
};

/**
 * @param {goog.net.HttpStatus} status
 * @param {npf.pages.Request} request
 * @protected
 */
npf.pages.Manager.prototype.navigateErrorInternal = function(status, request) {
  /** @type {Function} */
  var Page = this.errorPageCtorsMap_[/** @type {string} */ (status)] || null;

  if (Page) {
    this.navigatePage_(request, Page);
  }
};

/**
 * @param {npf.pages.Request} request
 * @param {Function} Page
 * @private
 */
npf.pages.Manager.prototype.navigatePage_ = function(request, Page) {
  /** @type {npf.pages.Page} */
  var currentPage = this.getCurrentPage();

  if (!(currentPage && currentPage.processUrl(request))) {
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
  this.page_ = /** @type {npf.pages.Page} */ (new Page(this));
  this.page_.addEventListener(npf.pages.Page.EventType.ERROR,
    this.onPageError_, false, this);
  this.page_.addEventListener(npf.pages.Page.EventType.TITLE_CHANGE,
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

      if (this.helpersMap_[type]) {
        page.setHelper(this.helpersMap_[type], type);
      }
    }, this);
  }

  var removeHelpersMap = {};

  goog.object.forEach(this.helpersMap_, function(helper, type) {
    if (!helperTypesMap[type]) {
      removeHelpersMap[type] = helper;
    }
  }, this);

  goog.object.forEach(removeHelpersMap, function(helper, type) {
    goog.object.remove(this.helpersMap_, type);
    this.removeHelper(type, helper);
  }, this);
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.pages.Manager.prototype.onPageTitleChange_ = function(evt) {
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
npf.pages.Manager.prototype.onPageError_ = function(evt) {
  var status = /** @type {goog.net.HttpStatus} */ (evt.status);
  this.navigateError(status);
};

/**
 * @param {Function} Page
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
 * @param {Function} Page
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.addErrorPageCtor = function(Page, httpStatus) {
  this.errorPageCtorsMap_[/** @type {string} */ (httpStatus)] = Page;
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 */
npf.pages.Manager.prototype.removeErrorPageCtor = function(httpStatus) {
  goog.object.remove(this.errorPageCtorsMap_,
    /** @type {string} */ (httpStatus));
};

/**
 * @param {goog.net.HttpStatus} httpStatus
 * @return {boolean}
 */
npf.pages.Manager.prototype.hasErrorPage = function(httpStatus) {
  return !!this.errorPageCtorsMap_[/** @type {string} */ (httpStatus)];
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
 * @return {Object.<string,goog.Disposable>}
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
 * @return {string?}
 */
npf.pages.Manager.prototype.getCurrentPageType = function() {
  return this.pageType_;
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
 * @return {Function}
 */
npf.pages.Manager.prototype.getPageCtor = function(pageType) {
  return this.pageCtorsMap_[pageType] || null;
};

/**
 * @param {string} name
 * @return {string?}
 */
npf.pages.Manager.prototype.getPageTypeByRoute = function(name) {
  /** @type {?string} */
  var pageType = null;

  if ('' != name) {
    goog.object.every(this.routeNamesMap_, function(routeNames, type) {
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
npf.pages.Manager.prototype.getPageCtorByRoute = function(name) {
  /** @type {Function} */
  var Page = null;

  goog.object.every(this.routeNamesMap_, function(routeNames, type) {
    if (-1 < goog.array.indexOf(routeNames, name)) {
      Page = this.getPageCtor(type);

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
  this.dispatchEvent({
    type: npf.pages.Manager.EventType.LOAD,
    request: this.request_,
    page: this.page_
  });
};

/**
 * @param {npf.pages.Page} page
 * @param {npf.pages.Request=} optrequest_
 * @protected
 */
npf.pages.Manager.prototype.dispatchUnloadEvent = function(page, optrequest_) {
  this.dispatchEvent({
    type: npf.pages.Manager.EventType.UNLOAD,
    request: optrequest_ || this.getRequestFromHistory(),
    page: page
  });
};
