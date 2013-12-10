goog.provide('npf.pages.Request');

goog.require('goog.object');
goog.require('npf.router.Route');


/**
 * @param {goog.Uri} uri
 * @param {npf.router.Route=} opt_route
 * @param {string=} opt_name
 * @param {Object.<string>=} opt_options
 * @constructor
 */
npf.pages.Request = function(uri, opt_route, opt_name, opt_options) {

  /**
   * @type {goog.Uri}
   */
  this.uri = uri;

  /**
   * @type {npf.router.Route}
   */
  this.route = opt_route || null;

  /**
   * @type {string}
   */
  this.name = goog.isString(opt_name) ? opt_name : '';

  /**
   * @type {Object.<string>}
   */
  this.options = opt_options || null;
};

/**
 * @return {npf.pages.Request}
 */
npf.pages.Request.prototype.clone = function() {
  var options = options ? goog.object.clone(this.options) : null;

  return new npf.pages.Request(
    this.uri.clone(), this.route, this.name, options);
};

/**
 * @param {string} key
 * @return {string|undefined}
 */
npf.pages.Request.prototype.getOption = function(key) {
  return this.options ? this.options[key] : undefined;
};

/**
 * @param {string} key
 * @param {string} value
 */
npf.pages.Request.prototype.setOption = function(key, value) {
  this.options[key] = value;
  this.uri.setPath(this.route.getUrl(this.options));
};

/**
 * @return {string}
 */
npf.pages.Request.prototype.getUrl = function() {
  return this.getToken();
};

/**
 * @return {string}
 */
npf.pages.Request.prototype.getToken = function() {
  return this.uri.toString();
};

/**
 * @param {string} key
 * @return {string|undefined}
 */
npf.pages.Request.prototype.getParameter = function(key) {
  return /** @type {string|undefined} */ (
    this.uri.getQueryData().get(key, undefined)) || undefined;
};

/**
 * @param {string} key
 * @param {string} value
 */
npf.pages.Request.prototype.setParameter = function(key, value) {
  this.uri.getQueryData().set(key, value);
};

/**
 * @param {string} key
 */
npf.pages.Request.prototype.removeParameter = function(key) {
  this.uri.getQueryData().remove(key);
};
