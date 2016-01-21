goog.provide('npf.math.Rand19937');


/**
 * Генератор псевдослучайных чисел Mersenne Twister MT19937.
 * @constructor
 * @struct
 */
npf.math.Rand19937 = function() {
	/**
	 * The array for the state vector
	 * @private {Array}
	 */
	this._mt = new Array(npf.math.Rand19937.N);

	/**
	 * this._mti == npf.math.Rand19937.N + 1 means this._mt[npf.math.Rand19937.N]
	 * is not initialized
	 * @private {number}
	 */
	this._mti = npf.math.Rand19937.N + 1;
};


/**
 * Least significant r bits
 * @const {number}
 */
npf.math.Rand19937.LOWER_MASK = 0x7fffffff;

/**
 * @const {number}
 */
npf.math.Rand19937.M = 397;

/**
 * Constant vector a
 * @const {number}
 */
npf.math.Rand19937.MATRIX_A = 0x9908b0df;

/**
 * @const {number}
 */
npf.math.Rand19937.N = 624;

/**
 * Most significant w-r bits
 * @const {number}
 */
npf.math.Rand19937.UPPER_MASK = 0x80000000;


/**
 * Initializes this._mt[npf.math.Rand19937.N] with a seed
 * @param {number} s
 */
npf.math.Rand19937.prototype.initGenrand = function(s) {
	this._mt[0]= this._unsigned32(s & 0xffffffff);

	for (this._mti = 1; this._mti < npf.math.Rand19937.N; this._mti++) {
		this._mt[this._mti] = this._addition32(
			this._multiplication32(
				1812433253,
				this._unsigned32(
					this._mt[this._mti - 1] ^ (this._mt[this._mti - 1] >>> 30)
				)
			),
			this._mti
		);
		// See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier.
		// In the previous versions, MSBs of the seed affect
		// only MSBs of the array this._mt[].
		this._mt[this._mti] = this._unsigned32(this._mt[this._mti] & 0xffffffff);
	}
};

/**
 * Initialize by an array with array-length.
 * @param {Array.<number>} initKey is the array for initializing keys
 * 		(unsigned integer)
 * @param {number} keyLength is its length
 */
npf.math.Rand19937.prototype.initByArray = function (initKey, keyLength) {
	this.initGenrand(19650218);

	/** @type {number} */
	var i = 1;
	/** @type {number} */
	var j = 0;
	/** @type {number} */
	var k = Math.max(npf.math.Rand19937.N, keyLength);

	for (; k; k--) {
		this._mt[i] = this._addition32(
			this._addition32(
				this._unsigned32(
					this._mt[i] ^ this._multiplication32(
						this._unsigned32(this._mt[i-1] ^ (this._mt[i-1] >>> 30)), 1664525
					)
				),
				initKey[j]),
			j
			);
		this._mt[i] = this._unsigned32(this._mt[i] & 0xffffffff);
		i++;
		j++;

		if (i >= npf.math.Rand19937.N) {
			this._mt[0] = this._mt[npf.math.Rand19937.N - 1];
			i = 1;
		}
		if (j >= keyLength) {
			j = 0;
		}
	}

	for (k = npf.math.Rand19937.N - 1; k; k--) {
		this._mt[i] = this._subtraction32(
			this._unsigned32(
				this._mt[i] ^ this._multiplication32(
					this._unsigned32(this._mt[i - 1] ^ (this._mt[i-1] >>> 30)),
					1566083941
				)
			),
			i
		);
		this._mt[i] = this._unsigned32(this._mt[i] & 0xffffffff);
		i++;

		if (i >= npf.math.Rand19937.N) {
			this._mt[0] = this._mt[npf.math.Rand19937.N - 1];
			i=1;
		}
	}

	this._mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};

/**
 * Generates a random number on [0, 0xffffffff]-interval.
 * @return {number}
 */
npf.math.Rand19937.prototype.genrandInt32 = function() {
	/** @type {number} */
	var y;
	/** @type {Array.<number>} */
	var mag01 = new Array(0x0, npf.math.Rand19937.MATRIX_A);

	// Generate npf.math.Rand19937.N words at one time
	if (this._mti >= npf.math.Rand19937.N) {
		/** @type {number} */
		var kk;

		if (this._mti == npf.math.Rand19937.N + 1) {
			// If initGenrand() has not been called, a default initial seed is used
			this.initGenrand(5489);
		}

		for (kk = 0; kk < npf.math.Rand19937.N - npf.math.Rand19937.M; kk++) {
			y = this._unsigned32(
				(this._mt[kk] & npf.math.Rand19937.UPPER_MASK) |
				(this._mt[kk + 1] & npf.math.Rand19937.LOWER_MASK)
			);

			this._mt[kk] = this._unsigned32(
				this._mt[kk + npf.math.Rand19937.M] ^ (y >>> 1) ^ mag01[y & 0x1]);
		}

		for (; kk < npf.math.Rand19937.N - 1; kk++) {
			y = this._unsigned32(
				(this._mt[kk] & npf.math.Rand19937.UPPER_MASK) |
				(this._mt[kk + 1] & npf.math.Rand19937.LOWER_MASK)
			);

			this._mt[kk] = this._unsigned32(
				this._mt[kk + (npf.math.Rand19937.M - npf.math.Rand19937.N)] ^ (y >>> 1) ^
					mag01[y & 0x1]
			);
		}

		y = this._unsigned32(
			(this._mt[npf.math.Rand19937.N - 1] & npf.math.Rand19937.UPPER_MASK) |
			(this._mt[0] & npf.math.Rand19937.LOWER_MASK)
		);

		this._mt[npf.math.Rand19937.N - 1] = this._unsigned32(
			this._mt[npf.math.Rand19937.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1]);
		this._mti = 0;
	}

	y = this._mt[this._mti++];

	/* Tempering */
	y = this._unsigned32(y ^ (y >>> 11));
	y = this._unsigned32(y ^ ((y << 7) & 0x9d2c5680));
	y = this._unsigned32(y ^ ((y << 15) & 0xefc60000));
	y = this._unsigned32(y ^ (y >>> 18));

	return y;
};

/**
 * Generates a random number on [0, 0x7fffffff]-interval.
 * @return {number}
 */
npf.math.Rand19937.prototype.genrandInt31 = function() {
	return (this.genrandInt32() >>> 1);
};

/**
 * Generates a random number on [0, 1]-real-interval.
 * @return {number}
 */
npf.math.Rand19937.prototype.genrandReal1 = function() {
	return this.genrandInt32() * (1.0 / 4294967295.0);
	/* divided by 2^32-1 */
};

/**
 * Generates a random number on [0, 1)-real-interval.
 * @return {number}
 */
npf.math.Rand19937.prototype.genrandReal2 = function() {
	return this.genrandInt32() * (1.0 / 4294967296.0);
	/* divided by 2^32 */
};

/**
 * Generates a random number on (0, 1)-real-interval.
 * @return {number}
 */
npf.math.Rand19937.prototype.genrandReal3 = function() {
	return (this.genrandInt32() + 0.5) * (1.0 / 4294967296.0);
	/* divided by 2^32 */
};

/**
 * Generates a random number on [0, 1) with 53-bit resolution.
 * @return {number}
 */
npf.math.Rand19937.prototype.genrandRes53 = function() {
	/** @type {number} */
	var a = this.genrandInt32() >>> 5;
	/** @type {number} */
	var b = this.genrandInt32() >>> 6;

	return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
};

/**
 * Returns a 32-bits unsiged integer from an operand to which applied a bit
 * operator.
 * @param {number} n1
 * @return {number}
 * @private
 */
npf.math.Rand19937.prototype._unsigned32 = function(n1) {
	return n1 < 0 ?
		(n1 ^ npf.math.Rand19937.UPPER_MASK) + npf.math.Rand19937.UPPER_MASK : n1;
};

/**
 * Emulates lowerflow of a c 32-bits unsiged integer variable, instead of the
 * operator -. These both arguments must be non-negative integers expressible
 * using unsigned 32 bits.
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 * @private
 */
npf.math.Rand19937.prototype._subtraction32 = function(n1, n2) {
	return n1 < n2 ?
		this._unsigned32((0x100000000 - (n2 - n1)) & 0xffffffff) : n1 - n2;
};

/**
 * Emulates overflow of a c 32-bits unsiged integer variable, instead of the
 * operator +. These both arguments must be non-negative integers expressible
 * using unsigned 32 bits.
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 * @private
 */
npf.math.Rand19937.prototype._addition32 = function(n1, n2) {
	return this._unsigned32((n1 + n2) & 0xffffffff);
};

/**
 * Emulates overflow of a c 32-bits unsiged integer variable, instead of the
 * operator *. These both arguments must be non-negative integers expressible
 * using unsigned 32 bits.
 * @param {number} n1
 * @param {number} n2
 * @return {number}
 */
npf.math.Rand19937.prototype._multiplication32 = function(n1, n2) {
	/** @type {number} */
	var sum = 0;

	for (var i = 0; i < 32; ++i) {
		if ((n1 >>> i) & 0x1){
			sum = this._addition32(sum, this._unsigned32(n2 << i));
		}
	}

	return sum;
};
