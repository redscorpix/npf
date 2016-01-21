goog.provide('npf.json.parser');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.math');


/**
 * @param {*} input
 * @param {number=} opt_count
 * @return {Array.<number>}
 */
npf.json.parser.getArrayOfId = function(input, opt_count) {
  if (goog.isArray(input)) {
    var result = /** @type {!Array.<number>} */ (
      goog.array.filter(/** @type {!Array} */ (input), function(item) {
        return goog.isNumber(item) && goog.math.isInt(item) && 0 < item;
      })
    );

    if (!opt_count || result.length == opt_count) {
      return result;
    }
  }

  return null;
};

/**
 * @param {*} json
 * @param {function(this: SCOPE, *, number, ?): R} func
 * @param {SCOPE=} opt_obj
 * @return {!Array.<R>}
 * @template SCOPE, R
 */
npf.json.parser.getArrayOfObject = function(json, func, opt_obj) {
  /** @type {!Array} */
  var result = [];

  if (goog.isArray(json)) {
    /** @type {number} */
    var l = json.length;

    for (var i = 0; i < l; i++) {
      var obj = func.call(opt_obj, json[i], i, json);

      if (obj) {
        result.push(obj);
      }
    }
  }

  return result;
};

/**
 * @param {*} input
 * @param {number=} opt_count
 * @return {Array.<string>}
 */
npf.json.parser.getArrayOfString = function(input, opt_count) {
  if (goog.isArray(input)) {
    var result = /** @type {!Array.<string>} */ (
      goog.array.filter(/** @type {!Array} */ (input), function(item) {
        return goog.isString(item);
      }));

    if (!opt_count || result.length == opt_count) {
      return result;
    }
  }

  return null;
};

/**
 * @param {*} input
 * @param {number=} opt_count
 * @return {Array.<number>}
 */
npf.json.parser.getArrayOfUint = function(input, opt_count) {
  if (goog.isArray(input)) {
    var result = /** @type {!Array.<number>} */ (
      goog.array.filter(/** @type {!Array} */ (input), function(item) {
        return goog.isNumber(item) && goog.math.isInt(item) && 0 <= item;
      })
    );

    if (!opt_count || result.length == opt_count) {
      return result;
    }
  }

  return null;
};

/**
 * @param {*} input
 * @return {goog.date.DateTime}
 */
npf.json.parser.getDateFromIsoString = function(input) {
  /** @type {string} */
  var date = npf.json.parser.getString(input);

  return date ? goog.date.fromIsoString(date) : null;
};

/**
 * @param {*} input
 * @param {string=} opt_def Defaults to empty string.
 * @return {string}
 */
npf.json.parser.getString = function(input, opt_def) {
  /** @type {string} */
  var def = opt_def || '';

  return goog.isString(input) ? input : def;
};

/**
 * @param {*} input
 * @param {number=} opt_def Defaults to 0.
 * @return {number}
 */
npf.json.parser.getUfloat = function(input, opt_def) {
  /** @type {number} */
  var def = opt_def || 0;

  return goog.isNumber(input) && 0 <= input ? input : def;
};

/**
 * @param {*} input
 * @param {number=} opt_def Defaults to 0.
 * @return {number}
 */
npf.json.parser.getUint = function(input, opt_def) {
  /** @type {number} */
  var def = opt_def || 0;

  return goog.isNumber(input) && goog.math.isInt(input) &&
    0 <= input ? input : def;
};
