goog.provide('npf.dataTypes');
goog.provide('npf.dataTypes.Gender');

goog.require('goog.object');


/**
 * @enum {number}
 */
npf.dataTypes.Gender = {
  MALE: 1,
  FEMALE: 2
};


/**
 * @param {*} gender
 * @return {npf.dataTypes.Gender?}
 */
npf.dataTypes.getGender = (function() {
  var map = goog.object.transpose(npf.dataTypes.Gender);

  return function(gender) {
    return map[gender] ? /** @type {!npf.dataTypes.Gender} */ (gender) : null;
  };
})();
