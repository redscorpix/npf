goog.provide('npf.dom.incremental.util');


/**
 * Used to prevent property collisions between our "map" and its prototype.
 * @param {!Object<string,*>} map The map to check.
 * @param {string} property The property to check.
 * @return {boolean} Whether map has property.
 */
npf.dom.incremental.util.has = function(map, property) {
  return Object.prototype.hasOwnProperty.call(map, property);
};


/**
 * Creates an map object without a prototype.
 * @return {!Object}
 */
npf.dom.incremental.util.createMap = function() {
  return Object.create(null);
};
