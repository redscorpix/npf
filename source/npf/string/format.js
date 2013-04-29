goog.provide('npf.string.format');


/**
 * @param {string|number} sourceNumber
 * @param {string=} opt_groupSeparator default is space.
 * @param {string=} opt_fractionSeparator default is ",".
 * @return {string}
 */
npf.string.format.number = function(sourceNumber, opt_groupSeparator,
                                    opt_fractionSeparator) {
  /** @type {string} */
  var source = sourceNumber + '';
  /** @type {string} */
  var groupSeparator = opt_groupSeparator || ' ';
  /** @type {string} */
  var fractionSeparator = opt_fractionSeparator || ',';
  /** @type {number} */
  var fractionIndex = source.indexOf('.');
  /** @type {string} */
  var fraction = fractionIndex > -1 ? source.substring(fractionIndex + 1) : '';
  /** @type {string} */
  var number = fractionIndex > -1 ? source.substring(0, fractionIndex) : source;

  if (5 > number.length) {
    return number + (fractionIndex > -1 ? fractionSeparator + fraction : '');
  }

  /** @type {string} */
  var result = '';

  while (3 < number.length) {
    result = number.substring(number.length - 3) +
      (result.length > 0 ? groupSeparator : '') + result;
    number = number.substring(0, number.length - 3);
  }

  result = number + groupSeparator + result +
    (-1 < fractionIndex ? fractionSeparator + fraction : '');

  return result;
};
