goog.provide('npf.Router');

goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.events.EventTarget');
goog.require('goog.history.Html5History');
goog.require('npf.History');


/**
 * @param {goog.History|npf.History=} opt_history
 * @constructor
 * @extends {goog.events.EventTarget}
 */
npf.Router = function(opt_history) {
	goog.base(this);

	this._history = opt_history || new npf.History();
	this.registerDisposable(this._history);

	goog.events.listen(this._history, goog.history.EventType.NAVIGATE, this._onNavigate, false, this);

	this._routesMap = {};
	this._namedRoutes = [];
};
goog.inherits(npf.Router, goog.events.EventTarget);


/**
 * @enum {string}
 */
npf.Router.EventType = {
	/**
	 * token (string)
	 * uri (!goog.Uri)
	 * route (?npf.router.Route)
	 * name (string)
	 * options (?Object.<string,string>)
	 */
	NAVIGATE: goog.events.getUniqueId('navigate')
};

/**
 * @typedef {{
 * 	route: npf.router.Route,
 * 	name: string
 * }}
 */
npf.Router.NamedRoute;

/**
 * Проверяет, на корневую ли страницу зашел пользователь.
 * Осуществляет редирект, если требуется.
 * @return {boolean} false, если произошла перезагрузка страницы.
 */
npf.Router.normalizeRootPath = function() {
	/** @type {string} */
	var hash = window.location.hash;
	/** @type {string} */
	var path = '';

	if (npf.History.isHtml5HistorySupported) {
		if (hash && 1 < hash.length && '/' == hash.charAt(1)) {
			path = window.location.hash.substr(1);
		}
	} else {
		if (!('/' == window.location.pathname && !window.location.search)) {
			// Если был хэш, то идем на корневую и подставляем якорь.
			if (hash) {
				path = '/' + hash;
			} else {
				// Делаем редирект на корневую плюс якорь с этим путем.
				path = '/#' + window.location.pathname + window.location.search;
			}
		}
	}

	if ('' != path) {
		window.location.href = path;

		return false;
	}

	return true;
};

/**
 * @type {goog.History|npf.History}
 * @private
 */
npf.Router.prototype._history;

/**
 * @type {!Object.<string,npf.router.Route>}
 * @private
 */
npf.Router.prototype._routesMap;

/**
 * @type {!Array.<npf.Router.NamedRoute>}
 * @private
 */
npf.Router.prototype._namedRoutes;

/**
 * @type {string}
 * @private
 */
npf.Router.prototype._currentRouteName = '';

/**
 * @type {boolean}
 * @private
 */
npf.Router.prototype._enabled = false;

/**
 * @type {boolean}
 * @private
 */
npf.Router.prototype._slashSuffixEnabled = true;


/** @inheritDoc */
npf.Router.prototype.disposeInternal = function() {
	goog.events.unlisten(this._history, goog.history.EventType.NAVIGATE, this._onNavigate, false, this);
	this.setEnabled(false);

	goog.base(this, 'disposeInternal');

	delete this._history;
	delete this._routesMap;
	delete this._namedRoutes;
	delete this._currentRouteName;
	delete this._enabled;
	delete this._slashSuffixEnabled;
};

/**
 * @return {!Array.<npf.router.Route>}
 */
npf.Router.prototype.getRoutes = function() {
	return goog.array.map(this._namedRoutes, function(namedRoute, i) {
		return namedRoute.route;
	}, this);
};

/**
 * @return {!Array.<string>}
 */
npf.Router.prototype.getRouteNames = function() {
	return goog.array.map(this._namedRoutes, function(namedRoute, i) {
		return namedRoute.name;
	}, this);
};

/**
 * @param {string} name
 * @return {npf.router.Route?}
 */
npf.Router.prototype.getRoute = function(name) {
	return this._routesMap[name] || null;
};

/**
 * @param {number} index
 * @return {npf.router.Route?}
 */
npf.Router.prototype.getRouteAt = function(index) {
	return this._namedRoutes[index] ? this._namedRoutes[index].route : null;
};

/**
 * @param {number} index
 * @return {string?}
 */
npf.Router.prototype.getRouteNameAt = function(index) {
	return this._namedRoutes[index] ? this._namedRoutes[index].name : null;
};

/**
 * @param {function(npf.router.Route,string,number)} func
 * @param {Object=} opt_scope
 */
npf.Router.prototype.forEach = function(func, opt_scope) {
	goog.array.forEach(this._namedRoutes, function(namedRoute, index) {
		func.call(opt_scope, namedRoute.route, namedRoute.name, index);
	}, this);
};

/**
 * @return {number}
 */
npf.Router.prototype.getRouteCount = function() {
	return this._namedRoutes.length;
};

/**
 * @param {npf.router.Route} route
 * @param {string} name
 * @return {number}
 */
npf.Router.prototype.addRoute = function(route, name) {
	this.removeRoute(name);

	/** @type {number} */
	var index = this.getRouteCount();

	this.addRouteAt(route, name, index);

	return index;
};

/**
 * @param {npf.router.Route} route
 * @param {string} name
 * @param {number} index
 */
npf.Router.prototype.addRouteAt = function(route, name, index) {
	this.removeRoute(name);
	this._routesMap[name] = route;
	this._namedRoutes.splice(index, 0, {
		route: route,
		name: name
	});
};

/**
 * @param {string} name
 * @return {npf.router.Route?}
 */
npf.Router.prototype.removeRoute = function(name) {
	/** @type {npf.router.Route} */
	var route = null;

	if (this._routesMap[name]) {
		var index = -1;

		goog.array.every(this._namedRoutes, function(namedRoute, i) {
			if (namedRoute.name == name) {
				index = i;

				return false;
			}

			return true;
		}, this);

		if (-1 < index) {
			this._namedRoutes.splice(index, 1);
		}

		route = this._routesMap[name];

		delete this._routesMap[name];
	}

	return route;
};

/**
 * @param {string|npf.router.Route} routeName
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
 * @param {boolean=} opt_replace
 */
npf.Router.prototype.navigateRoute = function(routeName, opt_optionsMap, opt_query, opt_replace) {
	/** @type {npf.router.Route} */
	var route = goog.isString(routeName) ? this.getRoute(routeName) : routeName;

	if (route) {
		/** @type {string} */
		var token = route.getToken(opt_optionsMap, opt_query);
		this.navigate(token, opt_replace);
	}
};

/**
 * @param {string|goog.Uri} token
 * @param {boolean=} opt_replace
 */
npf.Router.prototype.navigate = function(token, opt_replace) {
	/** @type {goog.Uri} */
	var uri = goog.Uri.parse(token);

	if (this._slashSuffixEnabled) {
		/** @type {string} */
		var uriPath = uri.getPath();

		if (uriPath && '/' != uriPath.charAt(uriPath.length - 1)) {
			uri.setPath(uriPath + '/');
		}
	}

	if (opt_replace) {
		this._history.replaceToken(uri.toString());
	} else {
		this._history.setToken(uri.toString());
	}
};

/**
 * @return {npf.router.Route?}
 */
npf.Router.prototype.getCurrentRoute = function() {
	return '' == this._currentRouteName ? null : this.getRoute(this._currentRouteName);
};

/**
 * @return {string}
 */
npf.Router.prototype.getCurrentRouteName = function() {
	return this._currentRouteName;
};

/**
 * @return {boolean}
 */
npf.Router.prototype.isEnabled = function() {
	return this._enabled;
};

/**
 * @param {boolean} enable
 */
npf.Router.prototype.setEnabled = function(enable) {
	if (this._enabled != enable) {
		this._enabled = enable;
		this._history.setEnabled(enable);
		this.setEnabledInternal(this._enabled);
	}
};

/**
 * @param {boolean} enable
 * @protected
 */
npf.Router.prototype.setEnabledInternal = function(enable) {
	if (enable) {
		/** @type {string} */
		var token = this._history.getToken();
		this.onNavigate(token);
	}
};

/**
 * @param {goog.events.Event} evt
 * @private
 */
npf.Router.prototype._onNavigate = function(evt) {
	var token = evt.token;
	this.onNavigate(token);
};

/**
 * @param {string} token
 * @protected
 */
npf.Router.prototype.onNavigate = function(token) {
	/** @type {goog.Uri} */
	var uri = new goog.Uri(token);

	if (this._slashSuffixEnabled) {
		/** @type {string} */
		var uriPath = uri.getPath();

		if (uriPath && '/' != uriPath.charAt(uriPath.length - 1)) {
			uri.setPath(uriPath + '/');
			this.navigate(uri, true);

			return;
		}
	}

	var info = this.parseToken(token);

	this.dispatchEvent({
		type: npf.Router.EventType.NAVIGATE,
		route: info.route,
		name: info.name,
		token: token,
		uri: info.uri,
		options: info.options
	});
};

/**
 * @param {string|goog.Uri} token
 * @return {{route:?npf.router.Route,name:string,uri:!goog.Uri,options:?Object.<string,string>}}
 */
npf.Router.prototype.parseToken = function(token) {
	/** @type {!goog.Uri} */
	var uri = goog.Uri.parse(token);
	/** @type {string} */
	var name = '';
	/** @type {Object.<string,string>} */
	var options = null;

	for (var i = this._namedRoutes.length - 1; i >= 0; i--) {
		/** @type {npf.Router.NamedRoute} */
		var namedRoute = this._namedRoutes[i];

		var matches = namedRoute.route.getOptions(uri);

		if (matches) {
			name = namedRoute.name;
			options = matches;

			break;
		}
	}

	this._currentRouteName = name;

	var route = '' == name ? null : this.getRoute(name);

	return {
		route: route,
		name: name,
		uri: uri,
		options: options
	};
};

/**
 * @return {goog.Uri}
 */
npf.Router.prototype.getUri = function() {
	return new goog.Uri(this.getToken());
};

/**
 * @return {string}
 */
npf.Router.prototype.getToken = function() {
	return this._history.getToken();
};

/**
 * @return {boolean}
 */
npf.Router.prototype.isSlashSuffixEnabled = function() {
	return this._slashSuffixEnabled;
};

/**
 * @param {boolean} enable
 */
npf.Router.prototype.setSlashSuffixEnabled = function(enable) {
	this._slashSuffixEnabled = enable;
};
