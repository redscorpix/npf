goog.provide('npf.crypt.crc32');


/**
 * Reverse polynomial
 * @type {number}
 * @const
 */
npf.crypt.crc32.POLY = 0xEDB88320;

/**
 * @type {number}
 * @private
 */
npf.crypt.crc32.crcTable_;

/**
 * @type {!Array.<number>}
 * @private
 */
npf.crypt.crc32.table_ = (function() {
  var table = [];

  for (var n = 0; n < 256; n++) {
    var c = n;

    for (var k = 0; k < 8; k++) {
      if (c & 1) {
        c = npf.crypt.crc32.POLY ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }

    table[n] = c >>> 0;
  }

  return table;
})();

/**
 * @param {string|Array.<number>} input
 * @param {boolean=} opt_direct
 * @return {string}
 */
npf.crypt.crc32.convert = function(input, opt_direct) {
  /** @type {Array.<number>} */
  var val = goog.isString(input) ? npf.crypt.crc32.strToArr_(input) : input;
  /** @type {number} */
  var ret = opt_direct ? npf.crypt.crc32.direct(val) : npf.crypt.crc32.table(val);

  // convert to 2's complement hex
  return (ret >>> 0).toString(16);
};

/**
 * Compute CRC of array directly.
 * This is slower for repeated calls, so append mode is not supported.
 * @param {Array.<number>} arr
 * @return {number}
 */
npf.crypt.crc32.direct = function(arr) {
  /** @type {number} */
  var crc = -1; // initial contents of LFBSR
  /** @type {number} */
  var l = arr.length;

  for (var i = 0; i < l; i++) {
    var temp = (crc ^ arr[i]) & 0xff;

    // read 8 bits one at a time
    for (var j = 0; j < 8; j += 1) {
      if ((temp & 1) === 1) {
        temp = (temp >>> 1) ^ npf.crypt.crc32.POLY;
      } else {
        temp = (temp >>> 1);
      }
    }

    crc = (crc >>> 8) ^ temp;
  }

  // flip bits
  return crc ^ -1;
};

/**
 * Compute CRC with the help of a pre-calculated table.
 * This supports append mode, if the second parameter is set.
 * @param {Array.<number>} arr
 * @param {boolean=} opt_append
 * @return {number}
 */
npf.crypt.crc32.table = function(arr, opt_append) {
  // if we're in append mode, don't reset crc
  // if arr is null or undefined, reset table and return
  if (!goog.isDef(npf.crypt.crc32.table.crc) || !opt_append || !arr) {
    npf.crypt.crc32.crcTable_ = 0 ^ -1;

    if (!arr) {
      return 0;
    }
  }

  // store in temp variable for minor speed gain

  /** @type {number} */
  var crc = npf.crypt.crc32.crcTable_;
  /** @type {number} */
  var l = arr.length;

  for (var i = 0; i < l; i++) {
    crc = (crc >>> 8) ^ npf.crypt.crc32.table_[(crc ^ arr[i]) & 0xff];
  }

  npf.crypt.crc32.crcTable_ = crc;

  return crc ^ -1;
};

/**
 * @param {string} str
 * @return {!Array.<number>}
 * @private
 */
npf.crypt.crc32.strToArr_ = function(str) {
  /** @type {!Array.<number>} */
  var arr = [];
  /** @type {number} */
  var len = str.length;

  for (var i = 0; i < len; i++) {
    arr[i] = str.charCodeAt(i);
  }

  return arr;
};
