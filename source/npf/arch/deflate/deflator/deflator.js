goog.provide('npf.arch.deflate.Deflator');

goog.require('npf.arch.deflate.deflator.DeflateBuffer');
goog.require('npf.arch.deflate.deflator.DeflateCt');
goog.require('npf.arch.deflate.deflator.DeflateConfiguration');
goog.require('npf.arch.deflate.deflator.DeflateTreeDesc');


/**
 * @constructor
 */
npf.arch.deflate.Deflator = function() {

  /**
   * @private {npf.arch.deflate.deflator.DeflateBuffer}
   */
  this.freeQueue_ = undefined;

  /**
   * @private {npf.arch.deflate.deflator.DeflateBuffer}
   */
  this.qhead_ = undefined;

  /**
   * @private {npf.arch.deflate.deflator.DeflateBuffer}
   */
  this.qtail_ = undefined;

  /**
   * @private {boolean}
   */
  this.initFlag_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.outBuf_ = null;

  /**
   * @private {number}
   */
  this.outcnt_ = undefined;

  /**
   * @private {number}
   */
  this.outoff_ = undefined;

  /**
   * @private {boolean}
   */
  this.complete_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.window_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.dBuf_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.lBuf_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.prev_ = undefined;

  /**
   * @private {number}
   */
  this.biBuf_ = undefined;

  /**
   * @private {number}
   */
  this.biValid_ = undefined;

  /**
   * @private {number}
   */
  this.blockStart_ = undefined;

  /**
   * @private {number}
   */
  this.insH_ = undefined;

  /**
   * @private {number}
   */
  this.hashHead_ = undefined;

  /**
   * @private {number}
   */
  this.prevMatch_ = undefined;

  /**
   * @private {boolean}
   */
  this.matchAvailable_ = undefined;

  /**
   * @private {number}
   */
  this.matchLength_ = undefined;

  /**
   * @private {number}
   */
  this.prevLength_ = undefined;

  /**
   * @private {number}
   */
  this.strStart_ = undefined;

  /**
   * @private {number}
   */
  this.matchStart_ = undefined;

  /**
   * @private {boolean}
   */
  this.eofile_ = undefined;

  /**
   * @private {number}
   */
  this.lookAhead_ = undefined;

  /**
   * @private {number}
   */
  this.maxChainLength_ = undefined;

  /**
   * @private {number}
   */
  this.maxLazyMatch_ = undefined;

  /**
   * @private {number}
   */
  this.comprLevel_ = undefined;

  /**
   * @private {number}
   */
  this.goodMatch_ = undefined;

  /**
   * @private {number}
   */
  this.niceMatch_ = undefined;

  /**
   * @private {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.dynLtree_ = null;

  /**
   * @private {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.dynDtree_ = null;

  /**
   * @private {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.staticLtree_ = null;

  /**
   * @private {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.staticDtree_ = null;

  /**
   * @private {Array.<npf.arch.deflate.deflator.DeflateCt>}
   */
  this.blTree_ = null;

  /**
   * @private {npf.arch.deflate.deflator.DeflateTreeDesc}
   */
  this.lDesc_ = undefined;

  /**
   * @private {npf.arch.deflate.deflator.DeflateTreeDesc}
   */
  this.dDesc_ = undefined;

  /**
   * @private {npf.arch.deflate.deflator.DeflateTreeDesc}
   */
  this.blDesc_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.blCount_ = null;

  /**
   * @private {Array.<number>}
   */
  this.heap_ = null;

  /**
   * @private {number}
   */
  this.heapLen_ = undefined;

  /**
   * @private {number}
   */
  this.heapMax_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.depth_ = null;

  /**
   * @private {Array.<number>}
   */
  this.lengthCode_ = null;

  /**
   * @private {Array.<number>}
   */
  this.distCode_ = null;

  /**
   * @private {Array.<number>}
   */
  this.baseLength_ = null;

  /**
   * @private {Array.<number>}
   */
  this.baseDist_ = null;

  /**
   * @private {Array.<number>}
   */
  this.flagBuf_ = null;

  /**
   * @private {number}
   */
  this.lastLit_ = undefined;

  /**
   * @private {number}
   */
  this.lastDist_ = undefined;

  /**
   * @private {number}
   */
  this.lastFlags_ = undefined;

  /**
   * @private {number}
   */
  this.flags_ = undefined;

  /**
   * @private {number}
   */
  this.flagBit_ = undefined;

  /**
   * @private {number}
   */
  this.optLen_ = undefined;

  /**
   * @private {number}
   */
  this.staticLen_ = undefined;

  /**
   * @private {Array.<number>}
   */
  this.deflateData_ = null;

  /**
   * @private {number}
   */
  this.deflatePos_ = undefined;
};


/**
 * Sliding Window size.
 * @const {number}
 */
npf.arch.deflate.Deflator.WSIZE = 32768;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.STORED_BLOCK = 0;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.STATIC_TREES = 1;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.DYN_TREES = 2;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.DEFAULT_LEVEL = 6;

/**
 * @const {boolean}
 */
npf.arch.deflate.Deflator.FULL_SEARCH = false;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.OUTBUFSIZ = 1024 * 8;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.WINDOW_SIZE = 2 * npf.arch.deflate.Deflator.WSIZE;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.MIN_MATCH = 3;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.MAX_MATCH = 258;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.BITS = 16;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.LIT_BUFSIZE = 0x2000;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.HASH_BITS = 15;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.DIST_BUFSIZE = npf.arch.deflate.Deflator.LIT_BUFSIZE;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.HASH_SIZE = 1 << npf.arch.deflate.Deflator.HASH_BITS;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.HASH_MASK = npf.arch.deflate.Deflator.HASH_SIZE - 1;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.WMASK = npf.arch.deflate.Deflator.WSIZE - 1;

/**
 * Tail of hash chains
 * @const {number}
 */
npf.arch.deflate.Deflator.NIL = 0;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.TOO_FAR = 4096;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.MIN_LOOKAHEAD =
  npf.arch.deflate.Deflator.MAX_MATCH + npf.arch.deflate.Deflator.MIN_MATCH + 1;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.MAX_DIST =
  npf.arch.deflate.Deflator.WSIZE - npf.arch.deflate.Deflator.MIN_LOOKAHEAD;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.SMALLEST = 1;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.MAX_BITS = 15;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.MAX_BL_BITS = 7;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.LENGTH_CODES = 29;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.LITERALS = 256;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.END_BLOCK = 256;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.L_CODES =
  npf.arch.deflate.Deflator.LITERALS + 1 + npf.arch.deflate.Deflator.LENGTH_CODES;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.D_CODES = 30;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.BL_CODES = 19;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.REP_3_6 = 16;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.REPZ_3_10 = 17;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.REPZ_11_138 = 18;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.HEAP_SIZE = 2 * npf.arch.deflate.Deflator.L_CODES + 1;

/**
 * @const {number}
 */
npf.arch.deflate.Deflator.H_SHIFT = parseInt(
  (npf.arch.deflate.Deflator.HASH_BITS + npf.arch.deflate.Deflator.MIN_MATCH - 1) /
  npf.arch.deflate.Deflator.MIN_MATCH, 10
);

/**
 * Bit size of this.biBuf_.
 * @const {number}
 */
npf.arch.deflate.Deflator.BUFFER_SIZE = 16;

/**
 * @private {!Array.<number>}
 */
npf.arch.deflate.Deflator.extraLbits_ = [
  0, 0, 0, 0, 0, 0, 0, 0,
  1, 1, 1, 1,
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4,
  5, 5, 5, 5,
  0
];

/**
 * @private {!Array.<number>}
 */
npf.arch.deflate.Deflator.extraDbits_ = [
  0, 0, 0, 0,
  1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6,
  7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12,
  13, 13
];

/**
 * @private {!Array.<number>}
 */
npf.arch.deflate.Deflator.extraBlbits_ = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];

/**
 * @private {!Array.<number>}
 */
npf.arch.deflate.Deflator.blOrder_ = [
  16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

/**
 * @private {!Array.<npf.arch.deflate.deflator.DeflateConfiguration>}
 */
npf.arch.deflate.Deflator.configurationTable_ = [
  new npf.arch.deflate.deflator.DeflateConfiguration(0, 0, 0, 0),
  new npf.arch.deflate.deflator.DeflateConfiguration(4, 4, 8, 4),
  new npf.arch.deflate.deflator.DeflateConfiguration(4, 5, 16, 8),
  new npf.arch.deflate.deflator.DeflateConfiguration(4, 6, 32, 32),
  new npf.arch.deflate.deflator.DeflateConfiguration(4, 4, 16, 16),
  new npf.arch.deflate.deflator.DeflateConfiguration(8, 16, 32, 32),
  new npf.arch.deflate.deflator.DeflateConfiguration(8, 16, 128, 128),
  new npf.arch.deflate.deflator.DeflateConfiguration(8, 32, 128, 256),
  new npf.arch.deflate.deflator.DeflateConfiguration(32, 128, 258, 1024),
  new npf.arch.deflate.deflator.DeflateConfiguration(32, 258, 258, 4096)
];


/**
 * @param {number=} opt_level
 * @private
 */
npf.arch.deflate.Deflator.prototype.deflateStart_ = function(opt_level) {
  var i;
  /** @type {number} */
  var level;

  if (opt_level) {
    level = npf.arch.deflate.Deflator.DEFAULT_LEVEL;
  } else if (opt_level < 1) {
    level = 1;
  } else if (opt_level > 9) {
    level = 9;
  }

  this.comprLevel_ = level;
  this.initFlag_ = false;
  this.eofile_ = false;

  if (this.outBuf_ !== null) {
    return;
  }

  this.freeQueue_ = null;
  this.qhead_ = null;
  this.qtail_ = null;
  this.outBuf_ = []; // new Array(OUTBUFSIZ);
                     // this.outBuf_.length never called
  this.window_ = []; // new Array(npf.arch.deflate.Deflator.WINDOW_SIZE);
                     // this.window_.length never called
  this.dBuf_ = []; // new Array(npf.arch.deflate.Deflator.DIST_BUFSIZE);
                   // this.dBuf_.length never called
  this.lBuf_ = []; // new Array(INBUFSIZ + INBUF_EXTRA);
                   // this.lBuf_.length never called
  this.prev_ = []; // new Array(1 << npf.arch.deflate.Deflator.BITS);
                   // this.prev_.length never called
  this.dynLtree_ = [];
  this.dynDtree_ = [];
  this.staticLtree_ = [];
  this.staticDtree_ = [];
  this.blTree_ = [];

  for (i = 0; i < npf.arch.deflate.Deflator.HEAP_SIZE; i++) {
    this.dynLtree_[i] = new npf.arch.deflate.deflator.DeflateCt();
  }

  for (i = 0; i < 2 * npf.arch.deflate.Deflator.D_CODES + 1; i++) {
    this.dynDtree_[i] = new npf.arch.deflate.deflator.DeflateCt();
  }

  for (i = 0; i < npf.arch.deflate.Deflator.L_CODES + 2; i++) {
    this.staticLtree_[i] = new npf.arch.deflate.deflator.DeflateCt();
  }

  for (i = 0; i < npf.arch.deflate.Deflator.D_CODES; i++) {
    this.staticDtree_[i] = new npf.arch.deflate.deflator.DeflateCt();
  }

  for (i = 0; i < 2 * npf.arch.deflate.Deflator.BL_CODES + 1; i++) {
    this.blTree_[i] = new npf.arch.deflate.deflator.DeflateCt();
  }

  this.lDesc_ = new npf.arch.deflate.deflator.DeflateTreeDesc();
  this.dDesc_ = new npf.arch.deflate.deflator.DeflateTreeDesc();
  this.blDesc_ = new npf.arch.deflate.deflator.DeflateTreeDesc();
  this.blCount_ = []; // new Array(npf.arch.deflate.Deflator.MAX_BITS+1);
                      // this.blCount_.length never called
  this.heap_ = []; // new Array(2*npf.arch.deflate.Deflator.L_CODES+1);
                   // this.heap_.length never called
  this.depth_ = []; // new Array(2*npf.arch.deflate.Deflator.L_CODES+1);
                    // this.depth_.length never called
  this.lengthCode_ = [];
        // new Array(npf.arch.deflate.Deflator.MAX_MATCH -
        // npf.arch.deflate.Deflator.MIN_MATCH+1);
        // this.lengthCode_.length never called
  this.distCode_ = []; // new Array(512);
                       // this.distCode_.length never called
  this.baseLength_ = []; // new Array(npf.arch.deflate.Deflator.LENGTH_CODES);
                         // this.baseLength_.length never called
  this.baseDist_ = []; // new Array(npf.arch.deflate.Deflator.D_CODES);
                       // this.baseDist_.length never called
  this.flagBuf_ = [];
          // new Array(parseInt(npf.arch.deflate.Deflator.LIT_BUFSIZE / 8, 10));
          // this.flagBuf_.length never called
};

/**
 * @private
 */
npf.arch.deflate.Deflator.prototype.deflateEnd_ = function() {
  this.freeQueue_ = null;
  this.qhead_ = null;
  this.qtail_ = null;
  this.outBuf_ = null;
  this.window_ = null;
  this.dBuf_ = null;
  this.lBuf_ = null;
  this.prev_ = null;
  this.dynLtree_ = null;
  this.dynDtree_ = null;
  this.staticLtree_ = null;
  this.staticDtree_ = null;
  this.blTree_ = null;
  this.lDesc_ = null;
  this.dDesc_ = null;
  this.blDesc_ = null;
  this.blCount_ = null;
  this.heap_ = null;
  this.depth_ = null;
  this.lengthCode_ = null;
  this.distCode_ = null;
  this.baseLength_ = null;
  this.baseDist_ = null;
  this.flagBuf_ = null;
};

/**
 * @param {npf.arch.deflate.deflator.DeflateBuffer} p
 * @private
 */
npf.arch.deflate.Deflator.prototype.reuseQueue_ = function(p) {
  p.next = this.freeQueue_;
  this.freeQueue_ = p;
};

/**
 * @return {npf.arch.deflate.deflator.DeflateBuffer}
 * @private
 */
npf.arch.deflate.Deflator.prototype.newQueue_ = function() {
  /** @type {npf.arch.deflate.deflator.DeflateBuffer} */
  var p = null;

  if (goog.isNull(this.freeQueue_)) {
    p = new npf.arch.deflate.deflator.DeflateBuffer();
  } else {
    p = this.freeQueue_;
    this.freeQueue_ = this.freeQueue_.next;
  }

  p.next = null;
  p.len = 0;
  p.off = 0;

  return p;
};

/**
 * @param {number} i
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.head1_ = function(i) {
  return this.prev_[npf.arch.deflate.Deflator.WSIZE + i];
};

/**
 * @param {number} i
 * @param {number} val
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.head2_ = function(i, val) {
  this.prev_[npf.arch.deflate.Deflator.WSIZE + i] = val;

  return this.prev_[npf.arch.deflate.Deflator.WSIZE + i];
};

/**
 * Used for the compressed output, put_ubyte for the
 * uncompressed output. However unlzw() uses this.window_ for its
 * suffix table instead of its output buffer, so it does not use put_ubyte
 * (to be cleaned up).
 * @param {number} c
 * @private
 */
npf.arch.deflate.Deflator.prototype.putByte_ = function(c) {
  this.outBuf_[this.outoff_ + this.outcnt_++] = c;

  if (this.outoff_ + this.outcnt_ === npf.arch.deflate.Deflator.OUTBUFSIZ) {
    this.qoutbuf_();
  }
};

/**
 * Output a 16 bit value, lsb first.
 * @param {number} w
 * @private
 */
npf.arch.deflate.Deflator.prototype.putShort_ = function(w) {
  w &= 0xffff;

  if (this.outoff_ + this.outcnt_ < npf.arch.deflate.Deflator.OUTBUFSIZ - 2) {
    this.outBuf_[this.outoff_ + this.outcnt_++] = (w & 0xff);
    this.outBuf_[this.outoff_ + this.outcnt_++] = (w >>> 8);
  } else {
    this.putByte_(w & 0xff);
    this.putByte_(w >>> 8);
  }
};

/**
 * Insert string s in the dictionary and set match_head to the previous head
 * of the hash chain (the most recent string with same hash key). Return
 * the previous length of the hash chain.
 * IN  assertion: all calls to to this.insertString_ are made with consecutive
 *    input characters and the first npf.arch.deflate.Deflator.MIN_MATCH bytes of s
 *    are valid (except for the last npf.arch.deflate.Deflator.MIN_MATCH-1 bytes
 *    of the input file).
 * @private
 */
npf.arch.deflate.Deflator.prototype.insertString_ = function() {
  this.insH_ = (
    (this.insH_ << npf.arch.deflate.Deflator.H_SHIFT) ^
    (this.window_[this.strStart_ + npf.arch.deflate.Deflator.MIN_MATCH - 1] & 0xff)
  ) & npf.arch.deflate.Deflator.HASH_MASK;
  this.hashHead_ = this.head1_(this.insH_);
  this.prev_[this.strStart_ & npf.arch.deflate.Deflator.WMASK] = this.hashHead_;
  this.head2_(this.insH_, this.strStart_);
}

/**
 * Send a code of the given tree. c and tree must not have side effects
 * @param {number} c
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} tree
 * @private
 */
npf.arch.deflate.Deflator.prototype.sendCode_ = function(c, tree) {
  this.sendBits_(tree[c].fc, tree[c].dl);
};

/**
 * Mapping from a distance to a distance code. dist is the distance - 1 and
 * must not have side effects. this.distCode_[256] and this.distCode_[257]
 * are never used.
 * @param {number} dist
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.dCode_ = function(dist) {
  return (
    dist < 256 ? this.distCode_[dist] : this.distCode_[256 + (dist >> 7)]
  ) & 0xff;
}

/**
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} tree
 * @param {number} n
 * @param {number} m
 * @return {boolean}
 * @private
 */
npf.arch.deflate.Deflator.prototype.smaller_ = function(tree, n, m) {
  return tree[n].fc < tree[m].fc ||
    (tree[n].fc === tree[m].fc && this.depth_[n] <= this.depth_[m]);
};

/**
 * Read string data.
 * @param {Array.<number>} buff
 * @param {number} offset
 * @param {number} n
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.readBuff_ = function(buff, offset, n) {
  /** @type {number} */
  var i;

  for (i = 0; i < n && this.deflatePos_ < this.deflateData_.length; i++) {
    buff[offset + i] = this.deflateData_[this.deflatePos_++] & 0xff;
  }

  return i;
};

/**
 * Initialize the "longest match" routines for a new file
 * @private
 */
npf.arch.deflate.Deflator.prototype.lmInit_ = function() {
  var j;

  // Initialize the hash table. */
  for (j = 0; j < npf.arch.deflate.Deflator.HASH_SIZE; j++) {
    // this.head2_(j, npf.arch.deflate.Deflator.NIL);
    this.prev_[npf.arch.deflate.Deflator.WSIZE + j] = 0;
  }
  // this.prev_ will be initialized on the fly */

  // Set the default configuration parameters:
  this.maxLazyMatch_ =
    npf.arch.deflate.Deflator.configurationTable_[this.comprLevel_].maxLazy;
  this.goodMatch_ =
    npf.arch.deflate.Deflator.configurationTable_[this.comprLevel_].goodLength;

  if (!npf.arch.deflate.Deflator.FULL_SEARCH) {
    this.niceMatch_ =
      npf.arch.deflate.Deflator.configurationTable_[this.comprLevel_].niceLength;
  }

  this.maxChainLength_ =
    npf.arch.deflate.Deflator.configurationTable_[this.comprLevel_].maxChain;

  this.strStart_ = 0;
  this.blockStart_ = 0;

  this.lookAhead_ = this.readBuff_(this.window_, 0, 2 * npf.arch.deflate.Deflator.WSIZE);

  if (this.lookAhead_ <= 0) {
    this.eofile_ = true;
    this.lookAhead_ = 0;

    return;
  }

  this.eofile_ = false;

  // Make sure that we always have enough this.lookAhead_. This is important
  // if input comes from a device such as a tty.
  while (this.lookAhead_ < npf.arch.deflate.Deflator.MIN_LOOKAHEAD && !this.eofile_) {
    this.fillWindow_();
  }

  // If this.lookAhead_ < npf.arch.deflate.Deflator.MIN_MATCH, this.insH_ is garbage,
  // but this is not important since only literal bytes will be emitted.
  this.insH_ = 0;

  for (j = 0; j < npf.arch.deflate.Deflator.MIN_MATCH - 1; j++) {
    // UPDATE_HASH(this.insH_, this.window_[j]);
    this.insH_ = (
      (this.insH_ << npf.arch.deflate.Deflator.H_SHIFT) ^ (this.window_[j] & 0xff)
    ) & npf.arch.deflate.Deflator.HASH_MASK;
  }
};

/**
 * Set this.matchStart_ to the longest match starting at the given string and
 * return its length. Matches shorter or equal to this.prevLength_ are discarded,
 * in which case the result is equal to this.prevLength_ and this.matchStart_ is
 * garbage.
 * IN assertions: curMatch is the head of the hash chain for the current
 *   string (this.strStart_) and its distance is <= npf.arch.deflate.Deflator.MAX_DIST,
 *   and this.prevLength_ >= 1
 * @param {number} curMatch
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.longestMatch_ = function(curMatch) {
  /**
   * Max hash chain length.
   * @type {number}
   */
  var chainLength = this.maxChainLength_;

  /**
   * Current string.
   * @type {number}
   */
  var scanp = this.strStart_;

  /**
   * Matched string.
   * @type {number}
   */
  var matchp;

  var bestLen = this.prevLength_; // best match length so far

  // Stop when curMatch becomes <= limit. To simplify the code,
  // we prevent matches with the string of this.window_ index 0.
  var limit = this.strStart_ > npf.arch.deflate.Deflator.MAX_DIST
    ? this.strStart_ - npf.arch.deflate.Deflator.MAX_DIST : npf.arch.deflate.Deflator.NIL;

  var strendp = this.strStart_ + npf.arch.deflate.Deflator.MAX_MATCH;
  var scanEnd1 = this.window_[scanp + bestLen - 1];
  var scanEnd = this.window_[scanp + bestLen];

  // Do not waste too much time if we already have a good match: */
  if (this.prevLength_ >= this.goodMatch_) {
    chainLength >>= 2;
  }

  // Assert(encoder->this.strStart_ <= npf.arch.deflate.Deflator.WINDOW_SIZE -
  // npf.arch.deflate.Deflator.MIN_LOOKAHEAD, "insufficient this.lookAhead_");

  do {
    // Assert(curMatch < encoder->this.strStart_, "no future");
    matchp = curMatch;

    // Skip to next match if the match length cannot increase
    // or if the match length is less than 2:
    if (
      this.window_[matchp + bestLen] !== scanEnd  ||
      this.window_[matchp + bestLen - 1] !== scanEnd1 ||
      this.window_[matchp] !== this.window_[scanp] ||
      this.window_[++matchp] !== this.window_[scanp + 1]
    ) {
      continue;
    }

    // The check at bestLen-1 can be removed because it will be made
    // again later. (This heuristic is not always a win.)
    // It is not necessary to compare scan[2] and match[2] since they
    // are always equal when the other bytes match, given that
    // the hash keys are equal and that npf.arch.deflate.Deflator.HASH_BITS >= 8.
    scanp += 2;
    matchp++;

    // We check for insufficient this.lookAhead_ only every 8th comparison;
    // the 256th check will be made at this.strStart_+258.
    while (scanp < strendp) {
      var broke = false;

      for (var i = 0; i < 8; i++) {
        scanp += 1;
        matchp += 1;

        if (this.window_[scanp] !== this.window_[matchp]) {
          broke = true;
          break;
        }
      }

      if (broke) {
        break;
      }
    }

    /**
     * Length of current match.
     * @type {number}
     */
    var len = npf.arch.deflate.Deflator.MAX_MATCH - (strendp - scanp);
    scanp = strendp - npf.arch.deflate.Deflator.MAX_MATCH;

    if (len > bestLen) {
      this.matchStart_ = curMatch;
      bestLen = len;

      if (npf.arch.deflate.Deflator.FULL_SEARCH) {
        if (len >= npf.arch.deflate.Deflator.MAX_MATCH) {
          break;
        }
      } else {
        if (len >= this.niceMatch_) {
          break;
        }
      }

      scanEnd1 = this.window_[scanp + bestLen - 1];
      scanEnd = this.window_[scanp + bestLen];
    }
  } while (
    (curMatch = this.prev_[curMatch & npf.arch.deflate.Deflator.WMASK]) >
      limit && --chainLength !== 0
  );

  return bestLen;
};

/**
 * Fill the window when the this.lookAhead_ becomes insufficient.
 * Updates this.strStart_ and this.lookAhead_, and sets this.eofile_
 * if end of input file.
 * IN assertion: this.lookAhead_ < npf.arch.deflate.Deflator.MIN_LOOKAHEAD &&
 *    this.strStart_ + this.lookAhead_ > 0
 * OUT assertions: at least one byte has been read, or this.eofile_ is set;
 *    file reads are performed for at least two bytes (required for the
 *    translate_eol option).
 * @private
 */
npf.arch.deflate.Deflator.prototype.fillWindow_ = function() {
  var n;
  var m;

  // Amount of free space at the end of the window.
  var more = npf.arch.deflate.Deflator.WINDOW_SIZE - this.lookAhead_ -
    this.strStart_;

  // If the window is almost full and there is insufficient this.lookAhead_,
  // move the upper half to the lower one to make room in the upper half.
  if (more === -1) {
    // Very unlikely, but possible on 16 bit machine if this.strStart_ == 0
    // and this.lookAhead_ == 1 (input done one byte at time)
    more--;
  } else if (
    this.strStart_ >= npf.arch.deflate.Deflator.WSIZE +
      npf.arch.deflate.Deflator.MAX_DIST
  ) {
    // By the IN assertion, the window is not empty so we can't confuse
    // more == 0 with more == 64K on a 16 bit machine.
    // Assert(npf.arch.deflate.Deflator.WINDOW_SIZE == (ulg)2*WSIZE,
    // "no sliding with BIG_MEM");

    // System.arraycopy(this.window_, WSIZE, this.window_, 0, WSIZE);
    for (n = 0; n < npf.arch.deflate.Deflator.WSIZE; n++) {
      this.window_[n] = this.window_[n + npf.arch.deflate.Deflator.WSIZE];
    }

    this.matchStart_ -= npf.arch.deflate.Deflator.WSIZE;
    /* we now have this.strStart_ >= npf.arch.deflate.Deflator.MAX_DIST: */
    this.strStart_   -= npf.arch.deflate.Deflator.WSIZE;
    this.blockStart_ -= npf.arch.deflate.Deflator.WSIZE;

    for (n = 0; n < npf.arch.deflate.Deflator.HASH_SIZE; n++) {
      m = this.head1_(n);
      this.head2_(
        n, m >= npf.arch.deflate.Deflator.WSIZE
          ? m - npf.arch.deflate.Deflator.WSIZE : npf.arch.deflate.Deflator.NIL);
    }

    for (n = 0; n < npf.arch.deflate.Deflator.WSIZE; n++) {
      // If n is not on any hash chain, this.prev_[n] is garbage but
      // its value will never be used.
      m = this.prev_[n];
      this.prev_[n] = m >= npf.arch.deflate.Deflator.WSIZE
        ? m - npf.arch.deflate.Deflator.WSIZE
        : npf.arch.deflate.Deflator.NIL;
    }

    more += npf.arch.deflate.Deflator.WSIZE;
  }

  // At this point, more >= 2
  if (!this.eofile_) {
    n = this.readBuff_(this.window_, this.strStart_ + this.lookAhead_, more);

    if (n <= 0) {
      this.eofile_ = true;
    } else {
      this.lookAhead_ += n;
    }
  }
};

/**
 * Processes a new input file and return its compressed length. This
 * function does not perform lazy evaluationof matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 * @private
 */
npf.arch.deflate.Deflator.prototype.deflateFast_ = function() {
  while (this.lookAhead_ !== 0 && goog.isNull(this.qhead_)) {
    var flush; // set if current block must be flushed

    // Insert the string this.window_[this.strStart_ .. this.strStart_+2] in the
    // dictionary, and set this.hashHead_ to the head of the hash chain:
    this.insertString_();

    // Find the longest match, discarding those <= this.prevLength_.
    // At this point we have always this.matchLength_ <
    // npf.arch.deflate.Deflator.MIN_MATCH
    if (
      this.hashHead_ !== npf.arch.deflate.Deflator.NIL &&
      this.strStart_ - this.hashHead_ <= npf.arch.deflate.Deflator.MAX_DIST
    ) {
      // To simplify the code, we prevent matches with the string
      // of window index 0 (in particular we have to avoid a match
      // of the string with itself at the start of the input file).
      this.matchLength_ = this.longestMatch_(this.hashHead_);
      // this.longestMatch_() sets this.matchStart_ */
      if (this.matchLength_ > this.lookAhead_) {
        this.matchLength_ = this.lookAhead_;
      }
    }
    if (this.matchLength_ >= npf.arch.deflate.Deflator.MIN_MATCH) {
      // check_match(this.strStart_, this.matchStart_, this.matchLength_);

      flush = this.ctTally_(this.strStart_ - this.matchStart_,
        this.matchLength_ - npf.arch.deflate.Deflator.MIN_MATCH);
      this.lookAhead_ -= this.matchLength_;

      // Insert new strings in the hash table only if the match length
      // is not too large. This saves time but degrades compression.
      if (this.matchLength_ <= this.maxLazyMatch_) {
        this.matchLength_--; // string at this.strStart_ already in hash table
        do {
          this.strStart_++;
          this.insertString_();
          // this.strStart_ never exceeds WSIZE-npf.arch.deflate.Deflator.MAX_MATCH,
          // so there are always npf.arch.deflate.Deflator.MIN_MATCH bytes ahead.
          // If this.lookAhead_ < npf.arch.deflate.Deflator.MIN_MATCH these bytes
          // are garbage, but it does not matter since the next
          // this.lookAhead_ bytes will be emitted as literals.
        } while (--this.matchLength_ !== 0);

        this.strStart_++;
      } else {
        this.strStart_ += this.matchLength_;
        this.matchLength_ = 0;
        this.insH_ = this.window_[this.strStart_] & 0xff;
        // UPDATE_HASH(this.insH_, this.window_[this.strStart_ + 1]);
        this.insH_ = (
          (this.insH_ << npf.arch.deflate.Deflator.H_SHIFT) ^
          (this.window_[this.strStart_ + 1] & 0xff)
        ) & npf.arch.deflate.Deflator.HASH_MASK;

      //#if npf.arch.deflate.Deflator.MIN_MATCH !== 3
      //    Call UPDATE_HASH() npf.arch.deflate.Deflator.MIN_MATCH-3 more times
      //#endif

      }
    } else {
      // No match, output a literal byte */
      flush = this.ctTally_(0, this.window_[this.strStart_] & 0xff);
      this.lookAhead_--;
      this.strStart_++;
    }

    if (flush) {
      this.flushBlock_(0);
      this.blockStart_ = this.strStart_;
    }

    // Make sure that we always have enough this.lookAhead_, except
    // at the end of the input file. We need npf.arch.deflate.Deflator.MAX_MATCH bytes
    // for the next match, plus npf.arch.deflate.Deflator.MIN_MATCH bytes to insert the
    // string following the next match.
    while (this.lookAhead_ < npf.arch.deflate.Deflator.MIN_LOOKAHEAD && !this.eofile_) {
      this.fillWindow_();
    }
  }
};

/**
 * @private
 */
npf.arch.deflate.Deflator.prototype.deflateBetter_ = function() {
  // Process the input block. */
  while (this.lookAhead_ !== 0 && goog.isNull(this.qhead_)) {
    // Insert the string this.window_[this.strStart_ .. this.strStart_+2] in the
    // dictionary, and set this.hashHead_ to the head of the hash chain:
    this.insertString_();

    // Find the longest match, discarding those <= this.prevLength_.
    this.prevLength_ = this.matchLength_;
    this.prevMatch_ = this.matchStart_;
    this.matchLength_ = npf.arch.deflate.Deflator.MIN_MATCH - 1;

    if (
      this.hashHead_ !== npf.arch.deflate.Deflator.NIL &&
      this.prevLength_ < this.maxLazyMatch_ &&
      this.strStart_ - this.hashHead_ <= npf.arch.deflate.Deflator.MAX_DIST
    ) {
      // To simplify the code, we prevent matches with the string
      // of window index 0 (in particular we have to avoid a match
      // of the string with itself at the start of the input file).
      this.matchLength_ = this.longestMatch_(this.hashHead_);

      // this.longestMatch_() sets this.matchStart_ */
      if (this.matchLength_ > this.lookAhead_) {
        this.matchLength_ = this.lookAhead_;
      }

      // Ignore a length 3 match if it is too distant: */
      if (
        this.matchLength_ === npf.arch.deflate.Deflator.MIN_MATCH &&
        this.strStart_ - this.matchStart_ > npf.arch.deflate.Deflator.TOO_FAR
      ) {
        // If this.prevMatch_ is also npf.arch.deflate.Deflator.MIN_MATCH,
        // this.matchStart_ is garbage but we will ignore the current
        // match anyway.
        this.matchLength_--;
      }
    }

    // If there was a match at the previous step and the current
    // match is not better, output the previous match:
    if (
      this.prevLength_ >= npf.arch.deflate.Deflator.MIN_MATCH &&
      this.matchLength_ <= this.prevLength_
    ) {
      var flush; // set if current block must be flushed

      // check_match(this.strStart_ - 1, this.prevMatch_, this.prevLength_);
      flush = this.ctTally_(this.strStart_ - 1 - this.prevMatch_,
        this.prevLength_ - npf.arch.deflate.Deflator.MIN_MATCH);

      // Insert in hash table all strings up to the end of the match.
      // this.strStart_-1 and this.strStart_ are already inserted.
      this.lookAhead_ -= this.prevLength_ - 1;
      this.prevLength_ -= 2;

      do {
        this.strStart_++;
        this.insertString_();
        // this.strStart_ never exceeds WSIZE-npf.arch.deflate.Deflator.MAX_MATCH,
        // so there are always npf.arch.deflate.Deflator.MIN_MATCH bytes ahead.
        // If this.lookAhead_ < npf.arch.deflate.Deflator.MIN_MATCH
        // these bytes are garbage, but it does not matter since the
        // next this.lookAhead_ bytes will always be emitted as literals.
      } while (--this.prevLength_ !== 0);

      this.matchAvailable_ = false;
      this.matchLength_ = npf.arch.deflate.Deflator.MIN_MATCH - 1;
      this.strStart_++;

      if (flush) {
        this.flushBlock_(0);
        this.blockStart_ = this.strStart_;
      }
    } else if (this.matchAvailable_) {
      // If there was no match at the previous position, output a
      // single literal. If there was a match but the current match
      // is longer, truncate the previous match to a single literal.
      if (this.ctTally_(0, this.window_[this.strStart_ - 1] & 0xff)) {
        this.flushBlock_(0);
        this.blockStart_ = this.strStart_;
      }

      this.strStart_++;
      this.lookAhead_--;
    } else {
      // There is no previous match to compare with, wait for
      // the next step to decide.
      this.matchAvailable_ = true;
      this.strStart_++;
      this.lookAhead_--;
    }

    // Make sure that we always have enough this.lookAhead_, except
    // at the end of the input file. We need npf.arch.deflate.Deflator.MAX_MATCH
    // bytes for the next match, plus npf.arch.deflate.Deflator.MIN_MATCH bytes
    // to insert the string following the next match.
    while (
      this.lookAhead_ < npf.arch.deflate.Deflator.MIN_LOOKAHEAD &&
      !this.eofile_
    ) {
      this.fillWindow_();
    }
  }
};

/**
 * @private
 */
npf.arch.deflate.Deflator.prototype.initDeflate_ = function() {
  if (!this.eofile_) {
    this.biBuf_ = 0;
    this.biValid_ = 0;
    this.ctInit_();
    this.lmInit_();

    this.qhead_ = null;
    this.outcnt_ = 0;
    this.outoff_ = 0;

    if (this.comprLevel_ <= 3) {
      this.prevLength_ = npf.arch.deflate.Deflator.MIN_MATCH - 1;
      this.matchLength_ = 0;
    } else {
      this.matchLength_ = npf.arch.deflate.Deflator.MIN_MATCH - 1;
      this.matchAvailable_ = false;
    }

    this.complete_ = false;
  }
};

/**
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} buffSize
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.deflateInternal_ = function(buff, off,
    buffSize) {
  if (!this.initFlag_) {
    this.initDeflate_();
    this.initFlag_ = true;

    if (this.lookAhead_ === 0) { // empty
      this.complete_ = true;

      return 0;
    }
  }

  var n = this.qcopy_(buff, off, buffSize);

  if (n === buffSize) {
    return buffSize;
  }

  if (this.complete_) {
    return n;
  }

  if (this.comprLevel_ <= 3) {
    // optimized for speed
    this.deflateFast_();
  } else {
    this.deflateBetter_();
  }

  if (this.lookAhead_ === 0) {
    if (this.matchAvailable_) {
      this.ctTally_(0, this.window_[this.strStart_ - 1] & 0xff);
    }

    this.flushBlock_(1);
    this.complete_ = true;
  }

  return n + this.qcopy_(buff, n + off, buffSize - n);
};

/**
 * @param {Array.<number>} buff
 * @param {number} off
 * @param {number} buffSize
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.qcopy_ = function(buff, off, buffSize) {
  /** @type {number} */
  var n = 0;
  /** @type {number} */
  var i;
  /** @type {number} */
  var j;

  while (!goog.isNull(this.qhead_) && n < buffSize) {
    i = buffSize - n;

    if (i > this.qhead_.len) {
      i = this.qhead_.len;
    }

    // System.arraycopy(this.qhead_.ptr, this.qhead_.off, buff, off + n, i);
    for (j = 0; j < i; j++) {
      buff[off + n + j] = this.qhead_.ptr[this.qhead_.off + j];
    }

    this.qhead_.off += i;
    this.qhead_.len -= i;
    n += i;

    if (this.qhead_.len === 0) {
      var p = this.qhead_;

      this.qhead_ = this.qhead_.next;
      this.reuseQueue_(p);
    }
  }

  if (n === buffSize) {
    return n;
  }

  if (this.outoff_ < this.outcnt_) {
    i = buffSize - n;

    if (i > this.outcnt_ - this.outoff_) {
      i = this.outcnt_ - this.outoff_;
    }

    // System.arraycopy(this.outBuf_, this.outoff_, buff, off + n, i);
    for (j = 0; j < i; j++) {
      buff[off + n + j] = this.outBuf_[this.outoff_ + j];
    }

    this.outoff_ += i;
    n += i;

    if (this.outcnt_ === this.outoff_) {
      this.outcnt_ = this.outoff_ = 0;
    }
  }

  return n;
};

/**
 * Allocate the match buffer, initialize the various tables and save the
 * location of the internal file attribute (ascii/binary) and method
 * (DEFLATE/STORE).
 * @private
 */
npf.arch.deflate.Deflator.prototype.ctInit_ = function() {
  var n; // iterates over tree elements
  var code; // code value

  if (this.staticDtree_[0].dl !== 0) {
    return; // this.ctInit_ already called
  }

  this.lDesc_.dynTree = this.dynLtree_;
  this.lDesc_.staticTree = this.staticLtree_;
  this.lDesc_.extraBits = npf.arch.deflate.Deflator.extraLbits_;
  this.lDesc_.extraBase = npf.arch.deflate.Deflator.LITERALS + 1;
  this.lDesc_.elems = npf.arch.deflate.Deflator.L_CODES;
  this.lDesc_.maxLength = npf.arch.deflate.Deflator.MAX_BITS;
  this.lDesc_.maxCode = 0;

  this.dDesc_.dynTree = this.dynDtree_;
  this.dDesc_.staticTree = this.staticDtree_;
  this.dDesc_.extraBits = npf.arch.deflate.Deflator.extraDbits_;
  this.dDesc_.extraBase = 0;
  this.dDesc_.elems = npf.arch.deflate.Deflator.D_CODES;
  this.dDesc_.maxLength = npf.arch.deflate.Deflator.MAX_BITS;
  this.dDesc_.maxCode = 0;

  this.blDesc_.dynTree = this.blTree_;
  this.blDesc_.staticTree = null;
  this.blDesc_.extraBits = npf.arch.deflate.Deflator.extraBlbits_;
  this.blDesc_.extraBase = 0;
  this.blDesc_.elems = npf.arch.deflate.Deflator.BL_CODES;
  this.blDesc_.maxLength = npf.arch.deflate.Deflator.MAX_BL_BITS;
  this.blDesc_.maxCode = 0;

  // Initialize the mapping length (0..255) -> length code (0..28)
  var length = 0;

  for (code = 0; code < npf.arch.deflate.Deflator.LENGTH_CODES - 1; code++) {
    this.baseLength_[code] = length;
    for (n = 0; n < (1 << npf.arch.deflate.Deflator.extraLbits_[code]); n++) {
      this.lengthCode_[length++] = code;
    }
  }
  // Assert (length === 256, "ct_init: length !== 256");

  // Note that the length 255 (match length 258) can be represented
  // in two different ways: code 284 + 5 bits or code 285, so we
  // overwrite this.lengthCode_[255] to use the best encoding:
  this.lengthCode_[length - 1] = code;

  // Initialize the mapping dist (0..32K) -> dist code (0..29) */
  var dist = 0;

  for (code = 0; code < 16; code++) {
    this.baseDist_[code] = dist;
    for (n = 0; n < (1 << npf.arch.deflate.Deflator.extraDbits_[code]); n++) {
      this.distCode_[dist++] = code;
    }
  }

  // Assert (dist === 256, "ct_init: dist !== 256");
  // from now on, all distances are divided by 128
  for (dist >>= 7; code < npf.arch.deflate.Deflator.D_CODES; code++) {
    this.baseDist_[code] = dist << 7;

    for (n = 0; n < (1 << (npf.arch.deflate.Deflator.extraDbits_[code] - 7)); n++) {
      this.distCode_[256 + dist++] = code;
    }
  }
  // Assert (dist === 256, "ct_init: 256+dist !== 512");

  // Construct the codes of the static literal tree
  for (var bits = 0; bits <= npf.arch.deflate.Deflator.MAX_BITS; bits++) {
    this.blCount_[bits] = 0;
  }

  n = 0;

  while (n <= 143) {
    this.staticLtree_[n++].dl = 8;
    this.blCount_[8]++;
  }

  while (n <= 255) {
    this.staticLtree_[n++].dl = 9;
    this.blCount_[9]++;
  }

  while (n <= 279) {
    this.staticLtree_[n++].dl = 7;
    this.blCount_[7]++;
  }

  while (n <= 287) {
    this.staticLtree_[n++].dl = 8;
    this.blCount_[8]++;
  }

  // Codes 286 and 287 do not exist, but we must include them in the
  // tree construction to get a canonical Huffman tree (longest code
  // all ones)
  this.genCodes_(this.staticLtree_, npf.arch.deflate.Deflator.L_CODES + 1);

  // The static distance tree is trivial: */
  for (n = 0; n < npf.arch.deflate.Deflator.D_CODES; n++) {
    this.staticDtree_[n].dl = 5;
    this.staticDtree_[n].fc = this.biReverse_(n, 5);
  }

  // Initialize the first block of the first file:
  this.initBlock_();
};

/**
 * Initialize a new block.
 * @private
 */
npf.arch.deflate.Deflator.prototype.initBlock_ = function() {
  var n; // iterates over tree elements

  // Initialize the trees.
  for (n = 0; n < npf.arch.deflate.Deflator.L_CODES;  n++) {
    this.dynLtree_[n].fc = 0;
  }

  for (n = 0; n < npf.arch.deflate.Deflator.D_CODES;  n++) {
    this.dynDtree_[n].fc = 0;
  }

  for (n = 0; n < npf.arch.deflate.Deflator.BL_CODES; n++) {
    this.blTree_[n].fc = 0;
  }

  this.dynLtree_[npf.arch.deflate.Deflator.END_BLOCK].fc = 1;
  this.optLen_ = 0;
  this.staticLen_ = 0;
  this.lastLit_ = 0;
  this.lastDist_ = 0;
  this.lastFlags_ = 0;
  this.flags_ = 0;
  this.flagBit_ = 1;
};

/**
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} tree tree to restore
 * @param {number} k node to move down
 * @private
 */
npf.arch.deflate.Deflator.prototype.pqdownheap_ = function(tree, k) {
  /** @type {number} */
  var v = this.heap_[k];
  /** @type {number} */
  var j = k << 1; // left son of k

  while (j <= this.heapLen_) {
    // Set j to the smallest of the two sons:
    if (
      j < this.heapLen_ &&
      this.smaller_(tree, this.heap_[j + 1], this.heap_[j])
    ) {
      j++;
    }

    // Exit if v is smaller than both sons
    if (this.smaller_(tree, v, this.heap_[j])) {
      break;
    }

    // Exchange v with the smallest son
    this.heap_[k] = this.heap_[j];
    k = j;

    // And continue down the tree, setting j to the left son of k
    j <<= 1;
  }

  this.heap_[k] = v;
};

/**
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, this.heap_[this.heapMax_] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array this.blCount_ contains the frequencies for each bit length.
 *     The length this.optLen_ is updated; this.staticLen_ is also updated
 *     if stree is not null.
 * @param {npf.arch.deflate.deflator.DeflateTreeDesc} desc
 * @private
 */
npf.arch.deflate.Deflator.prototype.genBitlen_ = function(desc) {
// the tree descriptor
  var tree = desc.dynTree;
  var extra = desc.extraBits;
  var base = desc.extraBase;
  var maxCode = desc.maxCode;
  var maxLength = desc.maxLength;
  var stree = desc.staticTree;
  var n; // iterate over the tree elements
  var bits; // bit length
  var overflow = 0; // number of elements with bit length too large

  for (bits = 0; bits <= npf.arch.deflate.Deflator.MAX_BITS; bits++) {
    this.blCount_[bits] = 0;
  }

  // In a first pass, compute the optimal bit lengths (which may
  // overflow in the case of the bit length tree).
  tree[this.heap_[this.heapMax_]].dl = 0; // root of the heap

  for (var h = this.heapMax_ + 1; h < npf.arch.deflate.Deflator.HEAP_SIZE; h++) {
    n = this.heap_[h];
    bits = tree[tree[n].dl].dl + 1;

    if (bits > maxLength) {
      bits = maxLength;
      overflow++;
    }

    tree[n].dl = bits;
    // We overwrite tree[n].dl which is no longer needed

    if (n > maxCode) {
      continue; // not a leaf node
    }

    this.blCount_[bits]++;

    /**
     * Extra bits.
     * @type {number}
     */
    var xbits = 0;

    if (n >= base) {
      xbits = extra[n - base];
    }

    var f = tree[n].fc; // frequency
    this.optLen_ += f * (bits + xbits);

    if (stree !== null) {
      this.staticLen_ += f * (stree[n].dl + xbits);
    }
  }

  if (overflow === 0) {
    return;
  }

  // This happens for example on obj2 and pic of the Calgary corpus

  // Find the first bit length which could increase:
  do {
    bits = maxLength - 1;

    while (this.blCount_[bits] === 0) {
      bits--;
    }

    this.blCount_[bits]--; // move one leaf down the tree
    this.blCount_[bits + 1] += 2; // move one overflow item as its brother
    this.blCount_[maxLength]--;
    // The brother of the overflow item also moves one step up,
    // but this does not affect this.blCount_[maxLength]
    overflow -= 2;
  } while (overflow > 0);

  // Now recompute all bit lengths, scanning in increasing frequency.
  // h is still equal to npf.arch.deflate.Deflator.HEAP_SIZE.
  // (It is simpler to reconstruct all lengths instead of fixing only
  // the wrong ones. This idea is taken from 'ar' written by Haruhiko Okumura.)
  for (bits = maxLength; bits !== 0; bits--) {
    n = this.blCount_[bits];

    while (n !== 0) {
      var m = this.heap_[--h];

      if (m > maxCode) {
        continue;
      }

      if (tree[m].dl !== bits) {
        this.optLen_ += (bits - tree[m].dl) * tree[m].fc;
        tree[m].fc = bits;
      }

      n--;
    }
  }
};

/**
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array this.blCount_ contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} tree the tree to decorate
 * @param {number} maxCode largest code with non-zero frequency
 * @private
 */
npf.arch.deflate.Deflator.prototype.genCodes_ = function(tree, maxCode) {
  var nextCode = []; // new Array(npf.arch.deflate.Deflator.MAX_BITS + 1);
                     // next code value for each bit length
  var code = 0; // running code value

  // The distribution counts are first used to generate the code values
  // without bit reversal.
  for (var bits = 1; bits <= npf.arch.deflate.Deflator.MAX_BITS; bits++) {
    code = ((code + this.blCount_[bits - 1]) << 1);
    nextCode[bits] = code;
  }

  // Check that the bit counts in this.blCount_ are consistent. The last code
  // must be all ones.
  // Assert (code + encoder->this.blCount_[npf.arch.deflate.Deflator.MAX_BITS]-1 ===
  // (1<<npf.arch.deflate.Deflator.MAX_BITS)-1, "inconsistent bit counts");
  // Tracev((stderr,"\ngen_codes: maxCode %d ", maxCode));

  for (var n = 0; n <= maxCode; n++) {
    var len = tree[n].dl;

    if (len === 0) {
      continue;
    }

    // Now reverse the bits
    tree[n].fc = this.biReverse_(nextCode[len]++, len);

    // Tracec(tree !== this.staticLtree_, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    // n, (isgraph(n) ? n : ' '), len, tree[n].fc, nextCode[len]-1));
  }
};

/**
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length this.optLen_ is updated;
 *     this.staticLen_ is also updated if stree is not null. The field maxCode
 *     is set.
 * @param {npf.arch.deflate.deflator.DeflateTreeDesc} desc
 * @private
 */
npf.arch.deflate.Deflator.prototype.buildTree_ = function(desc) {
  // the tree descriptor
  var tree = desc.dynTree;
  var stree = desc.staticTree;
  var elems = desc.elems;
  var n; // iterate over heap elements
  var maxCode = -1; // largest code with non zero frequency
  var node = elems; // next internal node of the tree

  // Construct the initial heap, with least frequent element in
  // this.heap_[npf.arch.deflate.Deflator.SMALLEST].
  // The sons of this.heap_[n] are this.heap_[2*n] and this.heap_[2*n+1].
  // this.heap_[0] is not used.
  this.heapLen_ = 0;
  this.heapMax_ = npf.arch.deflate.Deflator.HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n].fc !== 0) {
      this.heap_[++this.heapLen_] = maxCode = n;
      this.depth_[n] = 0;
    } else {
      tree[n].dl = 0;
    }
  }

  // The pkzip format requires that at least one distance code exists,
  // and that at least one bit should be sent even if there is only one
  // possible code. So to avoid special checks later on we force at least
  // two codes of non zero frequency.
  while (this.heapLen_ < 2) {
    var xnew = this.heap_[++this.heapLen_] = (maxCode < 2 ? ++maxCode : 0);
    tree[xnew].fc = 1;
    this.depth_[xnew] = 0;
    this.optLen_--;

    if (!goog.isNull(stree)) {
      this.staticLen_ -= stree[xnew].dl;
    }
    // new is 0 or 1 so it does not have extra bits
  }

  desc.maxCode = maxCode;

  // The elements this.heap_[this.heapLen_/2+1 .. this.heapLen_]
  // are leaves of the tree, establish sub-heaps of increasing lengths:
  for (n = this.heapLen_ >> 1; n >= 1; n--) {
    this.pqdownheap_(tree, n);
  }

  // Construct the Huffman tree by repeatedly combining the least two
  // frequent nodes.
  do {
    n = this.heap_[npf.arch.deflate.Deflator.SMALLEST];
    this.heap_[npf.arch.deflate.Deflator.SMALLEST] = this.heap_[this.heapLen_--];
    this.pqdownheap_(tree, npf.arch.deflate.Deflator.SMALLEST);

    // var m = node of next least frequency
    var m = this.heap_[npf.arch.deflate.Deflator.SMALLEST];

    // keep the nodes sorted by frequency
    this.heap_[--this.heapMax_] = n;
    this.heap_[--this.heapMax_] = m;

    // Create a new node father of n and m
    tree[node].fc = tree[n].fc + tree[m].fc;
    //  this.depth_[node] = (char)(MAX(this.depth_[n], this.depth_[m]) + 1);

    if (this.depth_[n] > this.depth_[m] + 1) {
      this.depth_[node] = this.depth_[n];
    } else {
      this.depth_[node] = this.depth_[m] + 1;
    }

    tree[n].dl = tree[m].dl = node;

    // and insert the new node in the heap
    this.heap_[npf.arch.deflate.Deflator.SMALLEST] = node++;
    this.pqdownheap_(tree, npf.arch.deflate.Deflator.SMALLEST);

  } while (this.heapLen_ >= 2);

  this.heap_[--this.heapMax_] = this.heap_[npf.arch.deflate.Deflator.SMALLEST];

  // At this point, the fields freq and dad are set. We can now
  // generate the bit lengths.
  this.genBitlen_(desc);

  // The field len is now set, we can generate the bit codes
  this.genCodes_(tree, maxCode);
};

/**
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree. Updates this.optLen_ to take into account the repeat
 * counts. (The contribution of the bit length codes will be added later
 * during the construction of this.blTree_.)
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} tree the tree to be scanned
 * @param {number} maxCode and its largest code of non zero frequency
 * @private
 */
npf.arch.deflate.Deflator.prototype.scanTree_ = function(tree, maxCode) {
  /**
   * Last emitted length.
   * @type {number}
   */
  var prevlen = -1;

  /**
   * Length of next code.
   * @type {number}
   */
  var nextlen = tree[0].dl;

  /**
   * Repeat count of the current code.
   * @type {number}
   */
  var count = 0;

  /**
   * Max repeat count.
   * @type {number}
   */
  var maxCount = 7;

  /**
   * Min repeat count.
   * @type {number}
   */
  var minCount = 4;

  if (nextlen === 0) {
    maxCount = 138;
    minCount = 3;
  }

  tree[maxCode + 1].dl = 0xffff; // guard

  for (var n = 0; n <= maxCode; n++) {
    /**
     * Length of current code.
     */
    var curlen = nextlen;
    nextlen = tree[n + 1].dl;

    if (++count < maxCount && curlen === nextlen) {
      continue;
    } else if (count < minCount) {
      this.blTree_[curlen].fc += count;
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        this.blTree_[curlen].fc++;
      }
      this.blTree_[npf.arch.deflate.Deflator.REP_3_6].fc++;
    } else if (count <= 10) {
      this.blTree_[npf.arch.deflate.Deflator.REPZ_3_10].fc++;
    } else {
      this.blTree_[npf.arch.deflate.Deflator.REPZ_11_138].fc++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      maxCount = 138;
      minCount = 3;
    } else if (curlen === nextlen) {
      maxCount = 6;
      minCount = 3;
    } else {
      maxCount = 7;
      minCount = 4;
    }
  }
};

/**
 * Send a literal or distance tree in compressed form, using the codes in
 * this.blTree_.
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} tree the tree to be scanned
 * @param {number} maxCode and its largest code of non zero frequency
 * @private
 */
npf.arch.deflate.Deflator.prototype.sendTree_ = function(tree, maxCode) {
  /**
   * Last emitted length.
   * @type {number}
   */
  var prevlen = -1;

  /**
   * Length of next code.
   * @type {number}
   */
  var nextlen = tree[0].dl;

  /**
   * Repeat count of the current code.
   * @type {number}
   */
  var count = 0;

  /**
   * Max repeat count.
   * @type {number}
   */
  var maxCount = 7;

  /**
   * Min repeat count.
   * @type {number}
   */
  var minCount = 4;

  // tree[maxCode+1].dl = -1; */  /* guard already set */
  if (nextlen === 0) {
    maxCount = 138;
    minCount = 3;
  }

  for (var n = 0; n <= maxCode; n++) {
    /**
     * Length of current code.
     * @type {number}
     */
    var curlen = nextlen;
    nextlen = tree[n + 1].dl;

    if (++count < maxCount && curlen === nextlen) {
      continue;
    } else if (count < minCount) {
      do {
        this.sendCode_(curlen, this.blTree_);
      } while (--count !== 0);
    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        this.sendCode_(curlen, this.blTree_);
        count--;
      }
    // Assert(count >= 3 && count <= 6, " 3_6?");
      this.sendCode_(npf.arch.deflate.Deflator.REP_3_6, this.blTree_);
      this.sendBits_(count - 3, 2);
    } else if (count <= 10) {
      this.sendCode_(npf.arch.deflate.Deflator.REPZ_3_10, this.blTree_);
      this.sendBits_(count - 3, 3);
    } else {
      this.sendCode_(npf.arch.deflate.Deflator.REPZ_11_138, this.blTree_);
      this.sendBits_(count - 11, 7);
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      maxCount = 138;
      minCount = 3;
    } else if (curlen === nextlen) {
      maxCount = 6;
      minCount = 3;
    } else {
      maxCount = 7;
      minCount = 4;
    }
  }
};

/**
 * Construct the Huffman tree for the bit lengths and return the index in
 * npf.arch.deflate.Deflator.blOrder_ of the last bit length code to send.
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.buildBlTree_ = function() {
  // Determine the bit length frequencies for literal and distance trees
  this.scanTree_(this.dynLtree_, this.lDesc_.maxCode);
  this.scanTree_(this.dynDtree_, this.dDesc_.maxCode);

  // Build the bit length tree:
  this.buildTree_(this.blDesc_);
  // this.optLen_ now includes the length of the tree representations, except
  // the lengths of the bit lengths codes and the 5+5+4 bits for the counts.

  // Determine the number of bit length codes to send. The pkzip format
  // requires that at least 4 bit length codes be sent. (appnote.txt says
  // 3 but the actual value used is 4.)

  var maxBlindex; // index of last bit length code of non zero freq

  for (maxBlindex = npf.arch.deflate.Deflator.BL_CODES - 1; maxBlindex >= 3; maxBlindex--) {
    if (this.blTree_[npf.arch.deflate.Deflator.blOrder_[maxBlindex]].dl !== 0) {
      break;
    }
  }

  // Update this.optLen_ to include the bit length tree and counts */
  this.optLen_ += 3 * (maxBlindex + 1) + 5 + 5 + 4;
  // Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  // encoder->this.optLen_, encoder->static_len));

  return maxBlindex;
};

/**
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 * @param {number} lcodes
 * @param {number} dcodes
 * @param {number} blcodes
 * @private
 */
npf.arch.deflate.Deflator.prototype.sendAllTrees_ = function(lcodes, dcodes,
    blcodes) {
  // Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  // Assert (lcodes <= npf.arch.deflate.Deflator.L_CODES &&
  // dcodes <= npf.arch.deflate.Deflator.D_CODES && blcodes <=
  // npf.arch.deflate.Deflator.BL_CODES, "too many codes");
  // Tracev((stderr, "\nbl counts: "));
  this.sendBits_(lcodes - 257, 5); // not +255 as stated in appnote.txt
  this.sendBits_(dcodes - 1,   5);
  this.sendBits_(blcodes - 4,  4); // not -3 as stated in appnote.txt

  for (var rank = 0; rank < blcodes; rank++) {
    // Tracev((stderr, "\nbl code %2d ", npf.arch.deflate.Deflator.blOrder_[rank]));
    this.sendBits_(this.blTree_[npf.arch.deflate.Deflator.blOrder_[rank]].dl, 3);
  }

  // send the literal tree
  this.sendTree_(this.dynLtree_, lcodes - 1);
  // send the distance tree
  this.sendTree_(this.dynDtree_, dcodes - 1);
};

/**
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and output the encoded block to the zip file.
 * @param {number} eof
 * @private
 */
npf.arch.deflate.Deflator.prototype.flushBlock_ = function(eof) {
  /**
   * Length of input block.
   * @type {number}
   */
  var storedLen = this.strStart_ - this.blockStart_;

  this.flagBuf_[this.lastFlags_] = this.flags_; // Save the flags
                                                // for the last 8 items

  // Construct the literal and distance trees
  this.buildTree_(this.lDesc_);
  // Tracev((stderr, "\nlit data: dyn %ld, stat %ld",
  // encoder->this.optLen_, encoder->static_len));

  this.buildTree_(this.dDesc_);
  // Tracev((stderr, "\ndist data: dyn %ld, stat %ld",
  // encoder->this.optLen_, encoder->static_len));
  // At this point, this.optLen_ and this.staticLen_ are the total bit lengths of
  // the compressed block data, excluding the tree representations.

  // Build the bit length tree for the above two trees, and get the index
  // in npf.arch.deflate.Deflator.blOrder_ of the last bit length code to send.

  /**
   * Index of last bit length code of non zero freq.
   * @type {number}
   */
  var maxBlindex = this.buildBlTree_();

 // Determine the best encoding. Compute first the block length in bytes
  var optLenb = (this.optLen_ + 3 + 7) >> 3;
  var staticLenb = (this.staticLen_ + 3 + 7) >> 3;

  // Trace((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u dist %u ",
  // optLenb, encoder->opt_len, staticLenb, encoder->static_len, storedLen,
  // encoder->this.lastLit_, encoder->this.lastDist_));

  if (staticLenb <= optLenb) {
    optLenb = staticLenb;
  }

  if (storedLen + 4 <= optLenb && this.blockStart_ >= 0) {
    // 4: two words for the lengths
    // The test buf !== NULL is only necessary
    // if npf.arch.deflate.Deflator.LIT_BUFSIZE > WSIZE.
    // Otherwise we can't have processed more than WSIZE input bytes since
    // the last block flush, because compression would have been
    // successful. If npf.arch.deflate.Deflator.LIT_BUFSIZE <= WSIZE,
    // it is never too late to transform a block into a stored block.

    /* send block type */
    this.sendBits_((npf.arch.deflate.Deflator.STORED_BLOCK << 1) + eof, 3);
    this.biWindup_();         /* align on byte boundary */
    this.putShort_(storedLen);
    this.putShort_(~storedLen);

    // copy block
    for (var i = 0; i < storedLen; i++) {
      this.putByte_(this.window_[this.blockStart_ + i]);
    }
  } else if (staticLenb === optLenb) {
    this.sendBits_((npf.arch.deflate.Deflator.STATIC_TREES << 1) + eof, 3);
    this.compressBlock_(this.staticLtree_, this.staticDtree_);
  } else {
    this.sendBits_((npf.arch.deflate.Deflator.DYN_TREES << 1) + eof, 3);
    this.sendAllTrees_(
      this.lDesc_.maxCode + 1, this.dDesc_.maxCode + 1, maxBlindex + 1);
    this.compressBlock_(this.dynLtree_, this.dynDtree_);
  }

  this.initBlock_();

  if (eof !== 0) {
    this.biWindup_();
  }
};

/**
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 * @param {number} dist distance of matched string
 * @param {number} lc (match length - npf.arch.deflate.Deflator.MIN_MATCH) or
 *                    unmatched char (if dist === 0)
 * @return {boolean}
 * @private
 */
npf.arch.deflate.Deflator.prototype.ctTally_ = function(dist, lc) {
  this.lBuf_[this.lastLit_++] = lc;

  if (dist === 0) {
    // lc is the unmatched char
    this.dynLtree_[lc].fc++;
  } else {
    // Here, lc is the match length - npf.arch.deflate.Deflator.MIN_MATCH
    dist--; // dist = match distance - 1
    // Assert((ush)dist < (ush)npf.arch.deflate.Deflator.MAX_DIST &&
    // (ush)lc <= (ush)(npf.arch.deflate.Deflator.MAX_MATCH-npf.arch.deflate.Deflator.MIN_MATCH) &&
    // (ush)this.dCode_(dist) < (ush)npf.arch.deflate.Deflator.D_CODES,  "ct_tally: bad match");

    this.dynLtree_[this.lengthCode_[lc] + npf.arch.deflate.Deflator.LITERALS + 1].fc++;
    this.dynDtree_[this.dCode_(dist)].fc++;

    this.dBuf_[this.lastDist_++] = dist;
    this.flags_ |= this.flagBit_;
  }

  this.flagBit_ <<= 1;

  // Output the flags if they fill a byte
  if ((this.lastLit_ & 7) === 0) {
    this.flagBuf_[this.lastFlags_++] = this.flags_;
    this.flags_ = 0;
    this.flagBit_ = 1;
  }

  // Try to guess if it is profitable to stop the current block here
  if (this.comprLevel_ > 2 && (this.lastLit_ & 0xfff) === 0) {
    // Compute an upper bound for the compressed length
    var outLength = this.lastLit_ * 8;
    var inLength = this.strStart_ - this.blockStart_;

    for (var dcode = 0; dcode < npf.arch.deflate.Deflator.D_CODES; dcode++) {
      outLength += this.dynDtree_[dcode].fc *
        (5 + npf.arch.deflate.Deflator.extraDbits_[dcode]);
    }

    outLength >>= 3;

    // Trace((stderr,"\nlast_lit %u, this.lastDist_ %u, in %ld, out ~%ld(%ld%%) ",
    // encoder->this.lastLit_, encoder->this.lastDist_, inLength, outLength,
    // 100L - outLength*100L/inLength));
    if (
      this.lastDist_ < parseInt(this.lastLit_ / 2, 10) &&
      outLength < parseInt(inLength / 2, 10)
    ) {
      return true;
    }
  }

  return (
    this.lastLit_ === npf.arch.deflate.Deflator.LIT_BUFSIZE - 1 ||
    this.lastDist_ === npf.arch.deflate.Deflator.DIST_BUFSIZE
  );
  // We avoid equality with npf.arch.deflate.Deflator.LIT_BUFSIZE because of wraparound
  // at 64K on 16 bit machines and because stored blocks are restricted to
  // 64K-1 bytes.
};

/**
 * Send the block data compressed using the given Huffman trees
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} ltree literal tree
 * @param {Array.<npf.arch.deflate.deflator.DeflateCt>} dtree distance tree
 * @private
 */
npf.arch.deflate.Deflator.prototype.compressBlock_ = function(ltree, dtree) {
  /**
   * Running index in this.lBuf_.
   * @type {number}
   */
  var lx = 0;

  /**
   * Running index in this.dBuf_.
   * @type {number}
   */
  var dx = 0;

  /**
   * Running index in this.flagBuf_.
   * @type {number}
   */
  var fx = 0;

  /**
   * Current flags.
   * @type {number}
   */
  var flag = 0;

  if (this.lastLit_ !== 0) {
    do {
      if ((lx & 7) === 0) {
        flag = this.flagBuf_[fx++];
      }

      /**
       * Match length or unmatched char (if dist === 0).
       * @type {number}
       */
      var lc = this.lBuf_[lx++] & 0xff;

      if ((flag & 1) === 0) {
        this.sendCode_(lc, ltree); /* send a literal byte */
        //  Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        // Here, lc is the match length - npf.arch.deflate.Deflator.MIN_MATCH

        /**
         * The code to send.
         * @type {number}
         */
        var code = this.lengthCode_[lc];

        // send the length code
        this.sendCode_(code + npf.arch.deflate.Deflator.LITERALS + 1, ltree);

        /**
         * Number of extra bits to send.
         * @type {number}
         */
        var extra = npf.arch.deflate.Deflator.extraLbits_[code];

        if (extra !== 0) {
          lc -= this.baseLength_[code];
          this.sendBits_(lc, extra); // send the extra length bits
        }

        /**
         * Distance of matched string.
         * @type {number}
         */
        var dist = this.dBuf_[dx++];

        // Here, dist is the match distance - 1
        code = this.dCode_(dist);
        //  Assert (code < npf.arch.deflate.Deflator.D_CODES, "bad d_code");

        this.sendCode_(code, dtree); // send the distance code
        extra = npf.arch.deflate.Deflator.extraDbits_[code];

        if (extra !== 0) {
          dist -= this.baseDist_[code];
          this.sendBits_(dist, extra); // send the extra distance bits
        }
      } // literal or match pair ?

      flag >>= 1;
    } while (lx < this.lastLit_);
  }

  this.sendCode_(npf.arch.deflate.Deflator.END_BLOCK, ltree);
};

/**
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 * @param {number} value value to send
 * @param {number} length number of bits
 * @private
 */
npf.arch.deflate.Deflator.prototype.sendBits_ = function(value, length) {
  // If not enough room in this.biBuf_, use (valid) bits from this.biBuf_ and
  // (16 - this.biValid_) bits from value, leaving (width - (16-this.biValid_))
  // unused bits in value.
  if (this.biValid_ > npf.arch.deflate.Deflator.BUFFER_SIZE - length) {
    this.biBuf_ |= (value << this.biValid_);
    this.putShort_(this.biBuf_);
    this.biBuf_ =
      (value >> (npf.arch.deflate.Deflator.BUFFER_SIZE - this.biValid_));
    this.biValid_ += length - npf.arch.deflate.Deflator.BUFFER_SIZE;
  } else {
    this.biBuf_ |= value << this.biValid_;
    this.biValid_ += length;
  }
};

/**
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 * @param {number} code the value to invert
 * @param {number} len its bit length
 * @return {number}
 * @private
 */
npf.arch.deflate.Deflator.prototype.biReverse_ = function(code, len) {
  var res = 0;

  do {
    res |= code & 1;
    code >>= 1;
    res <<= 1;
  } while (--len > 0);

  return res >> 1;
};

/**
 * Write out any remaining bits in an incomplete byte.
 * @private
 */
npf.arch.deflate.Deflator.prototype.biWindup_ = function() {
  if (this.biValid_ > 8) {
    this.putShort_(this.biBuf_);
  } else if (this.biValid_ > 0) {
    this.putByte_(this.biBuf_);
  }

  this.biBuf_ = 0;
  this.biValid_ = 0;
};

/**
 * @private
 */
npf.arch.deflate.Deflator.prototype.qoutbuf_ = function() {
  if (this.outcnt_ !== 0) {
    /** @type {npf.arch.deflate.deflator.DeflateBuffer} */
    var q = this.newQueue_();

    if (this.qhead_ === null) {
      this.qhead_ = this.qtail_ = q;
    } else {
      this.qtail_ = this.qtail_.next = q;
    }

    q.len = this.outcnt_ - this.outoff_;

    // System.arraycopy(this.outBuf_, this.outoff_, q.ptr, 0, q.len);
    for (var i = 0; i < q.len; i++) {
      q.ptr[i] = this.outBuf_[this.outoff_ + i];
    }

    this.outcnt_ = this.outoff_ = 0;
  }
};

/**
 * @param {Array.<number>} arr
 * @param {number=} opt_level
 * @return {!Array.<number>}
 */
npf.arch.deflate.Deflator.prototype.deflate = function(arr, opt_level) {
  this.deflateData_ = arr;
  this.deflatePos_ = 0;
  this.deflateStart_(opt_level);

  /** @type {!Array.<number>} */
  var buff = [];
  /** @type {number} */
  var i;

  do {
    i = this.deflateInternal_(buff, buff.length, 1024);
  } while (i > 0);

  this.deflateEnd_();
  this.deflateData_ = null; // G.C.

  return buff;
};
