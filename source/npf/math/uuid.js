goog.provide('npf.math.Uuid');


/**
 * JS library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see https://github.com/pnegri/uuid-js
 * @see http://www.ietf.org/rfc/rfc4122.txt
 * @constructor
 * @struct
 */
npf.math.Uuid = function() {
	/**
	 * @type {string}
	 */
	this.hex = '';

	/**
	 * @type {number}
	 */
	this.version = 0;
};

/**
 * @param {number} bits
 * @return {number}
 */
npf.math.Uuid.maxFromBits = function(bits) {
	return Math.pow(2, bits);
};

/**
 * @type {number}
 */
npf.math.Uuid.limitUI04 = npf.math.Uuid.maxFromBits(4);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI06 = npf.math.Uuid.maxFromBits(6);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI08 = npf.math.Uuid.maxFromBits(8);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI12 = npf.math.Uuid.maxFromBits(12);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI14 = npf.math.Uuid.maxFromBits(14);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI16 = npf.math.Uuid.maxFromBits(16);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI32 = npf.math.Uuid.maxFromBits(32);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI40 = npf.math.Uuid.maxFromBits(40);

/**
 * @type {number}
 */
npf.math.Uuid.limitUI48 = npf.math.Uuid.maxFromBits(48);

/**
 * @return {number}
 */
npf.math.Uuid.randomUI04 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI04);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI06 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI06);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI08 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI08);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI12 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI12);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI14 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI14);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI16 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI16);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI32 = function() {
	return Math.floor(Math.random() * npf.math.Uuid.limitUI32);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI40 = function() {
	return (0 | Math.random() * (1 << 30)) +
		(0 | Math.random() * (1 << 40 - 30)) * (1 << 30);
};

/**
 * @return {number}
 */
npf.math.Uuid.randomUI48 = function() {
	return (0 | Math.random() * (1 << 30)) +
		(0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
};

/**
 * @param {string} string
 * @param {number} length
 * @param {?string=} opt_z
 * @return {string}
 */
npf.math.Uuid.paddedString = function(string, length, opt_z) {
	/** @type {string} */
	var z = opt_z ? opt_z : '0';

	/** @type {number} */
	var i = length - string.length;

	for (; i > 0; i >>>= 1, z += z) {
		if (i & 1) {
			string = z + string;
		}
	}

	return string;
};

/**
 * @param {number} timeLow
 * @param {number} timeMid
 * @param {number} timeHiAndVersion
 * @param {number} clockSeqHiAndReserved
 * @param {number} clockSeqLow
 * @param {number} node
 * @return {!npf.math.Uuid}
 */
npf.math.Uuid.prototype.fromParts = function(timeLow, timeMid, timeHiAndVersion,
		clockSeqHiAndReserved, clockSeqLow, node) {
	this.version = (timeHiAndVersion >> 12) & 0xF;
	this.hex = [
		npf.math.Uuid.paddedString(timeLow.toString(16), 8),
		npf.math.Uuid.paddedString(timeMid.toString(16), 4),
		npf.math.Uuid.paddedString(timeHiAndVersion.toString(16), 4),
		npf.math.Uuid.paddedString(clockSeqHiAndReserved.toString(16), 2) +
			npf.math.Uuid.paddedString(clockSeqLow.toString(16), 2),
		npf.math.Uuid.paddedString(node.toString(16), 12)
	].join('-');

	return this;
};

/**
 * @return {string}
 */
npf.math.Uuid.prototype.toString = function() {
	return this.hex;
};

/**
 * @return {string}
 */
npf.math.Uuid.prototype.toURN = function() {
	return 'urn:uuid:' + this.hex;
};

/**
 * @return {!Array.<number>}
 */
npf.math.Uuid.prototype.toBytes = function() {
	/** @type {!Array.<string>} */
	var parts = this.hex.split('-');
	/** @type {!Array.<number>} */
	var ints = [];
	/** @type {number} */
	var intPos = 0;

	for (var i = 0; i < parts.length; i++) {
		for (var j = 0; j < parts[i].length; j+=2) {
			ints[intPos++] = parseInt(parts[i].substr(j, 2), 16);
		}
	}

	return ints;
};

/**
 * @return {boolean}
 */
npf.math.Uuid.prototype.equals = function(uuid) {
	return uuid instanceof npf.math.Uuid && this.hex === uuid.hex;
};

/**
 * @param {number} time
 * @return {{low:number,mid:number,hi:number,timestamp:number}}
 */
npf.math.Uuid.getTimeFieldValues = function(time) {
	var ts = time - Date.UTC(1582, 9, 15);
	var hm = ((ts / 0x100000000) * 10000) & 0xFFFFFFF;
	return {
		low: ((ts & 0xFFFFFFF) * 10000) % 0x100000000,
		mid: hm & 0xFFFF,
		hi: hm >>> 16,
		timestamp: ts
	};
};

/**
 * @return {!npf.math.Uuid}
 * @private
 */
npf.math.Uuid._create4 = function() {
	return new npf.math.Uuid().fromParts(
		npf.math.Uuid.randomUI32(),
		npf.math.Uuid.randomUI16(),
		0x4000 | npf.math.Uuid.randomUI12(),
		0x80   | npf.math.Uuid.randomUI06(),
		npf.math.Uuid.randomUI08(),
		npf.math.Uuid.randomUI48()
	);
};

/**
 * @return {!npf.math.Uuid}
 * @private
 */
npf.math.Uuid._create1 = function() {
	var now = new Date().getTime();
	var sequence = npf.math.Uuid.randomUI14();
	var node = (npf.math.Uuid.randomUI08() | 1) * 0x10000000000 +
		npf.math.Uuid.randomUI40();
	var tick = npf.math.Uuid.randomUI04();
	var timestamp = 0;
	var timestampRatio = 1/4;

	if (now != timestamp) {
		if (now < timestamp) {
			sequence++;
		}

		timestamp = now;
		tick = npf.math.Uuid.randomUI04();
	} else if (Math.random() < timestampRatio && tick < 9984) {
		tick += 1 + npf.math.Uuid.randomUI04();
	} else {
		sequence++;
	}

	var tf = npf.math.Uuid.getTimeFieldValues(timestamp);
	var tl = tf.low + tick;
	var thav = (tf.hi & 0xFFF) | 0x1000;

	sequence &= 0x3FFF;
	var cshar = (sequence >>> 8) | 0x80;
	var csl = sequence & 0xFF;

	return new npf.math.Uuid().fromParts(tl, tf.mid, thav, cshar, csl, node);
};

/**
 * @param {?number=} opt_version
 * @return {!npf.math.Uuid}
 */
npf.math.Uuid.create = function(opt_version) {
	if (1 === opt_version) {
		return npf.math.Uuid._create1();
	} else {
		return npf.math.Uuid._create4();
	}
};

/**
 * @param {number} time
 * @param {boolean=} opt_last
 * @return {!npf.math.Uuid}
 */
npf.math.Uuid.fromTime = function(time, opt_last) {
	/** @type {boolean} */
	var last = !!opt_last;
	var tf = npf.math.Uuid.getTimeFieldValues(time);
	var tl = tf.low;
	var thav = (tf.hi & 0xFFF) | 0x1000;  // set version '0001'

	if (last) {
		return new npf.math.Uuid().fromParts(
			tl, tf.mid, thav,
			0x80 | npf.math.Uuid.limitUI06,
			npf.math.Uuid.limitUI08 - 1, npf.math.Uuid.limitUI48 - 1
		);
	} else {
		return new npf.math.Uuid().fromParts(tl, tf.mid, thav, 0, 0, 0);
	}
};

/**
 * @param {number} time
 * @return {!npf.math.Uuid}
 */
npf.math.Uuid.firstFromTime = function(time) {
	return npf.math.Uuid.fromTime(time, false);
};

/**
 * @param {number} time
 * @return {!npf.math.Uuid}
 */
npf.math.Uuid.lastFromTime = function(time) {
	return npf.math.Uuid.fromTime(time, true);
};

/**
 * @param {string} strId
 * @return {npf.math.Uuid}
 */
npf.math.Uuid.fromURN = function(strId) {
	var p = /^(?:urn:uuid:|\{)?([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{2})([0-9a-f]{2})-([0-9a-f]{12})(?:\})?$/i;
	var r = p.exec(strId);

	if (r) {
		return new npf.math.Uuid().fromParts(
			parseInt(r[1], 16), parseInt(r[2], 16),
			parseInt(r[3], 16), parseInt(r[4], 16),
			parseInt(r[5], 16), parseInt(r[6], 16)
		);
	}

	return null;
};

/**
 * @param {!Array.<number>} ints
 * @return {npf.math.Uuid}
 */
npf.math.Uuid.fromBytes = function(ints) {
	if (ints.length < 5) {
		return null;
	}

	var str = '';
	var pos = 0;
	var parts = [4, 2, 2, 2, 6];

	for (var i = 0; i < parts.length; i++) {
		for (var j = 0; j < parts[i]; j++) {
			var octet = ints[pos++].toString(16);

			if (octet.length == 1) {
				octet = '0' + octet;
			}

			str += octet;
		}

		if (parts[i] !== 6) {
			str += '-';
		}
	}

	return npf.math.Uuid.fromURN(str);
};

/**
 * @param {string} binary
 * @return {npf.math.Uuid}
 */
npf.math.Uuid.fromBinary = function(binary) {
	var ints = [];

	for (var i = 0; i < binary.length; i++) {
		ints[i] = binary.charCodeAt(i);

		if (ints[i] > 255 || ints[i] < 0) {
			throw new Error('Unexpected byte in binary data.');
		}
	}

	return npf.math.Uuid.fromBytes(ints);
};
