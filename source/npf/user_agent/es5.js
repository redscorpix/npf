goog.provide('npf.userAgent.es5');

goog.require('npf.userAgent.json');


/**
 * Check if browser implements ECMAScript 5 Array per specification.
 * @return {boolean}
 */
npf.userAgent.es5.isArraySupported = function() {
  return !!(
    Array.prototype &&
    Array.prototype['every'] &&
    Array.prototype['filter'] &&
    Array.prototype['forEach'] &&
    Array.prototype['indexOf'] &&
    Array.prototype['lastIndexOf'] &&
    Array.prototype['map'] &&
    Array.prototype['some'] &&
    Array.prototype['reduce'] &&
    Array.prototype['reduceRight'] &&
    Array['isArray']
  );
};

/**
 * Check if browser implements ECMAScript 5 Date per specification.
 * @return {boolean}
 */
npf.userAgent.es5.isDateSupported = function() {
  /** @type {boolean} */
  var canParseISODate = false;

  try {
    canParseISODate = !!Date.parse('2013-04-12T06:06:37.307Z');
  } catch (e) {
    // no ISO date parsing yet
  }

  return !!(
    Date['now'] &&
    Date.prototype &&
    Date.prototype['toISOString'] &&
    Date.prototype['toJSON'] &&
    canParseISODate
  );
};

/**
 * Check if browser implements ECMAScript 5 Function per specification.
 * @return {boolean}
 */
npf.userAgent.es5.isFunctionSupported = function() {
  return !!(Function.prototype && Function.prototype.bind);
};

/**
 * Check if browser implements ECMAScript 5 Object per specification.
 * @return {boolean}
 */
npf.userAgent.es5.isObjectSupported = function() {
  return !!(
    Object['keys'] &&
    Object['create'] &&
    Object['getPrototypeOf'] &&
    Object['getOwnPropertyNames'] &&
    Object['isSealed'] &&
    Object['isFrozen'] &&
    Object['isExtensible'] &&
    Object['getOwnPropertyDescriptor'] &&
    Object['defineProperty'] &&
    Object['defineProperties'] &&
    Object['seal'] &&
    Object['freeze'] &&
    Object['preventExtensions']
  );
};

/**
 * Check if browser implements everything as specified in ECMAScript 5.
 * @return {boolean}
 */
npf.userAgent.es5.isSpecificationSupported = function() {
  return npf.userAgent.es5.isArraySupported() &&
    npf.userAgent.es5.isDateSupported() &&
    npf.userAgent.es5.isFunctionSupported() &&
    npf.userAgent.es5.isObjectSupported() &&
    npf.userAgent.es5.isStrictModeSupported() &&
    npf.userAgent.es5.isStringSupported() &&
    npf.userAgent.json.isSupported() &&
    npf.userAgent.es5.isUndefinedSupported();
};

/**
 * Check if browser implements ECMAScript 5 Object strict mode.
 * @return {boolean}
 */
npf.userAgent.es5.isStrictModeSupported = function() {
  return (function() {'use strict'; return !this; })();
};

/**
 * Check if browser implements ECMAScript 5 String per specification.
 * @return {boolean}
 */
npf.userAgent.es5.isStringSupported = function() {
  return !!(String.prototype && String.prototype.trim);
};

/**
 * Check if browser prevents assignment to global `undefined` per ECMAScript 5.
 * @return {boolean}
 */
npf.userAgent.es5.isUndefinedSupported = function() {
  try {
    var originalUndefined = goog.global['undefined'];
    goog.global['undefined'] = 12345;
    var result = 'undefined' == typeof goog.global['undefined'];
    goog.global['undefined'] = originalUndefined;

    return result;
  } catch (e) {
    return false;
  }
};
