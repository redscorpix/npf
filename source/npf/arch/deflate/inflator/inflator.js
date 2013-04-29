goog.provide('npf.arch.deflate.Inflator');

goog.require('npf.arch.deflate.inflator.HuftBuild');


/**
 * @constructor
 */
npf.arch.deflate.Inflator = function() {

};


/**
 * Sliding Window size
 * @type {number}
 * @const
 */
npf.arch.deflate.Inflator.WSIZE = 32768;

/**
 * @type {number}
 * @const
 */
npf.arch.deflate.Inflator.STORED_BLOCK = 0;

/**
 * @type {number}
 * @const
 */
npf.arch.deflate.Inflator.STATIC_TREES = 1;

/**
 * @type {number}
 * @const
 */
npf.arch.deflate.Inflator.DYN_TREES = 2;

/**
 * bits in base literal/length lookup table
 * @type {number}
 * @const
 */
npf.arch.deflate.Inflator.LBITS = 9;

/**
 * bits in base distance lookup table
 * @type {number}
 * @const
 */
npf.arch.deflate.Inflator.DBITS = 6;

/**
 * @type {!Array.<number>}
 * @const
 */
npf.arch.deflate.Inflator.MASK_BITS = [
  0x0000,
  0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff,
  0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff
];

/**
 * Copy lengths for literal codes 257..285
 * @type {!Array.<number>}
 * @const
 */
npf.arch.deflate.Inflator.CPLENS = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
];

/**
 * Extra bits for literal codes 257..285
 * @type {!Array.<number>}
 * @const
 */
npf.arch.deflate.Inflator.CPLEXT = [
  0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
  3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99 // 99==invalid
];

/**
 * Copy offsets for distance codes 0..29
 * @type {!Array.<number>}
 * @const
 */
npf.arch.deflate.Inflator.CPDIST = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577
];

/**
 * Extra bits for distance codes
 * @type {!Array.<number>}
 * @const
 */
npf.arch.deflate.Inflator.CPDEXT = [
  0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
  7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
  12, 12, 13, 13
];

/**
 * Order of the bit length code lengths
 * @type {!Array.<number>}
 * @const
 */
npf.arch.deflate.Inflator.BORDER = [
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
];

/**
 * @type {Array.<number>}
 * @private
 */
npf.arch.deflate.Inflator.prototype.slide_;

/**
 * current position in slide
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.wp_;

/**
 * inflate static
 * @type {npf.arch.deflate.inflator.HuftList}
 * @private
 */
npf.arch.deflate.Inflator.prototype.fixedTl_ = null;

/**
 * Inflate static.
 * @type {npf.arch.deflate.inflator.HuftList}
 * @private
 */
npf.arch.deflate.Inflator.prototype.fixedTd_;

/**
 * Inflate static.
 * @type {npf.arch.deflate.inflator.HuftList|number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.fixedBl_;

/**
 * Inflate static.
 * @type {npf.arch.deflate.inflator.HuftList|number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.fixedBd_;

/**
 * bit buffer
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.bitBuf_;

/**
 * bits in bit buffer
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.bitLen_;

/**
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.method_;

/**
 * @type {boolean}
 * @private
 */
npf.arch.deflate.Inflator.prototype.eof_;

/**
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.copyLeng_;

/**
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.copyDist_;

/**
 * Literal length decoder table.
 * @type {npf.arch.deflate.inflator.HuftList}
 * @private
 */
npf.arch.deflate.Inflator.prototype.tl_;

/**
 * Literal distance decoder table.
 * @type {npf.arch.deflate.inflator.HuftList}
 * @private
 */
npf.arch.deflate.Inflator.prototype.td_;

/**
 * Number of bits decoded by tl.
 * @type {npf.arch.deflate.inflator.HuftList|number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.bl_;

/**
 * Number of bits decoded by td.
 * @type {npf.arch.deflate.inflator.HuftList|number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.bd_;

/**
 * @type {Array.<number>}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateData_;

/**
 * @type {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflatePos_;


/**
 * @return {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.getByte_ = function() {
  if (this.inflateData_.length === this.inflatePos_) {
    return -1;
  }

  return this.inflateData_[this.inflatePos_++] & 0xff;
};

/**
 * @param {number} n
 * @private
 */
npf.arch.deflate.Inflator.prototype.needBits_ = function(n) {
  while (this.bitLen_ < n) {
    this.bitBuf_ |= this.getByte_() << this.bitLen_;
    this.bitLen_ += 8;
  }
};

/**
 * @param {number} n
 * @private
 */
npf.arch.deflate.Inflator.prototype.getBits_ = function(n) {
  return this.bitBuf_ & npf.arch.deflate.Inflator.MASK_BITS[n];
};

/**
 * @param {number} n
 * @private
 */
npf.arch.deflate.Inflator.prototype.dumpBits_ = function(n) {
  this.bitBuf_ >>= n;
  this.bitLen_ -= n;
};

/**
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} size
 * @return {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateCodes_ = function(buff, off, size) {
  // inflate (decompress) the codes in a deflated (compressed) block.
  // Return an error code or zero if it all goes ok.
  if (size === 0) {
    return 0;
  }

  // inflate the coded data

  var e; // table entry flag/number of extra bits

  /**
   * Pointer to table entry.
   * @type {npf.arch.deflate.inflator.HuftNode}
   */
  var t;

  /**
   * @type {number}
   */
  var n = 0;

  for (;;) { // do until end of block
    this.needBits_(/** @type {number} */ (this.bl_));
    t = this.tl_.list[this.getBits_(/** @type {number} */ (this.bl_))];
    e = t.e;

    while (e > 16) {
      if (e === 99) {
        return -1;
      }

      this.dumpBits_(t.b);
      e -= 16;
      this.needBits_(e);
      t = t.t[this.getBits_(e)];
      e = t.e;
    }

    this.dumpBits_(t.b);

    if (e === 16) { // then it's a literal
      this.wp_ &= npf.arch.deflate.Inflator.WSIZE - 1;
      buff[off + n++] = this.slide_[this.wp_++] = t.n;

      if (n === size) {
        return size;
      }

      continue;
    }

    // exit if end of block
    if (e === 15) {
      break;
    }

    // it's an EOB or a length

    // get length of block to copy
    this.needBits_(e);
    this.copyLeng_ = t.n + this.getBits_(e);
    this.dumpBits_(e);

    // decode distance of block to copy
    this.needBits_(/** @type {number} */ (this.bd_));
    t = this.td_.list[this.getBits_(/** @type {number} */ (this.bd_))];
    e = t.e;

    while (e > 16) {
      if (e === 99) {
        return -1;
      }

      this.dumpBits_(t.b);
      e -= 16;
      this.needBits_(e);
      t = t.t[this.getBits_(e)];
      e = t.e;
    }

    this.dumpBits_(t.b);
    this.needBits_(e);
    this.copyDist_ = this.wp_ - t.n - this.getBits_(e);
    this.dumpBits_(e);

    // do the copy
    while (this.copyLeng_ > 0 && n < size) {
      this.copyLeng_--;
      this.copyDist_ &= npf.arch.deflate.Inflator.WSIZE - 1;
      this.wp_ &= npf.arch.deflate.Inflator.WSIZE - 1;
      buff[off + n++] = this.slide_[this.wp_++] = this.slide_[this.copyDist_++];
    }

    if (n === size) {
      return size;
    }
  }

  this.method_ = -1; // done

  return n;
};

/**
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} size
 * @return {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateStored_ = function(buff, off, size) {
  /* "decompress" an inflated type 0 (stored) block. */

  /** @type {number} */
  var n = this.bitLen_ & 7;
  this.dumpBits_(n);

  // get the length and its complement
  this.needBits_(16);
  n = this.getBits_(16);
  this.dumpBits_(16);
  this.needBits_(16);

  if (n !== ((~this.bitBuf_) & 0xffff)) {
    return -1; // error in compressed data
  }

  this.dumpBits_(16);

  // read and output the compressed data
  this.copyLeng_ = n;

  n = 0;

  while (this.copyLeng_ > 0 && n < size) {
    this.copyLeng_--;
    this.wp_ &= npf.arch.deflate.Inflator.WSIZE - 1;
    this.needBits_(8);
    buff[off + n++] = this.slide_[this.wp_++] = this.getBits_(8);
    this.dumpBits_(8);
  }

  if (this.copyLeng_ === 0) {
    this.method_ = -1; // done
  }

  return n;
};

/**
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} size
 * @return {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateFixed_ = function(buff, off, size) {
  // decompress an inflated type 1 (fixed Huffman codes) block.  We should
  // either replace this with a custom decoder, or at least precompute the
  // Huffman tables.

  // if first time, set up tables for fixed blocks
  if (!this.fixedTl_) {
    var i; // temporary variable
    /**
     * 288 length list for huft_build (initialized below)
     * @type {!Array.<number>}
     */
    var l = [];

    // literal table
    for (i = 0; i < 144; i++) {
      l[i] = 8;
    }

    for (; i < 256; i++) {
      l[i] = 9;
    }

    for (; i < 280; i++) {
      l[i] = 7;
    }

    for (; i < 288; i++) { // make a complete, but wrong code set
      l[i] = 8;
    }

    this.fixedBl_ = 7;

    var h = new npf.arch.deflate.inflator.HuftBuild(
      l, 288, 257,
      npf.arch.deflate.Inflator.CPLENS, npf.arch.deflate.Inflator.CPLEXT,
      this.fixedBl_
    );

    if (h.status !== 0) {
      throw Error('HufBuild error: ' + h.status);
    }

    this.fixedTl_ = h.root;
    this.fixedBl_ = h.m;

    // distance table
    for (i = 0; i < 30; i++) { // make an incomplete code set
      l[i] = 5;
    }

    this.fixedBd_ = 5;

    h = new npf.arch.deflate.inflator.HuftBuild(
      l, 30, 0,
      npf.arch.deflate.Inflator.CPDIST, npf.arch.deflate.Inflator.CPDEXT,
      this.fixedBd_
    );

    if (h.status > 1) {
      this.fixedTl_ = null;

      throw Error('HufBuild error: ' + h.status);
    }

    this.fixedTd_ = h.root;
    this.fixedBd_ = h.m;
  }

  this.tl_ = this.fixedTl_;
  this.td_ = this.fixedTd_;
  this.bl_ = this.fixedBl_;
  this.bd_ = this.fixedBd_;

  return this.inflateCodes_(buff, off, size);
};

/**
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} size
 * @return {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateDynamic_ = function(buff, off, size) {
  // decompress an inflated type 2 (dynamic Huffman codes) block.

  /**
   * Temporary variables.
   * @type {number}
   */
  var i;

  /** @type {number} */
  var j;

  /**
   * Literal/length code table
   * @type {npf.arch.deflate.inflator.HuftNode}
   */
  var t;
  /** @type {!Array.<number>} */
  var ll = [];

  // literal/length and distance code lengths
  for (i = 0; i < 286 + 30; i++) {
    ll[i] = 0;
  }

  // read in table lengths
  this.needBits_(5);

  /**
   * Number of literal/length codes
   * @type {number}
   */
  var nl = 257 + this.getBits_(5);

  this.dumpBits_(5);
  this.needBits_(5);

  /**
   * Number of distance codes.
   * @type {number}
   */
  var nd = 1 + this.getBits_(5);

  this.dumpBits_(5);
  this.needBits_(4);

  /**
   * Number of bit length codes
   * @type {number}
   */
  var nb = 4 + this.getBits_(4);

  this.dumpBits_(4);

  if (nl > 286 || nd > 30) {
    return -1; // bad lengths
  }

  // read in bit-length-code lengths
  for (j = 0; j < nb; j++) {
    this.needBits_(3);
    ll[npf.arch.deflate.Inflator.BORDER[j]] = this.getBits_(3);
    this.dumpBits_(3);
  }

  for (; j < 19; j++) {
    ll[npf.arch.deflate.Inflator.BORDER[j]] = 0;
  }

  // build decoding table for trees--single level, 7 bit lookup
  this.bl_ = 7;

  /** @type {npf.arch.deflate.inflator.HuftBuild} */
  var h = new npf.arch.deflate.inflator.HuftBuild(
    ll, 19, 19, null, null, this.bl_);

  if (h.status !== 0) {
    return -1; // incomplete code set
  }

  this.tl_ = h.root;
  this.bl_ = h.m;

  // read in literal and distance code lengths

  /**
   * Number of lengths to get.
   * @type {number}
   */
  var n = nl + nd;
  i = 0;

  /**
   * Last length.
   * @type {number}
   */
  var l = 0;

  while (i < n) {
    this.needBits_(this.bl_);
    t = this.tl_.list[this.getBits_(this.bl_)];
    j = t.b;
    this.dumpBits_(j);
    j = t.n;

    if (j < 16) { // length of code in bits (0..15)
      ll[i++] = l = j; // save last length in l
    } else if (j === 16) { // repeat last length 3 to 6 times
      this.needBits_(2);
      j = 3 + this.getBits_(2);
      this.dumpBits_(2);

      if (i + j > n) {
        return -1;
      }

      while (j-- > 0) {
        ll[i++] = l;
      }
    } else if (j === 17) { // 3 to 10 zero length codes
      this.needBits_(3);
      j = 3 + this.getBits_(3);
      this.dumpBits_(3);

      if (i + j > n) {
        return -1;
      }

      while (j-- > 0) {
        ll[i++] = 0;
      }

      l = 0;
    } else { // j === 18: 11 to 138 zero length codes
      this.needBits_(7);
      j = 11 + this.getBits_(7);
      this.dumpBits_(7);

      if (i + j > n) {
        return -1;
      }

      while (j-- > 0) {
        ll[i++] = 0;
      }

      l = 0;
    }
  }

  // build the decoding tables for literal/length and distance codes
  this.bl_ = npf.arch.deflate.Inflator.LBITS;
  h = new npf.arch.deflate.inflator.HuftBuild(ll, nl, 257,
    npf.arch.deflate.Inflator.CPLENS, npf.arch.deflate.Inflator.CPLEXT, this.bl_);

  if (this.bl_ === 0) { // no literals or lengths
    h.status = 1;
  }

  if (h.status !== 0) {
    if (h.status !== 1) {
      return -1; // incomplete code set
    }
    // **incomplete literal tree**
  }

  this.tl_ = h.root;
  this.bl_ = h.m;

  for (i = 0; i < nd; i++) {
    ll[i] = ll[i + nl];
  }

  this.bd_ = npf.arch.deflate.Inflator.DBITS;
  h = new npf.arch.deflate.inflator.HuftBuild(ll, nd, 0,
    npf.arch.deflate.Inflator.CPDIST, npf.arch.deflate.Inflator.CPDEXT, this.bd_);
  this.td_ = h.root;
  this.bd_ = h.m;

  if (this.bd_ === 0 && nl > 257) { // lengths but no distances
    // **incomplete distance tree**
    return -1;
  }
/*
  if (h.status === 1) {
    // **incomplete distance tree**
  }
*/
  if (h.status !== 0) {
    return -1;
  }

  // decompress until an end-of-block code
  return this.inflateCodes_(buff, off, size);
};

/**
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateStart_ = function() {
  if (!this.slide_) {
    this.slide_ = []; // new Array(2 * npf.arch.deflate.Inflator.WSIZE);
                      // this.slide_.length is never called
  }

  this.wp_ = 0;
  this.bitBuf_ = 0;
  this.bitLen_ = 0;
  this.method_ = -1;
  this.eof_ = false;
  this.copyLeng_ = 0;
  this.copyDist_ = 0;
  this.tl_ = null;
};

/**
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} size
 * @return {number}
 * @private
 */
npf.arch.deflate.Inflator.prototype.inflateInternal_ = function(buff, off, size) {
  // decompress an inflated entry

  /** @type {number} */
  var i;
  /** @type {number} */
  var n = 0;

  while (n < size) {
    if (this.eof_ && this.method_ === -1) {
      return n;
    }

    if (this.copyLeng_ > 0) {
      if (this.method_ !== npf.arch.deflate.Inflator.STORED_BLOCK) {
        // npf.arch.deflate.Inflator.STATIC_TREES or
        // npf.arch.deflate.Inflator.DYN_TREES
        while (this.copyLeng_ > 0 && n < size) {
          this.copyLeng_--;
          this.copyDist_ &= npf.arch.deflate.Inflator.WSIZE - 1;
          this.wp_ &= npf.arch.deflate.Inflator.WSIZE - 1;
          buff[off + n++] = this.slide_[this.wp_++] =
            this.slide_[this.copyDist_++];
        }
      } else {
        while (this.copyLeng_ > 0 && n < size) {
          this.copyLeng_--;
          this.wp_ &= npf.arch.deflate.Inflator.WSIZE - 1;
          this.needBits_(8);
          buff[off + n++] = this.slide_[this.wp_++] = this.getBits_(8);
          this.dumpBits_(8);
        }

        if (this.copyLeng_ === 0) {
          this.method_ = -1; // done
        }
      }

      if (n === size) {
        return n;
      }
    }

    if (this.method_ === -1) {
      if (this.eof_) {
        break;
      }

      // read in last block bit
      this.needBits_(1);

      if (this.getBits_(1) !== 0) {
        this.eof_ = true;
      }

      this.dumpBits_(1);

      // read in block type
      this.needBits_(2);
      this.method_ = this.getBits_(2);
      this.dumpBits_(2);
      this.tl_ = null;
      this.copyLeng_ = 0;
    }

    switch (this.method_) {
      case npf.arch.deflate.Inflator.STORED_BLOCK:
        i = this.inflateStored_(buff, off + n, size - n);
        break;

      case npf.arch.deflate.Inflator.STATIC_TREES:
        if (this.tl_) {
          i = this.inflateCodes_(buff, off + n, size - n);
        } else {
          i = this.inflateFixed_(buff, off + n, size - n);
        }
        break;

      case npf.arch.deflate.Inflator.DYN_TREES:
        if (this.tl_) {
          i = this.inflateCodes_(buff, off + n, size - n);
        } else {
          i = this.inflateDynamic_(buff, off + n, size - n);
        }
        break;

      default: // error
        i = -1;
        break;
    }

    if (i === -1) {
      if (this.eof_) {
        return 0;
      }

      return -1;
    }

    n += i;
  }

  return n;
};

/**
 * @param {Array.<number>} arr
 * @return {!Array.<number>}
 */
npf.arch.deflate.Inflator.prototype.inflate = function(arr) {
  this.inflateStart_();
  this.inflateData_ = arr;
  this.inflatePos_ = 0;

  /** @type {!Array.<number>} */
  var buff = [];
  /** @type {number} */
  var i;

  do {
    i = this.inflateInternal_(buff, buff.length, 1024);
  } while (i > 0);

  this.inflateData_ = null; // G.C.

  return buff;
};
