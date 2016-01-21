goog.provide('npf.generator');

/**
 * @private {number}
 */
npf.generator.uniqueIdCounter_ = 0;


/**
 * @param {string} identifier The identifier.
 * @return {string} A unique identifier.
 * @idGenerator
 */
npf.generator.getUniqueId = function(identifier) {
  return identifier + '_' + npf.generator.uniqueIdCounter_++;
};
