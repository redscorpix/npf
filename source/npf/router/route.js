goog.provide('npf.router.Route');

goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.string');
goog.require('npf.string');


/**
 * @param {string} fragment
 * @param {Object.<string,function(string):boolean|Array.<function(string):boolean>>=}
 *                                                             opt_validatorsMap
 *
 * @example
 * new npf.router.Route('/user/{id:int}', {
 *   'id': function(value) { return 1000 < parseInt(value, 10); }
 * });
 * new npf.router.Route('/user/{id:range(10,)}');
 * new npf.router.Route('/user/{id:string}');
 * new npf.router.Route('/user/{id}');
 *
 * @constructor
 */
npf.router.Route = function(fragment, opt_validatorsMap) {

  /**
   * @type {!Object.<string,Array.<function(string):boolean>>}
   * @private
   */
  this.validatorsMap_ = {};

  if (opt_validatorsMap) {
    goog.object.forEach(opt_validatorsMap, function(validator, name) {
      var validators = goog.isArray(validator) ? validator : [validator];
      this.validatorsMap_[name] = validators;
    },  this);
  }

  /**
   * @private {!Array.<string>}
   */
  this.optionNames_ = [];

  /** @type {string} */
  var replacedFragment = fragment;
  /** @type {string} */
  var generateFragment = fragment;
  /** @type {Array.<string>} */
  var matches;

  while (!goog.isNull(matches = replacedFragment.match(
    npf.router.Route.MATCH_REGEX))) {
    /** @type {string} */
    var name = matches[1];
    /** @type {string} */
    var type = matches[2] || 'string';
    /** @type {string} */
    var args = matches[3] || '';

    if ('range' == type || 'int' == type) {
      replacedFragment = replacedFragment.replace(
        npf.router.Route.FRAGMENT_REPLACE_REGEX, '(\\d+)');

      if ('range' == type && args) {
        this.addRangeValidator_(name, args);
      }
    } else {
      replacedFragment = replacedFragment.replace(
        npf.router.Route.FRAGMENT_REPLACE_REGEX, '(\\w+)');
    }

    this.optionNames_.push(name);

    var regExp = new RegExp('\\{(' + name +
      ')(?:\\:(\\w+)(?:\\(([\\w\\,]+)\\))?)?\\}');
    generateFragment = generateFragment.replace(regExp, '{' + name + '}');
  }

  /**
   * @private {RegExp}
   */
  this.regex_ = new RegExp('^' + replacedFragment + '$');

  /**
   * @private {string}
   */
  this.generateFragment_ = generateFragment;
};


/**
 * @const {RegExp}
 */
npf.router.Route.MATCH_REGEX = /\{(\w+)(?:\:(\w+)(?:\(([\w\,]+)\))?)?\}/;

/**
 * @const {RegExp}
 */
npf.router.Route.FRAGMENT_REPLACE_REGEX = /\{[\w\:\,\(\)]+\}/;


/**
 * @param {string} name
 * @param {string} args
 * @private
 */
npf.router.Route.prototype.addRangeValidator_ = function(name, args) {
  var parts = args.split(',');
  /** @type {function(string):boolean} */
  var validator;

  if (2 <= parts.length) {
    var from = '' == parts[0] ? null : parseInt(parts[0], 10);
    var to = '' == parts[1] ? null : parseInt(parts[1], 10);

    if (goog.isNumber(from) && goog.isNumber(to)) {
      var min = Math.min(from, to);
      var max = Math.max(from, to);

      validator = function(value) {
        var intValue = parseInt(value, 10);

        return min <= intValue && intValue <= max;
      };
    } else if (goog.isNumber(from)) {
      validator = function(value) {
        return from <= parseInt(value, 10);
      };
    } else if (goog.isNumber(to)) {
      validator = function(value) {
        return to >= parseInt(value, 10);
      };
    }
  }

  if (validator) {
    this.validatorsMap_[name].push(validator);
  }
};

/**
 * @param {string|goog.Uri} token
 * @return {boolean}
 */
npf.router.Route.prototype.check = function(token) {
  return !!this.getOptions(token);
};

/**
 * @param {string|goog.Uri} token
 * @return {Object.<string,string>}
 */
npf.router.Route.prototype.getOptions = function(token) {
  var uri = goog.Uri.parse(token);

  return this.getOptionsInternal(uri.getPath());
};

/**
 * @param {string} path
 * @return {Object.<string,string>}
 * @protected
 */
npf.router.Route.prototype.getOptionsInternal = function(path) {
  /** @type {Array.<string>} */
  var values = this.regex_.exec(path);
  /** @type {Object.<string>} */
  var valuesMap = null;

  if (values) {
    valuesMap = {};

    /** @type {number} */
    var count = Math.min(values.length - 1, this.optionNames_.length);

    for (var i = 0; i < count; i++) {
      var key = this.optionNames_[i];
      var value = values[i + 1];
      var match = true;

      if (this.validatorsMap_[key]) {
        match = goog.array.every(this.validatorsMap_[key], function(validator) {
          return validator(value);
        }, this);
      }

      if (match) {
        valuesMap[key] = value;
      } else {
        valuesMap = null;
        break;
      }
    }
  }

  return valuesMap;
};

/**
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
 * @return {string}
 */
npf.router.Route.prototype.getUrl = function(opt_optionsMap, opt_query) {
  return this.getToken(opt_optionsMap, opt_query);
};

/**
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
 * @return {string}
 */
npf.router.Route.prototype.getToken = function(opt_optionsMap, opt_query) {
  return this.getUri(opt_optionsMap, opt_query).toString();
};

/**
 * @param {Object.<string,number|string>=} opt_optionsMap
 * @param {string|goog.Uri.QueryData|Object.<string,string>=} opt_query
 * @return {goog.Uri}
 */
npf.router.Route.prototype.getUri = function(opt_optionsMap, opt_query) {
  var fragment = npf.string.supplant(this.generateFragment_, opt_optionsMap);
  var uri = new goog.Uri(fragment);

  if (opt_query) {
    /** @type {goog.Uri.QueryData} */
    var queryData;

    if (goog.isString(opt_query)) {
      queryData = new goog.Uri.QueryData(opt_query);
    } else if (opt_query instanceof goog.Uri.QueryData) {
      queryData = opt_query;
    } else if (goog.isObject(opt_query)) {
      queryData = goog.Uri.QueryData.createFromMap(opt_query);
    }

    if (queryData) {
      uri.setQueryData(queryData);
    }
  }

  return uri;
};
