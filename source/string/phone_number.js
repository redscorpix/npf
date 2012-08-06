goog.provide('npf.string.phoneNumber');

goog.require('goog.array');


/**
 * @param {string} phone
 * @return {string}
 */
npf.string.phoneNumber.parse = function(phone) {
  phone = phone.replace(/[^\d]/g, '');

  /** @type {number} */
  var codeLength;
  var one = [0, 1, 3, 7];
  var two = [
    20, 27, 30, 31, 32, 33, 34, 36, 40, 41, 43, 44, 45, 46, 47, 48, 49,
    51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 81, 82,
    84, 86, 90, 91, 92, 93, 94, 95, 98];
  var four = [5993, 5994, 5997, 5999, 8816];
  var five = [88216];

  if (goog.array.contains(one, parseInt(phone.substr(0, 1), 10))) {
    codeLength = 1;
  } else if (goog.array.contains(two, parseInt(phone.substr(0, 2), 10))) {
    codeLength = 2;
  } else if (goog.array.contains(four, parseInt(phone.substr(0, 4), 10))) {
    codeLength = 4;
  } else if (goog.array.contains(four, parseInt(phone.substr(0, 5), 10))) {
    codeLength = 5;
  } else {
    codeLength = 3;
  }

  /** @type {number} */
  var numberLength = phone.length - codeLength;

  if (3 > numberLength) {
    return '';
  }

  var first = true;
  /** @type {string} */
  var result = '+' + phone.substr(0, codeLength) + ' ';
  phone = phone.substr(codeLength);

  while (7 <= phone.length) {
    result += phone.substr(0, 3) + (first ? ' ' : '-');
    phone = phone.substr(3);
    first = false;
  }

  if (4 == phone.length) {
    result += phone.substr(0, 2) + '-' + phone.substr(2);
  } else if (5 == phone.length) {
    result += phone.substr(0, 1) + '-' + phone.substr(1, 2) + '-' +
    	phone.substr(3);
  } else if (6 == phone.length) {
    result += phone.substr(0, 2) + '-' + phone.substr(2, 2) + '-' +
    	phone.substr(4);
  }

  return result;
};
