goog.provide('npf.arch.Gzip');
goog.provide('npf.arch.gzip');

goog.require('goog.json');
goog.require('npf.crypt.crc32');
goog.require('npf.arch.deflate');


/**
 * @constructor
 */
npf.arch.Gzip = function() {

};


/**
 * @type {number}
 * @const
 */
npf.arch.Gzip.ID1 = 0x1F;

/**
 * @type {number}
 * @const
 */
npf.arch.Gzip.ID2 = 0x8B;

/**
 * @enum {number}
 */
npf.arch.Gzip.CompressionMethod = {
  DEFLATE: 8
};

/**
 * @enum {number}
 */
npf.arch.Gzip.PossibleFlag = {
  FTEXT: 0x01,
  FHCRC: 0x02,
  FEXTRA: 0x04,
  FNAME: 0x08,
  FCOMMENT: 0x10
};

/**
 * OS identifier (Unix)
 * @type {number}
 * @const
 */
npf.arch.Gzip.OS = 3;

/**
 * @type {number}
 * @const
 */
npf.arch.Gzip.DEFAULT_LEVEL = 6;


/**
 * @param {number} n
 * @param {Array.<number>} arr
 * @private
 */
npf.arch.Gzip.prototype.putByte_ = function(n, arr) {
  arr.push(n & 0xFF);
};

/**
 * LSB first
 * @param {number} n
 * @param {Array.<number>} arr
 * @private
 */
npf.arch.Gzip.prototype.putShort_ = function(n, arr) {
  arr.push(n & 0xFF);
  arr.push(n >>> 8);
};

/**
 * LSB first
 * @param {number} n
 * @param {Array.<number>} arr
 * @private
 */
npf.arch.Gzip.prototype.putLong_ = function(n, arr) {
  this.putShort_(n & 0xffff, arr);
  this.putShort_(n >>> 16, arr);
};

/**
 * @param {string} s
 * @param {Array.<number>} arr
 * @private
 */
npf.arch.Gzip.prototype.putString_ = function(s, arr) {
  var len = s.length;

  for (var i = 0; i < len; i++) {
    this.putByte_(s.charCodeAt(i), arr);
  }
};

/**
 * @param {Array.<number>} arr
 * @return {number}
 * @private
 */
npf.arch.Gzip.prototype.readByte_ = function(arr) {
  return arr.shift();
};

/**
 * @param {Array.<number>} arr
 * @return {number}
 * @private
 */
npf.arch.Gzip.prototype.readShort_ = function(arr) {
  return arr.shift() | (arr.shift() << 8);
};

/**
 * @param {Array.<number>} arr
 * @return {number}
 * @private
 */
npf.arch.Gzip.prototype.readLong_ = function(arr) {
  /** @type {number} */
  var n1 = this.readShort_(arr);
  /** @type {number} */
  var n2 = this.readShort_(arr);

  // JavaScript can't handle bits in the position 32
  // we'll emulate this by removing the left-most bit (if it exists)
  // and add it back in via multiplication, which does work
  if (n2 > 32768) {
    n2 -= 32768;

    return ((n2 << 16) | n1) + 2147483648 /* 32768 * Math.pow(2, 16) */;
  }

  return (n2 << 16) | n1;
};

/**
 * @param {Array.<number>} arr
 * @return {string}
 * @private
 */
npf.arch.Gzip.prototype.readString_ = function(arr) {
  /** @type {string} */
  var result = '';

  // turn all bytes into chars until the terminating null
  while (arr[0]) {
    result += String.fromCharCode(arr.shift());
  }

  // throw away terminating null
  arr.shift();

  return result;
};

/**
 * Reads n number of bytes and return as an array.
 * @param {Array.<number>} arr Array of bytes to read from
 * @param {number} n Number of bytes to read
 * @return {!Array.<number>}
 * @private
 */
npf.arch.Gzip.prototype.readBytes_ = function(arr, n) {
  var ret = [];

  for (var i = 0; i < n; i++) {
    ret[i] = arr.shift();
  }

  return ret;
};

/**
 * ZIPs a file in GZIP format. The format is as given by the spec, found at:
 * http://www.gzip.org/zlib/rfc-gzip.html
 * @param {string|Array.<number>} input
 * @param {number=} opt_level
 * @param {number=} opt_timestamp
 * @param {string=} opt_name
 * @return {!Array.<number>}
 */
npf.arch.Gzip.prototype.zip = function(input, opt_level, opt_timestamp,
    opt_name) {
  /** @type {Array.<number>} */
  var data = [];
  /** @type {number} */
  var flags = 0;
  /** @type {number} */
  var level = opt_level || npf.arch.Gzip.DEFAULT_LEVEL;
  /** @type {!Array.<number>} */
  var out = [];

  if (goog.isString(input)) {
    for (var i = 0; i < input.length; i++) {
      data[i] = input.charCodeAt(i);
    }
  } else {
    data = input;
  }

  if (opt_name) {
    flags |= npf.arch.Gzip.PossibleFlag.FNAME;
  }

  /** @type {number} */
  var algLevel = 0;

  // put deflate args (extra flags)
  if (1 == level) {
    // fastest algorithm
    algLevel = 4;
  } else if (1 == level) {
    // maximum compression (fastest algorithm)
    algLevel = 2;
  }

  // magic number marking this file as GZIP
  this.putByte_(npf.arch.Gzip.ID1, out);
  this.putByte_(npf.arch.Gzip.ID2, out);
  this.putByte_(npf.arch.Gzip.CompressionMethod.DEFLATE, out);
  this.putByte_(flags, out);
  this.putLong_(opt_timestamp || parseInt(goog.now() / 1000, 10), out);
  this.putByte_(algLevel, out);
  this.putByte_(npf.arch.Gzip.OS, out);

  if (opt_name) {
    // ignore the directory part
    this.putString_(
      opt_name.substring(opt_name.lastIndexOf('/') + 1), out);
    // terminating null
    this.putByte_(0, out);
  }

  /** @type {!Array.<number>} */
  var deflated = npf.arch.deflate.deflate(data, level);

  for (var i = 0; i < deflated.length; i++) {
    this.putByte_(deflated[i], out);
  }

  this.putLong_(parseInt(npf.crypt.crc32.convert(data), 16), out);
  this.putLong_(data.length, out);

  return out;
}

/**
 * @param {Array.<number>} data
 * @return {!Array.<number>}
 */
npf.arch.Gzip.prototype.unzip = function(data) {
  // start with a copy of the array
  var arr = Array.prototype.slice.call(data, 0);

  // check the first two bytes for the magic numbers
  if (
    this.readByte_(arr) !== npf.arch.Gzip.ID1 ||
    this.readByte_(arr) !== npf.arch.Gzip.ID2
  ) {
    throw Error('Not a GZIP file');
  }

  /** @type {npf.arch.Gzip.CompressionMethod} */
  var compressionMethod;
  /** @type {number} */
  var t = this.readByte_(arr);

  for (var key in npf.arch.Gzip.CompressionMethod) {
    if (npf.arch.Gzip.CompressionMethod[key] == t) {
      compressionMethod = npf.arch.Gzip.CompressionMethod[key];

      break;
    }
  }

  if (!compressionMethod) {
    throw Error('Unsupported compression method');
  }

  /** @type {number} */
  var flags = this.readByte_(arr);
  /** @type {number} */
  var mtime = this.readLong_(arr);
  /** @type {number} */
  var xFlags = this.readByte_(arr);
  /** @type {number} */
  var os = this.readByte_(arr);

  // just throw away the bytes for now
  if (flags & npf.arch.Gzip.PossibleFlag.FEXTRA) {
    t = this.readShort_(arr);
    this.readBytes_(arr, t);
  }

  // just throw away for now
  if (flags & npf.arch.Gzip.PossibleFlag.FNAME) {
    this.readString_(arr);
  }

  // just throw away for now
  if (flags & npf.arch.Gzip.PossibleFlag.FCOMMENT) {
    this.readString_(arr);
  }

  // just throw away for now
  if (flags & npf.arch.Gzip.PossibleFlag.FHCRC) {
    this.readShort_(arr);
  }

  /** @type {!Array.<number>} */
  var result = [];

  if (npf.arch.Gzip.CompressionMethod.DEFLATE == compressionMethod) {
    // give deflate everything but the last 8 bytes
    // the last 8 bytes are for the CRC32 checksum and filesize
    result = npf.arch.deflate.inflate(arr.splice(0, arr.length - 8));
  }

  /** @type {number} */
  var crc = this.readLong_(arr);

  if (crc != parseInt(npf.crypt.crc32.convert(result), 16)) {
    throw Error('Checksum does not match');
  }

  /** @type {number} */
  var size = this.readLong_(arr);

  if (size != result.length) {
    throw Error('Size of decompressed file not correct');
  }

  return result;
};

/**
 * @param {*} input
 * @param {number=} opt_level
 * @param {number=} opt_timestamp
 * @param {string=} opt_name
 * @return {!Array.<number>}
 */
npf.arch.gzip.zip = function(input, opt_level, opt_timestamp, opt_name) {
  /** @type {string} */
  var data = goog.json.serialize(input);
  var gzip = new npf.arch.Gzip();

  return gzip.zip(data, opt_level, opt_timestamp, opt_name);
};

/**
 * @param {*} input
 * @param {number=} opt_level
 * @param {number=} opt_timestamp
 * @param {string=} opt_name
 * @return {string}
 */
npf.arch.gzip.zipToString = function(input, opt_level, opt_timestamp, opt_name) {
  /** @type {!Array.<number>} */
  var result = npf.arch.gzip.zip(input, opt_level, opt_timestamp, opt_name);
  /** @type {string} */
  var str;

  if (0 == result.length % 2) {
    str = '1';
  } else {
    str = '0';
    result.push(0);
  }

  for (var i = 0; i < result.length; i += 2) {
    str += String.fromCharCode(result[i] * 256 + result[i + 1]);
  }

  return str;
};

/**
 * @param {Array.<number>} data
 * @return {*}
 */
npf.arch.gzip.unzip = function(data) {
  var gzip = new npf.arch.Gzip();
  /** @type {!Array.<number>} */
  var result = gzip.unzip(data);

  var str = '';

  for (var i = 0; i < result.length; i++) {
    str += String.fromCharCode(result[i]);
  }

  return goog.json.parse(str);
};

/**
 * @param {string} data
 * @return {*}
 */
npf.arch.gzip.unzipFromString = function(data) {
  /** @type {!Array.<number>} */
  var arr = [];

  for (var i = 1; i < data.length; i++) {
    /** @type {number} */
    var code = data.charCodeAt(i);
    arr.push(Math.ceil((code - code % 256) / 256));
    arr.push(code % 256);
  }

  if ('0' == data.charAt(0)) {
    arr.pop();
  }

  return npf.arch.gzip.unzip(arr);
};
