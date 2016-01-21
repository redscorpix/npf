goog.provide('npf.userAgent.es6');


/**
 * Check if browser implements ECMAScript 6 Array per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isArraySupported = function() {
  return !!(
    Array.prototype &&
    Array.prototype['copyWithin'] &&
    Array.prototype['fill'] &&
    Array.prototype['find'] &&
    Array.prototype['findIndex'] &&
    Array.prototype['keys'] &&
    Array.prototype['entries'] &&
    Array.prototype['values'] &&
    Array['from'] &&
    Array['of']
  );
};

/**
 * Check if browser implements ECMAScript 6 `String.prototype.contains`
 * per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isGeneratorSupported = function() {
  try {
    new Function('function* test() {}')();

    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if browser implements ECMAScript 6 Math per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isMathSupported = function() {
  return !!(
    Math &&
    Math['clz32'] &&
    Math['cbrt'] &&
    Math['imul'] &&
    Math['sign'] &&
    Math['log10'] &&
    Math['log2'] &&
    Math['log1p'] &&
    Math['expm1'] &&
    Math['cosh'] &&
    Math['sinh'] &&
    Math['tanh'] &&
    Math['acosh'] &&
    Math['asinh'] &&
    Math['atanh'] &&
    Math['hypot'] &&
    Math['trunc'] &&
    Math['fround']
  );
};

/**
 * Check if browser implements ECMAScript 6 Number per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isNumberSupported = function() {
  return !!(
    Number['isFinite'] &&
    Number['isInteger'] &&
    Number['isSafeInteger'] &&
    Number['isNaN'] &&
    Number['parseInt'] &&
    Number['parseFloat'] &&
    Number['isInteger'](Number['MAX_SAFE_INTEGER']) &&
    Number['isInteger'](Number['MIN_SAFE_INTEGER']) &&
    Number['isFinite'](Number['EPSILON'])
  );
};

/**
 * Check if browser implements ECMAScript 6 Object per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isObjectSupported = function() {
  return !!(Object.assign && Object.is && Object.setPrototypeOf);
};

/**
 * Check if browser implements ECMAScript 6 Promises per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isPromiseSupported = function() {
  return 'Promise' in goog.global &&
    // Some of these methods are missing from
    // Firefox/Chrome experimental implementations
    'resolve' in goog.global.Promise &&
    'reject' in goog.global.Promise &&
    'all' in goog.global.Promise &&
    'race' in goog.global.Promise &&
    // Older version of the spec had a resolver object
    // as the arg rather than a function
    (function() {
      var resolve;
      new goog.global['Promise'](function(r) {
        resolve = r;
      });

      return 'function' === typeof resolve;
    }());
};

/**
 * Check if browser implements ECMAScript 6 String per specification.
 * @return {boolean}
 */
npf.userAgent.es6.isStringSupported = function() {
  return !!(
    String['fromCodePoint'] &&
    String['raw'] &&
    String.prototype['codePointAt'] &&
    String.prototype['repeat'] &&
    String.prototype['startsWith'] &&
    String.prototype['endsWith'] &&
    String.prototype['contains']
  );
};
